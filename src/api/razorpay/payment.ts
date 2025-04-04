import type { PayloadRequest } from 'payload'

import { getRazorpayInstance } from '../../lib/razorpay'
import { toRazorpayAmount } from '../../utils/currency'
import { validatePaymentVerification } from '../../utils/validation'

export const createPayment = async (req: PayloadRequest) => {
  try {
    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
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
        razorpay_payment_id: `${Math.random()}-${order.id}-123`,
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
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        success: false,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}

export const verifyPayment = async (req: PayloadRequest) => {
  try {
    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
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
          headers: { 'Content-Type': 'application/json' },
          status: 400,
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
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        success: false,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}
