import React from 'react'
import { AlertTriangle, Plus, Share2, Settings, List, Pencil } from 'lucide-react'
import { Category } from '../types'
import Icon from '../utils/icons'

interface Props {
  category: Category
  onAddExpense: () => void
  onShare: () => void
  onConfigure: () => void
  onViewExpenses: () => void
  onEdit: () => void
}

const CategoryCard: React.FC<Props> = ({ category, onAddExpense, onShare, onConfigure, onViewExpenses, onEdit }) => {
  const percentage =
    category.maxValue > 0
      ? Math.min((category.currentValue / category.maxValue) * 100, 100)
      : 0

  const barColor = category.isOverLimit
    ? '#ef4444'
    : percentage >= 80
    ? '#f97316'
    : '#22c55e'

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 flex flex-col hover:shadow-md transition-shadow"
      style={{ borderLeftColor: category.isOverLimit ? '#ef4444' : category.color }}
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Card header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: category.color + '22' }}
            >
              <Icon name={category.icon} size={22} color={category.color} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
              <span className="text-xs text-gray-400">
                {category.isOwner ? 'My category' : 'Shared with me'}
              </span>
            </div>
          </div>
          {category.isOverLimit && (
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          )}
        </div>

        {/* Spending info */}
        <div className="flex-1">
          {category.hasMonthConfig ? (
            <>
              <div className="flex justify-between items-baseline mb-1.5">
                <span
                  className={`text-lg font-bold ${
                    category.isOverLimit ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  ${category.currentValue.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">/ ${category.maxValue.toFixed(2)}</span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: barColor }}
                />
              </div>

              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">{percentage.toFixed(0)}% used</span>
                {category.isOverLimit && (
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                    Over limit
                  </span>
                )}
                {!category.isOverLimit && percentage >= 80 && (
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                    Near limit
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-3 gap-2">
              <p className="text-sm text-gray-400">No limit set for this month</p>
              <p className="text-sm font-medium text-gray-700">
                Spent: ${category.currentValue.toFixed(2)}
              </p>
              <button
                onClick={onConfigure}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Set monthly limit →
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
          <button
            onClick={onAddExpense}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg py-1.5 transition-colors font-medium"
          >
            <Plus size={14} />
            Add Expense
          </button>
          <button
            onClick={onViewExpenses}
            className="flex items-center justify-center gap-1.5 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
            title="View expenses"
          >
            <List size={14} />
          </button>
          <button
            onClick={onConfigure}
            className="flex items-center justify-center gap-1.5 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
            title="Edit monthly limit"
          >
            <Settings size={14} />
          </button>
          {category.isOwner && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-1.5 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
              title="Edit category"
            >
              <Pencil size={14} />
            </button>
          )}
          {category.isOwner && (
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-1.5 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
              title="Share category"
            >
              <Share2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
