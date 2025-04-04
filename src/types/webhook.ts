export type WebhookEventType =
  | 'order.paid'
  | 'payment.authorized'
  | 'payment.captured'
  | 'payment.failed'
  | 'refund.failed'
  | 'refund.processed'

export type WebhookPaymentEvent = {
  amount: number
  contact: string
  currency: string
  description: string
  email: string
  entity: string
  error_code?: string
  error_description?: string
  error_reason?: string
  error_source?: string
  id: string
  method: string
  order_id: string
  status: string
}

export type WebhookRefundEvent = {
  amount: number
  currency: string
  entity: string
  id: string
  payment_id: string
  speed_processed: string
  speed_requested: string
  status: string
}

export type WebhookEvent = {
  account_id: string
  contains: string[]
  created_at: number
  entity: string
  event: WebhookEventType
  payload: {
    order?: {
      amount: number
      currency: string
      entity: string
      id: string
      receipt?: string
      status: string
    }
    payment?: WebhookPaymentEvent
    refund?: WebhookRefundEvent
  }
}
