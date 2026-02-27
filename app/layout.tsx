import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Are You Cooked? | AI Job Risk Calculator",
  description: "300 million jobs will be affected by AI. Enter your job title and find out if you're cooked in 5 seconds.",
  metadataBase: new URL('https://doomcheck.com'),
  openGraph: {
    title: "Are You Cooked? | AI Job Risk Calculator",
    description: "300 million jobs will be affected by AI. Enter your job title and find out if you're cooked in 5 seconds.",
    type: "website",
    siteName: "DoomCheck",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DoomCheck - Are You Doomed?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Are You Cooked?",
    description: "Find out if AI is coming for your job. Takes 5 seconds.",
    images: ["/og-image.png"],
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
