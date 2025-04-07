import type { Endpoint } from 'payload'

import { configHandler } from './config'
import { createOrderAndPayment, verifyPayment } from './payment'
import { webhookHandler } from './webhook'

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
    handler: createOrderAndPayment,
    method: 'post',
    path: '/razorpay/create-order-payment',
  },
  {
    handler: verifyPayment,
    method: 'post',
    path: '/razorpay/verify-payment',
  },
]
