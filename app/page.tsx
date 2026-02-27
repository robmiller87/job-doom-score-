"use client"

import { useState } from "react"

interface AnalysisResult {
  score: number
  factors: string[]
  name: string | null
  profilePic: string | null
  headline: string | null
}

function getResult(score: number): { emoji: string; message: string } {
  if (score <= 35) return { emoji: "😌", message: "You might survive. Maybe." }
  if (score <= 50) return { emoji: "😰", message: "Start paying attention." }
  if (score <= 65) return { emoji: "😬", message: "Time to adapt." }
  if (score <= 80) return { emoji: "🚨", message: "AI is coming for you." }
  return { emoji: "💀", message: "It was nice knowing you." }
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [checkedCount] = useState(47293)

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
    const { message } = getResult(result.score)
    const text = encodeURIComponent(`I'm ${result.score}% doomed by AI 💀\n\n"${message}"\n\nCheck your doom score:`)
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
          <p className="text-gray-600">Reading job title, industry, experience...</p>
        </div>
      </main>
    )
  }

  if (step === "result" && result) {
    const { emoji, message } = getResult(result.score)
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
            YOUR DOOM SCORE
          </h1>
          
          {result.profilePic && (
            <img 
              src={result.profilePic} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-black"
            />
          )}
          
          {result.name && (
            <p className="text-gray-600 mb-2">{result.name}</p>
          )}
          
          {result.headline && (
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{result.headline}</p>
          )}
          
          <div className="text-8xl mb-2">{emoji}</div>
          <div className="text-7xl font-black text-black mb-2">{result.score}%</div>
          <p className="text-xl text-gray-700 mb-6">"{message}"</p>

          {result.factors && result.factors.length > 0 && (
            <div className="bg-white border-2 border-black p-4 mb-6 text-left max-w-sm mx-auto">
              <p className="font-bold text-sm uppercase tracking-wider mb-2">Why:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {result.factors.map((factor, i) => (
                  <li key={i}>• {factor}</li>
                ))}
              </ul>
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

        <p className="text-gray-500 text-sm mb-8">
          🔥 <span className="font-semibold">{checkedCount.toLocaleString()}</span> profiles checked
        </p>
        
        <p className="text-gray-400 text-xs">
          For entertainment purposes only. We don't store your data.
        </p>
      </div>
    </main>
  )
}
