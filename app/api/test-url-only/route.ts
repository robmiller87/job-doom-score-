import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json()

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'No OpenAI key' }, { status: 500 })
    }

    const prompt = `You are an AI job displacement risk analyst. I'm giving you a LinkedIn profile URL. Based on the URL structure, username, and any knowledge you might have about this person, estimate their AI displacement risk.

LinkedIn URL: ${linkedinUrl}

Instructions:
1. Look at the username in the URL for clues (names, numbers, profession hints)
2. If you recognize this person from your training data, use that knowledge
3. If you don't know them, make reasonable inferences from the URL
4. Score from 0-100 where 0=SAFE (founders, executives, owners) and 100=DOOMED (easily automated roles)

Return ONLY valid JSON:
{
  "score": <0-100>,
  "guessedRole": "<your best guess at their role>",
  "confidence": "<low/medium/high>",
  "reasoning": "<brief explanation>"
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
        temperature: 0.3
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    return NextResponse.json({
      raw: content,
      parsed: JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}')
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
