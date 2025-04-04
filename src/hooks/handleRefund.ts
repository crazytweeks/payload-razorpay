import type { CollectionAfterChangeHook } from 'payload'

import { getRazorpayInstance } from '../lib/razorpay'

type RefundData = {
  amount: number
  id: number
  notes?: Record<string, string>
  payment_id: string
  receipt?: string
  speed?: 'normal' | 'optimum'
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
      notes: doc.notes,
      receipt: doc.receipt,
      speed: doc.speed || 'normal',
    })

    // Update refund record with Razorpay details
    await req.payload.update({
      id: doc.id,
      collection: 'razorpay-refunds',
      data: {
        razorpay_refund_id: refund.id,
        status: refund.status,
      },
    })

    return doc
  } catch (error: any) {
    req.payload.logger.error({
      error: error.message,
      msg: 'Error processing refund',
    })
    throw error
  }
}
