'use client'

import { useState } from 'react'

interface TokenData {
  id: string
  token: string
  userId: string
  userName: string
  amount: number
  status: string
  createdAt: Date
  expiresAt: Date
}

interface AgentTokenScannerProps {
  onTokenRedeemed?: () => void
}

export default function AgentTokenScanner({ onTokenRedeemed }: AgentTokenScannerProps) {
  const [token, setToken] = useState('')
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [location, setLocation] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const verifyToken = async () => {
    if (!token.trim()) {
      setError('Please enter a token code')
      return
    }

    setIsVerifying(true)
    setError('')
    setSuccess('')
    setTokenData(null)

    try {
      const response = await fetch('/api/agent/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify token')
      }

      setTokenData(data.tokenData)
      setSuccess('Token verified successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const redeemToken = async () => {
    if (!tokenData) return

    setIsRedeeming(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/agent/redeem-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: tokenData.token,
          location: location.trim() || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to redeem token')
      }

      setSuccess('Token redeemed successfully! Cash payout completed.')
      setTokenData(null)
      setToken('')
      setLocation('')
      
      if (onTokenRedeemed) {
        onTokenRedeemed()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsRedeeming(false)
    }
  }

  const resetForm = () => {
    setToken('')
    setTokenData(null)
    setLocation('')
    setError('')
    setSuccess('')
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatExpiryTime = (expiresAt: Date) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const timeLeft = expiry.getTime() - now.getTime()

    if (timeLeft <= 0) {
      return 'Expired'
    }

    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m remaining`
    }
    return `${minutesLeft}m remaining`
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <h2 className="text-xl font-bold text-gray-900">Token Scanner</h2>
        <p className="text-sm text-gray-600 mt-1">Verify and redeem withdrawal tokens</p>
      </div>

      <div className="p-6">
        {/* Token Input */}
        <div className="mb-4">
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Token Code
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="Enter token code (e.g., ABC123XYZ456)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center tracking-wider"
            disabled={isVerifying || isRedeeming || !!tokenData}
          />
        </div>

        {/* Verify Button */}
        {!tokenData && (
          <button
            onClick={verifyToken}
            disabled={isVerifying || !token.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium transition-colors mb-4"
          >
            {isVerifying ? 'Verifying...' : 'Verify Token'}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Token Details */}
        {tokenData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3">Token Details</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{tokenData.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg">UGX {tokenData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{formatTime(tokenData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="text-orange-600">{formatExpiryTime(tokenData.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tokenData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tokenData.status}
                </span>
              </div>
            </div>

            {/* Location Input */}
            <div className="mt-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Kampala Central Branch"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isRedeeming}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={resetForm}
                disabled={isRedeeming}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={redeemToken}
                disabled={isRedeeming}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                {isRedeeming ? 'Processing...' : 'Complete Payout'}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Instructions:</p>
              <ul className="space-y-1">
                <li>• Ask customer to provide their withdrawal token</li>
                <li>• Enter the token code or scan the QR code</li>
                <li>• Verify customer identity before proceeding</li>
                <li>• Complete payout only after verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
