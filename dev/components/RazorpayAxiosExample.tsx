'use client'

import { Banner } from '@payloadcms/ui'
import React, { useState } from 'react'

import { useRazorpayFetch } from '../../src/hooks/useRazorpayFetch.js'

export const RazorpayExampleComponent: React.FC = () => {
  const [amount, setAmount] = useState<number>(100) // Default ₹1.00
  const { createAndProcessPayment, error, isLoading, orderData, paymentData } = useRazorpayFetch()

  const handlePayment = async () => {
    await createAndProcessPayment({
      amount,
      currency: 'INR',
      description: 'Example Payment',
      onCancel: () => {
        console.log('Payment was cancelled')
      },
      onError: (err) => {
        console.error('Payment failed:', err)
      },
      onSuccess: (data) => {
        console.log('Payment successful!', data)
        alert(`Payment successful! Payment ID: ${data.razorpay_payment_id}`)
      },
      prefill: {
        name: 'Test Customer',
        contact: '9999999999',
        email: 'customer@example.com',
      },
      theme: {
        color: '#3399cc',
      },
    })
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Razorpay Payment Example</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
          Amount (in ₹)
        </label>
        <input
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          id="amount"
          min="1"
          onChange={(e) => setAmount(Number(e.target.value))}
          type="number"
          value={amount}
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={isLoading}
        onClick={handlePayment}
      >
        {isLoading ? 'Processing...' : `Pay ₹${amount}`}
      </button>

      {error && <Banner type="error">Error: {error}</Banner>}

      {orderData && (
        <div className="mt-4">
          <h3 className="font-bold">Order Created:</h3>
          <div className="mt-2" title="Order Data">
            <pre className="text-sm overflow-auto">{JSON.stringify(orderData, null, 2)}</pre>
          </div>
        </div>
      )}

      {paymentData && (
        <div className="mt-4">
          <h3 className="font-bold">Payment Completed:</h3>
          <div className="mt-2" title="Payment Data">
            <pre className="text-sm overflow-auto">{JSON.stringify(paymentData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default RazorpayExampleComponent
