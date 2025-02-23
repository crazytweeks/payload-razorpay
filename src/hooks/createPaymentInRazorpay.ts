import type { CollectionBeforeChangeHook } from 'payload'
import type { RazorpayOrder } from '../types/razorpay.js'

import { getRazorpayInstance } from '../lib/razorpay.js'
import { toRazorpayAmount } from '../utils/currency.js'

type OrderData = {
  id: string
  payment: {
    amount: number
    currency?: string
    notes?: Record<string, string>
    receipt?: string
    razorpay_order_id?: string
    status: string
  }
}

type RazorpayOrderCreateParams = {
  amount: number
  currency: string
  notes: Record<string, string>
  receipt: string
}

export const createPaymentInRazorpay: CollectionBeforeChangeHook<OrderData> = async ({
  data,
  operation,
  req,
}) => {
  // Only run on create
  if (operation !== 'create') {
    return data
  }

  // Skip if payment is already created
  if (data?.payment?.razorpay_order_id) {
    return data
  }

  if (!data.payment?.amount) {
    throw new Error('Payment amount is required')
  }

  try {
    const razorpay = getRazorpayInstance()
    const amountInPaise = toRazorpayAmount(data.payment.amount)

    // Create order in Razorpay
    const orderParams: RazorpayOrderCreateParams = {
      amount: amountInPaise,
      currency: 'INR', // Default to INR if not specified
      notes: {
        orderId: data.id ?? '',
        ...(data.payment?.notes || {}),
      },
      receipt: data.id ?? '', // Always use data.id as receipt
    }

    // Override currency if specified
    if (data.payment.currency) {
      orderParams.currency = data.payment.currency
    }

    const order = await razorpay.orders.create(orderParams)

    // Update data with Razorpay order details
    return {
      ...data,
      payment: {
        ...data.payment,
        razorpay_order_id: order.id,
        status: 'pending',
      },
    }
  } catch (error: any) {
    req.payload.logger.error({
      msg: 'Error creating Razorpay order',
      error: error.message,
    })
    throw error
  }
}
