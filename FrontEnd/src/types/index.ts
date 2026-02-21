export interface AuthResponse {
  token: string
  email: string
  name: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  maxValue: number       // from monthly config (0 if not configured)
  hasMonthConfig: boolean
  currentValue: number   // expenses sum for the viewed month
  isOverLimit: boolean
  isOwner: boolean
}

export interface MonthConfig {
  id: string
  categoryId: string
  year: number
  month: number
  maxValue: number
  isConfigured: boolean
}

export interface Expense {
  id: string
  amount: number
  description: string | null
  createdAt: string
  categoryName: string
}
