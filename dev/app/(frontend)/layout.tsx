
import type { ReactNode } from 'react'

type RootLayoutProps = { children: ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/logo.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
