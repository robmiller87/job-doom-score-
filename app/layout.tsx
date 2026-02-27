import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "How Fucked Are You? | AI Job Apocalypse Calculator",
  description: "Find out how at-risk your job is from AI automation. Get your doom score.",
  openGraph: {
    title: "How Fucked Are You? | AI Job Apocalypse Calculator",
    description: "Find out how at-risk your job is from AI automation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Fucked Are You?",
    description: "I just got my AI doom score. How fucked are you?",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
