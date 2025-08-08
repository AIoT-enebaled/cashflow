import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    // Get a test user
    const testUser = await prisma.user.findFirst({
      where: { phone: '+256700000004' }
    })

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      testUserExists: !!testUser,
      testUserPhone: testUser?.phone || 'Not found',
      testUserVerified: testUser?.isVerified || false
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
