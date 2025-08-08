import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserRole, SubscriptionTier } from '@prisma/client'

// Subscription tier configurations
const SUBSCRIPTION_CONFIG = {
  [SubscriptionTier.LITE_USER]: {
    monthlyFee: 7500,
    includedWithdrawals: 8,
    maxAmountPerWithdrawal: 75000
  },
  [SubscriptionTier.PRO_USER]: {
    monthlyFee: 25000,
    includedWithdrawals: 25,
    maxAmountPerWithdrawal: 300000
  },
  [SubscriptionTier.BUSINESS_ELITE]: {
    monthlyFee: 60000,
    includedWithdrawals: 50,
    maxAmountPerWithdrawal: 1500000
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      password,
      businessName,
      businessType,
      businessAddress,
      subscriptionTier,
      isBusinessOwner
    } = body

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { message: 'Name, phone, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this phone number or email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine user role
    const userRole = isBusinessOwner ? UserRole.BUSINESS_OWNER : UserRole.USER

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        password: hashedPassword,
        role: userRole,
        businessName: isBusinessOwner ? businessName : null,
        businessType: isBusinessOwner ? businessType : null,
        businessAddress: isBusinessOwner ? businessAddress : null,
        isVerified: true, // Auto-verify for now
        kycCompleted: false
      }
    })

    // Create subscription
    const config = SUBSCRIPTION_CONFIG[subscriptionTier as SubscriptionTier]
    const currentDate = new Date()
    const nextMonth = new Date(currentDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: subscriptionTier,
        monthlyFee: config.monthlyFee,
        includedWithdrawals: config.includedWithdrawals,
        maxAmountPerWithdrawal: config.maxAmountPerWithdrawal,
        currentPeriodStart: currentDate,
        currentPeriodEnd: nextMonth,
        nextBillingDate: nextMonth
      }
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM_ALERT',
        title: 'Welcome to CashFlow Connect!',
        message: `Your account has been created successfully with the ${subscriptionTier.replace('_', ' ')} plan. Complete your KYC verification to start withdrawing cash.`
      }
    })

    // Log the registration
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'user_registration',
        resource: 'user',
        resourceId: user.id,
        details: {
          role: userRole,
          subscriptionTier,
          isBusinessOwner
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: user.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
