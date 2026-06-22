import { useEffect } from 'react'
import { useSiteSettings, getSetting } from '../hooks/useSiteSettings'
import { ImagePlaceholder } from '../components/ImagePlaceholder'

export function AboutPage() {
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    document.title = 'About | Aura New York'
  }, [])

  const aboutContent = getSetting(
    settings,
    'about_content',
    'Aura New York is Manhattan\'s premier leasing brokerage, dedicated to connecting exceptional properties with discerning tenants. With a deep understanding of the luxury rental market and a commitment to excellence, we deliver unparalleled service to landlords and residents alike.'
  )

  const headshots = getSetting<Array<{ name: string; title: string; image_url?: string }>>(
    settings,
    'about_headshots',
    []
  )

  const placeholderHeadshots: Array<{ name: string; title: string; image_url?: string }> = [
    { name: 'Sarah Chen', title: 'Founder & CEO' },
    { name: 'Marcus Rodriguez', title: 'VP of Operations' },
    { name: 'Elena Volkov', title: 'Head of Marketing' },
    { name: 'James Patterson', title: 'Senior Agent' },
  ]

  const displayHeadshots = headshots.length > 0 ? headshots : placeholderHeadshots

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-950 mb-6">
            Our Story
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {aboutContent}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 py-16 border-t border-b border-neutral-200">
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-brand-600 mb-2">3,000+</div>
            <p className="text-neutral-600 font-body">Units Leased</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-brand-600 mb-2">10+</div>
            <p className="text-neutral-600 font-body">Years in Business</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-brand-600 mb-2">100%</div>
            <p className="text-neutral-600 font-body">Manhattan Focused</p>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-4xl font-display font-bold text-brand-950 mb-12 text-center">
            Meet Our Team
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 aspect-square rounded-2xl mb-4" />
                  <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayHeadshots.map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="rounded-2xl overflow-hidden mb-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <ImagePlaceholder label={member.name} aspectRatio="aspect-square" />
                    )}
                  </div>
                  <h3 className="text-xl font-display font-bold text-brand-950 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-neutral-600 font-body">{member.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mission Section */}
        <div className="mt-24 bg-brand-50 rounded-2xl p-12 md:p-16">
          <h2 className="text-3xl font-display font-bold text-brand-950 mb-6">Our Mission</h2>
          <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl">
            We believe that finding the perfect home should be an exceptional experience. By combining market expertise, cutting-edge technology, and personalized service, we empower both landlords and tenants to make informed decisions. Aura New York stands as the trusted partner for luxury leasing in Manhattan.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
