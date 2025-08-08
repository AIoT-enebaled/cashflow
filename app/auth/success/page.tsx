'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import MatrixBackground from '@/components/ui/matrix-background'

export default function AuthSuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('Auth Success Page - Status:', status)
    console.log('Auth Success Page - Session:', session)

    if (status === 'loading') {
      console.log('Session still loading...')
      return
    }

    if (status === 'unauthenticated') {
      console.log('No session found, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session) {
      console.log('Session confirmed, redirecting to dashboard in 2 seconds...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-dark-950 text-white cyber-grid flex items-center justify-center">
      <MatrixBackground density={10} />
      
      <div className="glass-card p-8 text-center relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-cyber-400">Authentication Successful!</h2>
        
        <div className="text-left bg-dark-900/50 rounded-lg p-4 mb-6 text-sm font-mono">
          <div>Status: <span className="text-neon-400">{status}</span></div>
          <div>User: <span className="text-neon-400">{session?.user?.name || 'Loading...'}</span></div>
          <div>Role: <span className="text-neon-400">{session?.user?.role || 'Loading...'}</span></div>
        </div>
        
        {status === 'loading' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
            <span>Establishing secure connection...</span>
          </div>
        )}
        
        {status === 'authenticated' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-pulse w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span>Redirecting to command center...</span>
          </div>
        )}
        
        {status === 'unauthenticated' && (
          <div className="text-red-400">
            Authentication failed. Redirecting to sign in...
          </div>
        )}
      </div>
    </div>
  )
}
