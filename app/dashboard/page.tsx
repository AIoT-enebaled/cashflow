'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'

interface Subscription {
  id: string
  tier: string
  monthlyFee: number
  includedWithdrawals: number
  maxAmountPerWithdrawal: number
  usedWithdrawals: number
  nextBillingDate: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  createdAt: string
  agentLocation?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      // Fetch user data
      fetchDashboardData()
    }
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch subscription data
      const subResponse = await fetch('/api/dashboard/subscription')
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData.subscription)
      }

      // Fetch recent transactions
      const transResponse = await fetch('/api/dashboard/transactions')
      if (transResponse.ok) {
        const transData = await transResponse.json()
        setRecentTransactions(transData.transactions)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
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
          <h2 className="text-xl font-semibold">Loading Command Center...</h2>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  const user = session?.user
  const monthlyUsage = subscription ? 
    Math.round((subscription.usedWithdrawals / subscription.includedWithdrawals) * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-cyber-400'
      case 'PENDING': return 'text-matrix-400'
      case 'FAILED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'LITE_USER': return { name: 'Lite Explorer', icon: '🌱', gradient: 'from-gray-600 to-gray-800' }
      case 'PRO_USER': return { name: 'Pro Warrior', icon: '⚡', gradient: 'from-neon-500 to-cyber-500' }
      case 'BUSINESS_ELITE': return { name: 'Elite Master', icon: '👑', gradient: 'from-matrix-500 to-orange-500' }
      default: return { name: 'Unknown', icon: '❓', gradient: 'from-gray-600 to-gray-800' }
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white cyber-grid">
      {/* Matrix Background Effect */}
      <MatrixBackground density={10} />

      {/* Header */}
      <header className="glass border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">₵</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  <span className="holo-text">Command Center</span>
                </h1>
                <p className="text-gray-400">
                  Welcome back, <span className="text-neon-400 font-semibold">{user?.name}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/profile"
                className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Profile
              </Link>
              <Link
                href="/api/auth/signout"
                className="btn-neon text-sm px-6 py-2"
              >
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Monthly Fee</p>
                <p className="text-2xl font-bold holo-text">
                  UGX {subscription?.monthlyFee?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-matrix-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Withdrawals Used</p>
                <p className="text-2xl font-bold">
                  <span className="text-matrix-400">{subscription?.usedWithdrawals || 0}</span>
                  <span className="text-gray-500 text-lg">/{subscription?.includedWithdrawals || 0}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-neon-400">
                  {recentTransactions.filter(t => t.type === 'WITHDRAWAL').length} Transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Overview */}
        <div className="glass-card mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <svg className="w-6 h-6 text-neon-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Power Level Status</span>
          </h3>
          
          {subscription ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const tierInfo = getTierInfo(subscription.tier)
                    return (
                      <>
                        <div className={`w-16 h-16 bg-gradient-to-br ${tierInfo.gradient} rounded-2xl flex items-center justify-center text-2xl`}>
                          {tierInfo.icon}
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold">{tierInfo.name}</h4>
                          <p className="text-gray-400">Active subscription tier</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold holo-text">
                    UGX {(subscription.monthlyFee || subscription.monthlyPrice || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-400">per month</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Withdrawal Usage</span>
                    <span className="text-sm text-gray-400">
                      {subscription.usedWithdrawals} / {subscription.includedWithdrawals}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-dark-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-neon-500 to-cyber-500 h-3 rounded-full transition-all duration-500 animate-glow"
                        style={{ width: `${Math.min(monthlyUsage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`text-sm font-semibold ${monthlyUsage > 80 ? 'text-red-400' : monthlyUsage > 60 ? 'text-matrix-400' : 'text-cyber-400'}`}>
                        {monthlyUsage}% utilized
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Max per withdrawal</span>
                    <span className="font-semibold text-white">
                      UGX {subscription.maxAmountPerWithdrawal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Next billing cycle</span>
                    <span className="font-semibold text-white">
                      {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="px-3 py-1 bg-cyber-500/20 text-cyber-400 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">No Active Subscription</h4>
              <p className="text-gray-400 mb-6">Choose a power level to unlock your financial potential</p>
              <Link
                href="/dashboard/subscription"
                className="btn-cyber inline-flex items-center space-x-2"
              >
                <span>Select Power Level</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/withdraw"
            className="feature-card group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Initiate Withdrawal</h3>
                <p className="text-gray-400 text-sm">Access your funds instantly</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/transactions"
            className="feature-card group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Transaction Log</h3>
                <p className="text-gray-400 text-sm">Review your activity history</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/subscription"
            className="feature-card group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-matrix-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Power Management</h3>
                <p className="text-gray-400 text-sm">Upgrade your capabilities</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-6 h-6 text-neon-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Recent Activity</span>
            </h3>
            <Link
              href="/dashboard/transactions"
              className="text-neon-400 hover:text-neon-300 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'WITHDRAWAL' ? 'bg-gradient-to-br from-cyber-500 to-emerald-500' :
                      transaction.type === 'SUBSCRIPTION_PAYMENT' ? 'bg-gradient-to-br from-matrix-500 to-orange-500' :
                      'bg-gradient-to-br from-neon-500 to-cyan-500'
                    }`}>
                      {transaction.type === 'WITHDRAWAL' ? '💰' :
                       transaction.type === 'SUBSCRIPTION_PAYMENT' ? '💳' : '🔄'}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {transaction.type === 'WITHDRAWAL' ? 'Cash Withdrawal' : 
                         transaction.type === 'SUBSCRIPTION_PAYMENT' ? 'Subscription Payment' : 
                         'Fee Payment'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.agentLocation || 'Online'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      UGX {transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">No Transaction History</h4>
              <p className="text-gray-400 mb-6">Your financial journey starts with your first withdrawal</p>
              <Link
                href="/dashboard/withdraw"
                className="btn-neon inline-flex items-center space-x-2"
              >
                <span>Make First Withdrawal</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
