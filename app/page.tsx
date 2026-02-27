"use client"

import { useState } from "react"

// Generate a deterministic score from URL (looks like analysis but consistent per URL)
function generateScore(url: string): number {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  // Map to 35-95 range (most people should feel somewhat doomed)
  return 35 + Math.abs(hash % 60)
}

function getResult(score: number): { emoji: string; message: string } {
  if (score <= 45) return { emoji: "😌", message: "You might survive. Maybe." }
  if (score <= 60) return { emoji: "😰", message: "Start learning new skills." }
  if (score <= 75) return { emoji: "😬", message: "Update that resume." }
  if (score <= 85) return { emoji: "🚨", message: "AI is coming for you." }
  return { emoji: "💀", message: "It was nice knowing you." }
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input")
  const [score, setScore] = useState(0)
  const [checkedCount, setCheckedCount] = useState(47293)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.includes("linkedin.com")) {
      alert("Please enter a valid LinkedIn URL")
      return
    }
    
    setStep("analyzing")
    
    setTimeout(() => {
      const s = generateScore(url)
      setScore(s)
      setCheckedCount(prev => prev + 1)
      setStep("result")
    }, 2500)
  }

  const shareTwitter = () => {
    const { message } = getResult(score)
    const text = encodeURIComponent(`I'm ${score}% doomed by AI 💀\n\n"${message}"\n\nCheck your doom score:`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.origin)}`, "_blank")
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, "_blank")
  }

  const reset = () => {
    setStep("input")
    setUrl("")
    setScore(0)
  }

  if (step === "analyzing") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🔍</div>
          <h2 className="text-2xl font-black text-black mb-2">ANALYZING PROFILE...</h2>
          <p className="text-gray-600">Scanning job title, industry, skills...</p>
        </div>
      </main>
    )
  }

  if (step === "result") {
    const { emoji, message } = getResult(score)
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f0]">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tight">
            YOUR DOOM SCORE
          </h1>
          
          <div className="text-9xl mb-4">{emoji}</div>
          <div className="text-8xl font-black text-black mb-2">{score}%</div>
          <p className="text-xl text-gray-700 mb-8">"{message}"</p>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={shareTwitter}
              className="bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Share on X
            </button>
            <button
              onClick={shareLinkedIn}
              className="bg-[#0077b5] text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-[#006699] transition-colors"
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
          Drop your LinkedIn URL. We'll analyze your profile<br />
          and tell you how doomed you are by AI.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-0 max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="paste-linkedin-url"
            className="flex-1 border-2 border-black border-r-0 px-4 py-4 text-black bg-white focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Check It
          </button>
        </form>

        <p className="text-gray-500 text-sm">
          🔥 <span className="font-semibold">{checkedCount.toLocaleString()}</span> profiles checked
        </p>
      </div>
    </main>
  )
}
