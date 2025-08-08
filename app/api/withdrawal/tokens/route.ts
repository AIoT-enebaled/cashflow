import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TokenService } from '@/lib/token-service'

// GET: Retrieve user's withdrawal tokens
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const tokens = await TokenService.getUserTokens(session.user.id, limit)

    return NextResponse.json({
      success: true,
      tokens,
      count: tokens.length
    }, { status: 200 })

  } catch (error) {
    console.error('Get user tokens error:', error)
    return NextResponse.json(
      { message: 'Failed to retrieve withdrawal tokens.' },
      { status: 500 }
    )
  }
}

// DELETE: Cancel a withdrawal token
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      )
    }

    const { tokenId } = await request.json()

    if (!tokenId) {
      return NextResponse.json(
        { message: 'Token ID is required.' },
        { status: 400 }
      )
    }

    const result = await TokenService.cancelToken(tokenId, session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message
    }, { status: 200 })

  } catch (error) {
    console.error('Cancel token error:', error)
    return NextResponse.json(
      { message: 'Failed to cancel withdrawal token.' },
      { status: 500 }
    )
  }
}
