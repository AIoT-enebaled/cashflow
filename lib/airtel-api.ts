export interface AirtelConfig {
  clientId: string
  clientSecret: string
  baseUrl: string
  environment: 'sandbox' | 'production'
}

export interface AirtelPaymentRequest {
  reference: string
  subscriber: {
    country: string
    currency: string
    msisdn: string
  }
  transaction: {
    amount: number
    country: string
    currency: string
    id: string
  }
}

export interface AirtelPaymentResponse {
  success: boolean
  transactionId?: string
  status?: string
  message?: string
  error?: string
}

export class AirtelMoneyAPI {
  private config: AirtelConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(config: AirtelConfig) {
    this.config = config
  }

  // Generate access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000))
      
      return this.accessToken
    } catch (error) {
      console.error('Airtel API Error - Access Token:', error)
      throw new Error('Failed to authenticate with Airtel API')
    }
  }

  // Request payment from customer
  async requestPayment(request: AirtelPaymentRequest): Promise<AirtelPaymentResponse> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/merchant/v1/payments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Country': request.subscriber.country,
          'X-Currency': request.subscriber.currency
        },
        body: JSON.stringify(request)
      })

      const data = await response.json()

      if (response.ok && data.status && data.status.success) {
        return {
          success: true,
          transactionId: data.data?.transaction?.id,
          status: data.data?.transaction?.status || 'PENDING',
          message: data.status.message
        }
      } else {
        return {
          success: false,
          error: data.status?.message || 'Payment request failed',
          status: 'FAILED'
        }
      }
    } catch (error) {
      console.error('Airtel API Error - Request Payment:', error)
      return {
        success: false,
        error: 'Network error occurred',
        status: 'FAILED'
      }
    }
  }

  // Check payment status
  async getPaymentStatus(transactionId: string, country: string): Promise<{
    status: string
    amount?: number
    currency?: string
    message?: string
  }> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/standard/v1/payments/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Country': country,
          'X-Currency': 'UGX'
        }
      })

      const data = await response.json()

      if (response.ok && data.status && data.status.success) {
        return {
          status: data.data?.transaction?.status || 'UNKNOWN',
          amount: data.data?.transaction?.amount,
          currency: data.data?.transaction?.currency,
          message: data.status.message
        }
      } else {
        return {
          status: 'FAILED',
          message: data.status?.message || 'Unable to check status'
        }
      }
    } catch (error) {
      console.error('Airtel API Error - Get Status:', error)
      return {
        status: 'FAILED',
        message: 'Network error'
      }
    }
  }

  // Get account balance
  async getAccountBalance(): Promise<{
    balance: number
    currency: string
  } | null> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/standard/v1/users/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Country': 'UG',
          'X-Currency': 'UGX'
        }
      })

      const data = await response.json()

      if (response.ok && data.status && data.status.success) {
        return {
          balance: data.data?.balance || 0,
          currency: data.data?.currency || 'UGX'
        }
      }

      return null
    } catch (error) {
      console.error('Airtel API Error - Get Balance:', error)
      return null
    }
  }

  // KYC verification
  async verifyKYC(msisdn: string, country: string): Promise<{
    verified: boolean
    grade?: string
    message?: string
  }> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.config.baseUrl}/standard/v1/users/${msisdn}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Country': country
        }
      })

      const data = await response.json()

      if (response.ok && data.status && data.status.success) {
        return {
          verified: data.data?.is_verified || false,
          grade: data.data?.grade,
          message: data.status.message
        }
      } else {
        return {
          verified: false,
          message: data.status?.message || 'KYC verification failed'
        }
      }
    } catch (error) {
      console.error('Airtel API Error - KYC Verification:', error)
      return {
        verified: false,
        message: 'Network error during verification'
      }
    }
  }
}

// Factory function to create Airtel API instance
export function createAirtelAPI(): AirtelMoneyAPI {
  const config: AirtelConfig = {
    clientId: process.env.AIRTEL_CLIENT_ID || '',
    clientSecret: process.env.AIRTEL_CLIENT_SECRET || '',
    baseUrl: process.env.AIRTEL_BASE_URL || 'https://openapiuat.airtel.africa',
    environment: (process.env.AIRTEL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
  }

  return new AirtelMoneyAPI(config)
}
