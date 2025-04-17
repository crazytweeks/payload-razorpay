import type { PayloadRequest } from 'payload'

import { RazorpayOrdersCollectionSlug } from '../../collections/razorpay-orders'
import { RazorpayTransactionsCollectionSlug } from '../../collections/razorpay-transactions'
import { getRazorpayInstance } from '../../lib/razorpay'
import { toRazorpayAmount } from '../../utils/currency'
import { validatePaymentVerification } from '../../utils/validation'

export const createOrderAndPayment = async (req: PayloadRequest) => {
  try {
    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const body = await req.json()
    const { amount, currency = 'INR', notes, receipt } = body

    const razorpay = getRazorpayInstance()
    const amountInPaise = toRazorpayAmount(amount)

    const user = await req.payload
      .auth({
        headers: req.headers,
        req,
      })
      .then(({ user }) => user)

    const customerInRazorpay = await razorpay.customers.create({
      name: user?.name,
      contact: user?.phone ?? undefined,
      email: user?.email,
    })

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      customer_details: user
        ? {
            name: user.name,
            billing_address: {},
            contact: '',
            email: user.email ?? '',
            shipping_address: {},
          }
        : undefined,
      customer_id: customerInRazorpay?.id,
      notes,
      receipt,
    })

    if (!order || !order.id) {
      return new Response(
        JSON.stringify({
          error: 'Failed to create order for your transaction',
          success: false,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const paymentData = {
      id: order.id,
      amount: order.amount,
      currency,
      notes,
      order_payload: order,
      receipt,
      refunds: [],
      status: order.status,
      transaction: [],
    }
    const createdOrder = await req.payload.create({
      collection: RazorpayOrdersCollectionSlug,
      data: {
        id: order.id,
        payment: paymentData,
      },
    })

    // Create transaction record
    const transaction = await req.payload.create({
      collection: RazorpayTransactionsCollectionSlug,
      data: {
        amount: amountInPaise,
        currency,
        notes,
        order: createdOrder.id,
        razorpay_order_id: order.id,
        status: 'created',
      },
    })

    // Update order with transaction reference
    await req.payload.update({
      collection: RazorpayOrdersCollectionSlug,
      data: {
        payment: {
          transaction: [transaction.id],
        },
      },
      where: {
        id: {
          equals: createdOrder.id,
        },
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
    console.log('error: ', error)
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

const run = async () => {
  const razorpay = getRazorpayInstance()

  const user = {
    id: '20',
    name: 'Bhuvan',
    contact: undefined,
    email: 'bhuvanbm987@gmail.com',
  }

  const exists = await razorpay.customers.all().catch((err) => {
    console.log('err: not exist ', err)
    return undefined
  })

  if (exists) {
    return exists
  }

  const customerInRazorpay = await razorpay.customers.create({
    name: user?.name,
    contact: user?.contact ?? undefined,
    email: user?.email,
  })

  return customerInRazorpay
}
