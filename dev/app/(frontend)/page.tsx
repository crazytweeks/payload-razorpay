
import TestRazorpay from '../../components/testRazorpay.js'
import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-6">
        <TestRazorpay />
      </div>
    </div>
  )
}

export default HomePage