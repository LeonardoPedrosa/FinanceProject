import React, { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'
import api from '../api/client'
import { Category, MonthConfig } from '../types'
import Icon from '../utils/icons'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Failed to save configuration.'
  }
  return 'An unexpected error occurred.'
}

interface Props {
  category: Category
  year: number
  month: number
  onClose: () => void
  onSaved: () => void
}

const EditMonthConfigModal: React.FC<Props> = ({ category, year, month, onClose, onSaved }) => {
  const [maxValue, setMaxValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await api.get<MonthConfig>(
          `/categories/${category.id}/month-config/${year}/${month}`
        )
        if (data.isConfigured) {
          setMaxValue(data.maxValue.toString())
        }
      } catch {
        // no config yet — leave field empty
      } finally {
        setLoadingConfig(false)
      }
    }
    loadConfig()
  }, [category.id, year, month])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(maxValue)
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.put(`/categories/${category.id}/month-config`, {
        year,
        month,
        maxValue: parsed,
      })
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

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
              <h2 className="text-base font-semibold text-gray-900">Monthly Limit</h2>
              <p className="text-xs text-gray-400">{category.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Month badge */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 text-sm font-medium w-fit">
            <Calendar size={14} />
            {MONTH_NAMES[month - 1]} {year}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Set the spending limit for this category in the selected month.
            You can change it every month independently.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-4 pt-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Spending Limit ($)
            </label>
            {loadingConfig ? (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-lg font-semibold"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                autoFocus
              />
            )}
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
              disabled={loading || loadingConfig}
              className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Save Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMonthConfigModal
