"use client"

import { useState } from "react"

// Scoring data
const industryRisk: Record<string, number> = {
  "Admin/Office": 28,
  "Retail": 25,
  "Marketing": 22,
  "Finance/Accounting": 20,
  "Sales": 18,
  "HR": 18,
  "Legal": 15,
  "Creative/Design": 14,
  "Tech/Engineering": 12,
  "Manufacturing": 12,
  "Education": 10,
  "Healthcare": 8,
  "Other": 15
}

const skillRisk: Record<string, number> = {
  "Customer Support": 24,
  "Writing/Content": 22,
  "Data Analysis": 20,
  "Operations": 18,
  "Design": 15,
  "Sales/BD": 14,
  "Management": 12,
  "Software/Code": 10,
  "Strategy": 8,
  "Other": 15
}

const expRisk: Record<string, number> = {
  "0-2 years": 8,
  "3-5 years": 15,
  "6-10 years": 20,
  "11-20 years": 14,
  "20+ years": 10
}

const sizeRisk: Record<string, number> = {
  "Enterprise (5000+)": 15,
  "Mid-size (500-5000)": 12,
  "SMB (50-500)": 8,
  "Startup (<50)": 5,
  "Freelance/Self": 6
}

const titleModifiers: Record<string, number> = {
  "assistant": 8,
  "coordinator": 7,
  "analyst": 5,
  "specialist": 4,
  "manager": 3,
  "associate": 4,
  "executive": -3,
  "director": -5,
  "vp": -7,
  "chief": -10,
  "founder": -10,
  "ceo": -10,
  "cto": -8,
  "engineer": -3,
  "developer": -4,
  "senior": -2,
  "lead": -3,
  "head": -4,
  "principal": -5,
}

function calculateScore(
  jobTitle: string,
  industry: string,
  experience: string,
  companySize: string,
  skill: string
): { score: number; breakdown: { label: string; value: number }[] } {
  const breakdown: { label: string; value: number }[] = []
  
  // Industry risk
  const indRisk = industryRisk[industry] || 15
  breakdown.push({ label: `Industry (${industry})`, value: indRisk })
  
  // Skill risk
  const sklRisk = skillRisk[skill] || 15
  breakdown.push({ label: `Skill (${skill})`, value: sklRisk })
  
  // Experience risk
  const expR = expRisk[experience] || 15
  breakdown.push({ label: `Experience (${experience})`, value: expR })
  
  // Company size risk
  const sizeR = sizeRisk[companySize] || 10
  breakdown.push({ label: `Company Size`, value: sizeR })
  
  // Title modifier
  let titleMod = 0
  const lowerTitle = jobTitle.toLowerCase()
  for (const [keyword, mod] of Object.entries(titleModifiers)) {
    if (lowerTitle.includes(keyword)) {
      titleMod += mod
    }
  }
  titleMod = Math.max(-10, Math.min(10, titleMod))
  if (titleMod !== 0) {
    breakdown.push({ label: `Title modifier`, value: titleMod })
  }
  
  const rawScore = indRisk + sklRisk + expR + sizeR + titleMod
  const score = Math.max(0, Math.min(100, rawScore))
  
  return { score, breakdown }
}

function getResult(score: number): { tier: string; emoji: string; headline: string; color: string } {
  if (score <= 20) return { tier: "Safe", emoji: "🛡️", headline: "You're probably fine. For now.", color: "text-green-400" }
  if (score <= 40) return { tier: "Sweating", emoji: "😰", headline: "Start paying attention.", color: "text-yellow-400" }
  if (score <= 60) return { tier: "Nervous", emoji: "😬", headline: "Time to diversify your skills.", color: "text-orange-400" }
  if (score <= 80) return { tier: "Danger", emoji: "🚨", headline: "Update your resume. Seriously.", color: "text-red-400" }
  return { tier: "Fucked", emoji: "💀", headline: "Good luck out there.", color: "text-red-600" }
}

export default function Home() {
  const [step, setStep] = useState<"form" | "calculating" | "result">("form")
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState("")
  const [experience, setExperience] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [skill, setSkill] = useState("")
  const [result, setResult] = useState<{ score: number; breakdown: { label: string; value: number }[] } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("calculating")
    
    setTimeout(() => {
      const res = calculateScore(jobTitle, industry, experience, companySize, skill)
      setResult(res)
      setStep("result")
    }, 2000)
  }

  const shareTwitter = () => {
    if (!result) return
    const { emoji, headline } = getResult(result.score)
    const text = encodeURIComponent(`I scored ${result.score}/100 on the AI Job Apocalypse Calculator ${emoji}\n\n"${headline}"\n\nHow fucked are you?`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank")
  }

  const shareLinkedIn = () => {
    if (!result) return
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")
  }

  const reset = () => {
    setStep("form")
    setJobTitle("")
    setIndustry("")
    setExperience("")
    setCompanySize("")
    setSkill("")
    setResult(null)
  }

  if (step === "calculating") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🔮</div>
          <h2 className="text-2xl font-bold mb-2">Calculating your doom...</h2>
          <p className="text-gray-400">Analyzing AI threat level</p>
        </div>
      </main>
    )
  }

  if (step === "result" && result) {
    const { tier, emoji, headline, color } = getResult(result.score)
    
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Your AI Risk Score</p>
            <div className="text-8xl mb-4">{emoji}</div>
            <div className={`text-7xl font-black ${color}`}>{result.score}</div>
            <p className={`text-xl mt-2 ${color}`}>{tier}</p>
            <p className="text-gray-300 mt-4 text-lg">"{headline}"</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Breakdown</h3>
            <div className="space-y-2">
              {result.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.label}</span>
                  <span className={item.value > 0 ? "text-red-400" : "text-green-400"}>
                    {item.value > 0 ? "+" : ""}{item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={shareTwitter}
              className="flex-1 bg-black border border-gray-700 hover:border-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Share on X
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex-1 bg-[#0077b5] hover:bg-[#006699] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Share on LinkedIn
            </button>
          </div>

          <button
            onClick={reset}
            className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors"
          >
            Calculate again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            How Fucked Are You?
          </h1>
          <p className="text-gray-400 text-lg">The AI Job Apocalypse Calculator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Marketing Manager"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">Select industry</option>
              {Object.keys(industryRisk).map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">Select experience</option>
              {Object.keys(expRisk).map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">Select company size</option>
              {Object.keys(sizeRisk).map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Primary Skill</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">Select primary skill</option>
              {Object.keys(skillRisk).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors mt-6"
          >
            Calculate My Doom Score 💀
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          For entertainment purposes. Not financial or career advice.
        </p>
      </div>
    </main>
  )
}
