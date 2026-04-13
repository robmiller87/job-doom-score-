import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '80,000 Tech Workers Gone in Q1 2026 — Half Replaced by AI | DoomCheck',
  description: '78,557 tech jobs cut in the first quarter of 2026. Almost half explicitly blamed on AI. At this pace, 265K jobs gone by year end.',
  openGraph: {
    title: '80,000 Tech Workers Gone in Q1 2026 — Half Replaced by AI',
    description: '78,557 tech jobs cut in Q1 2026. 48% due to AI. The numbers are accelerating.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '80,000 Tech Workers Gone in Q1 2026 — Half Replaced by AI',
    description: '78,557 tech jobs cut in Q1 2026. 48% due to AI. The numbers are accelerating.',
  }
}

export default function Q1LayoffsPost() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">Q1 2026</span>
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">AI Layoffs</span>
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">Industry Report</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">
          80,000 Tech Workers Gone in Q1 2026 — Half Replaced by AI
        </h1>
        
        <div className="flex items-center text-gray-400 text-sm">
          <span>April 13, 2026</span>
          <span className="mx-2">•</span>
          <span>5 min read</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-red max-w-none">
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          <strong>The numbers are in for Q1 2026. 78,557 tech workers lost their jobs in three months. 
          Almost half — 47.9% — were explicitly cut because of AI. This isn&apos;t a prediction anymore. It&apos;s a quarterly earnings report.</strong>
        </p>

        <h2>The Raw Numbers</h2>
        <ul>
          <li><strong>78,557</strong> tech workers laid off in Q1 2026</li>
          <li><strong>37,638</strong> (47.9%) cut explicitly due to AI</li>
          <li><strong>76%</strong> of cuts happened in the United States</li>
          <li><strong>264,730</strong> projected job losses for full year at current pace</li>
        </ul>

        <p>
          That last number deserves a second look. If the current pace holds, <strong>a quarter million tech workers</strong> will 
          lose their jobs in 2026. Not restaurant workers. Not truck drivers. Tech workers — the people who were supposed 
          to be safe.
        </p>

        <h2>The &quot;AI Switcheroo&quot;</h2>
        <p>
          Business Insider coined it the &quot;layoff switcheroo.&quot; Here&apos;s how it works:
        </p>
        <ol>
          <li>Company announces layoffs for &quot;restructuring&quot; or &quot;efficiency&quot;</li>
          <li>Same week, company announces massive AI investment</li>
          <li>New job postings appear — but for AI/ML roles, not the ones that were cut</li>
          <li>Stock price goes up because investors love replacing humans with machines</li>
        </ol>
        <p>
          Pinterest cut 15% of its workforce in January, citing &quot;reallocating resources to teams focused on AI.&quot; 
          An employee (anonymous, because of course) said the layoffs were really about fixing the business — AI was just the cover story.
        </p>
        <p>
          It doesn&apos;t matter which version is true. Either AI is replacing you, or AI is the excuse to replace you. 
          The result is the same: you&apos;re gone.
        </p>

        <h2>Who&apos;s Getting Hit</h2>
        <p>
          The biggest cuts this quarter came from:
        </p>
        <ul>
          <li><strong>Oracle:</strong> 30,000 jobs (18% of workforce) — to fund AI spending</li>
          <li><strong>Meta:</strong> Ongoing &quot;flattening&quot; — cutting middle management, hiring AI engineers</li>
          <li><strong>Dell:</strong> Thousands cut across divisions</li>
          <li><strong>Citibank:</strong> Continuing 2025 cuts into 2026</li>
          <li><strong>GoPro:</strong> Workforce reduction</li>
        </ul>
        <p>
          Notice a pattern? It&apos;s not just startups trimming fat. These are massive, profitable companies choosing 
          to replace humans with AI — and being rewarded by the market for doing it.
        </p>

        <h2>The Gartner Prediction</h2>
        <p>
          Advisory firm Gartner predicts that <strong>half of all companies will use AI to reduce headcount</strong> in 
          the near term. Not &quot;might.&quot; Not &quot;could.&quot; Will.
        </p>
        <p>
          Meanwhile, 55% of companies surveyed said they plan to increase contract and temporary workers in 2026. 
          Translation: full-time jobs become gig work, benefits disappear, and the AI handles the rest.
        </p>

        <h2>What This Means For You</h2>
        <p>
          If you work in tech and you haven&apos;t checked your AI replacement risk yet, you&apos;re running out of 
          excuses. The data is clear:
        </p>
        <ul>
          <li>Middle management is the primary target</li>
          <li>Repetitive knowledge work is being automated first</li>
          <li>Companies are using &quot;AI investment&quot; as cover for cost-cutting</li>
          <li>The US is absorbing 76% of the damage</li>
        </ul>

        <h2>The Uncomfortable Truth</h2>
        <p>
          We&apos;re on pace for a quarter million tech layoffs this year. The companies doing the cutting are more 
          profitable than ever. The stock market rewards every pink slip. And the AI tools replacing these workers 
          are getting better every quarter.
        </p>
        <p>
          This isn&apos;t a recession. This is a restructuring. And unlike a recession, 
          these jobs aren&apos;t coming back.
        </p>

        <div className="bg-red-950 border border-red-800 rounded-lg p-6 my-8">
          <h3 className="text-red-400 font-bold text-lg mb-2">Check Your Doom Score</h3>
          <p className="text-gray-300 mb-4">
            Paste any job listing into DoomCheck and find out how likely AI is to replace that role. 
            It takes 10 seconds. The answer might save your career.
          </p>
          <Link 
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Check Your Job →
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Sources: Tom&apos;s Hardware, Nikkei Asia, Business Insider, Gartner, The Guardian. Data as of April 2026.
        </p>
      </div>

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <Link href="/blog" className="text-red-400 hover:text-red-300 transition-colors">
          ← Back to The Doom Report
        </Link>
      </div>
    </article>
  )
}
