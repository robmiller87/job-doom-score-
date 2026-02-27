import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY

// DoomCheck Algorithm v2 - Order matters!
function calculateDoomScore(profile: any): { score: number; goodFactors: string[]; badFactors: string[] } {
  const goodFactors: string[] = []
  const badFactors: string[] = []
  let score = 50 // Base score
  let isVerySafe = false // Flag to skip industry risk for founders/owners

  const headline = (profile.headline || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()
  const combinedText = `${headline} ${summary}`
  
  // Get current job from experiences
  const currentJob = profile.experiences?.[0]?.company || ''
  const allExperiences = (profile.experiences || []).map((e: any) => (e.company || '').toLowerCase()).join(' ')

  // ============================================
  // STEP 1: VERY SAFE CHECK (founders, owners, investors)
  // These people pivot, they don't get replaced. Check FIRST!
  // ============================================
  const verySafeTitles: Record<string, string> = {
    'co-founder': 'You built companies, you\'ll build more',
    'founder': 'Founders adapt, not get replaced',
    'entrepreneur': 'Entrepreneurs pivot, not get fired',
    'serial entrepreneur': 'You\'ve reinvented yourself before',
    'solopreneur': 'You are the business',
    'self-employed': 'No boss to fire you',
    'independent consultant': 'Independence = adaptability',
    'sovereign': 'You answer to yourself',
    'fractional': 'Portfolio career = diversified risk',
    'investor': 'You deploy capital, not labor',
    'venture capital': 'VCs fund AI, not fear it',
    'angel investor': 'Angel investors pick winners',
    'board member': 'Governance roles need human judgment',
    'chairman': 'You own the board, not a desk',
    'owner': 'You own the business, not a job',
    'ceo': 'You deploy AI, not compete with it',
  }

  let titleFound = false
  for (const [title, context] of Object.entries(verySafeTitles)) {
    if (combinedText.includes(title)) {
      score -= 25
      goodFactors.push(context)
      titleFound = true
      isVerySafe = true // Skip industry risk later
      break
    }
  }

  // ============================================
  // STEP 2: CMO/CHRO CHECK (dying C-suite functions)
  // Must check BEFORE "chief" which would protect them
  // ============================================
  if (!titleFound) {
    if (combinedText.includes('cmo') || combinedText.includes('chief marketing')) {
      score += 10
      badFactors.push('CMO: Marketing being automated, high salary = first to cut')
      titleFound = true
    } else if (combinedText.includes('chro') || combinedText.includes('chief human resources') || combinedText.includes('chief people')) {
      score += 10
      badFactors.push('CHRO: HR automation accelerating, function shrinking')
      titleFound = true
    }
  }

  // ============================================
  // STEP 3: HIGH RISK TITLES (+20)
  // ============================================
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
    'support specialist': 'Chatbots handling 80% of support queries'
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(highRiskTitles)) {
      if (combinedText.includes(title)) {
        score += 20
        badFactors.push(context)
        titleFound = true
        break
      }
    }
  }

  // ============================================
  // STEP 4: MEDIUM RISK TITLES (+10)
  // Includes SWE (market flooded + Copilot)
  // ============================================
  const mediumRiskTitles: Record<string, string> = {
    'manager': 'Middle management shrinking as orgs flatten',
    'supervisor': 'AI performance monitoring reducing supervisor roles',
    'accountant': '40% of accounting tasks automatable',
    'copywriter': 'GPT-4 matches human copywriting quality',
    'content writer': 'AI generating 30% of marketing copy',
    'paralegal': 'AI does doc review 10x faster',
    'customer service': '80% of interactions going to bots',
    'marketing manager': 'AI handles targeting, copy, and optimization',
    'hr manager': 'AI screening resumes, scheduling, interviewing',
    'recruiter': 'AI sourcing up 300%, fewer recruiters needed',
    'operations': 'Operations: AI automating workflows & reporting',
    'sales op': 'Sales ops: CRM + AI forecasting reducing headcount',
    'business analyst': 'AI doing analysis faster than humans',
    'project manager': 'AI project tools automating coordination',
    'product manager': 'AI handling roadmaps, specs, prioritization',
    'consultant': 'AI automating analysis & recommendations',
    'writer': 'AI content generation is mainstream',
    'editor': 'AI editing & proofreading tools everywhere',
    'designer': 'AI design tools (Midjourney, Figma AI) disrupting',
    'software engineer': 'SWE market flooded + Copilot eating junior roles',
    'software developer': 'SWE market saturated + AI coding tools',
    'developer': 'Developer market competitive + AI assistants',
    'programmer': 'Coding increasingly AI-assisted',
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(mediumRiskTitles)) {
      if (combinedText.includes(title)) {
        score += 10
        badFactors.push(context)
        titleFound = true
        break
      }
    }
  }

  // ============================================
  // STEP 5: PROTECTED SWE SPECIALIZATIONS (-10)
  // Infrastructure/backend/devops harder to automate
  // ============================================
  const protectedSWE: Record<string, string> = {
    'infrastructure': 'Infrastructure expertise = hard to automate',
    'backend': 'Backend architecture needs human judgment',
    'devops': 'DevOps: complex systems need experienced humans',
    'platform': 'Platform engineering = strategic, not routine',
    'security engineer': 'Security requires adversarial human thinking',
    'site reliability': 'SRE: keeping systems alive needs humans',
    'systems architect': 'Architecture decisions need human judgment',
    'staff engineer': 'Staff+ roles = leadership, not just coding',
    'principal engineer': 'Principal roles = strategic, not replaceable',
  }

  for (const [title, context] of Object.entries(protectedSWE)) {
    if (combinedText.includes(title)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // ============================================
  // STEP 6: LOW RISK TITLES (-15)
  // Leadership and specialized roles
  // ============================================
  const lowRiskTitles: Record<string, string> = {
    'cto': 'You choose which AI to deploy',
    'cfo': 'Fiduciary responsibility = human required',
    'coo': 'Operations leadership needs human judgment',
    'chief': 'C-suite accountability requires humans',
    'vp of': 'VP-level = relationships + strategy',
    'vice president': 'Relationship-driven, harder to automate',
    'director': 'Strategic decisions still need humans',
    'head of': 'Leadership roles harder to automate',
    'senior director': 'Senior leadership = judgment AI lacks',
    'partner': 'Partner-level = client relationships matter',
    'managing director': 'MD roles = client trust + judgment',
    'general manager': 'GM = accountability + local knowledge',
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(lowRiskTitles)) {
      if (combinedText.includes(title)) {
        score -= 15
        goodFactors.push(context)
        titleFound = true
        break
      }
    }
  }

  // ============================================
  // STEP 7: INDUSTRY RISK (SKIP if Very Safe)
  // Founders don't get dinged for being in "marketing"
  // ============================================
  if (!isVerySafe) {
    const highRiskIndustries: Record<string, string> = {
      'advertising': 'Programmatic + AI creative = fewer humans',
      'journalism': 'AP using AI for reports since 2014',
      'retail': 'Automated checkout + AI inventory',
      'telemarketing': 'Robocalls won, humans lost',
      'call center': '85% of interactions will be AI by 2025',
      'insurance claims': 'Claims processing 90% automatable',
      'banking': 'AI doing loans, fraud, trading',
      'legal services': 'AI contract review 10x faster than associates',
    }

    for (const [ind, context] of Object.entries(highRiskIndustries)) {
      if (combinedText.includes(ind) || allExperiences.includes(ind)) {
        score += 12
        badFactors.push(context)
        break
      }
    }
  }

  // Protected industries (always apply)
  const protectedIndustries: Record<string, string> = {
    'healthcare': 'Aging population = growing demand',
    'medical': 'Liability + licensing protects you',
    'construction': 'Robots can\'t navigate job sites yet',
    'nursing': '1M+ shortage = job security for decades',
    'emergency services': 'Split-second human judgment required',
    'plumbing': 'Every house is different',
    'electrical work': 'Code compliance = human required',
    'physical therapy': 'Human touch is the product',
  }

  for (const [ind, context] of Object.entries(protectedIndustries)) {
    if (combinedText.includes(ind) || allExperiences.includes(ind)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // ============================================
  // STEP 8: TECH SKILLS (protective)
  // ============================================
  const techSkills: Record<string, string> = {
    'artificial intelligence': 'You\'re building the disruption',
    'machine learning': 'ML expertise in high demand',
    'ai engineer': 'AI builders don\'t fear AI',
    'data science': 'AI needs humans to ask right questions',
    'robotics': 'You build the robots',
    'blockchain': 'Niche expertise = hard to replace',
    'web3': 'Emerging field = runway',
    'crypto': 'Specialized knowledge protects you',
  }

  for (const [skill, context] of Object.entries(techSkills)) {
    if (combinedText.includes(skill)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // ============================================
  // STEP 9: EXPERIENCE COUNT
  // ============================================
  const expCount = profile.experiences?.length || 0
  if (expCount > 10) {
    score -= 8
    goodFactors.push(`${expCount}+ roles = deep institutional knowledge`)
  } else if (expCount > 7) {
    score -= 5
    goodFactors.push(`${expCount}+ roles = institutional knowledge`)
  } else if (expCount < 3) {
    score += 5
    badFactors.push('Early career = more replaceable')
  }

  // ============================================
  // STEP 10: FOLLOWER COUNT (MAJOR factor)
  // Mega-followers = basically immune
  // ============================================
  const followers = profile.follower_count || 0
  if (followers > 500000) {
    score -= 35
    goodFactors.push(`${followers.toLocaleString()} followers = you ARE the media`)
  } else if (followers > 100000) {
    score -= 25
    goodFactors.push(`${followers.toLocaleString()} followers = massive distribution moat`)
  } else if (followers > 50000) {
    score -= 15
    goodFactors.push(`${followers.toLocaleString()} followers = strong personal brand`)
  } else if (followers > 10000) {
    score -= 8
    goodFactors.push(`${followers.toLocaleString()} followers = personal brand moat`)
  } else if (followers > 5000) {
    score -= 4
    goodFactors.push(`${followers.toLocaleString()} connections = strong network`)
  } else if (followers < 500) {
    score += 3
    badFactors.push('Small network = fewer opportunities')
  }

  // ============================================
  // STEP 11: Additional entrepreneur signals
  // ============================================
  if (!isVerySafe && (combinedText.includes('started my') || combinedText.includes('built my') || combinedText.includes('own business'))) {
    score -= 10
    goodFactors.push('Entrepreneurial mindset = you adapt')
  }

  // ============================================
  // STEP 12: CLAMP and ensure both boxes have content
  // ============================================
  score = Math.max(12, Math.min(94, score))

  // Always ensure BOTH boxes have content
  if (badFactors.length === 0) {
    if (score > 50) {
      badFactors.push('Some roles in your field are being automated')
    } else if (score > 30) {
      badFactors.push('AI tools are entering your workflow')
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
