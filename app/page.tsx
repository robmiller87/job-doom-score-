"use client"

import { useState } from "react"

interface AnalysisResult {
  score: number
  goodFactors: string[]
  badFactors: string[]
  name: string | null
  profilePic: string | null
  headline: string | null
}

interface TierResult {
  tier: string
  emoji: string
  message: string
  color: string
}

function getTier(score: number): TierResult {
  if (score <= 20) return { 
    tier: "SAFE", 
    emoji: "😎", 
    message: "The robots work for you.",
    color: "text-green-600"
  }
  if (score <= 40) return { 
    tier: "UNCERTAIN", 
    emoji: "😌", 
    message: "You might survive. Maybe.",
    color: "text-yellow-600"
  }
  if (score <= 60) return { 
    tier: "NERVOUS", 
    emoji: "😬", 
    message: "Time to adapt.",
    color: "text-orange-500"
  }
  if (score <= 80) return { 
    tier: "IN DANGER", 
    emoji: "🚨", 
    message: "AI is coming for you.",
    color: "text-red-500"
  }
  return { 
    tier: "DOOMED", 
    emoji: "💀", 
    message: "Update your resume. Now.",
    color: "text-red-700"
  }
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [checkedCount] = useState(2500)
  
  // Fake recently checked users for social proof
  const recentUsers = [
    { name: "Sarah", img: "https://i.pravatar.cc/100?img=1" },
    { name: "Michael", img: "https://i.pravatar.cc/100?img=3" },
    { name: "Emma", img: "https://i.pravatar.cc/100?img=5" },
    { name: "James", img: "https://i.pravatar.cc/100?img=8" },
    { name: "Priya", img: "https://i.pravatar.cc/100?img=9" },
    { name: "David", img: "https://i.pravatar.cc/100?img=11" },
    { name: "Lisa", img: "https://i.pravatar.cc/100?img=16" },
    { name: "Carlos", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Nina", img: "https://i.pravatar.cc/100?img=20" },
    { name: "Tom", img: "https://i.pravatar.cc/100?img=14" },
    { name: "Sofia", img: "https://i.pravatar.cc/100?img=23" },
    { name: "Chris", img: "https://i.pravatar.cc/100?img=15" },
    { name: "Anna", img: "https://i.pravatar.cc/100?img=25" },
    { name: "Ryan", img: "https://i.pravatar.cc/100?img=17" },
    { name: "Julia", img: "https://i.pravatar.cc/100?img=26" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!url.includes("linkedin.com/in/")) {
      setError("Please enter a valid LinkedIn profile URL")
      return
    }
    
    setStep("analyzing")
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: url })
      })
      
      if (!res.ok) throw new Error('Analysis failed')
      
      const data = await res.json()
      setResult(data)
      setStep("result")
    } catch (err) {
      setError("Failed to analyze profile. Please try again.")
      setStep("input")
    }
  }

  const shareTwitter = () => {
    if (!result) return
    const { tier, message } = getTier(result.score)
    const text = encodeURIComponent(`My AI doom status: ${tier} 💀\n\n"${message}"\n\nCheck yours:`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.origin)}`, "_blank")
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, "_blank")
  }

  const reset = () => {
    setStep("input")
    setUrl("")
    setResult(null)
    setError("")
  }

  if (step === "analyzing") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🔍</div>
          <h2 className="text-2xl font-black text-black mb-2">ANALYZING PROFILE...</h2>
          <p className="text-gray-600">Scanning your career for AI vulnerability...</p>
        </div>
      </main>
    )
  }

  if (step === "result" && result) {
    const { tier, emoji, message, color } = getTier(result.score)
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="max-w-lg w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">😬</span>
            <span className="text-xl font-black tracking-tight text-black">DOOM<span className="text-orange-500">CHECK</span></span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
            YOUR DOOM STATUS
          </h1>
          
          {result.name && (
            <p className="text-xl font-semibold text-black mb-1">{result.name}</p>
          )}
          
          {result.headline && (
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{result.headline}</p>
          )}
          
          <div className="text-8xl mb-4">{emoji}</div>
          <div className={`text-5xl md:text-6xl font-black mb-2 ${color}`}>{tier}</div>
          <p className="text-xl text-gray-700 mb-8">"{message}"</p>

          {(result.goodFactors?.length > 0 || result.badFactors?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              {result.badFactors?.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 p-4 text-left">
                  <p className="font-bold text-sm uppercase tracking-wider mb-2 text-red-700">⚠️ Working Against You</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {result.badFactors.map((factor, i) => (
                      <li key={i}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.goodFactors?.length > 0 && (
                <div className="bg-green-50 border-2 border-green-200 p-4 text-left">
                  <p className="font-bold text-sm uppercase tracking-wider mb-2 text-green-700">✅ Working For You</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {result.goodFactors.map((factor, i) => (
                      <li key={i}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={shareTwitter}
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors text-sm"
            >
              Share on X
            </button>
            <button
              onClick={shareLinkedIn}
              className="bg-[#0077b5] text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-[#006699] transition-colors text-sm"
            >
              Share on LinkedIn
            </button>
          </div>

          <button
            onClick={reset}
            className="text-gray-500 hover:text-black text-sm underline"
          >
            Check another profile
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">😬</span>
          <span className="text-2xl font-black tracking-tight text-black">DOOM<span className="text-orange-500">CHECK</span></span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight">
          ARE YOU DOOMED?
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Paste your LinkedIn URL. We'll analyze your profile<br />
          and tell you how doomed you are by AI.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="linkedin.com/in/yourprofile"
            className="flex-1 border-2 border-black sm:border-r-0 px-4 py-4 text-black bg-white focus:outline-none font-mono text-sm"
          />
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Check It
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <p className="text-gray-500 text-sm mb-6">
          🔥 <span className="font-semibold">{checkedCount.toLocaleString()}</span> profiles checked
        </p>

        {/* Recently checked ticker */}
        <div className="w-full max-w-xl mx-auto mb-6 overflow-hidden">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Recently Checked</p>
          <div className="relative">
            <div className="flex animate-scroll gap-3">
              {[...recentUsers, ...recentUsers].map((user, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 whitespace-nowrap"
                >
                  <img 
                    src={user.img} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 text-xs">
          We don't store your data.
        </p>
      </div>
    </main>
  )
}
