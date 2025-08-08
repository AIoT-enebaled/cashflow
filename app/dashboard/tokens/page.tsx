'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'
import WithdrawalToken from '@/components/withdrawal-token'

interface Token {
  id: string
  token: string
  qrCode: string
  amount: number
  status: string
  expiresAt: string
  createdAt: string
  transaction?: {
    id: string
    status: string
    createdAt: string
  }
  agent?: {
    agentCode: string
    businessName: string
  }
}

export default function TokensPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchTokens()
  }, [status, router])

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/withdrawal/tokens')
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens || [])
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelToken = async (tokenId: string) => {
    try {
      const response = await fetch('/api/withdrawal/tokens', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId }),
      })

      if (response.ok) {
        setTokens(tokens.filter(token => token.id !== tokenId))
        alert('Token cancelled successfully')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to cancel token')
      }
    } catch (error) {
      alert('Failed to cancel token')
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
          <h2 className="text-xl font-semibold">Loading Withdrawal Tokens...</h2>
        </div>
      </div>
    )
  }

  const pendingTokens = tokens.filter(token => token.status === 'PENDING' && new Date(token.expiresAt) > new Date())
  const completedTokens = tokens.filter(token => token.status === 'REDEEMED')
  const expiredTokens = tokens.filter(token => token.status === 'EXPIRED' || (token.status === 'PENDING' && new Date(token.expiresAt) <= new Date()))
  const cancelledTokens = tokens.filter(token => token.status === 'CANCELLED')

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
                  <span className="holo-text">Withdrawal Tokens</span>
                </h1>
                <p className="text-gray-400">Manage your cash collection tokens</p>
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
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">⏳</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Tokens</p>
                <p className="text-xl font-bold text-yellow-400">
                  {pendingTokens.length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-xl font-bold text-green-400">
                  {completedTokens.length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">⏰</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Expired</p>
                <p className="text-xl font-bold text-red-400">
                  {expiredTokens.length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-lg">❌</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-xl font-bold text-gray-400">
                  {cancelledTokens.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Tokens */}
        {pendingTokens.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
              <span className="text-yellow-400">⏳</span>
              <span>Active Tokens</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingTokens.map((token) => (
                <WithdrawalToken
                  key={token.id}
                  token={{
                    id: token.id,
                    token: token.token,
                    qrCodeDataUrl: token.qrCode,
                    amount: token.amount,
                    expiresAt: new Date(token.expiresAt),
                    status: token.status
                  }}
                  onCancel={handleCancelToken}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Completed Tokens */}
        {completedTokens.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span>Recently Completed</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedTokens.slice(0, 4).map((token) => (
                <WithdrawalToken
                  key={token.id}
                  token={{
                    id: token.id,
                    token: token.token,
                    qrCodeDataUrl: token.qrCode,
                    amount: token.amount,
                    expiresAt: new Date(token.expiresAt),
                    status: token.status
                  }}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Active Tokens */}
        {pendingTokens.length === 0 && (
          <div className="glass-card text-center py-12 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Active Withdrawal Tokens</h3>
            <p className="text-gray-400 mb-6">
              You don't have any active withdrawal tokens. Start a withdrawal to generate a new token.
            </p>
            <Link
              href="/dashboard/withdraw"
              className="btn-neon inline-flex items-center space-x-2"
            >
              <span>Initiate Withdrawal</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-gray-400 text-sm">Generate a new withdrawal token</p>
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
                <h3 className="text-lg font-semibold mb-1">Transaction History</h3>
                <p className="text-gray-400 text-sm">View all your transactions</p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/withdrawal-tokens"
            className="feature-card group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">System Demo</h3>
                <p className="text-gray-400 text-sm">Try the token system demo</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
