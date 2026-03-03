import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { SavingsGoal } from '../types'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

interface Props {
  goal: SavingsGoal
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
}

const SavingsGoalCard: React.FC<Props> = ({ goal, onViewDetails, onEdit, onDelete }) => {
  const progressPct = Math.min(
    goal.totalTargetAmount > 0 ? (goal.totalSaved / goal.totalTargetAmount) * 100 : 0,
    100
  )
  const currentMonth = goal.monthSummaries[goal.monthSummaries.length - 1]
  const lastThreeBadges = goal.monthSummaries.slice(-3)

  const statusColor =
    goal.status === 'Active'
      ? 'bg-green-100 text-green-700'
      : goal.status === 'Completed'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-600'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{goal.name}</h3>
          {goal.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{goal.description}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor}`}>
          {goal.status}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>${goal.totalSaved.toFixed(0)} saved</span>
          <span>Goal: ${goal.totalTargetAmount.toFixed(0)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progressPct.toFixed(1)}% of target</p>
      </div>

      {/* Current month preview */}
      {currentMonth ? (
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-xs">
          <p className="font-medium text-gray-600 mb-1.5">
            {MONTH_NAMES[currentMonth.month - 1]} {currentMonth.year}
          </p>
          <div className="flex justify-between text-gray-500">
            <span>
              Budget: <strong className="text-gray-700">${currentMonth.monthlyBudget.toFixed(0)}</strong>
            </span>
            <span>
              Spent: <strong className="text-gray-700">${currentMonth.totalExpenses.toFixed(0)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span>{currentMonth.badge}</span>
            <span
              className={
                currentMonth.amountSaved >= 0
                  ? 'text-green-600 font-medium'
                  : 'text-red-500 font-medium'
              }
            >
              {currentMonth.amountSaved >= 0 ? '+' : ''}$
              {currentMonth.amountSaved.toFixed(0)} {currentMonth.badgeLabel}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-xs text-gray-400 text-center">
          Goal starts {MONTH_NAMES[goal.startMonth - 1]} {goal.startYear}
        </div>
      )}

      {/* Badge history */}
      {lastThreeBadges.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Recent:</span>
          {lastThreeBadges.map((s, i) => (
            <span
              key={i}
              title={`${MONTH_NAMES[s.month - 1]} ${s.year}: ${s.badgeLabel}`}
              className="text-base"
            >
              {s.badge}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Eye size={14} />
          Details
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default SavingsGoalCard
