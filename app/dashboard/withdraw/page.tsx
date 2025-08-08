'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'
import WithdrawalToken from '@/components/withdrawal-token'

interface WithdrawalCalculation {
  canWithdraw: boolean
  amount: number
  feeAmount: number
  isFeeFree: boolean
  remainingFreeWithdrawals: number
  maxAmountPerWithdrawal: number
  message?: string
}

export default function WithdrawPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [calculation, setCalculation] = useState<WithdrawalCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [withdrawalToken, setWithdrawalToken] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  const calculateWithdrawal = async (withdrawalAmount: number) => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setCalculation(null)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/withdrawal/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: withdrawalAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        setCalculation(null)
        return
      }

      setCalculation(data.calculation)
      setError('')
    } catch (error) {
      setError('Failed to calculate withdrawal fees')
      setCalculation(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    
    if (value) {
      const numericValue = parseInt(value)
      calculateWithdrawal(numericValue)
    } else {
      setCalculation(null)
    }
  }

  const processWithdrawal = async () => {
    if (!calculation || !calculation.canWithdraw) return

    try {
      setProcessing(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/withdrawal/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: calculation.amount,
          agentLocation: 'Online Platform' 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      setSuccess(data.message)
      
      // Store the withdrawal token if it was generated
      if (data.token) {
        setWithdrawalToken(data.token)
      }
      
      setAmount('')
      setCalculation(null)

    } catch (error) {
      setError('Failed to process withdrawal. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-950 text-white cyber-grid flex items-center justify-center">
        <MatrixBackground density={10} />
        <div className="glass-card p-8 text-center">
          <div className="loading-dots mb-4">
            <div style={{ '--i': 0 } as any}></div>
            <div style={{ '--i': 1 } as any}></div>
            <div style={{ '--i': 2 } as any}></div>
          </div>
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const formatAmount = (amount: string) => {
    if (!amount) return ''
    return parseInt(amount).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white cyber-grid">
      <MatrixBackground density={8} />

      {/* Header */}
      <header className="glass border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="w-12 h-12 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold holo-text">Cash Withdrawal</h1>
                <p className="text-gray-400">Access your funds instantly</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Withdrawal Form */}
        <div className="glass-card mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Withdraw Funds</span>
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-cyber-500/20 border border-cyber-500/50 text-cyber-300 px-4 py-3 rounded-xl backdrop-blur-sm mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="form-label">
                Withdrawal Amount (UGX)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount (e.g., 50000)"
                  className="form-input text-2xl font-bold pl-16"
                  disabled={processing}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl font-bold">UGX</span>
                </div>
              </div>
              {amount && (
                <p className="mt-2 text-sm text-gray-400">
                  Amount: UGX {formatAmount(amount)}
                </p>
              )}
            </div>

            {/* Real-time Calculation Display */}
            {loading && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="loading-dots">
                    <div style={{ '--i': 0 } as any}></div>
                    <div style={{ '--i': 1 } as any}></div>
                    <div style={{ '--i': 2 } as any}></div>
                  </div>
                  <span className="text-gray-300">Calculating fees...</span>
                </div>
              </div>
            )}

            {calculation && (
              <div className={`rounded-xl p-6 border ${calculation.canWithdraw ? 'bg-cyber-500/10 border-cyber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${calculation.canWithdraw ? 'bg-cyber-500' : 'bg-red-500'}`}>
                    {calculation.canWithdraw ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>Withdrawal Calculation</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Withdrawal Amount:</span>
                      <span className="font-semibold">UGX {calculation.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fee Amount:</span>
                      <span className={`font-semibold ${calculation.isFeeFree ? 'text-cyber-400' : 'text-matrix-400'}`}>
                        {calculation.isFeeFree ? 'FREE' : `UGX ${calculation.feeAmount.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Cost:</span>
                      <span className="font-bold text-lg">
                        UGX {(calculation.amount + calculation.feeAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Free Withdrawals Left:</span>
                      <span className="font-semibold text-cyber-400">
                        {calculation.remainingFreeWithdrawals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Per Withdrawal:</span>
                      <span className="font-semibold">
                        UGX {calculation.maxAmountPerWithdrawal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {calculation.message && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-300">{calculation.message}</p>
                  </div>
                )}

                {calculation.canWithdraw && (
                  <div className="mt-6">
                    <button
                      onClick={processWithdrawal}
                      disabled={processing}
                      className="btn-cyber w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="loading-dots">
                            <div style={{ '--i': 0 } as any}></div>
                            <div style={{ '--i': 1 } as any}></div>
                            <div style={{ '--i': 2 } as any}></div>
                          </div>
                          <span>Processing Withdrawal...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Confirm Withdrawal</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Quick Amounts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[10000, 25000, 50000, 100000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => {
                  setAmount(quickAmount.toString())
                  calculateWithdrawal(quickAmount)
                }}
                className="feature-card p-4 text-center hover:scale-105 transition-transform"
                disabled={processing}
              >
                <div className="text-lg font-bold">UGX {quickAmount.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal Token Display */}
        {withdrawalToken && (
          <div className="glass-card border-cyber-500/50 bg-cyber-500/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Withdrawal Token Generated</span>
            </h2>

            <WithdrawalToken token={withdrawalToken} />
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard/tokens"
                className="btn-cyber flex-1 text-center py-3"
              >
                View All Tokens
              </Link>
              <Link 
                href="/dashboard/transactions"
                className="btn-outline flex-1 text-center py-3"
              >
                Transaction History
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
