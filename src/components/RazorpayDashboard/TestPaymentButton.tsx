import React from 'react'
import { Button } from '@payloadcms/ui'

type TestPaymentButtonProps = {
  keyId: string
}

export const TestPaymentButton: React.FC<TestPaymentButtonProps> = ({ keyId }) => {
  const [loading, setLoading] = React.useState(false)

  const handleTestPayment = async () => {
    try {
      setLoading(true)

      // Create a test payment
      const response = await fetch('/api/razorpay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // ₹100
          currency: 'INR',
          notes: {
            type: 'test_payment',
          },
        }),
      })

      const { data } = await response.json()

      if (!data?.order) {
        throw new Error('Failed to create payment')
      }

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Test Payment',
        description: 'Testing Razorpay Integration',
        order_id: data.order.id,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            alert('Payment successful!')
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#000000',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Error initiating test payment:', error)
      alert('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="test-payment">
      <h3>Test Payment</h3>
      <p>Create a test payment to verify your integration</p>
      <Button onClick={handleTestPayment} disabled={loading}>
        {loading ? 'Processing...' : 'Create Test Payment (₹100)'}
      </Button>

      <style>{`
        .test-payment {
          background: var(--theme-elevation-50);
          border-radius: 4px;
          padding: 1rem;
        }
        .test-payment h3 {
          margin: 0 0 0.5rem;
        }
        .test-payment p {
          color: var(--theme-elevation-500);
          font-size: 0.875rem;
          margin: 0 0 1rem;
        }
      `}</style>
    </div>
  )
}
