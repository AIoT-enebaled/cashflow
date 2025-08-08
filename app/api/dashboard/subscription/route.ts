import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PaymentService } from '@/lib/payment-service'

// Map of tier names to enum values
type TierMap = {
  LITE_USER: 'LITE_USER'
  BASIC_TIER: 'BASIC_TIER'
  STANDARD_TIER: 'STANDARD_TIER'
  PREMIUM_TIER: 'PREMIUM_TIER'
  BUSINESS_TIER: 'BUSINESS_TIER'
  ENTERPRISE_TIER: 'ENTERPRISE_TIER'
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: {
        payments: {
          where: { status: 'COMPLETED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { 
          message: 'No subscription found',
          subscription: null
        },
        { status: 200 }
      )
    }

    // Calculate transactions used this month
    const transactionsUsed = await prisma.transaction.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: subscription.currentMonthStart
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Subscription retrieved successfully',
        subscription: {
          id: subscription.id,
          tier: subscription.tier,
          transactionLimit: subscription.transactionLimit,
          transactionsUsed: transactionsUsed,
          monthlyPrice: subscription.monthlyPrice,
          maxTransactionAmount: subscription.maxTransactionAmount,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          nextRenewalDate: subscription.nextRenewalDate
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Dashboard subscription error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch subscription details' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tier } = body

    if (!tier) {
      return NextResponse.json(
        { message: 'Subscription tier is required' },
        { status: 400 }
      )
    }

    // Define subscription tier details (matching Prisma schema)
    const tierDetails = {
      'LITE_USER': {
        tier: 'LITE_USER',
        monthlyPrice: 0,
        transactionLimit: 5,
        maxTransactionAmount: 50000,
        overageFee: 2000
      },
      'BASIC_TIER': {
        tier: 'BASIC_TIER',
        monthlyPrice: 5000,
        transactionLimit: 15,
        maxTransactionAmount: 300000,
        overageFee: 1800
      },
      'STANDARD_TIER': {
        tier: 'STANDARD_TIER',
        monthlyPrice: 15000,
        transactionLimit: 25,
        maxTransactionAmount: 500000,
        overageFee: 1500
      },
      'PREMIUM_TIER': {
        tier: 'PREMIUM_TIER',
        monthlyPrice: 60000,
        transactionLimit: 100,
        maxTransactionAmount: 1500000,
        overageFee: 1000
      },
      'BUSINESS_TIER': {
        tier: 'BUSINESS_TIER',
        monthlyPrice: 200000,
        transactionLimit: 500,
        maxTransactionAmount: 5000000,
        overageFee: 500
      },
      'ENTERPRISE_TIER': {
        tier: 'ENTERPRISE_TIER',
        monthlyPrice: 0, // Contact for pricing
        transactionLimit: 999999,
        maxTransactionAmount: 999999999,
        overageFee: 250
      }
    }

    const selectedTier = tierDetails[tier as keyof typeof tierDetails]
    if (!selectedTier) {
      return NextResponse.json(
        { message: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Create subscription record first
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        tier: selectedTier.tier as TierMap[keyof TierMap],
        monthlyPrice: selectedTier.monthlyPrice,
        transactionLimit: selectedTier.transactionLimit,
        maxTransactionAmount: selectedTier.maxTransactionAmount,
        overageFee: selectedTier.overageFee,
        status: 'INACTIVE',
        currentMonthStart: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastRenewalDate: new Date(),
        nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    // Process payment through MTN Mobile Money
    const paymentService = PaymentService.getInstance()
    const paymentRequest = {
      amount: selectedTier.monthlyPrice,
      phoneNumber: session.user.phone,
      reference: `SUB_${subscription.id}_${Date.now()}`,
      description: `Subscription payment for ${selectedTier.tier}`,
      userId: session.user.id
    }

    const paymentResult = await paymentService.processPayment(paymentRequest)

    if (!paymentResult.success) {
      // Clean up subscription if payment fails
      await prisma.subscription.delete({
        where: { id: subscription.id }
      })
      
      return NextResponse.json(
        { 
          message: paymentResult.message,
          error: true
        },
        { status: 400 }
      )
    }

    // Create subscription payment record
    await prisma.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        amount: selectedTier.monthlyPrice,
        paymentMethod: 'MOBILE_MONEY',
        status: 'PENDING',
        transactionId: paymentResult.transactionId,
        billingPeriod: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
      }
    })

    return NextResponse.json(
      { 
        message: 'Subscription initiated successfully',
        subscription: {
          id: subscription.id,
          tier: subscription.tier,
          transactionLimit: subscription.transactionLimit,
          transactionsUsed: 0,
          monthlyPrice: subscription.monthlyPrice,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          nextRenewalDate: subscription.nextRenewalDate,
          transactionId: paymentResult.transactionId
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { message: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}
