'use client'

import { useEffect } from 'react'

export default function HMRErrorHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Store original fetch
    const originalFetch = window.fetch
    
    // Enhanced fetch wrapper for all HMR-related requests
    window.fetch = function(...args) {
      const url = args[0]?.toString() || ''
      
      return originalFetch.apply(this, args).catch((error) => {
        // Check for various HMR/development-related requests that fail in cloud
        const isHMRRelated = 
          url.includes('_next/static') ||
          url.includes('webpack') ||
          url.includes('hmr') ||
          url.includes('hot-update') ||
          url.includes('reload=') ||
          url.includes('__nextjs') ||
          url.includes('fast-refresh') ||
          error.message.includes('Failed to fetch') && process.env.NODE_ENV === 'development'

        if (isHMRRelated) {
          console.warn('🔄 HMR request failed (expected in cloud):', url.substring(0, 100))
          // Return empty successful response to prevent cascading errors
          return Promise.resolve(new Response('{}', { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
          }))
        }
        
        // Re-throw non-HMR errors
        throw error
      })
    }

    // Handle webpack HMR module requests
    if ((window as any).__webpack_require__) {
      const webpack = (window as any).__webpack_require__
      
      // Override HMR module fetching
      if (webpack.hmrM) {
        const originalHmrM = webpack.hmrM
        webpack.hmrM = function(chunkId: any) {
          try {
            return originalHmrM(chunkId).catch((error: any) => {
              console.warn('🔄 HMR module update failed (expected in cloud):', chunkId)
              return {}
            })
          } catch (error) {
            console.warn('🔄 HMR module sync failed (expected in cloud):', chunkId)
            return {}
          }
        }
      }

      // Override HMR check
      if (webpack.hmrC) {
        const originalHmrC = webpack.hmrC
        webpack.hmrC = function(chunkId: any) {
          try {
            return originalHmrC(chunkId).catch((error: any) => {
              console.warn('🔄 HMR check failed (expected in cloud):', chunkId)
              return false
            })
          } catch (error) {
            console.warn('🔄 HMR check sync failed (expected in cloud):', chunkId)
            return false
          }
        }
      }
    }

    // Handle Next.js router fetch errors for RSC payloads
    const handleRouterError = (event: any) => {
      if (event.error && event.error.message?.includes('Failed to fetch')) {
        console.warn('🔄 Router fetch failed (expected in cloud), falling back to browser navigation')
        event.preventDefault()
      }
    }

    // Listen for unhandled promise rejections related to HMR
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (error?.message?.includes('Failed to fetch') && 
          (error?.stack?.includes('webpack') || 
           error?.stack?.includes('hmr') ||
           error?.stack?.includes('fast-refresh') ||
           error?.stack?.includes('router-reducer'))) {
        console.warn('🔄 Unhandled HMR promise rejection (suppressed for cloud):', error.message)
        event.preventDefault()
      }
    }

    // Add event listeners
    window.addEventListener('error', handleRouterError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Override console.error to filter HMR noise in development
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error
      console.error = function(...args) {
        const message = args.join(' ')
        if (message.includes('Failed to fetch') && 
            (message.includes('webpack') || 
             message.includes('hmr') || 
             message.includes('_next/static'))) {
          // Suppress HMR errors in cloud environments
          return
        }
        originalConsoleError.apply(console, args)
      }
    }

    // Cleanup function
    return () => {
      window.fetch = originalFetch
      window.removeEventListener('error', handleRouterError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
