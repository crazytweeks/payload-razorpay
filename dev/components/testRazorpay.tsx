'use client'

import type { FC } from 'react'

import React from 'react'

import { useRazorpayConfig } from '../../src/hooks/useRazorpayConfig.js'
import RazorpayExampleComponent from './RazorpayAxiosExample.js'

const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

interface ErrorDisplayProps {
  error: Error | null
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
    <h3 className="text-red-800 font-semibold mb-2">Error</h3>
    <pre className="text-red-600 text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
  </div>
)

interface ConfigDisplayProps {
  data: {
    isConfigured: boolean
    keyId?: string
    testMode: boolean
    webhookEnabled: boolean
    webhookPath: string
  }
}

const ConfigDisplay: FC<ConfigDisplayProps> = ({ data }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
    <h3 className="text-gray-800 font-semibold mb-2">Configuration</h3>
    <pre className="text-gray-600 text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
  </div>
)

const TestRazorpay: FC = () => {
  const { data, error, isLoading } = useRazorpayConfig()

  return (
    <div className="flex flex-col">
      <div className="max-w-3xl mx-auto p-6 flex-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Razorpay Test Configuration</h2>

        {isLoading && <LoadingSpinner />}

        {error && <ErrorDisplay error={error} />}

        {data && !error && <ConfigDisplay data={data} />}
      </div>

      <div className="flex-1">
        <RazorpayExampleComponent />
      </div>
    </div>
  )
}

export default TestRazorpay
