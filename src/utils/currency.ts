/**
 * Convert amount to Razorpay format (paise)
 * @param amount Amount in rupees
 * @returns Amount in paise
 */
export const toRazorpayAmount = (amount: number): number => {
  return Math.round(amount * 100)
}

/**
 * Convert Razorpay amount (paise) to rupees
 * @param amount Amount in paise
 * @returns Amount in rupees
 */
export const fromRazorpayAmount = (amount: number): number => {
  return amount / 100
}

/**
 * Format amount in Indian Rupees
 * @param amount Amount in rupees
 * @returns Formatted amount string
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    style: 'currency',
  }).format(amount)
}

/**
 * Format amount based on currency code
 * @param amount Amount in smallest currency unit
 * @param currency Currency code (e.g., 'INR', 'USD')
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-IN', {
    currency,
    style: 'currency',
  }).format(fromRazorpayAmount(amount))
}
