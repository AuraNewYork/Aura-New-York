import { useState } from 'react'
import { useEffect } from 'react'
import { sendEmail } from '../lib/api'
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Mail, Phone, MapPin } from 'lucide-react'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Contact | Aura New York'
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
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      })

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        honeypot: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-brand-950 mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to our team and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Address Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold text-brand-950 mb-2">Office</h3>
                  <p className="text-neutral-600 font-body">
                    307 7th Ave #2403
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Phone className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold text-brand-950 mb-2">Phone</h3>
                  <a
                    href="tel:917-727-5250"
                    className="text-brand-600 hover:text-brand-700 font-body font-semibold transition-colors"
                  >
                    917.727.5250
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <Mail className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold text-brand-950 mb-2">Email</h3>
                  <a
                    href="mailto:hello@auranewyork.com"
                    className="text-brand-600 hover:text-brand-700 font-body font-semibold transition-colors"
                  >
                    hello@auranewyork.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-neutral-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-neutral-200">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">
                  40.751°N, 73.993°W
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-50 rounded-2xl p-12">
              <h2 className="text-3xl font-display font-bold text-brand-950 mb-8">
                Send us a message
              </h2>

              {success ? (
                <div className="flex items-start gap-4 p-6 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-green-950 mb-1">Thank you!</h3>
                    <p className="text-green-800">
                      We've received your message. Our team will be in touch shortly.
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
                      Name *
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

                  {/* Phone (Optional) */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      placeholder="(555) 000-0000"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-body font-semibold text-brand-950 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent resize-none"
                      placeholder="How can we help you?"
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
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Business Hours Info */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-display font-bold text-brand-950 mb-4">
            Business Hours
          </h3>
          <p className="text-neutral-700 font-body mb-2">
            Monday - Friday: 9:00 AM - 6:00 PM EST
          </p>
          <p className="text-neutral-700 font-body">
            Saturday - Sunday: By appointment only
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
