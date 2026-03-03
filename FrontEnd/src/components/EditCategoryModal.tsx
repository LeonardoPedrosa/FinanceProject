import React, { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/client'
import Icon, { ICON_NAMES } from '../utils/icons'
import { Category } from '../types'

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#6b7280',
]

interface Props {
  category: Category
  onClose: () => void
  onSaved: () => void
}

const EditCategoryModal: React.FC<Props> = ({ category, onClose, onSaved }) => {
  const [name, setName] = useState(category.name)
  const [selectedIcon, setSelectedIcon] = useState(category.icon)
  const [color, setColor] = useState(category.color)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.put(`/categories/${category.id}`, {
        name: name.trim(),
        icon: selectedIcon,
        color,
      })
      onSaved()
    } catch {
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <form id="edit-cat-form" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g. Family, Health, Pets…"
              required
              autoFocus
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1">
              {ICON_NAMES.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  title={iconName}
                  className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                    selectedIcon === iconName
                      ? 'bg-indigo-100 ring-2 ring-indigo-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon
                    name={iconName}
                    size={20}
                    color={selectedIcon === iconName ? color : '#6b7280'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <div className="relative" title="Custom color">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full"
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 hover:border-gray-400 transition-colors"
                  style={
                    !PRESET_COLORS.includes(color) ? { backgroundColor: color, border: 'none' } : {}
                  }
                >
                  {PRESET_COLORS.includes(color) ? '+' : ''}
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: color + '22' }}
              >
                <Icon name={selectedIcon} size={22} color={color} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{name || 'Category Name'}</p>
                <p className="text-xs text-gray-400">Preview</p>
              </div>
            </div>
          </div>
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
            form="edit-cat-form"
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCategoryModal
