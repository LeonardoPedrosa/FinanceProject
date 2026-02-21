import React, { useState } from 'react'
import { X, Share2, CheckCircle } from 'lucide-react'
import api from '../api/client'
import { Category } from '../types'
import Icon from '../utils/icons'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Failed to share category.'
  }
  return 'An unexpected error occurred.'
}

interface Props {
  category: Category
  onClose: () => void
}

const ShareCategoryModal: React.FC<Props> = ({ category, onClose }) => {
  const [email, setEmail] = useState('')
  const [canEdit, setCanEdit] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post(`/categories/${category.id}/share`, {
        userEmail: email.trim(),
        canEdit,
      })
      setShared(true)
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
              <h2 className="text-base font-semibold text-gray-900">Share Category</h2>
              <p className="text-xs text-gray-400">{category.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {shared ? (
          /* Success state */
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <CheckCircle size={48} className="text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Shared successfully!</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{email}</strong> now has access to <strong>{category.name}</strong>.
            </p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-500">
              Enter the email of the person you want to share this category with.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="wife@example.com"
                required
                autoFocus
              />
            </div>

            {/* Permission toggle */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Allow editing</p>
                <p className="text-xs text-gray-400">
                  {canEdit
                    ? 'They can add expenses and modify data.'
                    : 'They can only view this category.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCanEdit((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none ${
                  canEdit ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                    canEdit ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
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
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 size={14} />
                {loading ? 'Sharing…' : 'Share'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ShareCategoryModal
