import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WithdrawalService } from '@/lib/withdrawal-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await WithdrawalService.getUserWithdrawalStats(session.user.id)

    if (!stats) {
      return NextResponse.json(
        { message: 'No subscription found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { stats },
      { status: 200 }
    )

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
