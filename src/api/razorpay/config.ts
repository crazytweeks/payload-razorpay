import type { PayloadRequest } from 'payload'

import { getPluginConfig } from '../../config/defaults.js'

export const configHandler = async (req: PayloadRequest) => {
  const config = getPluginConfig()

  // Check if Razorpay is properly configured
  const isConfigured = Boolean(
    config.razorpay.keyId && config.razorpay.keySecret && !config.disabled,
  )

  return new Response(
    JSON.stringify({
      isConfigured,
      keyId: isConfigured ? config.razorpay.keyId : undefined,
      testMode: config.razorpay.testMode,
      webhookEnabled: config.webhook.enabled,
      webhookPath: config.webhook.path,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
