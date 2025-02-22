export type PaymentStatus = 'authorized' | 'captured' | 'created' | 'failed' | 'refunded'

export type PaymentMethod = 'card' | 'emi' | 'netbanking' | 'other' | 'upi' | 'wallet'

export type PaymentCreateOptions = {
  amount: number
  currency?: string
  customerId?: string
  notes?: Record<string, string>
  orderId?: string
  receipt?: string
}

export type PaymentVerificationData = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export type RefundCreateOptions = {
  amount?: number
  notes?: Record<string, string>
  paymentId: string
  receipt?: string
  speed?: 'normal' | 'optimum'
}

export type PaymentResponse = {
  data?: any
  error?: any
  message: string
  success: boolean
}
