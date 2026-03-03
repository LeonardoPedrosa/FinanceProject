import React, { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/client'

interface Props {
  year: number
  month: number
  currentBudget: number
  onClose: () => void
  onSaved: () => void
}

const SetMonthBudgetModal: React.FC<Props> = ({ year, month, currentBudget, onClose, onSaved }) => {
  const [value, setValue] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    const amount = parseFloat(value)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await api.put(`/user-month-budget?year=${year}&month=${month}`, { totalBudget: amount })
      onSaved()
    } catch {
      setError('Failed to save budget. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Set Month Budget</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Monthly Budget ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="e.g. 10000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetMonthBudgetModal
