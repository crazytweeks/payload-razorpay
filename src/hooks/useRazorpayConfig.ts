import { useEffect, useState } from 'react'

type RazorpayConfig = {
  isConfigured: boolean
  keyId?: string
  testMode: boolean
  webhookEnabled: boolean
  webhookPath: string
}

export const useRazorpayConfig = () => {
  const [data, setData] = useState<RazorpayConfig>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/razorpay/config')
        const config = await response.json()

        setData(config)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch config'))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchConfig()
  }, [])

  return {
    data,
    error,
    isLoading,
  }
}
