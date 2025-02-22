import Razorpay from 'razorpay'

import type { RazorpayConfig } from '../types/config.js'

import { getConfig } from '../config/defaults.js'

let razorpayInstance: null | Razorpay = null

export const initializeRazorpay = (config: RazorpayConfig): Razorpay => {
  if (!config.keyId || !config.keySecret) {
    throw new Error('Razorpay API credentials are required')
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    })
  }

  return razorpayInstance
}

export const getRazorpayInstance = (): Razorpay => {
  if (!razorpayInstance) {
    const config = getConfig()
    razorpayInstance = initializeRazorpay(config)
  }
  return razorpayInstance
}

export const resetRazorpayInstance = (): void => {
  razorpayInstance = null
}
