import type { Config, CustomComponent } from 'payload'

import type { PayloadRazorpayConfig } from './types/config'

import { defaultConfig, setConfig } from './config/defaults'

export const razorpayPlugin =
  (incomingConfig: PayloadRazorpayConfig) =>
  (config: Config): Config => {
    // Initialize plugin config
    setConfig({
      ...defaultConfig,
      ...incomingConfig,
    })

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    // Add Razorpay dashboard components
    config.admin.components.beforeDashboard.push(
      'payload-razorpay/components/BeforeDashboardClient',
      'payload-razorpay/components/BeforeDashboardServer',
    )

    // Add Razorpay script
    if (!config.admin.components.afterDashboard) {
      config.admin.components.afterDashboard = []
    }

    // config.admin.components.afterDashboard.push(RazorpayScript)

    return config
  }
