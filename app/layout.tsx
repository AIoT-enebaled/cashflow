import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/session-provider'
import HMRErrorHandler from '@/components/hmr-error-handler'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CashFlow Connect - Mobile Money Withdrawal Service',
  description: 'Subscription-based mobile money withdrawal service in Uganda. Predictable costs, enhanced convenience, and value-added financial tools.',
  keywords: 'mobile money, Uganda, withdrawal, subscription, financial services',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <HMRErrorHandler />
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
