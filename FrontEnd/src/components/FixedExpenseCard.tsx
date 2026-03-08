import React from 'react'
import { Pencil, Trash2, Calendar } from 'lucide-react'
import { FixedExpense } from '../types'

interface Props {
  expense: FixedExpense
  onEdit: () => void
  onDelete: () => void
  onViewMonths: () => void
}

const FixedExpenseCard: React.FC<Props> = ({ expense, onEdit, onDelete, onViewMonths }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{expense.name}</h3>
          {expense.ownerName !== null && (
            <p className="text-xs text-gray-400 mt-0.5">From {expense.ownerName}</p>
          )}
          {expense.ownerName === null && expense.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{expense.description}</p>
          )}
        </div>
        {expense.ownerName === null && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">This month</p>
          <p className="text-xl font-bold text-gray-900">${expense.currentMonthAmount.toFixed(2)}</p>
          {expense.currentMonthAmount !== expense.defaultAmount && (
            <p className="text-xs text-gray-400">Default: ${expense.defaultAmount.toFixed(2)}</p>
          )}
        </div>
        <button
          onClick={onViewMonths}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Calendar size={13} />
          All months
        </button>
      </div>
    </div>
  )
}

export default FixedExpenseCard
