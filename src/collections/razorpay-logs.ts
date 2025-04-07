import type { CollectionConfig } from 'payload'

export const __RazorpayLogsCollectionSlug = 'razorpay-logs'
export const RazorpayLogs: CollectionConfig = {
  slug: __RazorpayLogsCollectionSlug,
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
