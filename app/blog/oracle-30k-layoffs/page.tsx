import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Oracle Just Fired 30,000 People With a 6 AM Email - Are You Next? | DoomCheck',
  description: 'Oracle cut 18% of its workforce overnight to fund AI spending. Their stock went up 2%. Here\'s what this means for your job security.',
  openGraph: {
    title: 'Oracle Just Fired 30,000 People With a 6 AM Email',
    description: 'Oracle cut 18% of its workforce overnight to fund AI spending. Their stock went up 2%.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oracle Just Fired 30,000 People With a 6 AM Email',
    description: 'Oracle cut 18% of its workforce overnight to fund AI spending. Their stock went up 2%.',
  }
}

export default function OracleLayoffsPost() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">Oracle</span>
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">Mass Layoffs</span>
          <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm font-medium">AI Replacement</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight mb-4">
          Oracle Just Fired 30,000 People With a 6 AM Email - Are You Next?
        </h1>
        
        <div className="flex items-center text-gray-400 text-sm">
          <span>April 2, 2026</span>
          <span className="mx-2">•</span>
          <span>4 min read</span>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-red max-w-none">
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          <strong>Oracle cut 18% of its workforce overnight to fund AI spending. Their stock went up 2%. 
          The robots aren't just coming—they're here, and they're being funded by your pink slip.</strong>
        </p>

        <h2>The 6 AM Execution</h2>
        <p>
          Yesterday (March 31, 2026), Oracle employees woke up to an email at 6 AM. Subject line probably something corporate and sanitized. 
          Sender: "Oracle Leadership" (because no one wanted to put their actual name on this massacre).
        </p>

        <p>
          <strong>30,000 people.</strong> Gone. Just like that. System access revoked immediately. 
          No "thank you for your service." No personal touch. Just a bulk email and a locked laptop.
        </p>

        <blockquote>
          <p>
            "Oracle laid off an estimated 20,000 to 30,000 employees globally on March 31, 2026, 
            representing roughly 18% of its total global workforce of around 162,000 people."
            <cite>— TD Cowen estimates</cite>
          </p>
        </blockquote>

        <h2>The Numbers Are Brutal</h2>
        <ul>
          <li><strong>30,000 jobs cut globally</strong></li>
          <li><strong>12,000 cuts in India alone</strong></li>
          <li><strong>18% of total workforce</strong> - nearly 1 in 5 people</li>
          <li><strong>Stock price: UP 2%</strong> (investors love firing humans)</li>
        </ul>

        <h2>Why? "AI Spending Ramp Up"</h2>
        <p>
          Oracle didn't fire 30,000 people because business was bad. They fired them to <em>invest more in AI</em>. 
          Let that sink in. They're literally replacing humans with robots and using the cost savings to buy more robots.
        </p>

        <p>
          This isn't a recession play. This isn't cost-cutting during hard times. This is the future: 
          <strong>AI becomes profitable enough that firing massive numbers of people is a growth strategy.</strong>
        </p>

        <h2>The McKinsey Prophecy</h2>
        <p>
          Remember McKinsey's prediction? <strong>375 million workers will need to change jobs by 2030</strong> due to AI automation. 
          Oracle just moved 30,000 people into that category in one morning.
        </p>

        <p>
          We're not talking about 2030 anymore. We're talking about right now. March 31, 2026. The future arrived early.
        </p>

        <h2>What This Means for You</h2>
        <p>
          If you're in tech, you're watching Oracle—one of the "safe" enterprise companies—prove that no job is safe. 
          If Oracle can fire 18% of their workforce overnight, what's stopping your company?
        </p>

        <p>
          The calculus is simple:
        </p>
        <ul>
          <li><strong>Human salary + benefits</strong> = $100K+/year ongoing</li>
          <li><strong>AI tool subscription</strong> = $20-200/month one-time</li>
          <li><strong>Investor reaction</strong> = Stock goes up</li>
        </ul>

        <p>
          <strong>You're not competing with other humans anymore. You're competing with software that works 24/7, 
          never calls in sick, and costs less than your monthly coffee budget.</strong>
        </p>

        <h2>The New Reality</h2>
        <p>
          Oracle's 30,000 layoffs aren't a tragedy. They're a case study. Other CEOs are taking notes. 
          The playbook is now proven:
        </p>

        <ol>
          <li>Identify AI-replaceable roles</li>
          <li>Send 6 AM email</li>
          <li>Cut humans, invest in AI</li>
          <li>Watch stock price rise</li>
          <li>Repeat</li>
        </ol>

        <p className="text-lg font-semibold text-red-400">
          The question isn't whether this will happen to other companies. 
          The question is: <strong>Are you ready?</strong>
        </p>

        <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-red-800">
          <h3 className="text-xl font-bold mb-3 text-center">Find Out Your Risk</h3>
          <p className="text-center text-gray-400 mb-4">
            Don't wait for your own 6 AM email. Check your AI replacement risk now.
          </p>
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Check Your Doom Score 😬
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <Link 
          href="/blog"
          className="text-red-400 hover:text-red-300 font-medium"
        >
          ← Back to The Doom Report
        </Link>
      </div>
    </article>
  )
}