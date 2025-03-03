import type { CollectionConfig } from 'payload'

export type RazorpayConfig = {
  keyId: string
  keySecret: string
  testMode?: boolean
  webhookSecret?: string
}

export type WebhookConfig = {
  enabled: boolean
  path?: string
}

export type PayloadRazorpayConfig = {
  /**
   * Collections to add payment-related fields
   */
  collections: {
    orders: CollectionConfig
    products?: CollectionConfig
  }
  /**
   * Disable the plugin
   */
  disabled?: boolean
  /**
   * Razorpay API configuration
   */
  razorpay: RazorpayConfig
  /**
   * Webhook configuration
   */
  webhook: WebhookConfig
}
