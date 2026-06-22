import { Link } from 'react-router-dom'
import { ExternalLink, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from './Logo'

const NAV_LINKS = [
  { label: 'Buildings', to: '/buildings' },
  { label: 'Availability', to: '/availability' },
  { label: 'About', to: '/about' },
  { label: 'Landlords', to: '/landlords' },
  { label: 'Contact', to: '/contact' },
  { label: 'Testimonials', to: '/testimonials' },
]

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo variant="light" />
            <div className="mt-6 space-y-3 text-sm text-neutral-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                307 7th Ave #2403, New York, NY 10001
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:9177275250" className="hover:text-white transition-colors">917.727.5250</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:hello@auranewyork.com" className="hover:text-white transition-colors">hello@auranewyork.com</a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Navigate</h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">The Auracle Newsletter</h3>
            <p className="text-sm text-neutral-300 mb-4">Stay informed on Manhattan's best rental deals.</p>
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <iframe
                src="https://ee2d230c.sibforms.com/serve/MUIFABT41IuH6QSRB4Jq923fAPTPXUf6nFH8DhHj4VjN7SYfZwT2PfVRJCfhFfEnpjEgh8Ni799NhjZmdgdnC9GNok9XfPZLqnyUuh6hw7viZdO4ARCJ6OHBtCh_7ucLTjmAYCbCj2mRxFIzIi1MKmkTjFjun5G9l0RHU2frTDgoXqIL1QctEWJi6wvCuA_LaX1sjtwX-DDjEiQArA=="
                title="Auracle Newsletter Signup"
                className="w-full h-[180px] border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="https://instagram.com/auranewyork" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600 transition-colors" aria-label="Instagram">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/auranewyork" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600 transition-colors" aria-label="LinkedIn">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Aura New York. All rights reserved.</p>
            <p className="max-w-xl">
              Aura New York is committed to compliance with all federal, state, and local fair housing laws.
              We do not discriminate against any person because of race, color, religion, national origin,
              sex, familial status, disability, or any other protected class. This site is designed to be
              accessible to all users.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
