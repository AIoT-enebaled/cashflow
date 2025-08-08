import { v4 as uuidv4 } from 'uuid'

export interface MTNConfig {
  subscriptionKey: string
  apiUser: string
  apiKey: string
  baseUrl: string
  environment: 'sandbox' | 'production'
}

export interface MTNPaymentRequest {
  amount: string
  currency: string
  externalId: string
  payer: {
    partyIdType: 'MSISDN'
    partyId: string
  }
  payerMessage: string
  payeeNote: string
}

export interface MTNPaymentResponse {
  success: boolean
  transactionId?: string
  status?: string
  reason?: string
  error?: string
}

export class MTNMobileMoneyAPI {
  private config: MTNConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(config: MTNConfig) {
    this.config = config
  }

  // Generate access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const credentials = Buffer.from(`${this.config.apiUser}:${this.config.apiKey}`).toString('base64')
      
      const response = await fetch(`${this.config.baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000))
      
      return this.accessToken
    } catch (error) {
      console.error('MTN API Error - Access Token:', error)
      throw new Error('Failed to authenticate with MTN API')
    }
  }

  // Request payment from customer
  async requestPayment(request: MTNPaymentRequest): Promise<MTNPaymentResponse> {
    try {
      const accessToken = await this.getAccessToken()
      const referenceId = uuidv4()

      const response = await fetch(`${this.config.baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': this.config.environment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (response.ok) {
        return {
          success: true,
          transactionId: referenceId,
          status: 'PENDING'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Payment request failed',
          reason: errorData.code
        }
      }
    } catch (error) {
      console.error('MTN API Error - Request Payment:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  // Check payment status
  async getPaymentStatus(transactionId: string): Promise<{
    status: string
    amount?: string
    currency?: string
    reason?: string
  }> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/collection/v1_0/requesttopay/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.config.environment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
        }
      })

      if (response.ok) {
        const data = await response.json()
        return {
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          reason: data.reason
        }
      } else {
        return {
          status: 'FAILED',
          reason: 'Unable to check status'
        }
      }
    } catch (error) {
      console.error('MTN API Error - Get Status:', error)
      return {
        status: 'FAILED',
        reason: 'Network error'
      }
    }
  }

  // Get account balance
  async getAccountBalance(): Promise<{
    availableBalance: string
    currency: string
  } | null> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/collection/v1_0/account/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.config.environment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
        }
      })

      if (response.ok) {
        const data = await response.json()
        return {
          availableBalance: data.availableBalance,
          currency: data.currency
        }
      }

      return null
    } catch (error) {
      console.error('MTN API Error - Get Balance:', error)
      return null
    }
  }

  // Validate account holder
  async validateAccountHolder(phoneNumber: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/collection/v1_0/accountholder/msisdn/${phoneNumber}/active`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': this.config.environment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
        }
      })

      return response.ok
    } catch (error) {
      console.error('MTN API Error - Validate Account:', error)
      return false
    }
  }
}

// Factory function to create MTN API instance
export function createMTNAPI(): MTNMobileMoneyAPI {
  const config: MTNConfig = {
    subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY || '',
    apiUser: process.env.MTN_API_USER || '',
    apiKey: process.env.MTN_API_KEY || '',
    baseUrl: process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
    environment: (process.env.MTN_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
  }

  return new MTNMobileMoneyAPI(config)
}
