# Payload CMS Razorpay Plugin

> ⚠️ **IMPORTANT NOTICE**
>
> This plugin is currently in alpha (v0.0.1-alpha.1) and under active development.
> It is not recommended for production use as breaking changes may occur.
> Use at your own risk in development environments only.

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
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID ?? '',
        keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
        // Optional configuration
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
      },
      webhook: {
        enabled: false, // Set to true if you want to enable webhook handling
      },
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

| Option                 | Type    | Required | Description                                      |
| ---------------------- | ------- | -------- | ------------------------------------------------ |
| razorpay.keyId         | string  | Yes      | Your Razorpay API Key ID                         |
| razorpay.keySecret     | string  | Yes      | Your Razorpay API Key Secret                     |
| razorpay.webhookSecret | string  | No       | Webhook secret for verifying Razorpay webhooks   |
| webhook.enabled        | boolean | No       | Enable/disable webhook handling (default: false) |

### Available Hooks

- `createPaymentInRazorpay`: Create Razorpay payment during order creation
- `createSubscriptionInRazorpay`: Create Razorpay subscription for recurring payments
- `handleRefund`: Process refunds through Razorpay
- `useRazorpayConfig`: Get Razorpay configuration in client components
- `useRazorpayAxios`: Create and process payments with axios instead of fetch (recommended)

### Client-side Usage with Standard Hooks

```typescript
import { createPayment } from 'payload-razorpay/client'

// Create a payment
const payment = await createPayment({
  amount: 1000, // Amount in smallest currency unit (paise for INR)
  currency: 'INR',
  // ... other options
})
```

### Client-side Usage with Axios-based Hook

```tsx
import { useRazorpayAxios } from 'payload-razorpay/hooks'

// In your React component
const PaymentComponent = () => {
  const { createAndProcessPayment, isLoading, error } = useRazorpayAxios()

  const handlePayNow = async () => {
    await createAndProcessPayment({
      amount: 1000, // Amount in paise (₹10.00)
      currency: 'INR',
      description: 'Product Purchase',
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      onSuccess: (data) => {
        console.log('Payment successful!', data)
      },
    })
  }

  return (
    <button onClick={handlePayNow} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
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
