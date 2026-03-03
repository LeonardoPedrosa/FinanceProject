import React, { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/client'
import { SavingsGoal } from '../types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Request failed.'
  }
  return 'An unexpected error occurred.'
}

interface Props {
  goal?: SavingsGoal | null
  onClose: () => void
  onSaved: () => void
}

const CreateSavingsGoalModal: React.FC<Props> = ({ goal, onClose, onSaved }) => {
  const now = new Date()
  const isEdit = !!goal

  const [name, setName] = useState(goal?.name ?? '')
  const [description, setDescription] = useState(goal?.description ?? '')
  const [targetAmount, setTargetAmount] = useState(goal?.totalTargetAmount?.toString() ?? '')
  const [monthlyBudget, setMonthlyBudget] = useState(goal?.monthlyBudget?.toString() ?? '')
  const [startYear, setStartYear] = useState(goal?.startYear ?? now.getFullYear())
  const [startMonth, setStartMonth] = useState(goal?.startMonth ?? now.getMonth() + 1)
  const [durationMonths, setDurationMonths] = useState(goal?.durationMonths?.toString() ?? '12')
  const [status, setStatus] = useState(goal?.status ?? 'Active')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        totalTargetAmount: parseFloat(targetAmount),
        monthlyBudget: parseFloat(monthlyBudget),
        startYear,
        startMonth,
        durationMonths: parseInt(durationMonths),
        ...(isEdit ? { status } : {}),
      }
      if (isEdit && goal) {
        await api.put(`/savings-goals/${goal.id}`, payload)
      } else {
        await api.post('/savings-goals', payload)
      }
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? 'Edit Savings Goal' : 'New Savings Goal'}
            </h2>
            <p className="text-xs text-gray-400">
              {isEdit ? 'Update your goal settings' : 'Set a savings target and monthly budget'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form
          id="savings-goal-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-5 space-y-4"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g. Trip to Japan, Emergency Fund…"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Short description…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Target Amount ($)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="20000"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Monthly Budget ($)
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="2000"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Month</label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Duration (months)
            </label>
            <input
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="12"
              min="1"
              max="120"
              step="1"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              e.g. 12 for 1 year · 24 for 2 years · 6 for 6 months
            </p>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="savings-goal-form"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? isEdit
                ? 'Saving…'
                : 'Creating…'
              : isEdit
              ? 'Save Changes'
              : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateSavingsGoalModal
