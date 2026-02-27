import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.feedback?.trim()) {
      return NextResponse.json({ error: 'Feedback required' }, { status: 400 })
    }

    if (!GOOGLE_SHEET_WEBHOOK) {
      console.error('No webhook configured')
      return NextResponse.json({ error: 'Feedback system unavailable' }, { status: 500 })
    }

    // Forward to Google Sheet
    await fetch(GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name || 'Unknown',
        score: data.score || 0,
        tier: data.tier || 'Unknown',
        feedback: data.feedback,
        email: data.email || '',
        url: data.url || ''
      })
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
