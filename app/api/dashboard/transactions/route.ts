import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        agent: true
      }
    })

    return NextResponse.json(
      { transactions },
      { status: 200 }
    )

  } catch (error) {
    console.error('Dashboard transactions error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
