import type { CollectionConfig, Plugin } from 'payload'

import { razorpayPlugin } from 'payload-razorpay'

const payloadPlugins: Plugin[] = [
  razorpayPlugin({
    collections: {},
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      testMode: process.env.NODE_ENV !== 'production',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    },
    webhook: {
      enabled: true,
      path: '/api/razorpay/webhook',
    },
  }),
]

export { payloadPlugins }
