'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SubscriptionTier } from '@prisma/client'
import MatrixBackground from '@/components/ui/matrix-background'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    subscriptionTier: SubscriptionTier.LITE_USER,
    isBusinessOwner: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const subscriptionTiers = [
    { 
      value: SubscriptionTier.LITE_USER, 
      label: 'Lite Explorer', 
      price: '7,500',
      description: '8 free withdrawals up to 75,000 UGX each',
      icon: '🌱',
      gradient: 'from-gray-600 to-gray-800'
    },
    { 
      value: SubscriptionTier.PRO_USER, 
      label: 'Pro Warrior', 
      price: '25,000',
      description: '25 free withdrawals up to 300,000 UGX each',
      icon: '���',
      gradient: 'from-neon-500 to-cyber-500'
    },
    { 
      value: SubscriptionTier.BUSINESS_ELITE, 
      label: 'Elite Master', 
      price: '60,000',
      description: '50 free withdrawals up to 1,500,000 UGX each',
      icon: '👑',
      gradient: 'from-matrix-500 to-orange-500'
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      router.push('/auth/signin?message=Registration successful! Please sign in.')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedTier = subscriptionTiers.find(t => t.value === formData.subscriptionTier)

  return (
    <div className="min-h-screen bg-dark-950 text-white py-12 px-4 sm:px-6 lg:px-8 cyber-grid">
      {/* Matrix Background Effect */}
      <MatrixBackground density={15} />

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-glow">
            <span className="text-3xl font-bold">₵</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="holo-text">Initialize Account</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Join the financial revolution and unlock predictable mobile money costs with advanced technology
          </p>
        </div>

        {/* Registration Form */}
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neon-400 border-b border-neon-500/30 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+256700000000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="form-label">
                    Secure Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isBusinessOwner"
                  name="isBusinessOwner"
                  checked={formData.isBusinessOwner}
                  onChange={handleChange}
                  className="w-5 h-5 text-neon-500 bg-dark-800 border-dark-600 rounded focus:ring-neon-500 focus:ring-2"
                />
                <label htmlFor="isBusinessOwner" className="text-gray-300 font-medium">
                  I represent a business entity
                </label>
              </div>

              {formData.isBusinessOwner && (
                <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-cyber-400">
                    Business Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessName" className="form-label">
                        Business Name
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required={formData.isBusinessOwner}
                        className="form-input"
                        placeholder="Your business name"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="businessType" className="form-label">
                        Business Type
                      </label>
                      <input
                        id="businessType"
                        name="businessType"
                        type="text"
                        required={formData.isBusinessOwner}
                        className="form-input"
                        placeholder="e.g., Retail, Restaurant, Services"
                        value={formData.businessType}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessAddress" className="form-label">
                      Business Address
                    </label>
                    <textarea
                      id="businessAddress"
                      name="businessAddress"
                      required={formData.isBusinessOwner}
                      rows={3}
                      className="form-input resize-none"
                      placeholder="Your complete business address"
                      value={formData.businessAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-matrix-400 border-b border-matrix-500/30 pb-2">
                Choose Your Power Level
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionTiers.map((tier) => (
                  <label
                    key={tier.value}
                    className={`pricing-card cursor-pointer transition-all duration-300 ${
                      formData.subscriptionTier === tier.value 
                        ? 'featured ring-2 ring-neon-500' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subscriptionTier"
                      value={tier.value}
                      checked={formData.subscriptionTier === tier.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tier.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-xl">{tier.icon}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{tier.label}</h4>
                      <div className="mb-3">
                        <span className="text-2xl font-bold">UGX {tier.price}</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                      <p className="text-gray-400 text-sm">{tier.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedTier && (
                <div className="bg-gradient-to-r from-neon-500/10 to-cyber-500/10 border border-neon-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${selectedTier.gradient} rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">{selectedTier.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{selectedTier.label} Selected</div>
                      <div className="text-sm text-gray-400">{selectedTier.description}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-dots">
                    <div style={{ '--i': 0 } as any}></div>
                    <div style={{ '--i': 1 } as any}></div>
                    <div style={{ '--i': 2 } as any}></div>
                  </div>
                  <span>Initializing Account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Initialize Account</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-neon-400 hover:text-neon-300 transition-colors font-medium"
              >
                Already have access? <span className="holo-text">Login to Portal</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Return to Mission Control</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
