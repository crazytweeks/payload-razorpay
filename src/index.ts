import type { Config } from 'payload'

import type { PayloadRazorpayConfig } from './types/config.js'

import { endpoints } from './api/razorpay/index.js'
import { orderFields } from './collections/extensions/orders.js'
import { RazorpayRefunds } from './collections/razorpay-refunds.js'
import { RazorpayTransactions } from './collections/razorpay-transactions.js'
import { defaultConfig, setConfig } from './config/defaults.js'

export const razorpayPlugin =
  (incomingConfig: PayloadRazorpayConfig) =>
  (config: Config): Config => {
    // Initialize plugin config
    setConfig({
      ...defaultConfig,
      ...incomingConfig,
    })

    // Ensure collections exist
    if (!config.collections) {
      config.collections = []
    }

    // Add Razorpay collections
    config.collections.push(RazorpayTransactions)
    config.collections.push(RazorpayRefunds)

    // Add payment fields to order collection if specified
    const orderSlug = incomingConfig.collections?.orders?.slug
    if (orderSlug) {
      const orderCollection = config.collections.find((collection) => collection.slug === orderSlug)

      if (orderCollection) {
        if (!orderCollection.fields) {
          orderCollection.fields = []
        }
        orderCollection.fields.push(...orderFields)
      }
    }

    // Add endpoints
    if (!config.endpoints) {
      config.endpoints = []
    }

    config.endpoints.push(...endpoints)

    return config
  }

// Export types
export * from './types/config.js'
export * from './types/payment.js'
export * from './types/webhook.js'
