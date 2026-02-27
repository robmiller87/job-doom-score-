# 😬 DoomCheck

**Are you cooked?** Find out if AI is coming for your job.

[**→ Try it: doomcheck.com**](https://doomcheck.com)

---

## What is this?

A viral AI job risk calculator. Enter your job title, get your "doom score" (0-100), plus a brutally honest roast.

McKinsey says 375 million workers will need to change jobs by 2030. This tool tells you if you're one of them.

## Tiers

| Score | Status | Emoji | Vibe |
|-------|--------|-------|------|
| 0-20 | UNTOUCHABLE | 😎 | The robots work FOR you |
| 21-40 | PROBABLY FINE | 😌 | You'll survive. Probably. |
| 41-60 | SWEATING | 😬 | AI just CC'd your boss |
| 61-80 | ON THE LIST | 🚨 | LinkedIn says "Open to Work" soon |
| 81-100 | COOKED | 💀 | RIP your career |

## Features

- **Zero friction** — Just type your job title
- **GPT-4o-mini powered** — Actual AI analyzing your job
- **Timeline** — See AI impact from 2025-2035
- **Roasts** — Brutally honest one-liners
- **Mobile-first** — Optimized for sharing
- **Native share** — Works on iOS/Android

## Tech Stack

- **Framework:** Next.js 15
- **Hosting:** Vercel
- **AI:** OpenAI GPT-4o-mini
- **Styling:** Tailwind CSS
- **Analytics:** Meta Pixel

## How it works

```
User enters: "Marketing Manager"
        ↓
POST /api/analyze-job
        ↓
GPT-4o-mini analyzes job title
        ↓
Returns: score, roast, factors, timeline
        ↓
Display result with tier + share buttons
```

## Cost

~$0.01 per analysis (GPT-4o-mini)

## Local Development

```bash
# Clone
git clone https://github.com/robmiller87/job-doom-score-.git
cd job-doom-score

# Install
pnpm install

# Set up env
cp .env.example .env.local
# Add your OPENAI_API_KEY

# Run
pnpm dev
```

## Environment Variables

```
OPENAI_API_KEY=sk-...
```

## License

MIT — do whatever you want with it.

## Author

Built by [Robert Miller](https://robertmiller.xyz) with help from [George](https://agent-george.com) (AI agent).

---

**Are you cooked?** [Find out →](https://doomcheck.com)
