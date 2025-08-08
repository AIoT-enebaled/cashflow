import { createMTNAPI, MTNPaymentRequest, MTNPaymentResponse } from './mtn-api'
import { createAirtelAPI, AirtelPaymentRequest, AirtelPaymentResponse } from './airtel-api'

export type MobileMoneyProvider = 'MTN' | 'AIRTEL'

export interface UnifiedPaymentRequest {
  provider: MobileMoneyProvider
  phoneNumber: string
  amount: number
  currency: string
  reference: string
  description: string
}

export interface UnifiedPaymentResponse {
  success: boolean
  provider: MobileMoneyProvider
  transactionId?: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
  message: string
  error?: string
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'UNKNOWN'
  amount?: number
  currency?: string
  message?: string
  provider: MobileMoneyProvider
}

export class MobileMoneyService {
  private mtnAPI = createMTNAPI()
  private airtelAPI = createAirtelAPI()

  // Detect provider from phone number
  static detectProvider(phoneNumber: string): MobileMoneyProvider | null {
    // Remove country code and special characters
    const cleanNumber = phoneNumber.replace(/[\s+\-()]/g, '')
    
    // MTN Uganda prefixes: 077, 078, 076, 039
    const mtnPrefixes = ['077', '078', '076', '039', '256077', '256078', '256076', '256039']
    
    // Airtel Uganda prefixes: 070, 075, 074
    const airtelPrefixes = ['070', '075', '074', '256070', '256075', '256074']
    
    for (const prefix of mtnPrefixes) {
      if (cleanNumber.startsWith(prefix)) {
        return 'MTN'
      }
    }
    
    for (const prefix of airtelPrefixes) {
      if (cleanNumber.startsWith(prefix)) {
        return 'AIRTEL'
      }
    }
    
    return null
  }

  // Format phone number for APIs
  private formatPhoneNumber(phoneNumber: string, provider: MobileMoneyProvider): string {
    let cleanNumber = phoneNumber.replace(/[\s+\-()]/g, '')
    
    // Remove Uganda country code if present
    if (cleanNumber.startsWith('256')) {
      cleanNumber = cleanNumber.substring(3)
    }
    
    // Ensure it starts with 0
    if (!cleanNumber.startsWith('0')) {
      cleanNumber = '0' + cleanNumber
    }
    
    // Convert to international format for APIs
    return '256' + cleanNumber.substring(1)
  }

  // Process payment request
  async requestPayment(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber, request.provider)

