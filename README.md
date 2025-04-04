# Payload CMS Razorpay Plugin

> ⚠️ **IMPORTANT NOTICE**
>
> This plugin is currently in active development and testing.
> It is not ready for production use as breaking changes may occur.
> Use at your own risk in development environments only.

A powerful Payload CMS plugin that integrates the Razorpay payment gateway for handling online payments, refunds, and more in your Payload CMS applications.



---

## 🚀 Features & Development Status

| Feature                                    | Status                   | Progress                                     |
| ------------------------------------------ | ------------------------ | -------------------------------------------- |
| **Configurable Collections**               | ❌ Not Planned            | No clear approach yet                        |
| **API Helpers**                            |                          |                                              |
| - Create Payment                           | 🟡 Under Testing         | Partially completed                          |
| - Verify Payment                           | 🟡 Under Testing         | Functional but needs validation              |
| - Webhook Handler                          | 🔵 In Progress           | Partially implemented, testing not started   |
| - Config Handler                           | 🟡 Under Testing         | Works but needs improvements                 |
| - Create Subscriptions                     | ❌ Not Started            | Yet to begin implementation                  |
| - Reports                                  | ❌ Not Started            | Planned for later                            |
| - Refund APIs                              | ❌ Not Planned            | No current plans                             |
| **UI Components**                          |                          |                                              |
| - Admin Dashboard Reports                  | 🟡 Under Testing         | Basic version available, improvements needed |
| - Example/Test Payment Component           | 🔵 In Progress           | Work ongoing                                 |
| **React Hooks**                            |                          |                                              |
| - `createPaymentInRazorpay`                | 🟡 Partially Implemented | Needs further testing                        |
| - `createSubscriptionInRazorpay`           | ❌ Not Started            | Implementation pending                       |
| - `handleRefund`                           | 🟡 Partially Implemented | Needs validation and testing                 |
| - `useRazorpayConfig`                      | ✅ Completed              | Tested and stable                            |
| - `useRazorpayFetch`                       | 🟡 Under Testing         | Some improvements required                   |
| - `getRazorpayInstance`                    | ✅ Completed              | Fully functional                             |
| **Other Features**                         |                          |                                              |
| - Secure Collections (Access Control)      | 🔵 In Progress           | Needs proper implementation                  |
| - Razorpay Customizations from Admin Panel | ❌ Not Started            | Planned but no work done                     |

Legend: ✅ Completed | 🟡 Under Testing | 🔵 In Progress | ❌ Not Started / Not Planned

---

## 📦 Installation

```bash
# npm
npm install payload-razorpay

# yarn
yarn add payload-razorpay

# pnpm
pnpm add payload-razorpay
```

---

## 🛠 Quick Start

### 1️⃣ Add the Plugin to Payload CMS

```typescript
import { buildConfig } from 'payload/config'
import { razorpayPlugin } from 'payload-razorpay'

export default buildConfig({
  plugins: [
    razorpayPlugin({
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID ?? '',
        keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET, // Optional
      },
      webhook: {
        enabled: false, // Enable if needed
      },
    }),
  ],
})
```

### 2️⃣ Use the Plugin Hooks in Collections

```typescript
import { CollectionConfig } from 'payload/types'
import { useRazorpay } from 'payload-razorpay/hooks'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    // Your fields here
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

---

## 📖 API Reference

### Plugin Options

| Option                   | Type    | Required | Description                                      |
| ------------------------ | ------- | -------- | ------------------------------------------------ |
| `razorpay.keyId`         | string  | ✅ Yes    | Your Razorpay API Key ID                         |
| `razorpay.keySecret`     | string  | ✅ Yes    | Your Razorpay API Key Secret                     |
| `razorpay.webhookSecret` | string  | ❌ No     | Webhook secret for verifying Razorpay webhooks   |
| `webhook.enabled`        | boolean | ❌ No     | Enable/disable webhook handling (default: false) |

### Available Hooks

- `createPaymentInRazorpay` → Create payments in Razorpay
- `createSubscriptionInRazorpay` → Handle subscriptions
- `handleRefund` → Process refunds
- `useRazorpayConfig` → Retrieve Razorpay configuration
- `useRazorpay`Fetch → Alternative API handler using Fetch

---

## 🌐 Webhook Integration

1. Set up the webhook URL in Razorpay dashboard: `https://your-domain.com/api/razorpay/webhook`
2. Configure the webhook secret in the plugin options.
3. Handle webhook events using `useRazorpayWebhook`.

---

## 🛠 Development

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

---

## 👥 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📢 Support

- 📚 [Documentation](https://github.com/crazytweeks/payload-razorpay/wiki)
- 🐛 [Issue Tracker](https://github.com/crazytweeks/payload-razorpay/issues)
- 💬 [Discussions](https://github.com/crazytweeks/payload-razorpay/discussions)

---

## 👨‍💻 Author

**Bhuvan BM**

---
