import React, { useState, useEffect, useCallback } from 'react'
import { Plus, LogOut, TrendingUp, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { Category, UserMonthBudget } from '../types'
import CategoryCard from '../components/CategoryCard'
import CreateCategoryModal from '../components/CreateCategoryModal'
import AddExpenseModal from '../components/AddExpenseModal'
import ShareCategoryModal from '../components/ShareCategoryModal'
import EditMonthConfigModal from '../components/EditMonthConfigModal'
import ExpensesListModal from '../components/ExpensesListModal'
import SetMonthBudgetModal from '../components/SetMonthBudgetModal'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // 1-12

  const [categories, setCategories] = useState<Category[]>([])
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const [globalBudget, setGlobalBudget] = useState<UserMonthBudget | null>(null)
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expenseTarget, setExpenseTarget] = useState<Category | null>(null)
  const [shareTarget, setShareTarget] = useState<Category | null>(null)
  const [configTarget, setConfigTarget] = useState<Category | null>(null)
  const [expensesListTarget, setExpensesListTarget] = useState<Category | null>(null)

  const fetchCategories = useCallback(async (y: number, m: number) => {
    setRefreshing(true)
    try {
      const { data } = await api.get<Category[]>(`/categories?year=${y}&month=${m}`)
      setCategories(data)
      setError('')
    } catch {
      setError('Failed to load categories. Please try again.')
    } finally {
      setInitialized(true)
      setRefreshing(false)
    }
  }, [])

  const fetchGlobalBudget = useCallback(async (y: number, m: number) => {
    try {
      const { data } = await api.get<UserMonthBudget>(`/user-month-budget?year=${y}&month=${m}`)
      setGlobalBudget(data)
    } catch {
      // non-critical — silently ignore
    }
  }, [])

  useEffect(() => {
    fetchCategories(year, month)
    fetchGlobalBudget(year, month)
  }, [fetchCategories, fetchGlobalBudget, year, month])

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  const overLimitCount = categories.filter((c) => c.isOverLimit).length
  const totalSpent = categories.reduce((s, c) => s + c.currentValue, 0)
  const configuredCategories = categories.filter((c) => c.hasMonthConfig)
  const totalBudget = configuredCategories.reduce((s, c) => s + c.maxValue, 0)
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const refresh = () => {
    fetchCategories(year, month)
    fetchGlobalBudget(year, month)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={26} />
            <span className="text-xl font-bold text-gray-900">Finance App</span>
          </div>
          <div className="flex items-center gap-4">
            {refreshing && <RefreshCw size={16} className="text-indigo-400 animate-spin" />}
            <button
              onClick={() => navigate('/savings-goals')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors hidden sm:block"
            >
              Savings Goals
            </button>
            <span className="text-sm text-gray-600 hidden sm:block">
              Hello, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Month selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center min-w-[160px]">
            <p className="text-xl font-bold text-gray-900">
              {MONTH_NAMES[month - 1]} {year}
            </p>
            {isCurrentMonth && (
              <p className="text-xs text-indigo-500 font-medium">Current month</p>
            )}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Month Budget</p>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Set budget"
              >
                <Pencil size={13} />
              </button>
            </div>
            {globalBudget?.isSet ? (
              <>
                <p className="text-2xl font-bold text-gray-900">${globalBudget.totalBudget.toFixed(2)}</p>
                {(() => {
                  const pct = Math.min((totalSpent / globalBudget.totalBudget) * 100, 100)
                  const over = totalSpent > globalBudget.totalBudget
                  const diff = Math.abs(globalBudget.totalBudget - totalSpent)
                  return (
                    <>
                      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${over ? 'text-red-500' : 'text-gray-400'}`}>
                        {over
                          ? `$${diff.toFixed(2)} over budget`
                          : `$${diff.toFixed(2)} remaining`}
                      </p>
                    </>
                  )
                })()}
              </>
            ) : (
              <button
                onClick={() => setShowBudgetModal(true)}
                className="text-sm text-indigo-500 hover:text-indigo-700 font-medium mt-1"
              >
                — Set Budget
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Month Spent</p>
            <p
              className={`text-2xl font-bold ${
                budgetPercentage >= 100 ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              ${totalSpent.toFixed(2)}
            </p>
            {totalBudget > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{budgetPercentage.toFixed(0)}% of budget</p>
            )}
          </div>
          <div
            className={`col-span-2 sm:col-span-1 rounded-xl p-4 shadow-sm border ${
              overLimitCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
            }`}
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Over Limit</p>
            <div className="flex items-center gap-2">
              {overLimitCount > 0 && <AlertTriangle size={18} className="text-red-500" />}
              <p className={`text-2xl font-bold ${overLimitCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {overLimitCount}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {overLimitCount === 1 ? '1 category over limit' : `${overLimitCount} categories over limit`}
            </p>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Categories{' '}
            {categories.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({categories.length})</span>
            )}
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Category
          </button>
        </div>

        {/* Content */}
        {!initialized ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <p className="text-red-500">{error}</p>
            <button onClick={refresh} className="text-sm text-indigo-600 hover:underline">
              Try again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="bg-indigo-50 rounded-full p-6 mb-4">
              <TrendingUp size={40} className="text-indigo-300" />
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No categories yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create your first category to start tracking spending.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              New Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onAddExpense={() => setExpenseTarget(category)}
                onShare={() => setShareTarget(category)}
                onConfigure={() => setConfigTarget(category)}
                onViewExpenses={() => setExpensesListTarget(category)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateCategoryModal
          year={year}
          month={month}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); refresh() }}
        />
      )}

      {expenseTarget && (
        <AddExpenseModal
          category={expenseTarget}
          onClose={() => setExpenseTarget(null)}
          onAdded={() => { setExpenseTarget(null); refresh() }}
        />
      )}

      {shareTarget && (
        <ShareCategoryModal
          category={shareTarget}
          onClose={() => setShareTarget(null)}
        />
      )}

      {configTarget && (
        <EditMonthConfigModal
          category={configTarget}
          year={year}
          month={month}
          onClose={() => setConfigTarget(null)}
          onSaved={() => { setConfigTarget(null); refresh() }}
        />
      )}

      {expensesListTarget && (
        <ExpensesListModal
          category={expensesListTarget}
          year={year}
          month={month}
          onClose={() => setExpensesListTarget(null)}
          onChanged={refresh}
        />
      )}

      {showBudgetModal && (
        <SetMonthBudgetModal
          year={year}
          month={month}
          currentBudget={globalBudget?.totalBudget ?? 0}
          onClose={() => setShowBudgetModal(false)}
          onSaved={() => { setShowBudgetModal(false); fetchGlobalBudget(year, month) }}
        />
      )}
    </div>
  )
}

export default DashboardPage
