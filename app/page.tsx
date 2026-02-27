"use client"

import { useState } from "react"

interface AnalysisResult {
  score: number
  roast: string
  goodFactors: string[]
  badFactors: string[]
  jobTitle: string
  timeline?: {
    "2025": string
    "2027": string
    "2030": string
    "2035": string
  }
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
    const { tier, emoji } = getTier(result.score)
    const text = encodeURIComponent(`I'm ${tier} ${emoji} according to AI\n\nDoom Score: ${result.score}/100\n\n"${result.roast}"\n\nCheck if AI is coming for YOUR job:`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent('https://doomcheck.com')}`, "_blank")
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://doomcheck.com')}`, "_blank")
  }

  const shareNative = async () => {
    if (!result) return
    const { tier, emoji } = getTier(result.score)
    const shareText = `My AI Doom Score: ${result.score}/100 ${emoji}

"${result.roast}"

Check yours: https://doomcheck.com`
    
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          text: shareText
        })
        return
      } catch (e) {
        // User cancelled or share failed, fall through to Twitter
      }
    }
    // Fallback to Twitter
    shareTwitter()
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText('https://doomcheck.com')
    alert('Link copied!')
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
    const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    return (
      <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-[#f5f5f0]">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-4">
            <button onClick={reset} className="text-lg font-bold hover:opacity-70 transition">
              <span className="text-black">😬 DOOM</span>
              <span className="text-orange-500">CHECK</span>
            </button>
          </div>

          {/* Result Card - Screenshot friendly */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 text-center">Your doom status</p>
            <p className="text-lg font-bold text-black mb-3 text-center">"{result.jobTitle}"</p>
            
            <div className="text-7xl sm:text-8xl mb-3 text-center">{tier.emoji}</div>
            
            <h2 className={`text-3xl sm:text-4xl font-black mb-1 text-center ${tier.color}`}>
              {tier.tier}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-4 text-center">"{tier.message}"</p>
            
            {/* Score bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  result.score <= 20 ? 'bg-green-500' :
                  result.score <= 40 ? 'bg-lime-500' :
                  result.score <= 60 ? 'bg-yellow-500' :
                  result.score <= 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">Doom Score: {result.score}/100</p>
          </div>

          {/* Roast */}
          <div className="bg-black text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-lg font-medium">🔥 {result.roast}</p>
          </div>

          {/* Timeline */}
          {result.timeline && (
            <div className="mb-4 bg-gray-50 rounded-xl p-3 sm:p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 text-center">📅 AI Impact Timeline</p>
              <div className="space-y-2">
                {Object.entries(result.timeline).map(([year, desc], i) => (
                  <div key={year} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      i === 0 ? 'bg-green-500' :
                      i === 1 ? 'bg-yellow-500' :
                      i === 2 ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-bold text-xs text-gray-800 w-10">{year}</span>
                    <span className="text-xs text-gray-600 flex-1">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Factors */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
            {result.badFactors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
                <p className="font-bold text-red-600 mb-1 text-xs sm:text-sm">⚠️ AGAINST YOU</p>
                {result.badFactors.map((f, i) => (
                  <p key={i} className="text-xs sm:text-sm text-gray-700">• {f}</p>
                ))}
              </div>
            )}
            {result.goodFactors.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                <p className="font-bold text-green-600 mb-1 text-xs sm:text-sm">✅ FOR YOU</p>
                {result.goodFactors.map((f, i) => (
                  <p key={i} className="text-xs sm:text-sm text-gray-700">• {f}</p>
                ))}
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="space-y-3 mb-4">
            {/* Primary share - Native on mobile */}
            <button
              onClick={shareNative}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-4 rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              📤 SHARE YOUR DOOM
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={shareTwitter}
                className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-bold hover:bg-gray-800 transition"
              >
                𝕏 POST
              </button>
              <button
                onClick={copyLink}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                🔗 COPY LINK
              </button>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full text-gray-500 py-3 hover:text-black transition text-base"
          >
            ← Check another job
          </button>
        </div>
      </main>
    )
  }

  // INPUT STATE (default)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#f5f5f0]">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          <span className="text-black">😬 DOOM</span>
          <span className="text-orange-500">CHECK</span>
        </h1>
        
        <a 
          href="https://www.mckinsey.com/featured-insights/future-of-work/jobs-lost-jobs-gained-what-the-future-of-work-will-mean-for-jobs-skills-and-wages"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 underline mb-6 sm:mb-8 block"
        >
          McKinsey: 375M workers may need new jobs by 2030 →
        </a>

        {/* Main headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-3 sm:mb-4 leading-tight">
          ARE YOU<br />COOKED?
        </h2>
        
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-4">
          Enter your job title. Find out if AI is coming for you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Marketing Manager"
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-orange-500 focus:outline-none mb-3"
            autoComplete="off"
            autoCapitalize="words"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition active:scale-[0.98]"
          >
            CHECK IT →
          </button>
          {error && (
            <p className="text-red-500 mt-3 text-sm">{error}</p>
          )}
        </form>

        {/* Social proof */}
        <p className="text-gray-400 text-sm">
          🔥 <span className="font-bold">{checkedCount.toLocaleString()}</span> careers checked
        </p>
        
        {/* Trust line */}
        <p className="text-gray-300 text-xs mt-4">
          Takes 5 seconds • No signup required
        </p>
      </div>
    </main>
  )
}
