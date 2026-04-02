import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DoomCheck Blog - AI Job Displacement News',
  description: 'Real-time coverage of AI replacing human jobs. Latest layoffs, automation trends, and job market analysis.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-red-500 hover:text-red-400">
            😬 DoomCheck
          </a>
          <div className="flex space-x-6">
            <a href="/blog" className="hover:text-gray-300">Blog</a>
            <a href="/" className="hover:text-gray-300">Check Your Doom</a>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}