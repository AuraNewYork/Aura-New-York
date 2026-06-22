import { Link } from 'react-router-dom'
import { Hop as Home } from 'lucide-react'

export default function NotFoundPage() {
  document.title = 'Page Not Found | Aura New York'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-bold text-brand-200 mb-4">404</div>
        <h1 className="font-display font-semibold text-3xl text-brand-950 mb-3">Page Not Found</h1>
        <p className="text-neutral-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
