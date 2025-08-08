import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  if (user.role !== role) {
    redirect('/unauthorized')
  }
  return user
}

export async function requireAdmin() {
  return requireRole(UserRole.ADMIN)
}

export async function requireBusinessOwner() {
  return requireRole(UserRole.BUSINESS_OWNER)
}

export async function requireAgent() {
  return requireRole(UserRole.AGENT)
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 1,
    [UserRole.AGENT]: 2,
    [UserRole.BUSINESS_OWNER]: 3,
    [UserRole.ADMIN]: 4,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessAdminFeatures(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN
}

export function canAccessBusinessFeatures(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.BUSINESS_OWNER)
}

export function canAccessAgentFeatures(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.AGENT)
}
