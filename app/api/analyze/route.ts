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

  // High risk job titles
  const highRiskTitles = ['assistant', 'coordinator', 'analyst', 'specialist', 'administrator', 'clerk', 'receptionist', 'data entry', 'bookkeeper', 'transcription', 'secretary', 'support']
  const mediumRiskTitles = ['manager', 'supervisor', 'accountant', 'copywriter', 'content writer', 'paralegal', 'customer service', 'marketing', 'hr ', 'recruiter']
  const lowRiskTitles = ['director', 'vp', 'chief', 'founder', 'ceo', 'cto', 'cfo', 'engineer', 'developer', 'surgeon', 'therapist', 'plumber', 'electrician', 'nurse', 'doctor', 'physician']

  // Check headline/summary for risk
  let titleFound = false
  for (const title of highRiskTitles) {
    if (headline.includes(title) || summary.includes(title)) {
      score += 20
      factors.push(`Role involves tasks AI can automate`)
      titleFound = true
      break
    }
  }

  if (!titleFound) {
    for (const title of mediumRiskTitles) {
      if (headline.includes(title) || summary.includes(title)) {
        score += 10
        factors.push(`Your field is seeing AI adoption`)
        titleFound = true
        break
      }
    }
  }

  if (!titleFound) {
    for (const title of lowRiskTitles) {
      if (headline.includes(title) || summary.includes(title)) {
        score -= 15
        factors.push(`Leadership/specialized roles adapt slower`)
        titleFound = true
        break
      }
    }
  }

  // Industry signals in summary
  const highRiskIndustries = ['marketing', 'advertising', 'media', 'journalism', 'retail', 'telemarketing', 'call center', 'insurance', 'banking', 'finance', 'legal']
  const lowRiskIndustries = ['healthcare', 'medical', 'construction', 'trades', 'nursing', 'emergency', 'plumbing', 'electrical']

  for (const ind of highRiskIndustries) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score += 12
      factors.push(`${ind.charAt(0).toUpperCase() + ind.slice(1)} is being disrupted`)
      break
    }
  }

  for (const ind of lowRiskIndustries) {
    if (summary.includes(ind) || headline.includes(ind) || allExperiences.includes(ind)) {
      score -= 10
      factors.push(`Physical/care work is harder to automate`)
      break
    }
  }

  // Check for AI/tech skills (protective)
  const techSkills = ['ai', 'machine learning', 'python', 'engineering', 'software', 'data science', 'robotics', 'crypto', 'blockchain', 'web3']
  for (const skill of techSkills) {
    if (headline.includes(skill) || summary.includes(skill)) {
      score -= 10
      factors.push(`Tech skills = you're building the disruption`)
      break
    }
  }

  // Experience factor
  const expCount = profile.experiences?.length || 0
  if (expCount > 7) {
    score -= 5
    factors.push(`Deep experience provides runway`)
  } else if (expCount < 3) {
    score += 5
    factors.push(`Early career = more exposure to change`)
  }

  // Follower count (influence = safety)
  const followers = profile.follower_count || 0
  if (followers > 10000) {
    score -= 8
    factors.push(`Large network = distribution advantage`)
  } else if (followers > 5000) {
    score -= 4
    factors.push(`Good network provides options`)
  }

  // Entrepreneur signal
  if (summary.includes('founder') || summary.includes('ceo') || summary.includes('started') || currentJob.toLowerCase().includes('consultancy')) {
    score -= 10
    factors.push(`Entrepreneurial = you adapt, not get replaced`)
  }

  // Clamp score
  score = Math.max(12, Math.min(94, score))

  // Ensure at least 2 factors
  if (factors.length === 0) {
    factors.push('AI adoption is accelerating across industries')
    factors.push('Routine cognitive tasks are most at risk')
  } else if (factors.length === 1) {
    factors.push('Automation pressure increasing everywhere')
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
