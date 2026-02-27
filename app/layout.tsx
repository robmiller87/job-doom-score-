import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Are You Doomed? | AI Job Risk Calculator",
  description: "300 million jobs will be affected by AI. Is yours one of them? Paste your LinkedIn and find out in 10 seconds.",
  metadataBase: new URL('https://doomcheck.com'),
  openGraph: {
    title: "Are You Doomed? | AI Job Risk Calculator",
    description: "300 million jobs will be affected by AI. Is yours one of them? Paste your LinkedIn and find out in 10 seconds.",
    type: "website",
    siteName: "DoomCheck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Are You Doomed?",
    description: "300 million jobs will be affected by AI. Is yours one of them?",
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