      if (request.provider === 'MTN') {
        return await this.processMTNPayment(request, formattedPhone)
      } else if (request.provider === 'AIRTEL') {
        return await this.processAirtelPayment(request, formattedPhone)
      } else {
        return {
          success: false,
          provider: request.provider,
          status: 'FAILED',
          message: 'Unsupported mobile money provider',
          error: 'UNSUPPORTED_PROVIDER'
        }
      }
    } catch (error) {
      console.error('Mobile Money Service Error:', error)
      return {
        success: false,
        provider: request.provider,
        status: 'FAILED',
        message: 'Service temporarily unavailable',
        error: 'SERVICE_ERROR'
      }
    }
  }

  // Process MTN payment
  private async processMTNPayment(
    request: UnifiedPaymentRequest, 
    formattedPhone: string
  ): Promise<UnifiedPaymentResponse> {
    const mtnRequest: MTNPaymentRequest = {
      amount: request.amount.toString(),
      currency: request.currency,
      externalId: request.reference,
      payer: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone
      },
      payerMessage: request.description,
      payeeNote: `Payment for ${request.description}`
    }

    const response = await this.mtnAPI.requestPayment(mtnRequest)

    return {
      success: response.success,
      provider: 'MTN',
      transactionId: response.transactionId,
      status: this.mapMTNStatus(response.status || 'FAILED'),
      message: response.success 
        ? 'Payment request sent to your MTN Mobile Money account' 
        : response.error || 'Payment request failed',
      error: response.error
    }
  }

  // Process Airtel payment
  private async processAirtelPayment(
    request: UnifiedPaymentRequest, 
    formattedPhone: string
  ): Promise<UnifiedPaymentResponse> {
    const airtelRequest: AirtelPaymentRequest = {
      reference: request.reference,
      subscriber: {
        country: 'UG',
        currency: request.currency,
        msisdn: formattedPhone
      },
      transaction: {
        amount: request.amount,
        country: 'UG',
        currency: request.currency,
        id: request.reference
      }
    }

    const response = await this.airtelAPI.requestPayment(airtelRequest)

    return {
      success: response.success,
      provider: 'AIRTEL',
      transactionId: response.transactionId,
      status: this.mapAirtelStatus(response.status || 'FAILED'),
      message: response.success 
        ? 'Payment request sent to your Airtel Money account' 
        : response.error || 'Payment request failed',
      error: response.error
    }
  }

  // Check payment status
  async getPaymentStatus(
    transactionId: string, 
    provider: MobileMoneyProvider
  ): Promise<PaymentStatusResponse> {
    try {
      if (provider === 'MTN') {
        const status = await this.mtnAPI.getPaymentStatus(transactionId)
        return {
          status: this.mapMTNStatus(status.status),
          amount: status.amount ? parseFloat(status.amount) : undefined,
          currency: status.currency,
          message: status.reason,
          provider: 'MTN'
        }
      } else if (provider === 'AIRTEL') {
        const status = await this.airtelAPI.getPaymentStatus(transactionId, 'UG')
        return {
          status: this.mapAirtelStatus(status.status),
          amount: status.amount,
          currency: status.currency,
          message: status.message,
          provider: 'AIRTEL'
        }
      } else {
        return {
          status: 'UNKNOWN',
          message: 'Unsupported provider',
          provider
        }
      }
    } catch (error) {
      console.error('Payment Status Error:', error)
      return {
        status: 'UNKNOWN',
        message: 'Unable to check payment status',
        provider
      }
    }
  }

  // Validate account holder
  async validateAccount(phoneNumber: string, provider: MobileMoneyProvider): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber, provider)

      if (provider === 'MTN') {
        return await this.mtnAPI.validateAccountHolder(formattedPhone)
      } else if (provider === 'AIRTEL') {
        const kyc = await this.airtelAPI.verifyKYC(formattedPhone, 'UG')
        return kyc.verified
      }

      return false
    } catch (error) {
      console.error('Account Validation Error:', error)
      return false
    }
  }

  // Map MTN status to unified status
  private mapMTNStatus(status: string): 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
        return 'SUCCESSFUL'
      case 'pending':
        return 'PENDING'
      case 'cancelled':
        return 'CANCELLED'
      case 'failed':
      case 'timeout':
      default:
        return 'FAILED'
    }
  }

  // Map Airtel status to unified status
  private mapAirtelStatus(status: string): 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' {
    switch (status?.toLowerCase()) {
      case 'ts':
      case 'successful':
      case 'success':
        return 'SUCCESSFUL'
      case 'tp':
      case 'pending':
        return 'PENDING'
      case 'tc':
      case 'cancelled':
        return 'CANCELLED'
      case 'tf':
      case 'failed':
      case 'timeout':
      default:
        return 'FAILED'
    }
  }

  // Get service health
  async getServiceHealth(): Promise<{
    mtn: boolean
    airtel: boolean
    overall: boolean
  }> {
    try {
      const [mtnHealth, airtelHealth] = await Promise.allSettled([
        this.mtnAPI.getAccountBalance(),
        this.airtelAPI.getAccountBalance()
      ])

      const mtnHealthy = mtnHealth.status === 'fulfilled' && mtnHealth.value !== null
      const airtelHealthy = airtelHealth.status === 'fulfilled' && airtelHealth.value !== null

      return {
        mtn: mtnHealthy,
        airtel: airtelHealthy,
        overall: mtnHealthy || airtelHealthy
      }
    } catch (error) {
      return {
        mtn: false,
        airtel: false,
        overall: false
      }
    }
  }
}

// Export singleton instance
export const mobileMoneyService = new MobileMoneyService()
