import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY

// DoomCheck Algorithm v2.1 - Fixes from calibration testing
function calculateDoomScore(profile: any): { score: number; goodFactors: string[]; badFactors: string[] } {
  const goodFactors: string[] = []
  const badFactors: string[] = []
  let score = 50 // Base score
  let isVerySafe = false // Flag to skip industry risk for founders/owners
  let isLowRisk = false // Flag to skip early career penalty

  const headline = (profile.headline || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()
  const combinedText = `${headline} ${summary}`
  
  // Get experience data - check titles too, not just companies
  const experiences = profile.experiences || []
  const allExperienceTitles = experiences.map((e: any) => (e.title || '').toLowerCase()).join(' ')
  const allExperienceCompanies = experiences.map((e: any) => (e.company || '').toLowerCase()).join(' ')
  
  // Combined searchable text includes experience titles
  const fullSearchText = `${combinedText} ${allExperienceTitles}`

  // ============================================
  // STEP 1: VERY SAFE CHECK (founders, owners, investors)
  // These people pivot, they don't get replaced. Check FIRST!
  // Now also checks experience titles (not just headline)
  // ============================================
  const verySafeTitles: Record<string, string> = {
    'co-founder': 'You built companies, you\'ll build more',
    'cofounder': 'You built companies, you\'ll build more',
    'founder': 'Founders adapt, not get replaced',
    'founding': 'Founding team = ownership mentality',
    'entrepreneur': 'Entrepreneurs pivot, not get fired',
    'serial entrepreneur': 'You\'ve reinvented yourself before',
    'solopreneur': 'You are the business',
    'self-employed': 'No boss to fire you',
    'independent consultant': 'Independence = adaptability',
    'sovereign': 'You answer to yourself',
    'fractional': 'Portfolio career = diversified risk',
    'managing partner': 'You run the fund, not work for it',
    'general partner': 'GP = you deploy capital',
    'investor': 'You deploy capital, not labor',
    'venture capital': 'VCs fund AI, not fear it',
    'angel investor': 'Angel investors pick winners',
    'private equity': 'PE = capital allocation, not labor',
    'board member': 'Governance roles need human judgment',
    'chairman': 'You own the board, not a desk',
    'owner': 'You own the business, not a job',
    'ceo': 'You deploy AI, not compete with it',
  }

  let titleFound = false
  for (const [title, context] of Object.entries(verySafeTitles)) {
    if (fullSearchText.includes(title)) {
      score -= 25
      goodFactors.push(context)
      titleFound = true
      isVerySafe = true // Skip industry risk + early career penalty
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
    'executive assistant': 'EA tasks: 70% automatable by 2027',
    'administrative assistant': 'Admin work: #1 category for AI replacement',
    'personal assistant': 'AI assistants replacing PA roles',
    'coordinator': 'Coordination roles: AI scheduling up 400% since 2023',
    'junior analyst': 'Junior analysts being replaced at major banks',
    'data analyst': 'Data analysis increasingly AI-powered',
    'administrator': 'Admin work: #1 category for AI replacement',
    'clerk': 'Clerical roles: 85% of tasks automatable today',
    'receptionist': 'AI receptionists now handle 60% of calls',
    'data entry': 'Data entry: 95% automatable',
    'bookkeeper': 'AI accounting tools 10x faster than humans',
    'transcription': 'Whisper AI made transcription obsolete',
    'secretary': 'AI assistants replacing secretary roles',
    'support specialist': 'Chatbots handling 80% of support queries',
    'customer support': 'Support tickets increasingly AI-handled',
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
    'business development': 'BD: AI SDRs + automated outreach reducing headcount',
    'account manager': 'Account management: CRM automation handling routine tasks',
    'account executive': 'AE roles shrinking as AI handles qualification',
    'sales manager': 'Sales management: AI forecasting + coaching tools',
    'marketing manager': 'AI handles targeting, copy, and optimization',
    'hr manager': 'AI screening resumes, scheduling, interviewing',
    'recruiter': 'AI sourcing up 300%, fewer recruiters needed',
    'talent acquisition': 'Talent acquisition increasingly AI-assisted',
    'operations manager': 'Operations: AI automating workflows & reporting',
    'sales operations': 'Sales ops: CRM + AI forecasting reducing headcount',
    'business analyst': 'AI doing analysis faster than humans',
    'project manager': 'AI project tools automating coordination',
    'product manager': 'AI handling roadmaps, specs, prioritization',
    'program manager': 'Program management: AI coordination tools',
    'consultant': 'AI automating analysis & recommendations',
    'copywriter': 'GPT-4 matches human copywriting quality',
    'content writer': 'AI generating 30% of marketing copy',
    'writer': 'AI content generation is mainstream',
    'editor': 'AI editing & proofreading tools everywhere',
    'graphic designer': 'AI design tools (Midjourney, Canva AI) disrupting',
    'ui designer': 'UI design increasingly AI-assisted',
    'ux designer': 'UX research and design tools going AI',
    'paralegal': 'AI does doc review 10x faster',
    'customer service': '80% of interactions going to bots',
    'accountant': '40% of accounting tasks automatable',
    'financial analyst': 'Financial modeling increasingly AI-powered',
    'software engineer': 'SWE market flooded + Copilot eating junior roles',
    'software developer': 'SWE market saturated + AI coding tools',
    'frontend developer': 'Frontend: AI generating UI code',
    'frontend engineer': 'Frontend: AI generating UI code',
    'backend developer': 'Backend roles: AI-assisted coding accelerating',
    'full stack': 'Full stack market competitive + AI assistants',
    'fullstack': 'Full stack market competitive + AI assistants',
    'web developer': 'Web dev: AI generating code faster than humans',
    'mobile developer': 'Mobile dev: AI building apps from prompts',
    'ios developer': 'iOS dev: AI tools writing Swift code',
    'android developer': 'Android dev: AI coding assistants everywhere',
    'react developer': 'React dev: AI generating components',
    'node developer': 'Node dev: Copilot writing server code',
    'python developer': 'Python dev: AI coding tools dominating',
    'java developer': 'Java dev: Enterprise code increasingly AI-generated',
    'programmer': 'Coding increasingly AI-assisted',
    'coder': 'Coding increasingly AI-assisted',
    'developer': 'Developer market: AI assistants changing everything',
    'engineer': 'Engineering roles: AI tools entering workflow',
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
    'backend engineer': 'Backend architecture needs human judgment',
    'devops': 'DevOps: complex systems need experienced humans',
    'platform engineer': 'Platform engineering = strategic, not routine',
    'security engineer': 'Security requires adversarial human thinking',
    'site reliability': 'SRE: keeping systems alive needs humans',
    'systems architect': 'Architecture decisions need human judgment',
    'solutions architect': 'Solutions architecture = client trust',
    'staff engineer': 'Staff+ roles = leadership, not just coding',
    'principal engineer': 'Principal roles = strategic, not replaceable',
    'engineering manager': 'Engineering leadership = people management',
  }

  for (const [title, context] of Object.entries(protectedSWE)) {
    if (fullSearchText.includes(title)) {
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
    'cio': 'IT strategy requires human judgment',
    'chief': 'C-suite accountability requires humans',
    'vp of': 'VP-level = relationships + strategy',
    'vice president': 'Relationship-driven, harder to automate',
    'svp': 'Senior VP = strategic leadership',
    'evp': 'Executive VP = C-suite adjacent',
    'director': 'Strategic decisions still need humans',
    'head of': 'Leadership roles harder to automate',
    'senior director': 'Senior leadership = judgment AI lacks',
    'partner': 'Partner-level = client relationships matter',
    'managing director': 'MD roles = client trust + judgment',
    'general manager': 'GM = accountability + local knowledge',
    'senior': 'Seniority = relationships + judgment AI lacks',
  }

  if (!titleFound) {
    for (const [title, context] of Object.entries(lowRiskTitles)) {
      if (combinedText.includes(title)) {
        score -= 15
        goodFactors.push(context)
        titleFound = true
        isLowRisk = true
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
      'advertising agency': 'Programmatic + AI creative = fewer humans',
      'journalism': 'AP using AI for reports since 2014',
      'retail': 'Automated checkout + AI inventory',
      'telemarketing': 'Robocalls won, humans lost',
      'call center': '85% of interactions will be AI by 2025',
      'insurance claims': 'Claims processing 90% automatable',
      'legal services': 'AI contract review 10x faster than associates',
    }

    for (const [ind, context] of Object.entries(highRiskIndustries)) {
      if (combinedText.includes(ind) || allExperienceCompanies.includes(ind)) {
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
    'electrical contractor': 'Code compliance = human required',
    'physical therapy': 'Human touch is the product',
    'mental health': 'Therapy requires human connection',
  }

  for (const [ind, context] of Object.entries(protectedIndustries)) {
    if (combinedText.includes(ind) || allExperienceCompanies.includes(ind)) {
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
    'deep learning': 'Deep learning = cutting edge',
    'ai engineer': 'AI builders don\'t fear AI',
    'data science': 'AI needs humans to ask right questions',
    'robotics': 'You build the robots',
    'blockchain': 'Niche expertise = hard to replace',
    'web3': 'Emerging field = runway',
    'crypto': 'Specialized knowledge protects you',
    'deep tech': 'Deep tech = hard to replicate',
  }

  for (const [skill, context] of Object.entries(techSkills)) {
    if (fullSearchText.includes(skill)) {
      score -= 10
      goodFactors.push(context)
      break
    }
  }

  // ============================================
  // STEP 9: EXPERIENCE COUNT
  // Skip early career penalty for senior titles
  // ============================================
  const expCount = experiences.length
  if (expCount > 10) {
    score -= 8
    goodFactors.push(`${expCount}+ roles = deep institutional knowledge`)
  } else if (expCount > 7) {
    score -= 5
    goodFactors.push(`${expCount}+ roles = institutional knowledge`)
  } else if (expCount < 3 && !isVerySafe && !isLowRisk) {
    // Only penalize if NOT a senior title
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
  } else if (followers < 500 && !isVerySafe && !isLowRisk) {
    // Only penalize if NOT a senior title
    score += 3
    badFactors.push('Small network = fewer opportunities')
  }

  // ============================================
  // STEP 11: Additional entrepreneur signals
  // ============================================
  if (!isVerySafe && (combinedText.includes('started my') || combinedText.includes('built my') || combinedText.includes('own business') || combinedText.includes('my company'))) {
    score -= 10
    goodFactors.push('Entrepreneurial mindset = you adapt')
    isVerySafe = true
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

    const fullName = profile.full_name || profile.name || profile.fullName || 
                     (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null) ||
                     profile.firstName || null
    const firstName = fullName?.split(' ')[0] || null
    
    console.log('Piloterr profile:', { 
      name: fullName, 
      headline: profile.headline?.slice(0, 50),
      experienceCount: profile.experiences?.length,
      followers: profile.follower_count
    })

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
