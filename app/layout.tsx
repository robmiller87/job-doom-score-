import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Are You Cooked? | AI Job Risk Calculator",
  description: "Check if AI is coming for YOUR job. Free AI job risk calculator analyzes 300+ million jobs. Enter your job title and get your doom score in 5 seconds. No signup required.",
  metadataBase: new URL('https://www.doomcheck.com'),
  openGraph: {
    title: "Are You Cooked? | AI Job Risk Calculator",
    description: "Check if AI is coming for YOUR job. Free AI job risk calculator analyzes 300+ million jobs. Enter your job title and get your doom score in 5 seconds.",
    type: "website",
    siteName: "DoomCheck",
    url: "https://www.doomcheck.com",
    images: [
      {
        url: "https://www.doomcheck.com/og-image.png?v=6",
        width: 1200,
        height: 630,
        alt: "DoomCheck - Are You Cooked?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Are You Cooked?",
    description: "Check if AI is coming for YOUR job. Free calculator. Takes 5 seconds.",
    images: ["https://www.doomcheck.com/og-image.png?v=6"],
  },
  keywords: ["AI job risk", "job automation", "AI replacement", "career safety", "job security", "artificial intelligence jobs", "doom calculator", "job displacement"],
  authors: [{ name: "DoomCheck" }],
  creator: "DoomCheck",
  publisher: "DoomCheck",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "DoomCheck - Are You Cooked?",
              "description": "Free AI job risk calculator. Check if artificial intelligence is coming for your job. Enter your job title and get your doom score in 5 seconds.",
              "url": "https://doomcheck.com",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "DoomCheck"
              },
              "publisher": {
                "@type": "Organization",
                "name": "DoomCheck"
              },
              "featureList": [
                "AI job risk analysis",
                "Job automation scoring",
                "Career safety assessment",
                "AI timeline predictions",
                "Free job security check"
              ]
            })
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1656205845736580');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
