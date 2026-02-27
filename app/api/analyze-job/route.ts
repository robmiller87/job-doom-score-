import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { jobTitle } = await request.json()

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your job title' }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
    }

    const prompt = `You are a brutally honest AI job displacement analyst. Given ONLY a job title, assess how likely this person is to be replaced by AI in the next 3-5 years.

JOB TITLE: "${jobTitle}"

SCORING GUIDE:
0-20 (UNTOUCHABLE): Founders, CEOs, investors, owners, creative directors, surgeons, judges, licensed trades (plumber, electrician), therapists
21-40 (PROBABLY FINE): Senior leadership, specialized engineers, nurses, teachers, sales leaders, skilled craftspeople
41-60 (SWEATING): Mid-level managers, general developers, designers, marketers, project managers, HR, recruiters  
61-80 (ON THE LIST): Junior roles, analysts, coordinators, copywriters, basic accounting, customer success
81-100 (COOKED): Data entry, transcription, basic customer support, telemarketers, routine admin, bookkeeping

RULES:
- Be ruthless but fair
- "Founder" or "CEO" = automatic 0-20
- "Assistant" or "Coordinator" = automatic 70+
- Software engineers are 45-55 (AI tools flooding market)
- Add dark humor to the roast
- Keep factors short and punchy (under 8 words each)

Return ONLY valid JSON:
{
  "score": <0-100>,
  "roast": "<one brutal sentence about their future>",
  "goodFactors": ["<why they might survive>", "<another reason>"],
  "badFactors": ["<why AI is coming>", "<another threat>"]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      console.error('OpenAI error:', await response.text())
      return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          score: Math.max(5, Math.min(98, parsed.score || 50)),
          roast: parsed.roast || "AI is watching you.",
          goodFactors: parsed.goodFactors || [],
          badFactors: parsed.badFactors || [],
          jobTitle: jobTitle.trim()
        })
      }
    } catch (e) {
      console.error('Parse error:', content)
    }
    
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
