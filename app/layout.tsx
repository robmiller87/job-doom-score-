import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Are You Doomed? | AI Job Risk Calculator",
  description: "Drop your LinkedIn URL. Find out how doomed you are by AI.",
  metadataBase: new URL('https://doomcheck.com'),
  openGraph: {
    title: "Are You Doomed? | AI Job Risk Calculator",
    description: "Drop your LinkedIn URL. Find out how doomed you are by AI.",
    type: "website",
    siteName: "Are You Doomed?",
  },
  twitter: {
    card: "summary_large_image",
    title: "Are You Doomed?",
    description: "I just got my AI doom score. How doomed are you?",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
