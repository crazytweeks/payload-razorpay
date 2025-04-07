import { type PayloadRequest } from 'payload'
import Razorpay from 'razorpay'

import type { WebhookEvent } from '../../types/webhook'

import { __RazorpayLogsCollectionSlug } from '../../collections/razorpay-logs'
import { _PLUGIN_WEBHOOK_SECRET } from '../../config/constants'

export const webhookHandler = async (req: PayloadRequest) => {
  try {
    const signature = req.headers.get('x-razorpay-signature')

    if (!_PLUGIN_WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Missing webhook secret' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

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

    const isValid = Razorpay.validateWebhookSignature(rawBody, signature, _PLUGIN_WEBHOOK_SECRET)

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const event = body as WebhookEvent

    await handleLogWebhook(req.payload, event)
    // Handle different event types
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(req.payload, event)
        break
      case 'payment.captured':
        await handlePaymentCaptured(req.payload, event)
        break
      case 'payment.failed':
        await handlePaymentFailed(req.payload, event)
        break
      case 'refund.processed':
        await handleRefundProcessed(req.payload, event)
        break
      default:
        await handleEverythingElse(req.payload, event)
        break
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

const handlePaymentAuthorized = async (payload: PayloadRequest['payload'], event: WebhookEvent) => {
  const { payment } = event.payload
  if (!payment) {
    return
  }

  await payload.update({
    collection: 'razorpay-transactions',
    data: {
      method: payment.method,
      status: 'authorized',
    },
    where: {
      razorpay_payment_id: {
        equals: payment.id,
      },
    },
  })
}

const handleEverythingElse = async (payload: PayloadRequest['payload'], event: WebhookEvent) => {
  const { payment } = event.payload
  if (!payment) {
    return
  }

  await payload.update({
    collection: 'razorpay-transactions',
    data: {
      method: payment.method,
      status: 'unknown',
    },
    where: {
      razorpay_payment_id: {
        equals: payment.id,
      },
    },
  })
}

const handleLogWebhook = async (payload: PayloadRequest['payload'], event: WebhookEvent) => {
  try {
    await payload.create({
      collection: __RazorpayLogsCollectionSlug,
      data: {
        event: event.event,
        payload: event.payload,
      },
    })
  } catch (error) {
    console.error('Error logging webhook:', error)

    return new Response(JSON.stringify({ error: 'Error logging webhook' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

export { handleEverythingElse, handlePaymentAuthorized }
