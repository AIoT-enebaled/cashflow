import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { subscriptionStore } from '@/lib/subscription-store'

interface WithdrawalCalculation {
  canWithdraw: boolean
  amount: number
  feeAmount: number
  isFeeFree: boolean
  remainingFreeWithdrawals: number
  maxAmountPerWithdrawal: number
  message?: string
}

const TIER_LIMITS = {
  'LITE_USER': {
    monthlyFee: 0,
    includedWithdrawals: 5,
    maxAmountPerWithdrawal: 50000,
    overLimitFeePercentage: 2.0
  },
  'BASIC_TIER': {
    monthlyFee: 5000,
    includedWithdrawals: 15,
    maxAmountPerWithdrawal: 300000,
    overLimitFeePercentage: 1.8
  },
  'STANDARD_TIER': {
    monthlyFee: 15000,
    includedWithdrawals: 25,
    maxAmountPerWithdrawal: 500000,
    overLimitFeePercentage: 1.5
  },
  'PREMIUM_TIER': {
    monthlyFee: 60000,
    includedWithdrawals: 100,
    maxAmountPerWithdrawal: 1500000,
    overLimitFeePercentage: 1.0
  },
  'BUSINESS_TIER': {
    monthlyFee: 200000,
    includedWithdrawals: 500,
    maxAmountPerWithdrawal: 5000000,
    overLimitFeePercentage: 0.5
  },
  'ENTERPRISE_TIER': {
    monthlyFee: 0,
    includedWithdrawals: 999999,
    maxAmountPerWithdrawal: 999999999,
    overLimitFeePercentage: 0.25
  }
} as const

const calculateWithdrawalDemo = async (userId: string, requestedAmount: number): Promise<WithdrawalCalculation> => {
  // Get user's subscription from shared store
  const subscription = subscriptionStore.get(userId)
  console.log('Withdrawal calculation - subscription for user:', userId, subscription)

  if (!subscription) {
    return {
      canWithdraw: false,
      amount: 0,
      feeAmount: 0,
      isFeeFree: false,
      remainingFreeWithdrawals: 0,
      maxAmountPerWithdrawal: 0,
      message: 'No active subscription found. Please subscribe to a plan.'
    }
  }

  const limits = TIER_LIMITS[subscription.tier as keyof typeof TIER_LIMITS]
  if (!limits) {
    return {
      canWithdraw: false,
      amount: 0,
      feeAmount: 0,
      isFeeFree: false,
      remainingFreeWithdrawals: 0,
      maxAmountPerWithdrawal: 0,
      message: 'Invalid subscription tier.'
    }
  }

  const remainingFreeWithdrawals = Math.max(0, subscription.transactionLimit - subscription.transactionsUsed)

  // Check if amount exceeds maximum per withdrawal
  if (requestedAmount > limits.maxAmountPerWithdrawal) {
    return {
      canWithdraw: false,
      amount: requestedAmount,
      feeAmount: 0,
      isFeeFree: false,
      remainingFreeWithdrawals,
      maxAmountPerWithdrawal: limits.maxAmountPerWithdrawal,
      message: `Amount exceeds maximum withdrawal limit of UGX ${limits.maxAmountPerWithdrawal.toLocaleString()} for your ${subscription.tier.replace('_', ' ')} plan.`
    }
  }

  // Check minimum amount (UGX 1,000)
  if (requestedAmount < 1000) {
    return {
      canWithdraw: false,
      amount: requestedAmount,
      feeAmount: 0,
      isFeeFree: false,
      remainingFreeWithdrawals,
      maxAmountPerWithdrawal: limits.maxAmountPerWithdrawal,
      message: 'Minimum withdrawal amount is UGX 1,000.'
    }
  }

  // Calculate fees
  let feeAmount = 0
  let isFeeFree = false

  if (remainingFreeWithdrawals > 0) {
    // This withdrawal is fee-free
    isFeeFree = true
    feeAmount = 0
  } else {
    // Apply over-limit fee
    isFeeFree = false
    feeAmount = Math.round(requestedAmount * limits.overLimitFeePercentage / 100)
    // Minimum fee of UGX 500
    feeAmount = Math.max(feeAmount, 500)
  }

  return {
    canWithdraw: true,
    amount: requestedAmount,
    feeAmount,
    isFeeFree,
    remainingFreeWithdrawals,
    maxAmountPerWithdrawal: limits.maxAmountPerWithdrawal,
    message: isFeeFree 
      ? `Fee-free withdrawal (${remainingFreeWithdrawals} remaining this month)`
      : `Over-limit fee of UGX ${feeAmount.toLocaleString()} applies`
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      )
    }

    const { amount } = await request.json()

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Please enter a valid withdrawal amount.' },
        { status: 400 }
      )
    }

    // Calculate withdrawal using demo function
    const calculation = await calculateWithdrawalDemo(
      session.user.id,
      amount
    )

    return NextResponse.json(
      { calculation },
      { status: 200 }
    )

  } catch (error) {
    console.error('Withdrawal calculation error:', error)
    return NextResponse.json(
      { message: 'Failed to calculate withdrawal. Please try again.' },
      { status: 500 }
    )
  }
}
