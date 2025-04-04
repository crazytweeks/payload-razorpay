import type { PayloadRazorpayConfig, RazorpayConfig } from '../types/config'

let pluginConfig: null | PayloadRazorpayConfig = null

export const DEFAULT_WEBHOOK_PATH = '/api/razorpay/webhook'

export const defaultConfig: PayloadRazorpayConfig = {
  disabled: false,
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    testMode: process.env.NODE_ENV !== 'production',
  },
  webhook: {
    enabled: true,
    path: DEFAULT_WEBHOOK_PATH,
  },
}

export const setConfig = (config: PayloadRazorpayConfig): void => {
  pluginConfig = {
    ...defaultConfig,
    ...config,
    razorpay: {
      ...defaultConfig.razorpay,
      ...config.razorpay,
    },
    webhook: {
      ...defaultConfig.webhook,
      ...config.webhook,
    },
  }
}

export const getConfig = (): RazorpayConfig => {
  if (!pluginConfig) {
    return defaultConfig.razorpay
  }
  return pluginConfig.razorpay
}

export const getPluginConfig = (): PayloadRazorpayConfig => {
  if (!pluginConfig) {
    return defaultConfig
  }
  return pluginConfig
}
