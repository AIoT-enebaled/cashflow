'use client'

import { useState, useEffect } from 'react'
import WithdrawalToken from '@/components/withdrawal-token'
import AgentTokenScanner from '@/components/agent-token-scanner'

interface Token {
  id: string
  token: string
  qrCodeDataUrl: string
  amount: number
  expiresAt: Date
  status: string
}

export default function WithdrawalTokensDemo() {
  const [activeTab, setActiveTab] = useState<'user' | 'agent'>('user')
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Demo token for testing
  const demoToken: Token = {
    id: 'demo-token-1',
    token: 'ABC123XYZ456',
    qrCodeDataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlbW8gUVIgQ29kZTwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2NjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUJDMTIzWFlaNDU2PC90ZXh0Pgo8L3N2Zz4K',
    amount: 50000,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: 'PENDING'
  }

  const fetchUserTokens = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/withdrawal/tokens')
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens || [])
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
      // For demo purposes, use the demo token
      setTokens([demoToken])
    } finally {
      setIsLoading(false)
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

  const handleTokenRedeemed = () => {
    alert('Token redeemed successfully! The transaction is now complete.')
    fetchUserTokens() // Refresh the tokens list
  }

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUserTokens()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Withdrawal Token System Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience the complete flow from withdrawal initiation to cash collection
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User View
            </button>
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'agent'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agent View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {activeTab === 'user' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Withdrawal Tokens
                </h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : tokens.length > 0 ? (
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <WithdrawalToken
                        key={token.id}
                        token={token}
                        onCancel={handleCancelToken}
                        showActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
                    <p className="text-gray-500 mb-4">No withdrawal tokens found</p>
                    <p className="text-sm text-gray-400">
                      Initiate a withdrawal to generate a token
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'agent' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Token Scanner
                </h2>
                <AgentTokenScanner onTokenRedeemed={handleTokenRedeemed} />
              </div>
            )}
          </div>

          {/* Right Column - Information */}
          <div className="space-y-6">
            {activeTab === 'user' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How It Works - User
                </h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Initiate Withdrawal</p>
                      <p>Start a withdrawal request through the app</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Get Token</p>
                      <p>Receive a unique token and QR code valid for 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Visit Agent</p>
                      <p>Go to any authorized CashFlow Connect agent</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium text-gray-900">Present Token</p>
                      <p>Show your token code or QR code to the agent</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">5</div>
                    <div>
                      <p className="font-medium text-gray-900">Collect Cash</p>
                      <p>Receive your cash after verification</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agent' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How It Works - Agent
                </h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Customer Arrives</p>
                      <p>Customer presents withdrawal token or QR code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Enter Token</p>
                      <p>Input the token code or scan the QR code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Verify Details</p>
                      <p>Confirm customer identity and withdrawal amount</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium text-gray-900">Complete Payout</p>
                      <p>Process the transaction and give cash to customer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">5</div>
                    <div>
                      <p className="font-medium text-gray-900">Earn Commission</p>
                      <p>Receive commission for facilitating the transaction</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Benefits */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Benefits
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure token-based authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>24-hour token expiration for security</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>QR code for quick scanning</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Real-time transaction tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Agent commission system</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Cancellation option for users</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            This demo shows the complete withdrawal token system. 
            For testing, use token code: <code className="bg-gray-100 px-2 py-1 rounded font-mono">ABC123XYZ456</code>
          </p>
        </div>
      </div>
    </div>
  )
}
