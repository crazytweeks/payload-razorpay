import type { Metadata } from 'next'

import './globals.css'
import { getServerUrl } from '../../helpers/getServerUrl.js'
import { DefaultProvider } from '../../providers/index.js'
import { cn } from '../../utils/cn.js'

export const dynamic = 'force-dynamic'

type RootLayoutProps = { children: React.ReactNode }

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html className={cn()} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/icon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <DefaultProvider>{children}</DefaultProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  applicationName: 'Razorpay Test with Payload CMS',
  authors: [
    {
      name: 'Bhuvan BM',
      url: 'https://github.com/crazytweeks',
    },
  ],
  description: '',
  keywords: [],
  metadataBase: new URL(getServerUrl()),
  title: 'Test Razorpay',
}

export default RootLayout
