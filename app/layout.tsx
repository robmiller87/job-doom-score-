import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Are You Cooked? | AI Job Risk Calculator",
  description: "300 million jobs will be affected by AI. Enter your job title and find out if you're cooked in 5 seconds.",
  metadataBase: new URL('https://www.doomcheck.com'),
  openGraph: {
    title: "Are You Cooked? | AI Job Risk Calculator",
    description: "300 million jobs will be affected by AI. Enter your job title and find out if you're cooked in 5 seconds.",
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
    description: "Find out if AI is coming for your job. Takes 5 seconds.",
    images: ["https://www.doomcheck.com/og-image.png?v=6"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
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
