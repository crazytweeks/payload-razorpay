import type { PayloadRequest } from 'payload'

import { getRazorpayInstance } from '../../lib/razorpay.js'
import { toRazorpayAmount } from '../../utils/currency.js'
import { validatePaymentVerification } from '../../utils/validation.js'

export const createPayment = async (req: PayloadRequest) => {
  try {
    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { amount, currency = 'INR', notes, orderId, receipt } = body

    const razorpay = getRazorpayInstance()
    const amountInPaise = toRazorpayAmount(amount)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      notes,
      receipt,
    })

    // Create transaction record
    const transaction = await req.payload.create({
      collection: 'razorpay-transactions',
      data: {
        amount: amountInPaise,
        currency,
        notes,
        order: orderId,
        razorpay_order_id: order.id,
        status: 'created',
      },
    })

    return new Response(
      JSON.stringify({
        data: {
          order,
          transaction,
        },
        success: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

export const verifyPayment = async (req: PayloadRequest) => {
  try {
    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    const isValid = validatePaymentVerification({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid payment signature',
          success: false,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Update transaction status
    const transaction = await req.payload.update({
      collection: 'razorpay-transactions',
      data: {
        razorpay_payment_id,
        status: 'authorized',
      },
      where: {
        razorpay_order_id: {
          equals: razorpay_order_id,
        },
      },
    })

    return new Response(
      JSON.stringify({
        data: transaction,
        success: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
