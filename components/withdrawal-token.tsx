'use client'

import { useState } from 'react'
import Image from 'next/image'

interface WithdrawalTokenProps {
  token: {
    id: string
    token: string
    qrCodeDataUrl: string
    amount: number
    expiresAt: Date
    status: string
  }
  onCancel?: (tokenId: string) => void
  showActions?: boolean
}

export default function WithdrawalToken({ 
  token, 
  onCancel, 
  showActions = true 
}: WithdrawalTokenProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REDEEMED':
        return 'bg-green-100 text-green-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCancel = async () => {
    if (!onCancel) return

    setIsCanceling(true)
    try {
      await onCancel(token.id)
    } finally {
      setIsCanceling(false)
    }
  }

  const isExpired = new Date(token.expiresAt) <= new Date()
  const isPending = token.status === 'PENDING' && !isExpired

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Withdrawal Token
            </h3>
            <p className="text-sm text-gray-600">
              UGX {token.amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(token.status)}`}>
              {token.status}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {formatExpiryTime(token.expiresAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Token Code */}
      <div className="px-6 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Token Code</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
              {token.token}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Present this code or QR code to an agent to collect your cash
          </p>
        </div>

        {/* Expandable QR Code Section */}
        {isPending && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isExpanded ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            
            {isExpanded && (
              <div className="mt-4 text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                  <Image
                    src={token.qrCodeDataUrl}
                    alt="Withdrawal QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Scan this QR code with the agent's app
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && isPending && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isCanceling ? 'Canceling...' : 'Cancel Token'}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isExpanded ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isPending && (
        <div className="px-6 py-3 bg-blue-50 border-t">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Instructions:</p>
              <ul className="space-y-1">
                <li>• Visit any authorized CashFlow Connect agent</li>
                <li>• Present this token code or show the QR code</li>
                <li>• Collect your cash after verification</li>
                <li>• Token expires in {formatExpiryTime(token.expiresAt)}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
