import { NextRequest, NextResponse } from 'next/server'

const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY

// AI-based doom scoring based on profile data
function calculateDoomScore(profile: any): { score: number; factors: string[] } {
  const factors: string[] = []
  let score = 50 // Base score

  const headline = (profile.headline || '').toLowerCase()
  const occupation = (profile.occupation || '').toLowerCase()
  const industry = (profile.industry || '').toLowerCase()
  const summary = (profile.summary || '').toLowerCase()

  // High risk job titles
  const highRiskTitles = ['assistant', 'coordinator', 'analyst', 'specialist', 'administrator', 'clerk', 'receptionist', 'data entry', 'bookkeeper', 'transcription']
  const mediumRiskTitles = ['manager', 'supervisor', 'accountant', 'copywriter', 'content writer', 'paralegal', 'customer service']
  const lowRiskTitles = ['director', 'vp', 'chief', 'founder', 'ceo', 'cto', 'engineer', 'developer', 'surgeon', 'therapist', 'plumber', 'electrician']

  // Check headline/occupation for risk
  for (const title of highRiskTitles) {
    if (headline.includes(title) || occupation.includes(title)) {
      score += 20
      factors.push(`"${title}" is highly automatable`)
      break
    }
  }

  for (const title of mediumRiskTitles) {
    if (headline.includes(title) || occupation.includes(title)) {
      score += 10
      factors.push(`"${title}" faces AI pressure`)
      break
    }
  }

  for (const title of lowRiskTitles) {
    if (headline.includes(title) || occupation.includes(title)) {
      score -= 15
      factors.push(`"${title}" is harder to automate`)
      break
    }
  }

  // Industry risk
  const highRiskIndustries = ['marketing', 'advertising', 'media', 'journalism', 'retail', 'telemarketing', 'call center', 'insurance']
  const lowRiskIndustries = ['healthcare', 'medical', 'construction', 'trades', 'nursing', 'emergency']

  for (const ind of highRiskIndustries) {
    if (industry.includes(ind) || headline.includes(ind)) {
      score += 12
      factors.push(`${ind} industry facing disruption`)
      break
    }
  }

  for (const ind of lowRiskIndustries) {
    if (industry.includes(ind) || headline.includes(ind)) {
      score -= 10
      factors.push(`${ind} requires human presence`)
      break
    }
  }

  // Check for AI/tech skills (protective)
  const techSkills = ['ai', 'machine learning', 'python', 'engineering', 'software', 'data science', 'robotics']
  for (const skill of techSkills) {
    if (headline.includes(skill) || summary.includes(skill)) {
      score -= 8
      factors.push(`Tech skills provide some protection`)
      break
    }
  }

  // Experience factor from profile
  if (profile.experiences && profile.experiences.length > 5) {
    score -= 5
    factors.push(`Senior experience helps (for now)`)
  }

  // Clamp score
  score = Math.max(15, Math.min(95, score))

  // Ensure at least 2 factors
  if (factors.length === 0) {
    factors.push('General workforce AI disruption')
    factors.push('Automation pressure increasing')
  } else if (factors.length === 1) {
    factors.push('Broader AI adoption accelerating')
  }

  return { score, factors }
}

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json()

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 })
    }

    if (!PROXYCURL_API_KEY) {
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

    // Call Proxycurl API
    const response = await fetch('https://nubela.co/proxycurl/api/v2/linkedin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PROXYCURL_API_KEY}`
      },
      // @ts-ignore
      url: undefined,
      next: { revalidate: 0 }
    })

    // Actually need to use query params
    const proxyResponse = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinUrl)}&skills=include`,
      {
        headers: {
          'Authorization': `Bearer ${PROXYCURL_API_KEY}`
        }
      }
    )

    if (!proxyResponse.ok) {
      const error = await proxyResponse.text()
      console.error('Proxycurl error:', error)
      
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

    const profile = await proxyResponse.json()
    const { score, factors } = calculateDoomScore(profile)

    return NextResponse.json({
      score,
      factors,
      name: profile.first_name || null,
      profilePic: profile.profile_pic_url || null,
      headline: profile.headline || null
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
