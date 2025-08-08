// Shared subscription store for demo purposes
// In a real application, this would be in a database

export interface DemoSubscription {
  id: string
  userId: string
  tier: string
  monthlyPrice: number
  transactionLimit: number
  maxTransactionAmount: number
  overageFee: number
  transactionsUsed: number
  status: string
  createdAt: Date
  updatedAt: Date
}

class SubscriptionStore {
  private subscriptions = new Map<string, DemoSubscription>()

  get(userId: string): DemoSubscription | null {
    return this.subscriptions.get(userId) || null
  }

  set(userId: string, subscription: DemoSubscription): void {
    this.subscriptions.set(userId, subscription)
  }

  update(userId: string, updates: Partial<DemoSubscription>): DemoSubscription | null {
    const existing = this.subscriptions.get(userId)
    if (!existing) return null

    const updated = { ...existing, ...updates, updatedAt: new Date() }
    this.subscriptions.set(userId, updated)
    return updated
  }

  delete(userId: string): boolean {
    return this.subscriptions.delete(userId)
  }

  list(): DemoSubscription[] {
    return Array.from(this.subscriptions.values())
  }
}

// Singleton instance
export const subscriptionStore = new SubscriptionStore()
