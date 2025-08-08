import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { subscriptionStore } from '@/lib/subscription-store'

// Mock withdrawal token generation
const generateWithdrawalToken = () => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const generateQRCode = (data: string) => {
  // Mock QR code data - in real app, this would generate actual QR code
  return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black" font-size="12">${data}</text></svg>`).toString('base64')}`
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

    const { amount, agentId, agentLocation } = await request.json()

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Please enter a valid withdrawal amount.' },
        { status: 400 }
      )
    }

    // Get user's subscription
    const subscription = subscriptionStore.get(session.user.id)
    
    if (!subscription) {
      return NextResponse.json(
        { message: 'No active subscription found. Please subscribe to a plan.' },
        { status: 400 }
      )
    }

    // Generate withdrawal token
    const token = generateWithdrawalToken()
    const qrCode = generateQRCode(token)
    
    // Create mock transaction
    const transaction = {
      id: `tx_${Date.now()}`,
      userId: session.user.id,
      type: 'WITHDRAWAL',
      amount,
      fee: 0, // Calculate based on subscription
      totalAmount: amount,
      status: 'PENDING',
      reference: token,
      createdAt: new Date()
    }

    // Create mock withdrawal token
    const withdrawalToken = {
      id: `token_${Date.now()}`,
      userId: session.user.id,
      token,
      qrCode,
      amount,
      status: 'PENDING',
      transactionId: transaction.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      createdAt: new Date()
    }

    // Update subscription usage if it's a free withdrawal
    if (subscription.transactionsUsed < subscription.transactionLimit) {
      subscriptionStore.update(session.user.id, {
        transactionsUsed: subscription.transactionsUsed + 1
      })
    }

    return NextResponse.json(
      { 
        message: `Withdrawal of UGX ${amount.toLocaleString()} processed successfully. Withdrawal token generated.`,
        transaction,
        token: withdrawalToken
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Withdrawal processing error:', error)
    return NextResponse.json(
      { message: 'Failed to process withdrawal. Please try again.' },
      { status: 500 }
    )
  }
}
