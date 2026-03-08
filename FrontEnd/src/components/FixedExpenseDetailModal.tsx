import React, { useState } from 'react'
import { X, Check, Pencil } from 'lucide-react'
import api from '../api/client'
import { FixedExpense } from '../types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  expense: FixedExpense
  onClose: () => void
  onChanged: () => void
}

const FixedExpenseDetailModal: React.FC<Props> = ({ expense, onClose, onChanged }) => {
  const [editingMonthId, setEditingMonthId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = (id: string, current: number) => {
    setEditingMonthId(id)
    setEditAmount(String(current))
  }

  const cancelEdit = () => {
    setEditingMonthId(null)
    setEditAmount('')
  }

  const saveEdit = async (year: number, month: number) => {
    const amount = parseFloat(editAmount)
    if (isNaN(amount) || amount <= 0) return

    setSaving(true)
    try {
      await api.put(`/fixed-expenses/${expense.id}/months/${year}/${month}`, { amount })
      onChanged()
      setEditingMonthId(null)
    } catch {
      // keep editing state on error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">{expense.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        {expense.description && (
          <p className="text-sm text-gray-400 mb-4">{expense.description}</p>
        )}
        <p className="text-xs text-gray-400 mb-4">Default: ${expense.defaultAmount.toFixed(2)}/month</p>

        <div className="overflow-y-auto flex-1">
          {expense.months.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No months generated yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Month</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                  <th className="pb-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {expense.months.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 text-gray-700">
                      {MONTH_NAMES[m.month - 1]} {m.year}
                    </td>
                    <td className="py-2.5 text-right">
                      {editingMonthId === m.id ? (
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          min="0.01"
                          step="0.01"
                          className="w-24 border border-indigo-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          autoFocus
                        />
                      ) : (
                        <span className={m.amount !== expense.defaultAmount ? 'text-indigo-600 font-medium' : 'text-gray-700'}>
                          ${m.amount.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pl-2">
                      {editingMonthId === m.id ? (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => saveEdit(m.year, m.month)}
                            disabled={saving}
                            className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded text-gray-400 hover:bg-gray-50 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(m.id, m.amount)}
                          className="p-1 rounded text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default FixedExpenseDetailModal
