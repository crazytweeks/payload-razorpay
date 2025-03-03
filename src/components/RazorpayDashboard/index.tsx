import { Banner, Card } from '@payloadcms/ui'
import React from 'react'

import { useRazorpayConfig } from '../../hooks/useRazorpayConfig'
import { TestPaymentButton } from './TestPaymentButton'
import { WebhookStatus } from './WebhookStatus'
import './styles.scss'

export const RazorpayDashboard: React.FC = () => {
  const { data: config, error, isLoading } = useRazorpayConfig()

  if (isLoading) {
    return <div>Loading Razorpay configuration...</div>
  }

  if (error) {
    return <Banner type="error">Error loading Razorpay configuration: {error.message}</Banner>
  }

  if (!config?.isConfigured) {
    return (
      <Banner type="error">
        <strong>Razorpay is not configured</strong>
        <p>Please set up your Razorpay API credentials in the environment variables:</p>
        <ul>
          <li>RAZORPAY_KEY_ID</li>
          <li>RAZORPAY_KEY_SECRET</li>
          <li>RAZORPAY_WEBHOOK_SECRET (optional)</li>
        </ul>
      </Banner>
    )
  }

  return (
    <div className="razorpay-dashboard">
      <div>
        <h2>Razorpay Integration</h2>

        <div className="razorpay-dashboard__grid">
          <div className="razorpay-dashboard__section">
            <Banner type={config.testMode ? 'error' : 'success'}>
              <strong>Mode: </strong>
              {config.testMode ? 'Test' : 'Production'}
            </Banner>

            <WebhookStatus enabled={config.webhookEnabled} path={config.webhookPath} />
          </div>

          {config.testMode && (
            <div className="razorpay-dashboard__section">
              <TestPaymentButton keyId={config.keyId ?? ''} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
