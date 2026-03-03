import React from 'react'
import { X } from 'lucide-react'
import { SavingsGoal } from '../types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  goal: SavingsGoal
  onClose: () => void
}

const SavingsGoalDetailModal: React.FC<Props> = ({ goal, onClose }) => {
  const progressPct = Math.min(
    goal.totalTargetAmount > 0 ? (goal.totalSaved / goal.totalTargetAmount) * 100 : 0,
    100
  )

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">{goal.name}</h2>
            {goal.description && (
              <p className="text-xs text-gray-400 mt-0.5">{goal.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress summary */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">
              <strong className="text-indigo-600">${goal.totalSaved.toFixed(2)}</strong> saved
            </span>
            <span className="text-gray-500">
              Target: <strong>${goal.totalTargetAmount.toFixed(2)}</strong>
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-400">{progressPct.toFixed(1)}% of target reached</p>
            <p className="text-xs text-gray-400">
              {goal.durationMonths} month{goal.durationMonths !== 1 ? 's' : ''} ·{' '}
              {MONTH_NAMES[goal.startMonth - 1]} {goal.startYear}
            </p>
          </div>
        </div>

        {/* Month-by-month table */}
        <div className="overflow-y-auto flex-1">
          {goal.monthSummaries.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              No data yet — this goal starts in the future or just started this month.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Month
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Budget
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Expenses
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Saved
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {goal.monthSummaries.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {MONTH_NAMES[s.month - 1]} {s.year}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ${s.monthlyBudget.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ${s.totalExpenses.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        s.amountSaved >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {s.amountSaved >= 0 ? '+' : ''}${s.amountSaved.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span title={s.badgeLabel} className="text-base">
                        {s.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-3 font-semibold text-gray-700">
                    Total Saved
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600">
                    ${goal.totalSaved.toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SavingsGoalDetailModal
