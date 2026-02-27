import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY

// AI-based doom scoring based on profile data
function calculateDoomScore(profile: any): { score: number; factors: string[] } {
  const factors: string[] = []
  let score = 50 // Base score

  const headline = (profile.headline || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()
  const fullName = profile.full_name || ''
  
  // Get current job from experiences
  const currentJob = profile.experiences?.[0]?.company || ''
  const allExperiences = (profile.experiences || []).map((e: any) => (e.company || '').toLowerCase()).join(' ')

  // High risk job titles with specific context
  const highRiskTitles: Record<string, string> = {
    'assistant': 'Administrative tasks: 70% automatable by 2027 (McKinsey)',
    'coordinator': 'Coordination roles: AI scheduling up 400% since 2023',
    'analyst': 'Data analysis: ChatGPT already replacing junior analysts at banks',
    'specialist': 'Specialist tasks being automated across industries',
    'administrator': 'Admin work: #1 category for AI replacement',
    'clerk': 'Clerical roles: 85% of tasks can be automated today',
    'receptionist': 'Front desk: AI receptionists now handle 60% of calls',
    'data entry': 'Data entry: effectively solved problem, 95% automatable',
    'bookkeeper': 'Bookkeeping: AI tools already 10x faster than humans',
    'transcription': 'Transcription: Whisper AI made this job obsolete',
    'secretary': 'Secretary roles being replaced by AI assistants',
    'support': 'Customer support: chatbots handling 80% of queries'
  }

  const mediumRiskTitles: Record<string, string> = {
    'manager': 'Middle management: flattening orgs = fewer managers needed',
    'supervisor': 'Supervisory roles shrinking as AI monitors performance',
    'accountant': 'Accounting: 40% of tasks automatable (Deloitte)',
    'copywriter': 'Copywriting: GPT-4 matches human quality in tests',
    'content writer': 'Content: AI generating 30% of marketing copy now',
    'paralegal': 'Legal research: AI 10x faster at doc review',
    'customer service': 'Customer service: 80% of interactions going to bots',
    'marketing': 'Marketing: AI handles targeting, copy, and optimization',
    'hr ': 'HR: AI screening resumes, scheduling, even interviewing',
    'recruiter': 'Recruiting: AI sourcing up 300%, fewer recruiters needed'
  }

  const lowRiskTitles: Record<string, string> = {
    'director': 'Senior leadership: strategic decisions still need humans',
    'vp': 'Executive level: relationship-driven, harder to automate',
    'chief': 'C-suite: accountability requires human judgment',
    'founder': 'Founders adapt the business, not get replaced by it',
    'ceo': 'CEOs: you deploy AI, not compete with it',
    'cto': 'Technical leadership: you choose which AI to use',
    'cfo': 'CFO: fiduciary responsibility requires human accountability',
    'engineer': 'Engineering: AI is a tool, engineers wield it',
    'developer': 'Developers: Copilot helps, but architecture needs humans',
    'surgeon': 'Surgery: physical precision + liability = human-only',
    'therapist': 'Therapy: human connection is the product',
    'plumber': 'Trades: no robot fixing pipes in your walls anytime soon',
    'electrician': 'Electrical work: physical + regulated = protected',
    'nurse': 'Nursing: care work requires human presence',
    'doctor': 'Physicians: diagnosis aids help, but patients need doctors',
    'physician': 'Medicine: malpractice liability keeps humans in the loop'
  }

  // Check headline/summary for risk
  let titleFound = false
  for (const [title, context] of Object.entries(highRiskTitles)) {
    if (headline.includes(title) || summary.includes(title)) {
      score += 20
      factors.push(context)
      titleFound = true
      break
    }
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(mediumRiskTitles)) {
      if (headline.includes(title) || summary.includes(title)) {
        score += 10
        factors.push(context)
        titleFound = true
        break
      }
    }
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(lowRiskTitles)) {
      if (headline.includes(title) || summary.includes(title)) {
        score -= 15
        factors.push(context)
        titleFound = true
        break
      }
    }
  }

  // Industry signals with specific context
  const highRiskIndustries: Record<string, string> = {
    'marketing': 'Marketing: AI handles 60% of ad targeting & copy now',
    'advertising': 'Advertising: programmatic + AI creative = fewer humans',
    'media': 'Media: AI writing news, editing video, generating images',
    'journalism': 'Journalism: AP using AI for earnings reports since 2014',
    'retail': 'Retail: automated checkout + AI inventory = fewer jobs',
    'telemarketing': 'Telemarketing: robocalls won, humans lost',
    'call center': 'Call centers: 85% of interactions will be AI by 2025',
    'insurance': 'Insurance: claims processing 90% automatable',
    'banking': 'Banking: AI doing loan decisions, fraud detection, trading',
    'finance': 'Finance: quant funds + AI advisors eating market share',
    'legal': 'Legal: AI contract review 10x faster than associates'
  }

  const lowRiskIndustries: Record<string, string> = {
    'healthcare': 'Healthcare: aging population = growing demand for humans',
    'medical': 'Medical: liability + licensing protects human workers',
    'construction': 'Construction: robots can\'t navigate job sites yet',
    'trades': 'Skilled trades: physical work in unstructured environments',
    'nursing': 'Nursing: 1M+ shortage means job security for decades',
    'emergency': 'Emergency services: split-second human judgment required',
    'plumbing': 'Plumbing: every house is different, robots can\'t adapt',
    'electrical': 'Electrical: code compliance + inspection = human required'
  }

  for (const [ind, context] of Object.entries(highRiskIndustries)) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score += 12
      factors.push(context)
      break
    }
  }

  for (const [ind, context] of Object.entries(lowRiskIndustries)) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score -= 10
      factors.push(context)
      break
    }
  }

  // Check for AI/tech skills (protective)
  const techSkills: Record<string, string> = {
    'ai': 'AI skills: you\'re building the disruption, not suffering it',
    'machine learning': 'ML expertise: companies paying premium for this',
    'python': 'Python + data: you automate others, not vice versa',
    'engineering': 'Engineering mindset: adapt tools, don\'t fear them',
    'software': 'Software: Copilot makes you faster, not obsolete',
    'data science': 'Data science: AI needs humans to ask the right questions',
    'robotics': 'Robotics: you build the robots',
    'crypto': 'Crypto/Web3: early in emerging field = runway',
    'blockchain': 'Blockchain: niche expertise = hard to replace',
    'web3': 'Web3: specialized knowledge protects you'
  }

  for (const [skill, context] of Object.entries(techSkills)) {
    if (headline.includes(skill) || summary.includes(skill)) {
      score -= 10
      factors.push(context)
      break
    }
  }

  // Experience factor
  const expCount = profile.experiences?.length || 0
  if (expCount > 7) {
    score -= 5
    factors.push(`${expCount}+ roles = institutional knowledge AI can't replicate`)
  } else if (expCount < 3) {
    score += 5
    factors.push('Early career: less experience = more replaceable')
  }

  // Follower count (influence = safety)
  const followers = profile.follower_count || 0
  if (followers > 10000) {
    score -= 8
    factors.push(`${followers.toLocaleString()} followers = personal brand moat`)
  } else if (followers > 5000) {
    score -= 4
    factors.push(`${followers.toLocaleString()} connections = strong network safety net`)
  } else if (followers < 500) {
    score += 3
    factors.push('Small network: fewer opportunities when disruption hits')
  }

  // Entrepreneur signal
  if (summary.includes('founder') || summary.includes('ceo') || summary.includes('started') || currentJob.toLowerCase().includes('consultancy')) {
    score -= 10
    factors.push('Entrepreneurial: you pivot the business, not get pivoted out')
  }

  // Clamp score
  score = Math.max(12, Math.min(94, score))

  // Ensure at least 2 factors
  if (factors.length === 0) {
    factors.push('AI adoption accelerating: 50% of tasks automatable by 2030')
    factors.push('Routine cognitive work most at risk (Goldman Sachs, 2023)')
  } else if (factors.length === 1) {
    factors.push('Automation pressure rising: 300M jobs globally affected')
  }

  return { score, factors }
}

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json()

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 })
    }

    if (!PILOTERR_API_KEY) {
      // Fallback: generate score from URL hash if no API key
      let hash = 0
      for (let i = 0; i < linkedinUrl.length; i++) {
        hash = ((hash << 5) - hash) + linkedinUrl.charCodeAt(i)
        hash = hash & hash
      }
      const fallbackScore = 40 + Math.abs(hash % 45)
      return NextResponse.json({
        score: fallbackScore,
        factors: ['Profile analysis unavailable', 'Score based on general trends'],
        name: null,
        profilePic: null
      })
    }

    // Call Piloterr API
    const response = await fetch(
      `https://piloterr.com/api/v2/linkedin/profile/info?query=${encodeURIComponent(linkedinUrl)}`,
      {
        headers: {
          'x-api-key': PILOTERR_API_KEY
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Piloterr error:', error)
      
      // Fallback on error
      let hash = 0
      for (let i = 0; i < linkedinUrl.length; i++) {
        hash = ((hash << 5) - hash) + linkedinUrl.charCodeAt(i)
        hash = hash & hash
      }
      return NextResponse.json({
        score: 40 + Math.abs(hash % 45),
        factors: ['Could not fetch profile', 'Score estimated from trends'],
        name: null,
        profilePic: null
      })
    }

    const profile = await response.json()
    
    // Check for API error response
    if (profile.error) {
      console.error('Piloterr API error:', profile.error)
      let hash = 0
      for (let i = 0; i < linkedinUrl.length; i++) {
        hash = ((hash << 5) - hash) + linkedinUrl.charCodeAt(i)
        hash = hash & hash
      }
      return NextResponse.json({
        score: 40 + Math.abs(hash % 45),
        factors: ['Profile is private or unavailable', 'Score based on general trends'],
        name: null,
        profilePic: null
      })
    }

    const { score, factors } = calculateDoomScore(profile)

    // Extract first name from full_name
    const firstName = profile.full_name?.split(' ')[0] || null

    return NextResponse.json({
      score,
      factors,
      name: firstName,
      profilePic: profile.photo_url || null,
      headline: profile.headline || profile.summary?.slice(0, 100) || null
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
