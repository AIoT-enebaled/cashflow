import { prisma } from '@/lib/prisma'
import { MTNMobileMoneyAPI } from '@/lib/mtn-api'

export interface PaymentRequest {
  amount: number
  userId: string
  phoneNumber: string
  reference: string
  description: string
}

export interface PaymentResponse {
  success: boolean
  message: string
  transactionId?: string
}

export class PaymentService {
  private static instance: PaymentService
  private mtnApi: MTNMobileMoneyAPI

  private constructor() {
    // Initialize MTN API with configuration
    this.mtnApi = new MTNMobileMoneyAPI({
      baseUrl: process.env.MTN_API_BASE_URL || '',
      apiUser: process.env.MTN_API_USER || '',
      apiKey: process.env.MTN_API_KEY || '',
      subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY || '',
      environment: 'sandbox' as const
    })
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      if (!request.amount || request.amount <= 0) {
        return {
          success: false,
          message: 'Invalid payment amount'
        }
      }

      // Create subscription payment record
      const payment = await prisma.subscriptionPayment.create({
        data: {
          subscriptionId: request.userId,
          amount: request.amount,
          status: 'PENDING',
          paymentMethod: 'MOBILE_MONEY'
        }
      })

      // Process payment through MTN API
      const mtnResponse = await this.mtnApi.requestPayment({
        amount: request.amount.toString(),
        currency: 'UGX',
        externalId: request.reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: request.phoneNumber
        },
        payerMessage: request.description,
        payeeNote: 'CashFlow Connect Subscription Payment'
      })

      if (!mtnResponse.success) {
        await prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED'
          }
        })
        return {
          success: false,
          message: mtnResponse.error || 'Payment failed'
        }
      }

      // Update payment record with MTN details
      await prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: {
          status: 'PENDING',
          transactionId: mtnResponse.transactionId
        }
      })

      return {
        success: true,
        message: 'Payment initiated successfully',
        transactionId: mtnResponse.transactionId
      }

    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        message: 'Failed to process payment. Please try again later.'
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const payment = await prisma.subscriptionPayment.findUnique({
        where: { transactionId },
        include: {
          subscription: true
        }
      })

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found'
        }
      }

      if (payment.status === 'COMPLETED') {
        return {
          success: true,
          message: 'Payment already completed'
        }
      }

      // Verify with MTN if payment was successful
      const verification = await this.mtnApi.getPaymentStatus(transactionId)

      if (verification.status === 'COMPLETED') {
        // Update payment status
        await prisma.subscriptionPayment.update({
          where: { transactionId },
          data: {
            status: 'COMPLETED'
          }
        })

        // If this was a subscription payment, update subscription status
        if (payment.subscriptionId) {
          await prisma.subscription.update({
            where: { id: payment.subscriptionId },
            data: {
              status: 'ACTIVE',
              lastRenewalDate: new Date(),
              nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          })
        }

        return {
          success: true,
          message: 'Payment verified successfully'
        }
      }

      return {
        success: false,
        message: verification.reason || 'Payment verification failed'
      }

    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        message: 'Failed to verify payment'
      }
    }
  }
}
