import { UserRole, Subscription, Agent } from '@prisma/client'
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      phone: string
      kycCompleted: boolean
      subscription?: Subscription
      agentProfile?: Agent
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: UserRole
    phone: string
    kycCompleted: boolean
    subscription?: Subscription
    agentProfile?: Agent
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: UserRole
    phone: string
    kycCompleted: boolean
    subscription?: Subscription
    agentProfile?: Agent
  }
}
