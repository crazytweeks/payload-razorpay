# Payload CMS Razorpay Plugin

A powerful Payload CMS plugin that seamlessly integrates Razorpay payment gateway for handling online payments and refunds in your Payload CMS applications.

[![npm version](https://badge.fury.io/js/payload-razorpay.svg)](https://badge.fury.io/js/payload-razorpay)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔒 Secure Razorpay integration
- 💳 Handle payments and refunds
- 🎯 Easy-to-use hooks and utilities
- 📊 Payment status tracking
- 🔄 Webhook support
- 🛠️ Customizable configuration

## Installation

```bash
# npm
npm install payload-razorpay

# yarn
yarn add payload-razorpay

# pnpm
pnpm add payload-razorpay
```

## Quick Start

1. Add the plugin to your Payload config:

```typescript
import { buildConfig } from 'payload/config'
import { razorpayPlugin } from 'payload-razorpay'

export default buildConfig({
  plugins: [
    razorpayPlugin({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
      // Optional configuration
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    }),
  ],
})
```

2. Use the plugin hooks in your collections:

```typescript
import { CollectionConfig } from 'payload/types'
import { useRazorpay } from 'payload-razorpay/hooks'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    // ... your fields
  ],
  hooks: {
    beforeChange: [
      useRazorpay({
        // Configure payment options
      }),
    ],
  },
}
```

## API Reference

### Plugin Options

| Option        | Type   | Required | Description                                    |
| ------------- | ------ | -------- | ---------------------------------------------- |
| key_id        | string | Yes      | Your Razorpay API Key ID                       |
| key_secret    | string | Yes      | Your Razorpay API Key Secret                   |
| webhookSecret | string | No       | Webhook secret for verifying Razorpay webhooks |

### Available Hooks

- `useRazorpay`: Main hook for payment processing
- `useRazorpayWebhook`: Handle Razorpay webhooks
- `useRazorpayRefund`: Process refunds

### Client-side Usage

```typescript
import { createPayment } from 'payload-razorpay/client'

// Create a payment
const payment = await createPayment({
  amount: 1000, // Amount in smallest currency unit (paise for INR)
  currency: 'INR',
  // ... other options
})
```

### Server-side Usage (RSC)

```typescript
import { verifyPayment } from 'payload-razorpay/rsc'

// Verify a payment
const isValid = await verifyPayment({
  razorpay_payment_id: 'pay_xxx',
  razorpay_order_id: 'order_xxx',
  razorpay_signature: 'xxx',
})
```

## Webhook Integration

1. Set up webhook URL in your Razorpay dashboard: `https://your-domain.com/api/razorpay/webhook`
2. Configure webhook secret in plugin options
3. Handle webhook events using the `useRazorpayWebhook` hook

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build the plugin
pnpm build

# Run tests
pnpm test
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://github.com/crazytweeks/payload-razorpay/wiki)
- 🐛 [Issue Tracker](https://github.com/crazytweeks/payload-razorpay/issues)
- 💬 [Discussions](https://github.com/crazytweeks/payload-razorpay/discussions)

## Author

Bhuvan BM
