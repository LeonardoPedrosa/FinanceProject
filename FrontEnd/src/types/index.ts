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
  isPrivate: boolean
  ownerName: string | null
}

export interface UserConnection {
  id: string
  sharerId: string
  sharerName: string
  sharerEmail: string
  receiverId: string
  receiverName: string
  receiverEmail: string
  createdAt: string
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
  installmentGroupId: string | null
  installmentNumber: number | null
  totalInstallments: number | null
}

export interface UserMonthBudget {
  id: string
  year: number
  month: number
  totalBudget: number
  isSet: boolean
  partnerTotalBudget?: number | null
}

export interface SavingsGoalMonthSummary {
  year: number
  month: number
  monthlyBudget: number
  totalExpenses: number
  amountSaved: number
  badge: string
  badgeLabel: string
}

export interface FixedExpenseMonth {
  id: string
  fixedExpenseId: string
  year: number
  month: number
  amount: number
}

export interface FixedExpense {
  id: string
  name: string
  description: string | null
  defaultAmount: number
  currentMonthAmount: number
  months: FixedExpenseMonth[]
  ownerName: string | null
}

export interface SavingsGoal {
  id: string
  userId: string
  name: string
  description: string | null
  totalTargetAmount: number
  monthlyBudget: number
  startYear: number
  startMonth: number
  durationMonths: number
  status: string
  totalSaved: number
  progressPercent: number
  monthSummaries: SavingsGoalMonthSummary[]
  createdAt: string
}
