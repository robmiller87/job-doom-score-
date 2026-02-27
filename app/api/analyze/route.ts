import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Tier mapping
function getTierFromScore(score: number): { tier: string; emoji: string; message: string } {
  if (score <= 20) return { tier: 'SAFE', emoji: '😎', message: 'The robots work for you.' }
  if (score <= 40) return { tier: 'UNCERTAIN', emoji: '😏', message: 'You might survive. Maybe.' }
  if (score <= 60) return { tier: 'NERVOUS', emoji: '😬', message: 'Time to adapt.' }
  if (score <= 80) return { tier: 'IN DANGER', emoji: '🚨', message: 'AI is coming for you.' }
  return { tier: 'DOOMED', emoji: '💀', message: 'Update your resume. Actually, don\'t bother.' }
}

// GPT-based analysis
async function analyzeWithGPT(profile: any): Promise<{ score: number; goodFactors: string[]; badFactors: string[] }> {
  const prompt = `You are an AI job displacement risk analyst. Analyze this LinkedIn profile and assess how at-risk this person is of being replaced or displaced by AI in the next 3-5 years.

PROFILE DATA:
- Name: ${profile.full_name || profile.name || 'Unknown'}
- Headline: ${profile.headline || 'Not provided'}
- Summary: ${(profile.summary || '').slice(0, 500)}
- Current Company: ${profile.experiences?.[0]?.company || 'Unknown'}
- Current Title: ${profile.experiences?.[0]?.title || 'Unknown'}
- Experience Count: ${profile.experiences?.length || 0} roles
- Followers: ${profile.follower_count || 0}
- Industry: ${profile.industry || 'Unknown'}

JOB TITLES FROM EXPERIENCE:
${(profile.experiences || []).slice(0, 5).map((e: any) => `- ${e.title || e.position || e.role || 'Unknown'} at ${e.company || e.company_name || 'Unknown'}`).join('\n') || 'None listed'}

SCORING GUIDELINES:
- 0-20 (SAFE): Founders, CEOs, investors, capital allocators, people with massive followings (50K+), business owners, people who run their own company/newsletter/media
- 21-40 (UNCERTAIN): Senior leadership, specialized experts, people with strong networks
- 41-60 (NERVOUS): Mid-level employees, generalists, roles being augmented by AI
- 61-80 (IN DANGER): Junior roles, administrative work, easily automatable tasks
- 81-100 (DOOMED): Data entry, basic customer support, routine clerical work

KEY OWNERSHIP SIGNALS (these people are SAFE, score 0-20):
- If their headline mentions THEIR OWN website/newsletter/company (e.g., "join our newsletter at mycompany.com") = they likely OWN it = SAFE
- If job title includes: Founder, Co-founder, CEO, Owner, Managing Partner, GP, Chairman = SAFE
- If they have 50K+ followers = significant personal brand = SAFE
- If they're in crypto/web3 with leadership role = likely early/owner = SAFE

KEY RISK FACTORS:
- Software engineers are at MEDIUM risk (score 45-55) - market flooded + AI coding tools, but still needed
- CMOs/Marketing leads are at HIGH risk - AI automating marketing
- Junior/entry-level roles are HIGH risk
- Physical trades (plumber, electrician) are SAFE - robots can't do it yet
- Administrative/clerical work is DOOMED

STRICT RULES (FOLLOW EXACTLY):
1. NEVER use the word "undefined" in any factor - this is BANNED
2. NEVER say "lack of specificity" or similar vague phrases - BANNED
3. ALWAYS give specific, concrete reasons based on their actual role
4. For badFactors: explain HOW AI threatens their job (e.g., "BD: AI SDRs replacing outreach")
5. For goodFactors: explain WHY protected (e.g., "10 years = institutional knowledge")
6. If Current Title is "Founder" or "CEO" or "Owner" → they are SAFE (score 0-20)
7. If they work at a company with their name or a company they seem to own → likely SAFE

Return ONLY valid JSON in this exact format:
{
  "score": <number 0-100>,
  "goodFactors": ["<factor 1>", "<factor 2>", "<factor 3>"],
  "badFactors": ["<factor 1>", "<factor 2>"]
}

Be concise (under 10 words each factor).`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    })
  })

  if (!response.ok) {
    console.error('OpenAI error:', await response.text())
    throw new Error('GPT analysis failed')
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  
  // Parse JSON from response
  try {
    // Handle potential markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        score: Math.max(12, Math.min(94, parsed.score || 50)),
        goodFactors: parsed.goodFactors || [],
        badFactors: parsed.badFactors || []
      }
    }
  } catch (e) {
    console.error('Failed to parse GPT response:', content)
  }
  
  // Fallback
  return { score: 50, goodFactors: ['Analysis incomplete'], badFactors: ['Could not fully assess'] }
}

