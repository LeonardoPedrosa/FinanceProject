import React, { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/client'
import { Category } from '../types'
import Icon from '../utils/icons'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Failed to add expense.'
  }
  return 'An unexpected error occurred.'
}

interface Props {
  category: Category
  onClose: () => void
  onAdded: () => void
}

const AddExpenseModal: React.FC<Props> = ({ category, onClose, onAdded }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post(`/categories/${category.id}/expenses`, {
        amount: parsed,
        description: description.trim() || undefined,
      })
      onAdded()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const projected = category.currentValue + (parseFloat(amount) || 0)
  const willExceed = projected > category.maxValue

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category.color + '22' }}
            >
              <Icon name={category.icon} size={18} color={category.color} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Add Expense</h2>
              <p className="text-xs text-gray-400">{category.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Current status */}
        <div className="px-6 pt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Current spent</span>
              <span className="font-medium">${category.currentValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
              <span>Limit</span>
              <span className="font-medium">${category.maxValue.toFixed(2)}</span>
            </div>
            {amount && (
              <div
                className={`flex justify-between mt-2 pt-2 border-t font-semibold ${
                  willExceed ? 'text-red-600' : 'text-green-600'
                }`}
              >
                <span>After this expense</span>
                <span>${projected.toFixed(2)}</span>
              </div>
            )}
          </div>
          {amount && willExceed && (
            <p className="text-xs text-red-500 mt-1.5">
              This expense will exceed your spending limit.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-4 pt-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-lg font-semibold"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g. Grocery shopping, Doctor visit…"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal
