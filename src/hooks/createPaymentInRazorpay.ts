import type { CollectionBeforeChangeHook } from 'payload'

import { getRazorpayInstance } from '../lib/razorpay'
import { toRazorpayAmount } from '../utils/currency'

type OrderData = {
  id: string
  payment: {
    amount: number
    currency?: string
    notes?: Record<string, string>
    razorpay_order_id?: string
    receipt?: string
    status: string
  }
}

type RazorpayOrderCreateParams = {
  amount: number
  currency: string
  notes: Record<string, string>
  receipt: string
}

/**
 * A hook to automatically create a Razorpay order when a new order document is created.
 * This hook runs before a document is created in your orders collection and creates a corresponding order in Razorpay.
 *
 * @example
 * ```typescript
 * import { createPaymentInRazorpay } from '@payloadcms/plugin-razorpay/hooks';
 *
 * // In your orders collection config:
 * export const Orders: CollectionConfig = {
 *   slug: 'orders',
 *   hooks: {
 *     beforeChange: [createPaymentInRazorpay],
 *   },
 *   fields: [
 *     {
 *       name: 'payment',
 *       type: 'group',
 *       fields: [
 *         {
 *           name: 'amount',
 *           type: 'number',
 *           required: true,
 *         },
 *         {
 *           name: 'currency',
 *           type: 'text',
 *           defaultValue: 'INR',
 *         },
 *         {
 *           name: 'notes',
 *           type: 'json',
 *         },
 *         {
 *           name: 'razorpay_order_id',
 *           type: 'text',
 *           admin: {
 *             readOnly: true,
 *           },
 *         },
 *         {
 *           name: 'status',
 *           type: 'text',
 *           admin: {
 *             readOnly: true,
 *           },
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 *
 * The hook requires the following data structure in your order document:
 * - payment.amount: number (required) - The amount to charge in your currency's base unit (e.g. rupees)
 * - payment.currency: string (optional) - The currency code (e.g. 'INR'). Defaults to 'INR'
 * - payment.notes: object (optional) - Additional notes to attach to the Razorpay order
 *
 * The hook will:
 * 1. Convert the amount to paise (1 rupee = 100 paise)
 * 2. Create a Razorpay order with the specified amount and details
 * 3. Store the Razorpay order ID in payment.razorpay_order_id
 * 4. Set the payment status to 'pending'
 *
 * @param {Object} args Hook arguments from Payload
 * @param {OrderData} args.data The order data being created/updated
 * @param {string} args.operation The current operation ('create' or 'update')
 * @param {PayloadRequest} args.req The Payload request object
 *
 * @returns {Promise<OrderData>} The modified order data with Razorpay details
 * @throws {Error} If payment amount is missing or Razorpay order creation fails
 */
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
      currency: data.payment.currency || 'INR',
      notes: {
        orderId: data.id ?? '',
        ...(data.payment?.notes || {}),
      },
      receipt: data.payment.receipt || data.id || '',
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
      error: error.message,
      msg: 'Error creating Razorpay order',
    })
    throw error
  }
}