// Fallback keyword-based analysis (if no OpenAI key)
function analyzeWithKeywords(profile: any): { score: number; goodFactors: string[]; badFactors: string[] } {
  const goodFactors: string[] = []
  const badFactors: string[] = []
  let score = 50

  const headline = (profile.headline || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()
  const combinedText = `${headline} ${summary}`
  const experienceTitles = (profile.experiences || []).map((e: any) => (e.title || '').toLowerCase()).join(' ')
  const fullText = `${combinedText} ${experienceTitles}`

  // Very Safe (founders, owners, investors)
  const verySafe = ['founder', 'co-founder', 'cofounder', 'ceo', 'owner', 'investor', 'managing partner', 'general partner', 'chairman', 'board member']
  for (const term of verySafe) {
    if (fullText.includes(term)) {
      score -= 25
      goodFactors.push('Ownership/founder role = you adapt, not get replaced')
      break
    }
  }

  // High risk
  const highRisk = ['assistant', 'coordinator', 'clerk', 'data entry', 'receptionist', 'bookkeeper']
  for (const term of highRisk) {
    if (combinedText.includes(term)) {
      score += 20
      badFactors.push('Administrative roles highly automatable')
      break
    }
  }

  // Medium risk (SWE, marketing, etc)
  const mediumRisk = ['developer', 'engineer', 'designer', 'marketer', 'marketing', 'recruiter', 'analyst']
  for (const term of mediumRisk) {
    if (combinedText.includes(term)) {
      score += 10
      badFactors.push('Role being augmented/displaced by AI tools')
      break
    }
  }

  // Leadership protection
  const leadership = ['director', 'vp', 'vice president', 'head of', 'chief', 'senior']
  for (const term of leadership) {
    if (combinedText.includes(term)) {
      score -= 15
      goodFactors.push('Leadership = harder to automate')
      break
    }
  }

  // Followers
  const followers = profile.follower_count || 0
  if (followers > 100000) {
    score -= 25
    goodFactors.push(`${followers.toLocaleString()} followers = massive distribution moat`)
  } else if (followers > 10000) {
    score -= 8
    goodFactors.push(`${followers.toLocaleString()} followers = personal brand moat`)
  }

  // Experience
  const expCount = profile.experiences?.length || 0
  if (expCount > 7) {
    score -= 5
    goodFactors.push(`${expCount}+ roles = institutional knowledge`)
  }

  score = Math.max(12, Math.min(94, score))
  
  if (badFactors.length === 0) badFactors.push('AI tools entering your workflow')
  if (goodFactors.length === 0) goodFactors.push('Adaptability will be key')

  return { score, goodFactors, badFactors }
}

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json()

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 })
    }

    if (!PILOTERR_API_KEY) {
      return NextResponse.json({ error: 'Profile lookup unavailable' }, { status: 500 })
    }

    // Fetch profile from Piloterr
    const response = await fetch(
      `https://piloterr.com/api/v2/linkedin/profile/info?query=${encodeURIComponent(linkedinUrl)}`,
      {
        headers: { 'x-api-key': PILOTERR_API_KEY }
      }
    )

    if (!response.ok) {
      console.error('Piloterr error:', await response.text())
      return NextResponse.json({ error: 'Could not fetch profile' }, { status: 500 })
    }

    const profile = await response.json()
    
    if (profile.error) {
      return NextResponse.json({ error: 'Profile is private or unavailable' }, { status: 400 })
    }

    // Analyze with GPT if available, otherwise fallback to keywords
    let analysis
    if (OPENAI_API_KEY) {
      try {
        analysis = await analyzeWithGPT(profile)
        console.log('GPT analysis:', analysis)
      } catch (e) {
        console.error('GPT failed, falling back to keywords:', e)
        analysis = analyzeWithKeywords(profile)
      }
    } else {
      analysis = analyzeWithKeywords(profile)
    }

    // Extract name
    const fullName = profile.full_name || profile.name || profile.fullName || 
                     (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null) ||
                     profile.firstName || null
    const firstName = fullName?.split(' ')[0] || null

    // Log experience data separately for visibility
    const exp0 = profile.experiences?.[0]
    console.log('EXPERIENCE_CHECK:', exp0?.title || exp0?.position || 'NO_TITLE', 'at', exp0?.company || 'NO_COMPANY')
    console.log('Profile:', fullName, 'Score:', analysis.score, 'ExpCount:', profile.experiences?.length || 0)

    return NextResponse.json({
      score: analysis.score,
      goodFactors: analysis.goodFactors, // Working For You (green)
      badFactors: analysis.badFactors,   // Working Against You (red)
      name: firstName,
      profilePic: profile.photo_url || null,
      headline: profile.headline || profile.summary?.slice(0, 100) || null
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
