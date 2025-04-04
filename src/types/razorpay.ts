export interface RazorpayOrder {
  amount: number
  amount_due: number
  amount_paid: number
  attempts: number
  created_at: number
  currency: string
  entity: string
  id: string
  notes: Record<string, string>
  receipt: string
  status: string
}
