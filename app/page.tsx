"use client"

import { useState } from "react"

interface AnalysisResult {
  score: number
  roast: string
  goodFactors: string[]
  badFactors: string[]
  jobTitle: string
}

interface TierResult {
  tier: string
  emoji: string
  message: string
  color: string
}

function getTier(score: number): TierResult {
  if (score <= 20) return { 
    tier: "UNTOUCHABLE", 
    emoji: "😎", 
    message: "The robots work FOR you.",
    color: "text-green-600"
  }
  if (score <= 40) return { 
    tier: "PROBABLY FINE", 
    emoji: "😌", 
    message: "You'll survive. Probably.",
    color: "text-lime-600"
  }
  if (score <= 60) return { 
    tier: "SWEATING", 
    emoji: "😬", 
    message: "AI just CC'd your boss.",
    color: "text-yellow-600"
  }
  if (score <= 80) return { 
    tier: "ON THE LIST", 
    emoji: "🚨", 
    message: "Your LinkedIn says 'Open to Work' soon.",
    color: "text-orange-500"
  }
  return { 
    tier: "COOKED", 
    emoji: "💀", 
    message: "RIP your career.",
    color: "text-red-600"
  }
}

export default function Home() {
  const [jobTitle, setJobTitle] = useState("")
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [checkedCount] = useState(2847)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (jobTitle.trim().length < 2) {
      setError("Please enter your job title")
      return
    }
    
    setStep("analyzing")
    
    try {
      const res = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: jobTitle.trim() })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }
      
      setResult(data)
      setStep("result")
    } catch (err: any) {
      setError(err.message || "Failed to analyze. Please try again.")
      setStep("input")
    }
  }

  const shareTwitter = () => {
    if (!result) return
    const { tier } = getTier(result.score)
    const text = encodeURIComponent(`My AI doom status: ${tier} ${getTier(result.score).emoji}\n\n"${result.roast}"\n\nCheck yours:`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent('https://doomcheck.com')}`, "_blank")
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://doomcheck.com')}`, "_blank")
  }

  const reset = () => {
    setStep("input")
    setJobTitle("")
    setResult(null)
    setError("")
  }

  // ANALYZING STATE
  if (step === "analyzing") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-6 animate-pulse">🔮</div>
          <h2 className="text-2xl font-black text-black mb-2">ANALYZING...</h2>
          <p className="text-gray-600 mb-6">Consulting the AI overlords...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-orange-500 h-2 rounded-full animate-progress"></div>
          </div>
        </div>
      </main>
    )
  }

  // RESULT STATE
  if (step === "result" && result) {
    const tier = getTier(result.score)
    
    return (
      <main className="min-h-screen flex flex-col items-center p-6 bg-[#f5f5f0]">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold">
              <span className="text-black">😬 DOOM</span>
              <span className="text-orange-500">CHECK</span>
            </h1>
          </div>

          {/* Result Card */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Your doom status</p>
            <p className="text-xl font-bold text-black mb-4">"{result.jobTitle}"</p>
            
            <div className="text-8xl mb-4">{tier.emoji}</div>
            
            <h2 className={`text-4xl font-black mb-2 ${tier.color}`}>
              {tier.tier}
            </h2>
            <p className="text-gray-600 text-lg mb-4">"{tier.message}"</p>
            
            {/* Score bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  result.score <= 20 ? 'bg-green-500' :
                  result.score <= 40 ? 'bg-lime-500' :
                  result.score <= 60 ? 'bg-yellow-500' :
                  result.score <= 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">Doom Score: {result.score}/100</p>
          </div>

          {/* Roast */}
          <div className="bg-black text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-lg font-medium">🔥 {result.roast}</p>
          </div>

          {/* Factors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {result.badFactors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="font-bold text-red-600 mb-2">⚠️ AGAINST YOU</p>
                {result.badFactors.map((f, i) => (
                  <p key={i} className="text-sm text-gray-700">• {f}</p>
                ))}
              </div>
            )}
            {result.goodFactors.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="font-bold text-green-600 mb-2">✅ FOR YOU</p>
                {result.goodFactors.map((f, i) => (
                  <p key={i} className="text-sm text-gray-700">• {f}</p>
                ))}
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={shareTwitter}
              className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              SHARE ON X
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex-1 bg-[#0077b5] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#006097] transition"
            >
              SHARE ON LINKEDIN
            </button>
          </div>

          <button
            onClick={reset}
            className="w-full text-gray-500 py-2 hover:text-black transition"
          >
            Check another job →
          </button>
        </div>
      </main>
    )
  }

  // INPUT STATE (default)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-black">😬 DOOM</span>
          <span className="text-orange-500">CHECK</span>
        </h1>
        
        <a 
          href="https://www.mckinsey.com/featured-insights/future-of-work/jobs-lost-jobs-gained-what-the-future-of-work-will-mean-for-jobs-skills-and-wages"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 underline mb-8 block"
        >
          McKinsey: 375 million workers may need to change jobs by 2030 →
        </a>

        {/* Main headline */}
        <h2 className="text-5xl md:text-6xl font-black text-black mb-4 leading-tight">
          ARE YOU<br />COOKED?
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Enter your job title. We'll tell you if AI is coming for you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Marketing Manager"
              className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
              CHECK IT
            </button>
          </div>
          {error && (
            <p className="text-red-500 mt-3 text-sm">{error}</p>
          )}
        </form>

        {/* Social proof */}
        <p className="text-gray-400 text-sm">
          🔥 <span className="font-bold">{checkedCount.toLocaleString()}</span> careers checked
        </p>
      </div>
    </main>
  )
}
