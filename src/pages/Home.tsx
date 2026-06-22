import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Users, Shield } from 'lucide-react'
import { useBuildings } from '../hooks/useBuildings'
import { useSiteSettings, getSetting } from '../hooks/useSiteSettings'
import { ImagePlaceholder } from '../components/ImagePlaceholder'

const DEFAULT_HERO_VIDEO = 'https://player.vimeo.com/progressive_redirect/playback/1010401569/rendition/1080p/file.mp4?loc=external&signature=ae74505170534c05ce9905798f3438c07e1019d74d19b8e1dedc426189ce995c'

export default function HomePage() {
  const { buildings } = useBuildings()
  const { settings } = useSiteSettings()

  const heroVideoUrl = getSetting(settings, 'hero_video_url', DEFAULT_HERO_VIDEO)
  const testimonials = getSetting(settings, 'testimonials', [
    {
      text: 'Aura New York made finding my perfect apartment effortless. Their expertise in the Manhattan market is unparalleled.',
      author: 'Sarah Chen',
      title: 'Manhattan Resident'
    },
    {
      text: 'As a property owner, Aura handled everything professionally. My units were leased within days of listing.',
      author: 'Michael Rodriguez',
      title: 'Building Owner'
    },
    {
      text: 'The team at Aura truly understands luxury real estate. They found me the perfect space in my ideal neighborhood.',
      author: 'Emma Thompson',
      title: 'Madison Avenue Executive'
    }
  ]) as Array<{ text: string; author: string; title: string }>

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%234B0E9B' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-brand-950/40" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
          <div className="max-w-3xl mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
              Manhattan's #1 Leasing Solution
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                to="/availability"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-display font-semibold rounded-full hover:bg-brand-700 transition-all duration-300 group"
              >
                Find an Apartment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/landlords"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-display font-semibold rounded-full hover:bg-white/30 transition-all duration-300 group border border-white/30"
              >
                Landlord Services
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-brand-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-display font-bold text-brand-300 mb-2">
                3,000+
              </div>
              <p className="text-lg font-body text-neutral-300">Units Under Management</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-display font-bold text-brand-300 mb-2">
                $100M+
              </div>
              <p className="text-lg font-body text-neutral-300">Total Leasable Units</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Buildings Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-950 mb-4">
              Featured Buildings
            </h2>
            <p className="text-xl font-body text-neutral-600">
              Curated portfolio of premium Manhattan properties
            </p>
          </div>

          {buildings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {buildings.slice(0, 6).map((building) => (
                <Link
                  key={building.id}
                  to={`/buildings/${building.slug}`}
                  className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden h-64 bg-neutral-100">
                    {building.hero_image_url ? (
                      <img
                        src={building.hero_image_url}
                        alt={building.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <ImagePlaceholder
                        label={building.name}
                        className="rounded-t-lg"
                        aspectRatio="h-64"
                      />
                    )}
                  </div>

                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-display font-bold text-brand-950 mb-2">
                      {building.name}
                    </h3>
                    <p className="text-sm font-body text-neutral-500 mb-1">{building.neighborhood}</p>
                    <p className="text-sm font-body text-neutral-600 mb-4">{building.address}</p>

                    <div className="flex items-center text-brand-600 font-semibold font-body group-hover:text-brand-700 transition-colors">
                      View Property
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 font-body">Featured buildings coming soon</p>
            </div>
          )}

          {buildings.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/buildings"
                className="inline-flex items-center px-8 py-4 bg-brand-600 text-white font-display font-semibold rounded-full hover:bg-brand-700 transition-all duration-300 group"
              >
                View All Buildings
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-950 mb-4">
              Our Services
            </h2>
            <p className="text-xl font-body text-neutral-600">
              Comprehensive real estate solutions for renters and landlords
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Luxury Rentals */}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-brand-200 border border-transparent animate-fade-in">
              <div className="w-16 h-16 bg-brand-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-brand-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-bold text-brand-950 mb-4">
                Luxury Rentals
              </h3>
              <p className="text-base font-body text-neutral-600 mb-6 leading-relaxed">
                Discover Manhattan's most prestigious rental properties. Our curated collection features premium apartments in the city's most desirable neighborhoods with white-glove leasing service.
              </p>
              <Link
                to="/availability"
                className="text-brand-600 font-semibold font-body hover:text-brand-700 transition-colors flex items-center"
              >
                Explore Rentals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Landlord Leasing */}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-brand-200 border border-transparent animate-fade-in">
              <div className="w-16 h-16 bg-brand-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-brand-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-bold text-brand-950 mb-4">
                Landlord Leasing
              </h3>
              <p className="text-base font-body text-neutral-600 mb-6 leading-relaxed">
                Maximize your rental income with our expert leasing services. We handle tenant screening, lease management, and marketing to ensure rapid unit placement and quality tenants.
              </p>
              <Link
                to="/landlords"
                className="text-brand-600 font-semibold font-body hover:text-brand-700 transition-colors flex items-center"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Property Management */}
            <div className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-brand-200 border border-transparent animate-fade-in">
              <div className="w-16 h-16 bg-brand-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-brand-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-bold text-brand-950 mb-4">
                Property Management
              </h3>
              <p className="text-base font-body text-neutral-600 mb-6 leading-relaxed">
                Comprehensive property management solutions that protect your investment. From maintenance coordination to financial reporting, we handle every detail professionally.
              </p>
              <Link
                to="/landlords"
                className="text-brand-600 font-semibold font-body hover:text-brand-700 transition-colors flex items-center"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Availability Teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-12 md:p-16 overflow-hidden relative animate-fade-in">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -mr-48 -mt-48" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Find Your Perfect Apartment
              </h2>
              <p className="text-xl font-body text-brand-50 mb-12 max-w-2xl">
                Browse our extensive collection of luxury apartments across Manhattan. Filter by location, price, and bedroom count to find your ideal home.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                  to="/availability?bedrooms=studio"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-4 rounded-lg font-body font-semibold transition-all duration-300 text-center border border-white/20"
                >
                  Studios
                </Link>
                <Link
                  to="/availability?bedrooms=1"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-4 rounded-lg font-body font-semibold transition-all duration-300 text-center border border-white/20"
                >
                  1 Bedroom
                </Link>
                <Link
                  to="/availability?bedrooms=2plus"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-4 rounded-lg font-body font-semibold transition-all duration-300 text-center border border-white/20"
                >
                  2+ Bedrooms
                </Link>
              </div>

              <Link
                to="/availability"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 font-display font-semibold rounded-full hover:bg-neutral-50 transition-all duration-300 group"
              >
                Browse All Units
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-brand-950 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl font-body text-neutral-600">
              Trusted by hundreds of renters and landlords across Manhattan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-brand-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-lg font-body text-neutral-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-neutral-200 pt-4">
                  <p className="font-display font-semibold text-brand-950">{testimonial.author}</p>
                  <p className="text-sm font-body text-neutral-600">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter + Contact CTA */}
      <section className="py-20 bg-brand-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-lg font-body text-brand-50">
              Subscribe to our newsletter for new listings and market insights
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3 mb-12 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-md text-white placeholder-white/50 rounded-full border border-white/20 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-300/30 font-body transition-all"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-display font-semibold rounded-full transition-all duration-300"
            >
              Subscribe
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-brand-300 font-semibold mb-1">Phone</p>
              <a href="tel:9177275250" className="font-body text-lg hover:text-brand-300 transition-colors">
                917.727.5250
              </a>
            </div>
            <div>
              <p className="text-brand-300 font-semibold mb-1">Email</p>
              <a href="mailto:info@aurandnewyork.com" className="font-body text-lg hover:text-brand-300 transition-colors">
                info@auraandnewyork.com
              </a>
            </div>
            <div>
              <p className="text-brand-300 font-semibold mb-1">Location</p>
              <p className="font-body text-lg">Manhattan, New York</p>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-display font-semibold rounded-full transition-all duration-300"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
