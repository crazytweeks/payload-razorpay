import type { CollectionConfig } from 'payload'

import { orderFields } from './extensions/orders'

export const RazorpayOrdersCollectionSlug = 'razorpay-orders'
export const RazorpayOrders: CollectionConfig = {
  slug: RazorpayOrdersCollectionSlug,
  admin: {
    group: 'Razorpay',
  },
  fields: [...orderFields],
  labels: {
    plural: 'Razorpay Orders',
    singular: 'Razorpay Order',
  },
}
