import { SubscriptionTier } from '@prisma/client'
import { prisma } from './prisma'
import { TokenService } from './token-service'

export interface WithdrawalCalculation {
  canWithdraw: boolean
  amount: number
  feeAmount: number
  isFeeFree: boolean
  remainingFreeWithdrawals: number
  maxAmountPerWithdrawal: number
  message?: string
}

export interface SubscriptionLimits {
  [SubscriptionTier.LITE_USER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
  [SubscriptionTier.BASIC_TIER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
  [SubscriptionTier.STANDARD_TIER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
  [SubscriptionTier.PREMIUM_TIER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
  [SubscriptionTier.BUSINESS_TIER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
  [SubscriptionTier.ENTERPRISE_TIER]: {
    monthlyFee: number
    includedWithdrawals: number
    maxAmountPerWithdrawal: number
    overLimitFeePercentage: number
  }
}

export const SUBSCRIPTION_LIMITS: SubscriptionLimits = {
  [SubscriptionTier.LITE_USER]: {
    monthlyFee: 0,
    includedWithdrawals: 5,
    maxAmountPerWithdrawal: 50000,
    overLimitFeePercentage: 2.0 // 2% fee for over-limit transactions
  },
  [SubscriptionTier.BASIC_TIER]: {
    monthlyFee: 5000,
    includedWithdrawals: 15,
    maxAmountPerWithdrawal: 300000,
    overLimitFeePercentage: 1.8 // 1.8% fee for over-limit transactions
  },
  [SubscriptionTier.STANDARD_TIER]: {
    monthlyFee: 15000,
    includedWithdrawals: 25,
    maxAmountPerWithdrawal: 500000,
    overLimitFeePercentage: 1.5 // 1.5% fee for over-limit transactions
  },
  [SubscriptionTier.PREMIUM_TIER]: {
    monthlyFee: 60000,
    includedWithdrawals: 100,
    maxAmountPerWithdrawal: 1500000,
    overLimitFeePercentage: 1.0 // 1% fee for over-limit transactions
  },
  [SubscriptionTier.BUSINESS_TIER]: {
    monthlyFee: 200000,
    includedWithdrawals: 500,
    maxAmountPerWithdrawal: 5000000,
    overLimitFeePercentage: 0.5 // 0.5% fee for over-limit transactions
  },
  [SubscriptionTier.ENTERPRISE_TIER]: {
    monthlyFee: 0, // Custom pricing - contact CFC
    includedWithdrawals: 999999, // Unlimited
    maxAmountPerWithdrawal: 999999999, // 999M+ (contact for custom)
    overLimitFeePercentage: 0.25 // 0.25% fee for over-limit transactions
  }
}

export class WithdrawalService {
  static async calculateWithdrawal(
    userId: string,
    requestedAmount: number
  ): Promise<WithdrawalCalculation> {
    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

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

    const limits = SUBSCRIPTION_LIMITS[subscription.tier]
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

  static async processWithdrawal(
    userId: string,
    amount: number,
    agentId?: string,
    agentLocation?: string
  ): Promise<{ success: boolean; transaction?: any; token?: any; message: string }> {
    const calculation = await this.calculateWithdrawal(userId, amount)

    if (!calculation.canWithdraw) {
      return {
        success: false,
        message: calculation.message || 'Withdrawal not allowed'
      }
    }

    try {
      // Start transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create transaction record - using schema fields
        const transaction = await tx.transaction.create({
          data: {
            userId,
            type: 'WITHDRAWAL',
            amount,
            fee: calculation.feeAmount,
            totalAmount: amount + calculation.feeAmount,
            status: 'PENDING',
            reference: this.generateWithdrawalCode()
          }
        })

        // Update subscription usage 
        const subscription = await tx.subscription.findUnique({
          where: { userId }
        })
        
        if (subscription && calculation.isFeeFree) {
          await tx.subscription.update({
            where: { userId },
            data: {
              transactionsUsed: {
                increment: 1
              }
            }
          })
        }

        // Create audit log
        await tx.auditLog.create({
          data: {
            userId,
            action: 'withdrawal_initiated',
            details: JSON.stringify({
              amount,
              feeAmount: calculation.feeAmount,
              isFeeFree: calculation.isFeeFree,
              transactionId: transaction.id,
              agentId,
              agentLocation
            })
          }
        })

        return transaction
      })

      // Generate withdrawal token
      const tokenResult = await TokenService.createWithdrawalToken(
        userId,
        result.id,
        amount
      )

      if (!tokenResult.success) {
        console.error('Failed to generate withdrawal token:', tokenResult.message)
        // Continue without failing the entire process
      }

      return {
        success: true,
        transaction: result,
        token: tokenResult.token,
        message: `Withdrawal of UGX ${amount.toLocaleString()} initiated successfully. ${tokenResult.success ? 'Withdrawal token generated.' : ''} ${calculation.isFeeFree ? 'No fees applied.' : `Fee: UGX ${calculation.feeAmount.toLocaleString()}`}`
      }

    } catch (error) {
      console.error('Withdrawal processing error:', error)
      return {
        success: false,
        message: 'Failed to process withdrawal. Please try again.'
      }
    }
  }

  private static generateWithdrawalCode(): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  static async getUserWithdrawalStats(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      return null
    }

    const limits = SUBSCRIPTION_LIMITS[subscription.tier]
    const remainingFreeWithdrawals = Math.max(0, subscription.transactionLimit - subscription.transactionsUsed)
    const usagePercentage = (subscription.transactionsUsed / subscription.transactionLimit) * 100

    // Get this month's transaction stats
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'WITHDRAWAL',
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    const totalWithdrawn = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalFees = monthlyTransactions.reduce((sum, t) => sum + t.fee, 0)

    return {
      subscription: {
        tier: subscription.tier,
        usedWithdrawals: subscription.usedWithdrawals,
        includedWithdrawals: subscription.includedWithdrawals,
        remainingFreeWithdrawals,
        usagePercentage: Math.round(usagePercentage),
        maxAmountPerWithdrawal: limits.maxAmountPerWithdrawal,
        nextBillingDate: subscription.nextBillingDate
      },
      monthlyStats: {
        totalTransactions: monthlyTransactions.length,
        totalWithdrawn,
        totalFees,
        avgWithdrawal: monthlyTransactions.length > 0 ? Math.round(totalWithdrawn / monthlyTransactions.length) : 0
      }
    }
  }
}
