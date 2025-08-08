'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'

interface SubscriptionTier {
  id: string
  name: string
  price: number
  transactions: number
  maxPerTransaction: number
  features: string[]
  popular?: boolean
  description: string
  icon: string
}

interface SubscriptionResponse {
  message?: string
  subscription?: {
    id?: string
    tier?: string
    transactionLimit?: number
    transactionsUsed?: number
    monthlyPrice?: number
    maxTransactionAmount?: number
    status?: string
    startDate?: string
    endDate?: string
    nextRenewalDate?: string
  }
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'BASIC_TIER',
    name: 'Basic Starter',
    price: 5000,
    transactions: 15,
    maxPerTransaction: 300000,
    description: 'Perfect for individuals getting started with digital transactions',
    icon: '🌱',
    features: [
      '15 transactions per month',
      'Max UGX 300,000 per transaction',
      '1.8% fee on over-limit transactions',
      'Basic customer support',
      'Mobile app access'
    ]
  },
  {
    id: 'STANDARD_TIER',
    name: 'Standard Pro',
    price: 15000,
    transactions: 25,
    maxPerTransaction: 500000,
    description: 'Great for regular users who need more transaction capacity',
    icon: '⚡',
    popular: true,
    features: [
      '25 transactions per month',
      'Max UGX 500,000 per transaction',
      '1.5% fee on over-limit transactions',
      'Priority customer support',
      'Advanced transaction history',
      'Email notifications'
    ]
  },
  {
    id: 'PREMIUM_TIER',
    name: 'Premium Elite',
    price: 60000,
    transactions: 100,
    maxPerTransaction: 1500000,
    description: 'Ideal for small businesses and high-volume users',
    icon: '👑',
    features: [
      '100 transactions per month',
      'Max UGX 1,500,000 per transaction',
      '1% fee on over-limit transactions',
      '24/7 customer support',
      'Business analytics dashboard',
      'Multiple user accounts',
      'API access'
    ]
  },
  {
    id: 'BUSINESS_TIER',
    name: 'Business Enterprise',
    price: 200000,
    transactions: 500,
    maxPerTransaction: 5000000,
    description: 'Designed for established businesses with high transaction volumes',
    icon: '🏢',
    features: [
      '500 transactions per month',
      'Max UGX 5,000,000 per transaction',
      '0.5% fee on over-limit transactions',
      'Dedicated account manager',
      'Custom reporting',
      'Team management tools',
      'Integration support',
      'Bulk transaction processing'
    ]
  },
  {
    id: 'ENTERPRISE_TIER',
    name: 'Enterprise Custom',
    price: 0,
    transactions: 999999,
    maxPerTransaction: 999999999,
    description: 'Custom solutions for large enterprises with 5M+ transactions',
    icon: '🚀',
    features: [
      'Unlimited transactions',
      'Custom transaction limits',
      '0.25% fee on over-limit transactions',
      'White-label solutions',
      'Custom integrations',
      'Dedicated infrastructure',
      'SLA guarantees',
      'Contact CFC for pricing'
    ]
  }
]

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionResponse['subscription'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/dashboard/subscription')
      const data: SubscriptionResponse = await response.json()
      setCurrentSubscription(data.subscription || null)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    setLoading(false)
  }, [status, router])

  const handleSubscribe = async (tierId: string) => {
    if (subscribing) return
    
    setSubscribing(tierId)
    try {
      const response = await fetch('/api/dashboard/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: tierId }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Update the current subscription state immediately
        const tierData = subscriptionTiers.find(t => t.id === tierId)
        setCurrentSubscription({
          tier: tierId,
          transactionLimit: tierData?.transactions || 0,
          transactionsUsed: data.subscription.transactionsUsed || 0,
          monthlyPrice: tierData?.price || 0,
          startDate: data.subscription.startDate,
          endDate: data.subscription.endDate,
          nextRenewalDate: data.subscription.nextRenewalDate
        })
        
        // Show success message
        const successMsg = data.message || 'Subscription updated successfully!'
        alert(`✅ ${successMsg}`)
        
        // Optionally fetch fresh data from server
        await fetchSubscription()
      } else {
        alert(`❌ ${data.message || 'Failed to update subscription'}`)
      }
    } catch (error) {
      console.error('Subscription update error:', error)
      alert('❌ Network error: Failed to update subscription')
    } finally {
      setSubscribing(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white cyber-grid flex items-center justify-center">
        <MatrixBackground density={10} />
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow">
            <div className="loading-dots">
              <div style={{ '--i': 0 } as any}></div>
              <div style={{ '--i': 1 } as any}></div>
              <div style={{ '--i': 2 } as any}></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold">Loading Power Levels...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white cyber-grid">
      <MatrixBackground density={10} />
      
      {/* Header */}
      <header className="glass border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="w-12 h-12 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  <span className="holo-text">Power Level Management</span>
                </h1>
                <p className="text-gray-400">Choose your subscription tier</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">💰</div>
            <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Subscription Tier</p>
                  <p className="text-xl font-bold text-cyber-400">
                    {subscriptionTiers.find(t => t.id === currentSubscription.tier)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Monthly Price</p>
                  <p className="text-xl font-bold text-cyber-400">
                    UGX {currentSubscription.monthlyPrice?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions Used</p>
                  <p className="text-xl font-bold text-cyber-400">
                    {currentSubscription.transactionsUsed || 0}/{currentSubscription.transactionLimit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Max Transaction Amount</p>
                  <p className="text-xl font-bold text-cyber-400">
                    UGX {currentSubscription?.maxTransactionAmount?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Subscription Period</p>
                  <p className="text-xl font-bold text-cyber-400">
                    {currentSubscription.startDate ? new Date(currentSubscription.startDate).toLocaleDateString() : ''} - 
                    {currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {subscriptionTiers.map((tier) => {
            // Define unique color schemes for each tier
            const getTierColors = (tierId: string) => {
              switch (tierId) {
                case 'BASIC_TIER':
                  return {
                    card: 'bg-gradient-to-br from-emerald-600/20 to-green-700/20 border-emerald-500/30',
                    icon: 'bg-gradient-to-br from-emerald-500 to-green-600',
                    price: 'text-emerald-400',
                    ring: 'ring-emerald-500',
                    badge: 'bg-gradient-to-r from-emerald-500 to-green-600'
                  }
                case 'STANDARD_TIER':
                  return {
                    card: 'bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border-blue-500/30',
                    icon: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                    price: 'text-blue-400',
                    ring: 'ring-blue-500',
                    badge: 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }
                case 'PREMIUM_TIER':
                  return {
                    card: 'bg-gradient-to-br from-purple-600/20 to-pink-700/20 border-purple-500/30',
                    icon: 'bg-gradient-to-br from-purple-500 to-pink-600',
                    price: 'text-purple-400',
                    ring: 'ring-purple-500',
                    badge: 'bg-gradient-to-r from-purple-500 to-pink-600'
                  }
                case 'BUSINESS_TIER':
                  return {
                    card: 'bg-gradient-to-br from-orange-600/20 to-red-700/20 border-orange-500/30',
                    icon: 'bg-gradient-to-br from-orange-500 to-red-600',
                    price: 'text-orange-400',
                    ring: 'ring-orange-500',
                    badge: 'bg-gradient-to-r from-orange-500 to-red-600'
                  }
                case 'ENTERPRISE_TIER':
                  return {
                    card: 'bg-gradient-to-br from-amber-600/20 to-yellow-700/20 border-amber-500/30',
                    icon: 'bg-gradient-to-br from-amber-500 to-yellow-600',
                    price: 'text-amber-400',
                    ring: 'ring-amber-500',
                    badge: 'bg-gradient-to-r from-amber-500 to-yellow-600'
                  }
                default:
                  return {
                    card: 'bg-gradient-to-br from-gray-600/20 to-slate-700/20 border-gray-500/30',
                    icon: 'bg-gradient-to-br from-gray-500 to-slate-600',
                    price: 'text-gray-400',
                    ring: 'ring-gray-500',
                    badge: 'bg-gradient-to-r from-gray-500 to-slate-600'
                  }
              }
            }

            const colors = getTierColors(tier.id)

            return (
            <div
              key={tier.id}
              className={`relative ${colors.card} backdrop-blur-sm border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                tier.popular ? `ring-2 ${colors.ring} ring-opacity-50` : ''
              } ${currentSubscription?.tier === tier.id ? `ring-2 ${colors.ring}` : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-neon-500 to-cyber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {currentSubscription?.tier === tier.id && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-gradient-to-r from-cyber-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <div className="mb-4">
                  {tier.price === 0 ? (
                    <div>
                      <span className={`text-3xl font-bold ${colors.price}`}>Custom</span>
                      <p className="text-gray-400 text-sm">Contact for pricing</p>
                    </div>
                  ) : (
                    <div>
                      <span className={`text-3xl font-bold ${colors.price}`}>
                        UGX {tier.price.toLocaleString()}
                      </span>
                      <p className="text-gray-400 text-sm">per month</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">
                    {tier.transactions === 999999 ? 'Unlimited' : tier.transactions} Transactions
                  </p>
                  <p className="text-sm text-gray-400">
                    Max UGX {tier.maxPerTransaction === 999999999 ? 'Custom' : tier.maxPerTransaction.toLocaleString()} per transaction
                  </p>
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <svg className="w-4 h-4 text-cyber-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                {tier.id === 'ENTERPRISE_TIER' ? (
                  <a
                    href="mailto:contact@cashflowconnect.ug"
                    className="w-full btn-neon text-center block"
                  >
                    Contact CFC
                  </a>
                ) : currentSubscription?.tier === tier.id ? (
                  <button
                    disabled
                    className="w-full bg-cyber-500/20 text-cyber-400 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={subscribing === tier.id}
                    className="w-full btn-cyber"
                  >
                    {subscribing === tier.id ? 'Subscribing...' : 'Select Plan'}
                  </button>
                )}
              </div>
            </div>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-12 glass-card">
          <h3 className="text-xl font-semibold mb-4">Subscription Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">Instant Token Generation</h4>
              <p className="text-gray-400 text-sm">
                Get withdrawal tokens with QR codes immediately after confirming your withdrawal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">Flexible Fee Structure</h4>
              <p className="text-gray-400 text-sm">
                Pay lower fees as you upgrade tiers, with over-limit transactions charged at competitive rates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">Monthly Reset</h4>
              <p className="text-gray-400 text-sm">
                Transaction limits reset every month, and you can subscribe again if you exceed your limit.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">Agent Network</h4>
              <p className="text-gray-400 text-sm">
                Access to our nationwide network of verified agents for cash collection.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
