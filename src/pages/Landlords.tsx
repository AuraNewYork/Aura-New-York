import { useState } from 'react'
import { useEffect } from 'react'
import { sendEmail } from '../lib/api'
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Building2, TrendingUp, Users, ChartBar as BarChart3 } from 'lucide-react'

export function LandlordsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    buildingAddress: '',
    numberOfUnits: '',
    message: '',
    honeypot: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'For Landlords | Aura New York'
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot validation
    if (formData.honeypot) {
      setSuccess(true)
      return
    }

    setError('')
    setLoading(true)

    try {
      await sendEmail({
        type: 'landlord',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        building: formData.buildingAddress,
        unit: formData.numberOfUnits,
        message: formData.message,
      })

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        buildingAddress: '',
        numberOfUnits: '',
        message: '',
        honeypot: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Technology-Driven',
      description: 'Cutting-edge marketing and analytics to maximize occupancy rates.',
    },
    {
      icon: BarChart3,
      title: 'Marketing Expertise',
      description: 'Strategic positioning across premium channels to reach qualified tenants.',
    },
    {
      icon: Users,
      title: 'Dedicated Team',
      description: 'Experienced agents committed to your property\'s success.',
    },
    {
      icon: Building2,
      title: 'Transparent Reporting',
      description: 'Clear communication and detailed metrics on all inquiries and leases.',
    },
  ]

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-950 mb-6">
            Partner With Manhattan's Leading Leasing Team
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Maximize your property's potential with Aura New York's expert leasing services and market expertise.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-950 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 font-body leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-neutral-50 rounded-2xl p-12">
          <h2 className="text-3xl font-display font-bold text-brand-950 mb-8 text-center">
            List Your Property
          </h2>

          {success ? (
            <div className="flex items-start gap-4 p-6 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display font-bold text-green-950 mb-1">Thank you!</h3>
                <p className="text-green-800">
                  We've received your inquiry. Our team will be in touch shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="(555) 000-0000"
                />
              </div>

              {/* Building Address */}
              <div>
                <label htmlFor="buildingAddress" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Building Address *
                </label>
                <input
                  type="text"
                  id="buildingAddress"
                  name="buildingAddress"
                  value={formData.buildingAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="123 Main St, New York, NY 10001"
                />
              </div>

              {/* Number of Units */}
              <div>
                <label htmlFor="numberOfUnits" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Number of Units *
                </label>
                <input
                  type="text"
                  id="numberOfUnits"
                  name="numberOfUnits"
                  value={formData.numberOfUnits}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="5"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent resize-none"
                  placeholder="Tell us about your property..."
                />
              </div>

              {/* Honeypot field */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                tabIndex={-1}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-300 text-white font-body font-semibold py-3 px-6 rounded-full transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                We'll get back to you within 24 hours.
              </p>
            </form>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-brand-950 text-white rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Maximize Your Revenue?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Manhattan property owners who trust Aura New York to deliver results.
          </p>
          <div className="inline-block bg-white text-brand-950 px-8 py-3 rounded-full font-display font-bold">
            Call 917.727.5250
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordsPage
