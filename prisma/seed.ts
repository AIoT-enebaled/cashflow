import { PrismaClient, SubscriptionTier, UserRole, AgentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create system settings
  const systemSettings = [
    {
      key: 'app_name',
      value: 'CashFlow Connect',
      description: 'Application name'
    },
    {
      key: 'default_currency',
      value: 'UGX',
      description: 'Default currency for transactions'
    },
    {
      key: 'lite_user_fee',
      value: '7500',
      description: 'Monthly fee for Lite User tier in UGX'
    },
    {
      key: 'pro_user_fee',
      value: '25000',
      description: 'Monthly fee for Pro User tier in UGX'
    },
    {
      key: 'business_elite_fee',
      value: '60000',
      description: 'Monthly fee for Business Elite tier in UGX'
    },
    {
      key: 'over_limit_fee_percentage',
      value: '0.5',
      description: 'Percentage fee for over-limit transactions'
    }
  ]

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    })
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { phone: '+256700000001' },
    update: {},
    create: {
      phone: '+256700000001',
      email: 'admin@cashflowconnect.ug',
      name: 'System Administrator',
      role: UserRole.ADMIN,
      isVerified: true,
      kycCompleted: true,
      password: hashedPassword
    }
  })

  // Create sample business owner
  const businessOwnerPassword = await bcrypt.hash('business123', 12)
  
  const businessOwner = await prisma.user.upsert({
    where: { phone: '+256700000002' },
    update: {},
    create: {
      phone: '+256700000002',
      email: 'owner@example.com',
      name: 'John Mukasa',
      role: UserRole.BUSINESS_OWNER,
      isVerified: true,
      kycCompleted: true,
      password: businessOwnerPassword,
      businessName: 'Mukasa Enterprises',
      businessType: 'Retail',
      businessAddress: 'Kampala, Uganda'
    }
  })

  // Create subscription for business owner
  const subscription = await prisma.subscription.create({
    data: {
      userId: businessOwner.id,
      tier: SubscriptionTier.PRO_USER,
      monthlyFee: 25000,
      includedWithdrawals: 25,
      maxAmountPerWithdrawal: 300000,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }
  })

  // Create sample agent
  const agentPassword = await bcrypt.hash('agent123', 12)
  
  const agentUser = await prisma.user.create({
    data: {
      phone: '+256700000003',
      email: 'agent@example.com',
      name: 'Sarah Nakato',
      role: UserRole.AGENT,
      isVerified: true,
      kycCompleted: true,
      password: agentPassword
    }
  })

  const agent = await prisma.agent.create({
    data: {
      userId: agentUser.id,
      agentCode: 'AG001',
      status: AgentStatus.ACTIVE,
      location: 'Kampala Central',
      district: 'Kampala',
      region: 'Central',
      businessName: 'Nakato Mobile Money Services',
      contactPhone: '+256700000003',
      liquidityBalance: 5000000, // 5M UGX
      commissionRate: 0.02
    }
  })

  // Create sample regular user
  const regularUserPassword = await bcrypt.hash('user123', 12)
  
  const regularUser = await prisma.user.create({
    data: {
      phone: '+256700000004',
      email: 'user@example.com',
      name: 'Mary Namugga',
      role: UserRole.USER,
      isVerified: true,
      kycCompleted: true,
      password: regularUserPassword
    }
  })

  // Create subscription for regular user
  await prisma.subscription.create({
    data: {
      userId: regularUser.id,
      tier: SubscriptionTier.LITE_USER,
      monthlyFee: 7500,
      includedWithdrawals: 8,
      maxAmountPerWithdrawal: 75000,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }
  })

  // Create sample business
  const business = await prisma.business.create({
    data: {
      name: 'Mukasa Enterprises',
      type: 'Retail Store',
      address: 'Plot 123, Kampala Road, Kampala',
      phone: '+256700000002',
      email: 'info@mukasa.com',
      ownerId: businessOwner.id
    }
  })

  // Add business owner to business users
  await prisma.businessUser.create({
    data: {
      businessId: business.id,
      userId: businessOwner.id,
      role: 'OWNER',
      canWithdraw: true,
      maxWithdrawal: 1000000
    }
  })

  // Create sample transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: businessOwner.id,
        type: 'WITHDRAWAL',
        amount: 150000,
        status: 'COMPLETED',
        agentId: agent.id,
        agentLocation: 'Kampala Central',
        isFeeFree: true,
        withdrawalCode: 'WC001',
        description: 'Business cash withdrawal'
      },
      {
        userId: regularUser.id,
        type: 'WITHDRAWAL',
        amount: 50000,
        status: 'COMPLETED',
        agentId: agent.id,
        agentLocation: 'Kampala Central',
        isFeeFree: true,
        withdrawalCode: 'WC002',
        description: 'Personal cash withdrawal'
      },
      {
        userId: businessOwner.id,
        type: 'SUBSCRIPTION_PAYMENT',
        amount: 25000,
        status: 'COMPLETED',
        description: 'Monthly subscription payment - Pro User'
      }
    ]
  })

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: businessOwner.id,
        type: 'TRANSACTION_SUCCESS',
        title: 'Withdrawal Successful',
        message: 'Your withdrawal of UGX 150,000 has been completed successfully.'
      },
      {
        userId: regularUser.id,
        type: 'LIMIT_WARNING',
        title: 'Withdrawal Limit Warning',
        message: 'You have used 6 out of 8 free withdrawals this month.'
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@cashflowconnect.ug / admin123')
  console.log('🏢 Business owner: owner@example.com / business123')
  console.log('🏪 Agent: agent@example.com / agent123')
  console.log('👥 Regular user: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
