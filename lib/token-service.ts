import { WithdrawalTokenStatus } from '@prisma/client'
import { prisma } from './prisma'
import * as crypto from 'crypto'
import QRCode from 'qrcode'

export interface TokenGenerationResult {
  success: boolean
  token?: {
    id: string
    token: string
    qrCodeDataUrl: string
    amount: number
    expiresAt: Date
    status: WithdrawalTokenStatus
  }
  message: string
}

export interface TokenVerificationResult {
  success: boolean
  tokenData?: {
    id: string
    token: string
    userId: string
    userName: string
    amount: number
    status: WithdrawalTokenStatus
    createdAt: Date
    expiresAt: Date
  }
  message: string
}

export interface TokenRedemptionResult {
  success: boolean
  transaction?: any
  message: string
}

export class TokenService {
  
  /**
   * Generate a secure withdrawal token
   */
  private static generateSecureToken(): string {
    // Generate a 12-character alphanumeric token
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 12; i++) {
      token += characters.charAt(crypto.randomInt(0, characters.length))
    }
    return token
  }

  /**
   * Generate QR code data URL
   */
  private static async generateQRCode(tokenData: {
    token: string
    amount: number
    userId: string
    expiresAt: Date
  }): Promise<string> {
    const qrData = {
      token: tokenData.token,
      amount: tokenData.amount,
      userId: tokenData.userId,
      expiresAt: tokenData.expiresAt.toISOString(),
      type: 'withdrawal_token',
      version: '1.0'
    }

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      return qrCodeDataUrl
    } catch (error) {
      console.error('QR Code generation error:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Create a withdrawal token after successful withdrawal initiation
   */
  static async createWithdrawalToken(
    userId: string,
    transactionId: string,
    amount: number
  ): Promise<TokenGenerationResult> {
    try {
      // Generate secure token
      const token = this.generateSecureToken()
      
      // Set expiration to 24 hours from now
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Generate QR code
      const qrCodeDataUrl = await this.generateQRCode({
        token,
        amount,
        userId,
        expiresAt
      })

      // Create withdrawal token in database
      const withdrawalToken = await prisma.withdrawalToken.create({
        data: {
          userId,
          transactionId,
          token,
          qrCode: qrCodeDataUrl,
          amount,
          status: WithdrawalTokenStatus.PENDING,
          expiresAt
        }
      })

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId,
          type: 'TOKEN_GENERATED',
          title: 'Withdrawal Token Generated',
          message: `Your withdrawal token ${token} has been generated. Please present it to an agent within 24 hours.`,
          data: JSON.stringify({
            tokenId: withdrawalToken.id,
            token,
            amount,
            expiresAt: expiresAt.toISOString()
          })
        }
      })

      return {
        success: true,
        token: {
          id: withdrawalToken.id,
          token: withdrawalToken.token,
          qrCodeDataUrl: withdrawalToken.qrCode!,
          amount: withdrawalToken.amount,
          expiresAt: withdrawalToken.expiresAt,
          status: withdrawalToken.status
        },
        message: 'Withdrawal token generated successfully'
      }

    } catch (error) {
      console.error('Token creation error:', error)
      return {
        success: false,
        message: 'Failed to generate withdrawal token'
      }
    }
  }

  /**
   * Verify a withdrawal token (used by agents)
   */
  static async verifyToken(tokenString: string): Promise<TokenVerificationResult> {
    try {
      const withdrawalToken = await prisma.withdrawalToken.findUnique({
        where: { token: tokenString },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })

      if (!withdrawalToken) {
        return {
          success: false,
          message: 'Invalid token'
        }
      }

      // Check if token has expired
      if (withdrawalToken.expiresAt < new Date()) {
        // Update token status to expired
        await prisma.withdrawalToken.update({
          where: { id: withdrawalToken.id },
          data: { status: WithdrawalTokenStatus.EXPIRED }
        })

        return {
          success: false,
          message: 'Token has expired'
        }
      }

      // Check if token has already been redeemed
      if (withdrawalToken.status === WithdrawalTokenStatus.REDEEMED) {
        return {
          success: false,
          message: 'Token has already been redeemed'
        }
      }

      // Check if token has been cancelled
      if (withdrawalToken.status === WithdrawalTokenStatus.CANCELLED) {
        return {
          success: false,
          message: 'Token has been cancelled'
      }
      }

      return {
        success: true,
        tokenData: {
          id: withdrawalToken.id,
          token: withdrawalToken.token,
          userId: withdrawalToken.userId,
          userName: withdrawalToken.user.name,
          amount: withdrawalToken.amount,
          status: withdrawalToken.status,
          createdAt: withdrawalToken.createdAt,
          expiresAt: withdrawalToken.expiresAt
        },
        message: 'Token verified successfully'
      }

    } catch (error) {
      console.error('Token verification error:', error)
      return {
        success: false,
        message: 'Failed to verify token'
      }
    }
  }

  /**
   * Redeem a withdrawal token (used by agents to complete cash payout)
   */
  static async redeemToken(
    tokenString: string,
    agentId: string,
    location?: string
  ): Promise<TokenRedemptionResult> {
    try {
      const verification = await this.verifyToken(tokenString)
      
      if (!verification.success || !verification.tokenData) {
        return {
          success: false,
          message: verification.message
        }
      }

      const tokenData = verification.tokenData

      // Start transaction to update token and related transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update withdrawal token
        const updatedToken = await tx.withdrawalToken.update({
          where: { id: tokenData.id },
          data: {
            status: WithdrawalTokenStatus.REDEEMED,
            agentId,
            redeemedAt: new Date(),
            redeemedLocation: location
          },
          include: {
            transaction: true
          }
        })

        // Update related transaction if it exists
        if (updatedToken.transactionId) {
          const updatedTransaction = await tx.transaction.update({
            where: { id: updatedToken.transactionId },
            data: {
              status: 'COMPLETED',
              completedAt: new Date()
            }
          })

          // Update agent statistics
          await tx.agent.update({
            where: { id: agentId },
            data: {
              totalTransactions: { increment: 1 },
              totalAmount: { increment: tokenData.amount },
              // Add commission (e.g., 1% of transaction amount)
              commissionEarned: { increment: Math.round(tokenData.amount * 0.01) }
            }
          })

          return updatedTransaction
        }

        return null
      })

      // Create notifications
      await Promise.all([
        // Notify user
        prisma.notification.create({
          data: {
            userId: tokenData.userId,
            type: 'TOKEN_REDEEMED',
            title: 'Cash Collected Successfully',
            message: `Your withdrawal of UGX ${tokenData.amount.toLocaleString()} has been completed successfully.`,
            data: JSON.stringify({
              tokenId: tokenData.id,
              amount: tokenData.amount,
              redeemedAt: new Date().toISOString(),
              location
            })
          }
        })
      ])

      return {
        success: true,
        transaction: result,
        message: 'Token redeemed successfully. Cash payout completed.'
      }

    } catch (error) {
      console.error('Token redemption error:', error)
      return {
        success: false,
        message: 'Failed to redeem token'
      }
    }
  }

  /**
   * Cancel a withdrawal token (used by users to cancel pending withdrawals)
   */
  static async cancelToken(tokenId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const withdrawalToken = await prisma.withdrawalToken.findFirst({
        where: {
          id: tokenId,
          userId,
          status: WithdrawalTokenStatus.PENDING
        },
        include: {
          transaction: true
        }
      })

      if (!withdrawalToken) {
        return {
          success: false,
          message: 'Token not found or cannot be cancelled'
        }
      }

      // Update token and transaction status
      await prisma.$transaction(async (tx) => {
        await tx.withdrawalToken.update({
          where: { id: tokenId },
          data: { status: WithdrawalTokenStatus.CANCELLED }
        })

        if (withdrawalToken.transactionId) {
          await tx.transaction.update({
            where: { id: withdrawalToken.transactionId },
            data: { status: 'CANCELLED' }
          })
        }
      })

      return {
        success: true,
        message: 'Withdrawal token cancelled successfully'
      }

    } catch (error) {
      console.error('Token cancellation error:', error)
      return {
        success: false,
        message: 'Failed to cancel token'
      }
    }
  }

  /**
   * Get user's withdrawal tokens
   */
  static async getUserTokens(userId: string, limit: number = 10) {
    try {
      const tokens = await prisma.withdrawalToken.findMany({
        where: { userId },
        include: {
          transaction: {
            select: {
              id: true,
              status: true,
              createdAt: true
            }
          },
          agent: {
            select: {
              agentCode: true,
              businessName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return tokens
    } catch (error) {
      console.error('Failed to get user tokens:', error)
      return []
    }
  }

  /**
   * Get agent's handled tokens
   */
  static async getAgentTokens(agentId: string, limit: number = 20) {
    try {
      const tokens = await prisma.withdrawalToken.findMany({
        where: {
          agentId,
          status: WithdrawalTokenStatus.REDEEMED
        },
        include: {
          user: {
            select: {
              name: true,
              phone: true
            }
          },
          transaction: {
            select: {
              id: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { redeemedAt: 'desc' },
        take: limit
      })

      return tokens
    } catch (error) {
      console.error('Failed to get agent tokens:', error)
      return []
    }
  }
}
