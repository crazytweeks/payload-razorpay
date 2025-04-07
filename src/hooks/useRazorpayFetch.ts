import { useEffect, useState } from 'react'

type RazorpayPaymentOptions = {
  amount: number // amount in currency subunit (paise for INR)
  currency?: string // e.g., 'INR'
  customerId?: string
  description?: string
  notes?: Record<string, string>
  onCancel?: () => void
  onError?: (error: any) => void
  onSuccess?: (data: any) => void
  prefill?: {
    contact?: string
    email?: string
    name?: string
  }
  receipt?: string
  theme?: {
    color?: string
  }
}

type RazorpayPaymentResponse = {
  amount: number
  created_at: number
  currency: string
  id: string
  order_id: string
  status: string
}

type RazorpayOrderResponse = {
  amount: number
  amount_due: number
  amount_paid: number
  created_at: number
  currency: string
  id: string
  notes?: Record<string, string>
  receipt?: string
  status: string
}

type RazorpayHandlerResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayFetchHookReturn = {
  createAndProcessPayment: (options: RazorpayPaymentOptions) => Promise<void>
  error: null | string
  isLoading: boolean
  orderData: null | RazorpayOrderResponse
  paymentData: null | RazorpayPaymentResponse
  verifyPayment: (response: RazorpayHandlerResponse) => Promise<boolean>
}

/**
 * A hook to create and process Razorpay payments using native fetch
 *
 * @example
 * ```tsx
 * import { useRazorpayFetch } from 'payload-razorpay/hooks'
 *
 * const MyComponent = () => {
 *   const {
 *     createAndProcessPayment,
 *     verifyPayment,
 *     isLoading,
 *     error
 *   } = useRazorpayFetch()
 *
 *   const handlePayment = async () => {
 *     await createAndProcessPayment({
 *       amount: 1000, // ₹10.00 in paise
 *       currency: 'INR',
 *       receipt: 'order_123',
 *       description: 'Test Payment',
 *       prefill: {
 *         name: 'Customer Name',
 *         email: 'customer@example.com',
 *         contact: '9999999999'
 *       }
 *     })
 *   }
 *
 *   return (
 *     <button
 *       onClick={handlePayment}
 *       disabled={isLoading}
 *     >
 *       {isLoading ? 'Processing...' : 'Pay Now'}
 *     </button>
 *   )
 * }
 * ```
 */
export const useRazorpayFetch = (): RazorpayFetchHookReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<null | string>(null)
  const [paymentData, setPaymentData] = useState<null | RazorpayPaymentResponse>(null)
  const [orderData, setOrderData] = useState<null | RazorpayOrderResponse>(null)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    if (!window.Razorpay) {
      loadRazorpayScript().catch((err) => {
        setError(`Failed to load Razorpay script: ${err.message}`)
      })
    }
  }, [])

  // Create order and initiate payment
  const createAndProcessPayment = async (options: RazorpayPaymentOptions) => {
    try {
      setIsLoading(true)
      setError(null)

      // Get Razorpay configuration
      const configResponse = await fetch('/api/razorpay/config')
      const config = await configResponse.json()

      if (!config.isConfigured || !config.keyId) {
        throw new Error('Razorpay is not properly configured')
      }

      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order-payment', {
        body: JSON.stringify({
          amount: options.amount,
          currency: options.currency || 'INR',
          notes: options.notes,
          receipt: options.receipt,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const { order } = orderData.data
      setOrderData(order)

      // If there's no window object, we're in a non-browser environment
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK is not available')
      }

      // Initialize Razorpay checkout
      const razorpayOptions = {
        name: 'Your Store Name',
        amount: options.amount.toString(),
        currency: options.currency || 'INR',
        description: options.description || 'Purchase',
        async handler(response: RazorpayHandlerResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            })

            const verifyData = await verifyResponse.json()
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            setPaymentData(verifyData.data)

            // Call success callback if provided
            if (options.onSuccess) {
              options.onSuccess(verifyData.data)
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed')
            if (options.onError) {
              options.onError(err)
            }
          }
        },
        key: config.keyId,
        modal: {
          ondismiss() {
            setError('Payment cancelled')
            if (options.onCancel) {
              options.onCancel()
            }
          },
        },
        order_id: order.id,
        prefill: options.prefill || {},
        theme: options.theme || { color: '#F37254' },
      }

      const razorpayInstance = new window.Razorpay(razorpayOptions)
      razorpayInstance.open()
    } catch (err: any) {
      setError(err.message || 'Failed to create payment')
      if (options.onError) {
        options.onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Verify payment manually if needed
  const verifyPayment = async (response: RazorpayHandlerResponse): Promise<boolean> => {
    try {
      const verifyResponse = await fetch('/api/razorpay/verify-payment', {
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const verifyData = await verifyResponse.json()
      return verifyData.success
    } catch (err) {
      setError('Payment verification failed')
      return false
    }
  }

  return {
    createAndProcessPayment,
    error,
    isLoading,
    orderData,
    paymentData,
    verifyPayment,
  }
}

// Add TypeScript global window interface extension
declare global {
  interface Window {
    Razorpay: any
  }
}
