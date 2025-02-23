import type { CollectionAfterChangeHook } from 'payload'

import { getRazorpayInstance } from '../lib/razorpay.js'

type RefundData = {
  id: number
  payment_id: string
  amount: number
  speed?: 'normal' | 'optimum'
  notes?: Record<string, string>
  receipt?: string
}

export const handleRefund: CollectionAfterChangeHook<RefundData> = async ({
  doc,
  operation,
  req,
}) => {
  // Only run on create
  if (operation !== 'create') {
    return doc
  }

  try {
    const razorpay = getRazorpayInstance()

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(doc.payment_id, {
      amount: doc.amount,
      speed: doc.speed || 'normal',
      notes: doc.notes,
      receipt: doc.receipt,
    })

    // Update refund record with Razorpay details
    await req.payload.update({
      collection: 'razorpay-refunds',
      id: doc.id,
      data: {
        razorpay_refund_id: refund.id,
        status: refund.status,
      },
    })

    return doc
  } catch (error: any) {
    req.payload.logger.error({
      msg: 'Error processing refund',
      error: error.message,
    })
    throw error
  }
}
