import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/signup',
      '/api/auth',
      '/api/health'
    ]

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    )

    // If it's a public route, allow access
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // For protected routes, ensure user is authenticated
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Role-based access control for specific routes
    const userRole = token.role as string

    // Admin routes
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Agent routes
    if (pathname.startsWith('/agent') && userRole !== 'AGENT' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Business routes
    if (pathname.startsWith('/business') && userRole !== 'BUSINESS_OWNER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Dashboard routes require any authenticated user
    if (pathname.startsWith('/dashboard')) {
      // Check if user has completed KYC for sensitive operations
      if ((pathname.includes('/withdraw') || pathname.includes('/transfer')) && !token.kycCompleted) {
        const kycUrl = new URL('/dashboard/kyc', req.url)
        return NextResponse.redirect(kycUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes without token
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/api/auth',
          '/api/health'
        ]

        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route)
        )

        if (isPublicRoute) {
          return true
        }

        // Require token for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
