import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error('Phone and password are required')
        }

        let user
        try {
          user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
            include: {
              subscription: true,
              agentProfile: true
            }
          })
        } catch (error) {
          console.log('Database error during auth, trying without subscription:', error)
          // If there's a schema mismatch, try without including subscription
          user = await prisma.user.findUnique({
            where: { phone: credentials.phone }
          })
        }

        if (!user || !user.password) {
          throw new Error('Invalid phone or password')
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password)

        if (!isValidPassword) {
          throw new Error('Invalid phone or password')
        }

        if (!user.isVerified) {
          throw new Error('Please verify your account before logging in')
        }

        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          kycCompleted: user.kycCompleted,
          subscription: user.subscription,
          agentProfile: user.agentProfile
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.kycCompleted = user.kycCompleted
        token.subscription = user.subscription
        token.agentProfile = user.agentProfile
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.phone = token.phone as string
        session.user.kycCompleted = token.kycCompleted as boolean
        session.user.subscription = token.subscription
        session.user.agentProfile = token.agentProfile
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET
}
