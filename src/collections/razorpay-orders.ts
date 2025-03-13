import type { CollectionConfig } from 'payload'

import { orderFields } from './extensions/orders'

export const RazorpayOrders: CollectionConfig = {
  slug: 'razorpay-orders',
  admin: {
    group: 'Razorpay',
  },
  fields: [...orderFields],
  labels: {
    plural: 'Razorpay Orders',
    singular: 'Razorpay Order',
  },
}
