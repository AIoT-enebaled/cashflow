import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TokenService } from '@/lib/token-service'
import { prisma } from '@/lib/prisma'

// POST: Redeem a withdrawal token (complete cash payout)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      )
    }

    // Check if user is an agent
    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id }
    })

    if (!agent) {
      return NextResponse.json(
        { message: 'Access denied. Agent privileges required.' },
        { status: 403 }
      )
    }

    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Agent account is not active.' },
        { status: 403 }
      )
    }

    const { token, location } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required.' },
        { status: 400 }
      )
    }

    // Redeem the token
    const result = await TokenService.redeemToken(
      token,
      agent.id,
      location
    )

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      message: result.message
    }, { status: 200 })

  } catch (error) {
    console.error('Token redemption error:', error)
    return NextResponse.json(
      { message: 'Failed to redeem token.' },
      { status: 500 }
    )
  }
}
