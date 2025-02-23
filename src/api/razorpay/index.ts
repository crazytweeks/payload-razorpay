import type { Endpoint } from 'payload'

import { configHandler } from './config.js'
import { createPayment, verifyPayment } from './payment.js'
import { webhookHandler } from './webhook.js'

export const endpoints: Endpoint[] = [
  {
    handler: configHandler,
    method: 'get',
    path: '/razorpay/config',
  },
  {
    handler: webhookHandler,
    method: 'post',
    path: '/razorpay/webhook',
  },
  {
    handler: createPayment,
    method: 'post',
    path: '/razorpay/create-payment',
  },
  {
    handler: verifyPayment,
    method: 'post',
    path: '/razorpay/verify-payment',
  },
]
