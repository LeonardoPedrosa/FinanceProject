import React, { useState, useEffect, useCallback } from 'react'
import { Plus, ChevronLeft, ChevronRight, Receipt } from 'lucide-react'
import api from '../api/client'
import { FixedExpense } from '../types'
import AppHeader from '../components/AppHeader'
import FixedExpenseCard from '../components/FixedExpenseCard'
import CreateFixedExpenseModal from '../components/CreateFixedExpenseModal'
import FixedExpenseDetailModal from '../components/FixedExpenseDetailModal'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const FixedExpensesPage: React.FC = () => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [expenses, setExpenses] = useState<FixedExpense[]>([])
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editTarget, setEditTarget] = useState<FixedExpense | null>(null)
  const [detailTarget, setDetailTarget] = useState<FixedExpense | null>(null)

  const fetchExpenses = useCallback(async (y: number, m: number) => {
    setRefreshing(true)
    try {
      const { data } = await api.get<FixedExpense[]>(`/fixed-expenses?year=${y}&month=${m}`)
      setExpenses(data)
      setError('')
    } catch {
      setError('Failed to load fixed expenses. Please try again.')
    } finally {
      setInitialized(true)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses(year, month)
  }, [fetchExpenses, year, month])

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  const totalThisMonth = expenses.reduce((s, e) => s + e.currentMonthAmount, 0)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this fixed expense? All monthly records will be removed.')) return
    try {
      await api.delete(`/fixed-expenses/${id}`)
      fetchExpenses(year, month)
    } catch {
      // silently ignore for now
    }
  }

  const handleDetailChanged = () => {
    fetchExpenses(year, month)
    if (detailTarget) {
      // Refresh the detail modal with updated data
      const updated = expenses.find(e => e.id === detailTarget.id)
      if (updated) setDetailTarget(updated)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="fixed-expenses" refreshing={refreshing} />

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
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Fixed This Month</p>
            <p className="text-2xl font-bold text-gray-900">${totalThisMonth.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Active Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Fixed Expenses{' '}
            {expenses.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({expenses.length})</span>
            )}
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Fixed Expense
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
            <button onClick={() => fetchExpenses(year, month)} className="text-sm text-indigo-600 hover:underline">
              Try again
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="bg-indigo-50 rounded-full p-6 mb-4">
              <Receipt size={40} className="text-indigo-300" />
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No fixed expenses yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Add recurring monthly costs like insurance, subscriptions, and utilities.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              New Fixed Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((expense) => (
              <FixedExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={() => setEditTarget(expense)}
                onDelete={() => handleDelete(expense.id)}
                onViewMonths={() => setDetailTarget(expense)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateFixedExpenseModal
          onClose={() => setShowCreateModal(false)}
          onSaved={() => { setShowCreateModal(false); fetchExpenses(year, month) }}
        />
      )}

      {editTarget && (
        <CreateFixedExpenseModal
          expense={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { setEditTarget(null); fetchExpenses(year, month) }}
        />
      )}

      {detailTarget && (
        <FixedExpenseDetailModal
          expense={detailTarget}
          onClose={() => setDetailTarget(null)}
          onChanged={handleDetailChanged}
        />
      )}
    </div>
  )
}

export default FixedExpensesPage
