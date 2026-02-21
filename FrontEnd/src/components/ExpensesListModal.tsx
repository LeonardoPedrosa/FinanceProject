import React, { useState, useEffect, useCallback } from 'react'
import { X, Pencil, Trash2, List } from 'lucide-react'
import api from '../api/client'
import { Category, Expense } from '../types'
import Icon from '../utils/icons'

interface Props {
  category: Category
  year: number
  month: number
  onClose: () => void
  onChanged: () => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const ExpensesListModal: React.FC<Props> = ({ category, year, month, onClose, onChanged }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editError, setEditError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<Expense[]>(
        `/categories/${category.id}/expenses?year=${year}&month=${month}`
      )
      setExpenses(data)
    } catch {
      setError('Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }, [category.id, year, month])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditAmount(expense.amount.toString())
    setEditDescription(expense.description ?? '')
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditAmount('')
    setEditDescription('')
    setEditError('')
  }

  const handleSave = async (expenseId: string) => {
    const parsed = parseFloat(editAmount)
    if (isNaN(parsed) || parsed <= 0) {
      setEditError('Please enter a valid amount greater than 0.')
      return
    }
    setSavingId(expenseId)
    setEditError('')
    try {
      await api.put(`/categories/${category.id}/expenses/${expenseId}`, {
        amount: parsed,
        description: editDescription.trim() || null,
      })
      cancelEdit()
      await fetchExpenses()
      onChanged()
    } catch {
      setEditError('Failed to save changes.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (expenseId: string) => {
    if (!window.confirm('Delete this expense?')) return
    setDeletingId(expenseId)
    try {
      await api.delete(`/categories/${category.id}/expenses/${expenseId}`)
      await fetchExpenses()
      onChanged()
    } catch {
      setError('Failed to delete expense.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category.color + '22' }}
            >
              <Icon name={category.icon} size={18} color={category.color} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{category.name}</h2>
              <p className="text-xs text-gray-400">{MONTH_NAMES[month - 1]} {year}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm mb-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <List size={36} className="mb-2 opacity-40" />
              <p className="text-sm">No expenses this month</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {expenses.map((expense) =>
                editingId === expense.id ? (
                  /* Edit mode row */
                  <div key={expense.id} className="py-3">
                    <div className="bg-indigo-50/60 rounded-xl p-3 space-y-2">
                      <div className="flex gap-2">
                        <div className="w-28">
                          <label className="block text-xs text-gray-500 mb-1">Amount ($)</label>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="0.01"
                            step="0.01"
                            autoFocus
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      {editError && (
                        <p className="text-xs text-red-500">{editError}</p>
                      )}
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="text-xs border border-gray-300 text-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(expense.id)}
                          disabled={savingId === expense.id}
                          className="text-xs bg-indigo-600 text-white rounded-lg px-3 py-1.5 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {savingId === expense.id ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View mode row */
                  <div key={expense.id} className="flex items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(expense.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {expense.description ?? (
                          <span className="italic text-gray-300">No description</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(expense)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && expenses.length > 0 && (
          <div className="px-6 py-3 border-t flex-shrink-0 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
              <span className="font-semibold text-gray-900">
                Total: ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpensesListModal
