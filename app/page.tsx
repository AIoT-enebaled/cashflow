'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      const user = session.user as any
    if (user.role === 'ADMIN') {
        router.push('/admin')
    } else if (user.role === 'AGENT') {
        router.push('/agent')
    } else if (user.role === 'BUSINESS_OWNER') {
        router.push('/business')
    } else {
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Matrix Background Effect */}
      <MatrixBackground density={20} />

      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">₵</span>
              </div>
              <h1 className="text-2xl font-display font-bold holo-text">
                CashFlow Connect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-neon">
                <span>Launch App</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 cyber-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-neon-500/20 to-cyber-500/20 border border-neon-500/30 rounded-full text-sm font-medium text-neon-300 mb-8">
                🚀 The Future of Mobile Money
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
              <span className="block">Predictable</span>
              <span className="holo-text animate-glow">Mobile Money</span>
              <span className="block text-gray-300">Withdrawal Costs</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience the next generation of financial technology. Stop worrying about unpredictable fees and embrace 
              <span className="text-cyber-400 font-semibold"> smart subscription plans</span> designed for Uganda's digital economy.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/signup" className="btn-cyber group">
                <span className="flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
              <Link href="#features" className="btn-neon">
                <span>Explore Features</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: "50K+", label: "Active Users", icon: "👥" },
                { value: "UGX 2B+", label: "Saved in Fees", icon: "💰" },
                { value: "99.9%", label: "Uptime", icon: "⚡" }
              ].map((stat, index) => (
                <div key={index} className="glass-card text-center animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold holo-text">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Why Choose <span className="holo-text">CashFlow Connect</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for Uganda's unique financial landscape with cutting-edge technology and user-centric design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💳",
                title: "Predictable Pricing",
                description: "No more surprise fees. Know exactly what you'll pay with our transparent subscription model."
              },
              {
                icon: "⚡",
                title: "Instant Withdrawals",
                description: "Get your money instantly with our optimized mobile money integration."
              },
              {
                icon: "🔒",
                title: "Bank-Grade Security",
                description: "Your financial data is protected with enterprise-level encryption and security protocols."
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                description: "Track your spending patterns and optimize your financial strategy with detailed insights."
              },
              {
                icon: "🌍",
                title: "Multi-Network Support",
                description: "Works seamlessly with MTN, Airtel, and other major mobile money providers in Uganda."
              },
              {
                icon: "🎯",
                title: "Business Focused",
                description: "Specialized tools and features designed for businesses and entrepreneurs."
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-neon-300">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to <span className="holo-text">Transform</span> Your Financial Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who have already discovered the future of mobile money in Uganda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-cyber">
                <span>Get Started Now</span>
                </Link>
              <Link href="/auth/signin" className="btn-neon">
                <span>Sign In</span>
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-500 to-cyber-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">₵</span>
              </div>
              <span className="text-lg font-bold">CashFlow Connect</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 CashFlow Connect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
