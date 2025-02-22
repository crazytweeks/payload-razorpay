import type { CollectionConfig } from 'payload'

export const RazorpayRefunds: CollectionConfig = {
  slug: 'razorpay-refunds',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['razorpay_refund_id', 'amount', 'status', 'createdAt'],
    group: 'Razorpay',
    useAsTitle: 'razorpay_refund_id',
  },
  fields: [
    {
      name: 'razorpay_refund_id',
      type: 'text',
      admin: {
        description: 'Razorpay Refund ID',
      },
      required: true,
      unique: true,
    },
    {
      name: 'razorpay_payment_id',
      type: 'text',
      admin: {
        description: 'Original Payment ID',
      },
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      admin: {
        description: 'Refund amount in smallest currency unit (paise)',
      },
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processed', value: 'processed' },
        { label: 'Failed', value: 'failed' },
      ],
      required: true,
    },
    {
      name: 'speed',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Optimum', value: 'optimum' },
      ],
      required: true,
    },
    {
      name: 'receipt',
      type: 'text',
    },
    {
      name: 'transaction',
      type: 'relationship',
      admin: {
        description: 'Related transaction',
      },
      relationTo: 'razorpay-transactions',
      required: true,
    },
    {
      name: 'notes',
      type: 'json',
      admin: {
        description: 'Additional notes or metadata',
      },
    },
    {
      name: 'error',
      type: 'group',
      admin: {
        condition: (data) => data?.status === 'failed',
      },
      fields: [
        {
          name: 'code',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'source',
          type: 'text',
        },
        {
          name: 'reason',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}
