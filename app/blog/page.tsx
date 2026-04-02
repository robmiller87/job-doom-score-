import Link from 'next/link'

export default function BlogPage() {
  const posts = [
    {
      slug: 'oracle-30k-layoffs',
      title: 'Oracle Just Fired 30,000 People With a 6 AM Email - Are You Next?',
      excerpt: 'Oracle cut 18% of its workforce overnight to fund AI spending. Their stock went up 2%. The robots are winning.',
      date: 'April 2, 2026',
      readTime: '4 min read',
      tags: ['Oracle', 'Mass Layoffs', 'AI Replacement']
    }
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          The <span className="text-red-500">Doom</span> Report
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Real-time coverage of AI displacing human jobs. Because someone needs to document the robot takeover.
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-red-900 text-red-200 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-3 hover:text-red-400 transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            
            <p className="text-gray-400 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-900 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Is Your Job Next?</h3>
        <p className="text-gray-400 mb-4">Find out your AI replacement risk with our doom score calculator</p>
        <Link 
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Check Your Doom Score 😬
        </Link>
      </div>
    </div>
  )
}