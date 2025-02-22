import type { Plugin } from 'payload'

import { payloadRazorpay } from 'payload-razorpay'

const payloadPlugins: Plugin[] = [
  payloadRazorpay({
    collections: {
      posts: true,
    },
  }),
]

export { payloadPlugins }
