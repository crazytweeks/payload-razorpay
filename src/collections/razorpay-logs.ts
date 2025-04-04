import type { CollectionConfig } from 'payload'

export const RazorpayLogs: CollectionConfig = {
  slug: 'razorpay-logs',
  admin: {
    group: 'Razorpay',
  },
  fields: [
    {
      name: 'event',
      type: 'text',
      required: true,
    },
    {
      name: 'payload',
      type: 'json',
      required: true,
    },
  ],
  labels: {
    plural: 'Razorpay Logs',
    singular: 'Razorpay log',
  },
}
