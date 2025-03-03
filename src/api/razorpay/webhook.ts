import type { PayloadRequest } from 'payload'

import type { WebhookEvent } from '../../types/webhook'

import { validateWebhookSignature } from '../../utils/validation'

export const webhookHandler = async (req: PayloadRequest) => {
  try {
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature || typeof signature !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!req.json) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const body = await req.json()
    // Validate webhook signature
    const rawBody = JSON.stringify(body)
    const isValid = validateWebhookSignature(rawBody, signature)

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const event = body as WebhookEvent

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(req.payload, event)
        break
      case 'payment.failed':
        await handlePaymentFailed(req.payload, event)
        break
      case 'refund.processed':
        await handleRefundProcessed(req.payload, event)
        break
      // Add more event handlers as needed
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
}

async function handlePaymentCaptured(payload: PayloadRequest['payload'], event: WebhookEvent) {
  const { payment } = event.payload
  if (!payment) {
    return
  }

  await payload.update({
    collection: 'razorpay-transactions',
    data: {
      method: payment.method,
      status: 'captured',
    },
    where: {
      razorpay_payment_id: {
        equals: payment.id,
      },
    },
  })
}

async function handlePaymentFailed(payload: PayloadRequest['payload'], event: WebhookEvent) {
  const { payment } = event.payload
  if (!payment) {
    return
  }

  await payload.update({
    collection: 'razorpay-transactions',
    data: {
      error: {
        code: payment.error_code,
        description: payment.error_description,
        reason: payment.error_reason,
        source: payment.error_source,
      },
      status: 'failed',
    },
    where: {
      razorpay_payment_id: {
        equals: payment.id,
      },
    },
  })
}

async function handleRefundProcessed(payload: PayloadRequest['payload'], event: WebhookEvent) {
  const { refund } = event.payload
  if (!refund) {
    return
  }

  await payload.update({
    collection: 'razorpay-refunds',
    data: {
      status: 'processed',
    },
    where: {
      razorpay_refund_id: {
        equals: refund.id,
      },
    },
  })
}
