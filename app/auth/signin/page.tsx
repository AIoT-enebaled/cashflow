'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MatrixBackground from '@/components/ui/matrix-background'

export default function SignInPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbTestResult, setDbTestResult] = useState('')
  const router = useRouter()

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test/db')
      const data = await response.json()
      setDbTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setDbTestResult('Database test failed: ' + (error as Error).message)
    }
  }

  const fillTestData = () => {
    setPhone('+256700000004')
    setPassword('user123')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Form submitted with:', { phone, password: password ? '***' : 'empty' })

    if (!phone || !password) {
      setError('Please enter both phone number and password')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting signin...')
      const result = await signIn('credentials', {
        phone,
        password,
        redirect: false,
      })

      console.log('Signin result:', result)

      if (result?.error) {
        console.error('Signin error:', result.error)
        setError(result.error)
        setLoading(false)
      } else if (result?.ok) {
        console.log('Login successful! Redirecting to auth success page...')
        // Redirect to intermediate success page for session handling
        window.location.replace('/auth/success')
      } else {
        setError('Login failed. Please check your credentials.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login exception:', error)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white cyber-grid flex items-center justify-center px-4">
      <MatrixBackground density={15} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-glow">
            <span className="text-3xl font-bold">₵</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="holo-text">Access Portal</span>
          </h2>
          <p className="text-gray-400">
            Enter your credentials to access the financial command center
          </p>
        </div>

        {/* Debug Panel - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-4 py-3 rounded-xl backdrop-blur-sm text-xs">
            <div className="mb-2 flex justify-between items-center">
              <strong>Debug Info:</strong>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={fillTestData}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Fill Test
                </button>
                <button
                  type="button"
                  onClick={testDatabase}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Test DB
                </button>
              </div>
            </div>
            <div>Phone: {phone || 'Not entered'}</div>
            <div>Password: {password ? '***' : 'Not entered'}</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Environment: {process.env.NODE_ENV}</div>
            {dbTestResult && (
              <div className="mt-2 p-2 bg-black/30 rounded">
                <pre className="text-xs overflow-x-auto">{dbTestResult}</pre>
              </div>
            )}
          </div>
        )}

        {/* Sign In Form */}
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      console.log('Phone input changed:', e.target.value)
                      setPhone(e.target.value)
                    }}
                    placeholder="+256700000000"
                    className="block w-full pl-10 pr-4 py-3 text-white bg-slate-800 border border-slate-600 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    style={{ 
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderColor: '#475569'
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      console.log('Password input changed')
                      setPassword(e.target.value)
                    }}
                    placeholder="Enter your secure passkey"
                    className="block w-full pl-10 pr-4 py-3 text-white bg-slate-800 border border-slate-600 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    style={{ 
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderColor: '#475569'
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Access System</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth/signup"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                New to the platform? <span className="holo-text">Initialize Account</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Test Accounts Info */}
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              <span>Test Accounts</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { role: "User", phone: "+256700000004", pass: "user123", color: "from-green-500 to-teal-500" },
                { role: "Business", phone: "+256700000002", pass: "business123", color: "from-purple-500 to-indigo-500" },
                { role: "Agent", phone: "+256700000003", pass: "agent123", color: "from-blue-500 to-cyan-500" },
                { role: "Admin", phone: "+256700000001", pass: "admin123", color: "from-red-500 to-pink-500" }
              ].map((demo, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className={`w-6 h-6 bg-gradient-to-r ${demo.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-xs font-bold`}>
                    {demo.role.charAt(0)}
                  </div>
                  <div className="text-gray-300 font-medium">{demo.role}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    <div>{demo.phone}</div>
                    <div>{demo.pass}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
