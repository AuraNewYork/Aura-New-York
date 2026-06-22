import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Buildings', to: '/buildings' },
  { label: 'Availability', to: '/availability' },
  { label: 'About', to: '/about' },
  { label: 'Landlords', to: '/landlords' },
  { label: 'Contact', to: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isHome = location.pathname === '/'
  const solid = scrolled || !isHome || mobileOpen
  const logoVariant = solid ? 'dark' : 'light'
  const textColor = solid ? 'text-brand-950' : 'text-white'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo variant={logoVariant} />

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                  location.pathname === link.to ? 'text-brand-600' : textColor
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/buildings"
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${textColor}`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:9177275250"
              className={`flex items-center gap-1.5 text-sm font-medium ${textColor} hover:text-brand-600 transition-colors`}
            >
              <Phone className="w-4 h-4" />
              917.727.5250
            </a>
            <Link
              to="/availability"
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
            >
              View Availability
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-brand-950 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/buildings"
                className="px-3 py-2 rounded-lg text-sm font-medium text-brand-950 hover:bg-neutral-50"
              >
                Admin
              </Link>
            )}
            <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col gap-3">
              <a href="tel:9177275250" className="flex items-center gap-2 px-3 text-sm font-medium text-brand-950">
                <Phone className="w-4 h-4" /> 917.727.5250
              </a>
              <Link
                to="/availability"
                className="mx-3 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full text-center hover:bg-brand-700 transition-colors"
              >
                View Availability
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
