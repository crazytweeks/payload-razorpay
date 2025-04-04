import { Banner, CopyToClipboard } from '@payloadcms/ui'
import React from 'react'

type WebhookStatusProps = {
  enabled: boolean
  path: string
}

export const WebhookStatus: React.FC<WebhookStatusProps> = ({ enabled, path }) => {
  const webhookUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}${path}`

  return (
    <div className="webhook-status">
      <Banner type={enabled ? 'success' : 'error'}>
        <strong>Webhook Status: </strong>
        {enabled ? 'Enabled' : 'Disabled'}
      </Banner>

      {enabled && (
        <div className="webhook-status__url">
          <strong>Webhook URL:</strong>
          <div className="webhook-status__url-copy">
            <code>{webhookUrl}</code>
            <CopyToClipboard value={webhookUrl} />
          </div>
          <small>Add this URL to your Razorpay Dashboard &gt; Settings &gt; Webhooks</small>
        </div>
      )}

      <style>{`
        .webhook-status {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .webhook-status__url {
          background: var(--theme-elevation-50);
          border-radius: 4px;
          padding: 1rem;
        }
        .webhook-status__url-copy {
          align-items: center;
          display: flex;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }
        .webhook-status__url code {
          background: var(--theme-elevation-100);
          border-radius: 4px;
          font-size: 0.9em;
          padding: 0.25rem 0.5rem;
          word-break: break-all;
        }
        .webhook-status__url small {
          color: var(--theme-elevation-500);
          display: block;
          font-size: 0.8em;
        }
      `}</style>
    </div>
  )
}
