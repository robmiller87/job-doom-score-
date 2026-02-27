import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY

// AI-based doom scoring based on profile data
function calculateDoomScore(profile: any): { score: number; goodFactors: string[]; badFactors: string[] } {
  const goodFactors: string[] = []
  const badFactors: string[] = []
  let score = 50 // Base score

  const headline = (profile.headline || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()
  const fullName = profile.full_name || ''
  
  // Get current job from experiences
  const currentJob = profile.experiences?.[0]?.company || ''
  const allExperiences = (profile.experiences || []).map((e: any) => (e.company || '').toLowerCase()).join(' ')

  // High risk job titles with specific context
  const highRiskTitles: Record<string, string> = {
    'assistant': 'Administrative tasks: 70% automatable by 2027',
    'coordinator': 'Coordination roles: AI scheduling up 400% since 2023',
    'analyst': 'Junior analysts being replaced at major banks',
    'specialist': 'Specialist tasks being automated across industries',
    'administrator': 'Admin work: #1 category for AI replacement',
    'clerk': 'Clerical roles: 85% of tasks automatable today',
    'receptionist': 'AI receptionists now handle 60% of calls',
    'data entry': 'Data entry: 95% automatable',
    'bookkeeper': 'AI accounting tools 10x faster than humans',
    'transcription': 'Whisper AI made transcription obsolete',
    'secretary': 'AI assistants replacing secretary roles',
    'support': 'Chatbots handling 80% of support queries'
  }

  const mediumRiskTitles: Record<string, string> = {
    'manager': 'Middle management shrinking as orgs flatten',
    'supervisor': 'AI performance monitoring reducing supervisor roles',
    'accountant': '40% of accounting tasks automatable',
    'copywriter': 'GPT-4 matches human copywriting quality',
    'content writer': 'AI generating 30% of marketing copy',
    'paralegal': 'AI does doc review 10x faster',
    'customer service': '80% of interactions going to bots',
    'marketing': 'AI handles targeting, copy, and optimization',
    'hr ': 'AI screening resumes, scheduling, interviewing',
    'recruiter': 'AI sourcing up 300%, fewer recruiters needed',
    'operations': 'Operations: AI automating workflows & reporting',
    'sales op': 'Sales ops: CRM + AI forecasting reducing headcount',
    'business analyst': 'AI doing analysis faster than humans',
    'project manager': 'AI project tools automating coordination',
    'product manager': 'AI handling roadmaps, specs, prioritization',
    'consultant': 'AI automating analysis & recommendations',
    'writer': 'AI content generation is mainstream',
    'editor': 'AI editing & proofreading tools everywhere',
    'designer': 'AI design tools (Midjourney, Figma AI) disrupting'
  }

  const lowRiskTitles: Record<string, string> = {
    'director': 'Strategic decisions still need humans',
    'vp': 'Relationship-driven, harder to automate',
    'chief': 'Accountability requires human judgment',
    'founder': 'Founders adapt, not get replaced',
    'ceo': 'You deploy AI, not compete with it',
    'cto': 'You choose which AI to use',
    'cfo': 'Fiduciary responsibility = human required',
    'head of': 'Leadership roles harder to automate',
    'senior': 'Seniority = relationships + judgment AI lacks',
    'leader': 'Leadership requires human accountability',
    'principal': 'Principal roles = strategic, not routine',
    'partner': 'Partner-level = client relationships matter',
    'engineer': 'Engineers wield AI as a tool',
    'developer': 'Architecture still needs humans',
    'surgeon': 'Physical precision + liability = protected',
    'therapist': 'Human connection is the product',
    'plumber': 'No robots fixing pipes anytime soon',
    'electrician': 'Physical + regulated = protected',
    'nurse': 'Care work requires human presence',
    'doctor': 'Patients need human doctors',
    'physician': 'Malpractice liability keeps humans in loop'
  }

  // Check headline/summary for risk
  let titleFound = false
  for (const [title, context] of Object.entries(highRiskTitles)) {
    if (headline.includes(title) || summary.includes(title)) {
      score += 20
      badFactors.push(context)
      titleFound = true
      break
    }
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(mediumRiskTitles)) {
      if (headline.includes(title) || summary.includes(title)) {
        score += 10
        badFactors.push(context)
        titleFound = true
        break
      }
    }
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(lowRiskTitles)) {
      if (headline.includes(title) || summary.includes(title)) {
        score -= 15
        goodFactors.push(context)
        titleFound = true
        break
      }
    }
  }

  // Industry signals with specific context
  const highRiskIndustries: Record<string, string> = {
    'marketing': 'AI handles 60% of ad targeting & copy',
    'advertising': 'Programmatic + AI creative = fewer humans',
    'media': 'AI writing news, editing video, generating images',
    'journalism': 'AP using AI for reports since 2014',
    'retail': 'Automated checkout + AI inventory',
    'telemarketing': 'Robocalls won, humans lost',
    'call center': '85% of interactions will be AI by 2025',
    'insurance': 'Claims processing 90% automatable',
    'banking': 'AI doing loans, fraud, trading',
    'finance': 'Quant funds + AI advisors eating market share',
    'financial': 'Financial services: AI handling analysis & trading',
    'legal': 'AI contract review 10x faster than associates',
    'consulting': 'AI automating analysis & slide decks',
    'accounting': 'Accounting tasks 40% automatable'
  }

  const lowRiskIndustries: Record<string, string> = {
    'healthcare': 'Aging population = growing demand',
    'medical': 'Liability + licensing protects you',
    'construction': 'Robots can\'t navigate job sites yet',
    'trades': 'Physical work in unstructured environments',
    'nursing': '1M+ shortage = job security for decades',
    'emergency': 'Split-second human judgment required',
    'plumbing': 'Every house is different',
    'electrical': 'Code compliance = human required'
  }

  for (const [ind, context] of Object.entries(highRiskIndustries)) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score += 12
      badFactors.push(context)
      break
    }
  }

  for (const [ind, context] of Object.entries(lowRiskIndustries)) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // Check for AI/tech skills (protective)
  const techSkills: Record<string, string> = {
    'ai': 'You\'re building the disruption',
    'machine learning': 'ML expertise in high demand',
    'python': 'You automate others, not vice versa',
    'engineering': 'Engineering mindset adapts',
    'software': 'Copilot makes you faster, not obsolete',
    'data science': 'AI needs humans to ask right questions',
    'robotics': 'You build the robots',
    'crypto': 'Emerging field = runway',
    'blockchain': 'Niche expertise = hard to replace',
    'web3': 'Specialized knowledge protects you'
  }

  for (const [skill, context] of Object.entries(techSkills)) {
    if (headline.includes(skill) || summary.includes(skill)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // Experience factor
  const expCount = profile.experiences?.length || 0
  if (expCount > 7) {
    score -= 5
    goodFactors.push(`${expCount}+ roles = institutional knowledge`)
  } else if (expCount < 3) {
    score += 5
    badFactors.push('Early career = more replaceable')
  }

  // Follower count (influence = safety)
  const followers = profile.follower_count || 0
  if (followers > 10000) {
    score -= 8
    goodFactors.push(`${followers.toLocaleString()} followers = personal brand moat`)
  } else if (followers > 5000) {
    score -= 4
    goodFactors.push(`${followers.toLocaleString()} connections = strong network`)
  } else if (followers < 500) {
    score += 3
    badFactors.push('Small network = fewer opportunities')
  }

  // Entrepreneur signal
  if (summary.includes('founder') || summary.includes('ceo') || summary.includes('started') || currentJob.toLowerCase().includes('consultancy')) {
    score -= 10
    goodFactors.push('Entrepreneurial mindset = you adapt')
  }

  // Clamp score
  score = Math.max(12, Math.min(94, score))

  // Always ensure BOTH boxes have content
  if (badFactors.length === 0) {
    // More specific fallbacks based on score
    if (score > 50) {
      badFactors.push('Your role type is in AI\'s crosshairs')
    } else if (score > 30) {
      badFactors.push('AI tools entering your workflow soon')
    } else {
      badFactors.push('No industry is fully immune to AI')
    }
  }
  if (goodFactors.length === 0) {
    if (score < 40) {
      goodFactors.push('Your profile shows resilience markers')
    } else {
      goodFactors.push('Adaptability will be key')
    }
  }

  return { score, goodFactors, badFactors }
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
        goodFactors: [],
        badFactors: ['Profile analysis unavailable'],
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
        goodFactors: [],
        badFactors: ['Could not fetch profile'],
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
        goodFactors: [],
        badFactors: ['Profile is private or unavailable'],
        name: null,
        profilePic: null
      })
    }

    const { score, goodFactors, badFactors } = calculateDoomScore(profile)

    // Extract first name from full_name
    const firstName = profile.full_name?.split(' ')[0] || null

    return NextResponse.json({
      score,
      goodFactors,
      badFactors,
      name: firstName,
      profilePic: profile.photo_url || null,
      headline: profile.headline || profile.summary?.slice(0, 100) || null
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
