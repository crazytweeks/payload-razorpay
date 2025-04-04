'use client'
import { Banner, Button, ErrorIcon, useConfig, useTheme } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type ConfigStatus = {
  isConfigured: boolean
  keyId?: string
  testMode: boolean
}

export const BeforeDashboardClient = () => {
  const { theme } = useTheme()
  const { config } = useConfig()
  const [configStatus, setConfigStatus] = useState<ConfigStatus>()
  const [message, setMessage] = useState('')

  const backgroundColor = theme === 'dark' ? '#333' : '#f7f7f7'
  const textColor = theme === 'dark' ? '#fff' : '#000'

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch(`${config.serverURL}${config.routes.api}/razorpay/config`)
      const result = await response.json()
      setConfigStatus(result)
    }

    void fetchConfig()
  }, [config.serverURL, config.routes.api])

  const handleTestPayment = () => {
    if (!configStatus?.keyId) {
      return
    }

    const options = {
      name: 'Test Payment',
      amount: 100 * 100, // Amount in paise (100 INR)
      currency: 'INR',
      description: 'Test Payment Description',
      handler(response: any) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id)
      },
      key: configStatus.keyId,
      prefill: {
        email: 'test@example.com',
      },
      theme: {
        color: '#000000',
      },
    }

    const razorpayInstance = new (window as any).Razorpay(options)
    razorpayInstance.open()
  }

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: '4px',
        color: textColor,
        margin: '10px 0',
        padding: '20px',
      }}
    >
      <h2 style={{ color: textColor }}>Razorpay Plugin Status</h2>

      {configStatus && (
        <div style={{ marginBottom: '20px' }}>
          <Banner className={configStatus.isConfigured ? 'bg-green-400' : 'bg-pink-500'}>
            <strong>Status: </strong>
            {configStatus.isConfigured ? (
              <>
                Configured{' '}
                <span aria-label="checkmark" role="img">
                  ✅
                </span>
              </>
            ) : (
              <>
                Not Configured <ErrorIcon />
              </>
            )}
          </Banner>

          {configStatus.testMode && (
            <div
              style={{
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                marginBottom: '10px',
                padding: '10px',
              }}
            >
              <span aria-label="wrench" role="img">
                🔧
              </span>{' '}
              Running in Test Mode
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button disabled={!configStatus?.isConfigured} onClick={handleTestPayment}>
          Test Payment (₹100)
        </Button>
      </div>

      {!configStatus?.isConfigured && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <span aria-label="warning" role="img">
            ⚠️
          </span>{' '}
          Please configure Razorpay API credentials in your environment variables
        </div>
      )}
    </div>
  )
}
