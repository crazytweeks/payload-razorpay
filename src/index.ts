import type { Config } from 'payload'

import type { PayloadRazorpayConfig } from './types/config'

import { endpoints } from './api/razorpay/index'
import { RazorpayLogs } from './collections/razorpay-logs'
import { RazorpayOrders } from './collections/razorpay-orders'
import { RazorpayRefunds } from './collections/razorpay-refunds'
import { RazorpayTransactions } from './collections/razorpay-transactions'
import { setConfig } from './config/defaults'

export const razorpayPlugin =
  (incomingConfig: PayloadRazorpayConfig) =>
  (config: Config): Config => {
    // Initialize plugin config
    setConfig({
      ...incomingConfig,
    })
    // Ensure collections exist
    if (!config.collections) {
      config.collections = []
    }

    // Add Razorpay collections
    config.collections.push(RazorpayOrders)
    config.collections.push(RazorpayTransactions)
    config.collections.push(RazorpayRefunds)
    config.collections.push(RazorpayLogs)

    config.endpoints = endpoints

    return config
  }

// Export types
export * from './types/config'
export * from './types/payment'
export * from './types/webhook'
