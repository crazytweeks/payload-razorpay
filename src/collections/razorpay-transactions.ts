import type { CollectionConfig } from 'payload'

export const RazorpayTransactions: CollectionConfig = {
  slug: 'razorpay-transactions',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['razorpay_payment_id', 'amount', 'status', 'createdAt'],
    group: 'Razorpay',
    useAsTitle: 'razorpay_payment_id',
  },
  fields: [
    {
      name: 'razorpay_payment_id',
      type: 'text',
      admin: {
        description: 'Razorpay Payment ID',
      },
      required: true,
      unique: true,
    },
    {
      name: 'razorpay_order_id',
      type: 'text',
      admin: {
        description: 'Razorpay Order ID',
      },
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
      name: 'status',
      type: 'select',
      defaultValue: 'created',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Authorized', value: 'authorized' },
        { label: 'Captured', value: 'captured' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      required: true,
    },
    {
      name: 'method',
      type: 'select',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'NetBanking', value: 'netbanking' },
        { label: 'UPI', value: 'upi' },
        { label: 'Wallet', value: 'wallet' },
        { label: 'EMI', value: 'emi' },
      ],
    },
    // {
    //   name: 'order',
    //   type: 'relationship',
    //   admin: {
    //     description: 'Related order',
    //   },
    //   relationTo: 'orders',
    // },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'contact',
          type: 'text',
        },
      ],
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
          name: 'step',
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
