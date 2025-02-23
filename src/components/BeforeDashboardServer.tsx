import type { ServerComponentProps } from 'payload'

import { Banner, Button } from '@payloadcms/ui'

import { getPluginConfig } from '../config/defaults.js'
import styles from './BeforeDashboardServer.module.css'

export const BeforeDashboardServer = async (props: ServerComponentProps) => {
  const { payload } = props
  const config = getPluginConfig()

  // Check if any transactions exist (we'll implement this collection later)
  const transactions = await payload
    .find({
      collection: 'razorpay-transactions',
      limit: 5,
      sort: '-createdAt',
    })
    .catch(() => ({ docs: [] }))

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          borderRadius: '4px',
          margin: '10px 0',
          padding: '20px',
        }}
      >
        <h2>Razorpay Configuration</h2>

        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              borderRadius: '4px',
              marginBottom: '10px',
              padding: '10px',
            }}
          >
            <strong>Webhook URL: </strong>
            <code>{`${process.env.PAYLOAD_PUBLIC_SERVER_URL}${config.webhook.path}`}</code>
          </div>

          <Banner>
            <strong>Environment: </strong>
            <span>{config.razorpay.testMode ? 'Test' : 'Production'}</span>
          </Banner>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Recent Transactions</h3>
          {transactions.docs.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              {transactions.docs.map((transaction: any) => (
                <div
                  key={transaction.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    padding: '10px',
                  }}
                >
                  <div>
                    <strong>ID:</strong> {transaction.razorpay_payment_id}
                  </div>
                  <div>
                    <strong>Amount:</strong> ₹{transaction.amount / 100}
                  </div>
                  <div>
                    <strong>Status:</strong> {transaction.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#666' }}>No transactions yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
