import { NextRequest, NextResponse } from 'next/server'

const PILOTERR_API_KEY = process.env.PILOTERR_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json()

    if (!PILOTERR_API_KEY) {
      return NextResponse.json({ error: 'No API key' }, { status: 500 })
    }

    const response = await fetch(
      `https://piloterr.com/api/v2/linkedin/profile/info?query=${encodeURIComponent(linkedinUrl)}`,
      { headers: { 'x-api-key': PILOTERR_API_KEY } }
    )

    const rawResponse = await response.json()
    
    // Return the full raw response so we can see the structure
    return NextResponse.json({
      rawKeys: Object.keys(rawResponse),
      hasProfile: !!rawResponse.profile,
      profileKeys: rawResponse.profile ? Object.keys(rawResponse.profile) : null,
      headline: rawResponse.profile?.headline || rawResponse.headline || 'NOT_FOUND',
      experiences: rawResponse.profile?.experiences?.slice(0, 2) || rawResponse.experiences?.slice(0, 2) || 'NOT_FOUND',
      fullRaw: rawResponse
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
