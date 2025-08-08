'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'

interface Transaction {
  id: string
  type: string
  amount: number
  fee: number
  totalAmount: number
  status: string
  reference: string
  createdAt: string
  completedAt?: string
  withdrawalToken?: {
    token: string
    status: string
    expiresAt: string
  }
}

export default function TransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchTransactions()
  }, [status, router])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/dashboard/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-cyber-400 bg-cyber-400/20'
      case 'PENDING': return 'text-matrix-400 bg-matrix-400/20'
      case 'FAILED': return 'text-red-400 bg-red-400/20'
      case 'CANCELLED': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'WITHDRAWAL': return '💰'
      case 'SUBSCRIPTION_PAYMENT': return '💳'
      case 'OVER_LIMIT_FEE': return '📊'
      case 'AGENT_FEE': return '🤝'
      default: return '🔄'
    }
  }

  const getTransactionName = (type: string) => {
    switch (type) {
      case 'WITHDRAWAL': return 'Cash Withdrawal'
      case 'SUBSCRIPTION_PAYMENT': return 'Subscription Payment'
      case 'OVER_LIMIT_FEE': return 'Over-Limit Fee'
      case 'AGENT_FEE': return 'Agent Commission'
      default: return 'Transaction'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter || transaction.status === filter
  })

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
          <h2 className="text-xl font-semibold">Loading Transaction History...</h2>
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
                  <span className="holo-text">Transaction Log</span>
                </h1>
                <p className="text-gray-400">View your complete transaction history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Withdrawals</p>
                <p className="text-xl font-bold text-cyber-400">
                  {transactions.filter(t => t.type === 'WITHDRAWAL').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-xl font-bold text-neon-400">
                  UGX {transactions.reduce((sum, t) => t.type === 'WITHDRAWAL' ? sum + t.amount : sum, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-matrix-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🟢</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-xl font-bold text-green-400">
                  {transactions.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">⏳</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-xl font-bold text-yellow-400">
                  {transactions.filter(t => t.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-400 font-medium">Filter:</span>
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'WITHDRAWAL', label: 'Withdrawals' },
              { id: 'SUBSCRIPTION_PAYMENT', label: 'Subscriptions' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'FAILED', label: 'Failed' }
            ].map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-neon-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-6 h-6 text-neon-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Transaction History</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-xl flex items-center justify-center text-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-white">
                          {getTransactionName(transaction.type)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>Ref: {transaction.reference}</span>
                        <span>•</span>
                        <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                        {transaction.withdrawalToken && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400">Token: {transaction.withdrawalToken.token}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      UGX {transaction.amount.toLocaleString()}
                    </p>
                    {transaction.fee > 0 && (
                      <p className="text-sm text-red-400">
                        Fee: UGX {transaction.fee.toLocaleString()}
                      </p>
                    )}
                    {transaction.completedAt && (
                      <p className="text-xs text-gray-400">
                        Completed: {new Date(transaction.completedAt).toLocaleDateString()}
                      </p>
                    )}
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
              <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? 'You haven\'t made any transactions yet'
                  : `No transactions found matching the "${filter}" filter`
                }
              </p>
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h3 className="text-lg font-semibold mb-1">New Withdrawal</h3>
                <p className="text-gray-400 text-sm">Start a new cash withdrawal</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/tokens"
            className="feature-card group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Withdrawal Tokens</h3>
                <p className="text-gray-400 text-sm">View active withdrawal tokens</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
