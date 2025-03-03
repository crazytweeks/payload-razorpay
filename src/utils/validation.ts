import * as crypto from 'node:crypto'

import { getPluginConfig } from '../config/defaults'

export const validateWebhookSignature = (body: string, signature: string): boolean => {
  const config = getPluginConfig()
  const webhookSecret = config.razorpay.webhookSecret

  if (!webhookSecret) {
    throw new Error('Webhook secret is not configured')
  }

  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export const validatePaymentVerification = ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): boolean => {
  const config = getPluginConfig()
  const secret = config.razorpay.keySecret

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return expectedSignature === signature
}
