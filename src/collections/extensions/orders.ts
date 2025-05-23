import type { Field } from 'payload'

export const orderFields: Field[] = [
  {
    name: 'payment',
    type: 'group',
    fields: [
      {
        name: 'status',
        type: 'select',
        defaultValue: 'pending',
        options: [
          { label: 'Created', value: 'created' },
          { label: 'Authorized', value: 'authorized' },
          { label: 'Captured', value: 'captured' },
          { label: 'Pending', value: 'pending' },
          { label: 'Paid', value: 'paid' },
          { label: 'Failed', value: 'failed' },
          { label: 'Refunded', value: 'refunded' },
        ],
        required: true,
      },
      {
        name: 'amount',
        type: 'number',
        admin: {
          description: 'Amount in smallest currency unit (paise)',
        },
        required: true,
      },
      {
        name: 'currency',
        type: 'text',
        defaultValue: 'INR',
        required: true,
      },
      {
        name: 'razorpay_order_id',
        type: 'text',
        admin: {
          description: 'Razorpay Order ID',
        },
      },
      {
        name: 'transactions',
        type: 'relationship',
        admin: {
          description: 'Related payment transactions',
        },
        hasMany: true,
        relationTo: 'razorpay-transactions',
      },
      {
        name: 'refunds',
        type: 'relationship',
        admin: {
          description: 'Related refunds',
        },
        hasMany: true,
        relationTo: 'razorpay-refunds',
      },

      {
        name: 'order_payload',
        type: 'json',
        admin: {
          description: 'Razorpay Order Payload',
        },
        required: false,
      },
    ],
  },
]
