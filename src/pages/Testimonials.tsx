import { useEffect } from 'react'
import { useSiteSettings, getSetting } from '../hooks/useSiteSettings'
import { Quote } from 'lucide-react'

export function TestimonialsPage() {
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    document.title = 'Testimonials | Aura New York'
  }, [])

  const testimonials = getSetting<Array<{ quote: string; author: string; title?: string }>>(
    settings,
    'testimonials',
    []
  )

  const placeholderTestimonials = [
    {
      quote:
        'Aura New York made the leasing process seamless and transparent. Their team went above and beyond to find the perfect tenant for our building.',
      author: 'Margaret Thompson',
      title: 'Property Owner, Upper West Side',
    },
    {
      quote:
        'As a first-time renter in Manhattan, I was overwhelmed. Aura\'s agents were patient, knowledgeable, and found me an incredible apartment in my budget.',
      author: 'David Chen',
      title: 'Tenant, Midtown East',
    },
    {
      quote:
        'The level of professionalism and market knowledge is unmatched. They consistently deliver results and maintain relationships built on trust.',
      author: 'Victoria Rodriguez',
      title: 'Real Estate Developer, Tribeca',
    },
    {
      quote:
        'After working with multiple brokers, Aura New York proved why they\'re the best. Their marketing strategy filled our vacancies in record time.',
      author: 'James Mitchell',
      title: 'Property Manager, SoHo',
    },
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : placeholderTestimonials

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-950 mb-6">
            What Our Clients Say
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Hear from landlords and tenants who have experienced the Aura New York difference.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-2xl h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {displayTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-10 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Quote Mark */}
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-brand-600 fill-brand-100" />
                </div>

                {/* Quote Text */}
                <p className="text-lg font-body text-neutral-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="pt-6 border-t border-neutral-100">
                  <p className="font-display font-bold text-brand-950 mb-1">
                    {testimonial.author}
                  </p>
                  {testimonial.title && (
                    <p className="text-sm text-neutral-500 font-body">
                      {testimonial.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Experience Aura?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto font-body">
            Join hundreds of satisfied clients who have chosen Aura New York for their leasing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-white text-brand-950 px-8 py-3 rounded-full font-display font-bold hover:bg-neutral-100 transition-colors"
            >
              Get In Touch
            </a>
            <a
              href="/landlords"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-display font-bold hover:bg-white hover:text-brand-950 transition-colors"
            >
              List Your Property
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 py-16 border-t border-neutral-200">
          <div className="text-center">
            <div className="text-4xl font-display font-bold text-brand-600 mb-2">98%</div>
            <p className="text-neutral-600 font-body">Client Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display font-bold text-brand-600 mb-2">2.5K+</div>
            <p className="text-neutral-600 font-body">Successful Leases</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display font-bold text-brand-600 mb-2">15 Days</div>
            <p className="text-neutral-600 font-body">Average Time to Lease</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialsPage
