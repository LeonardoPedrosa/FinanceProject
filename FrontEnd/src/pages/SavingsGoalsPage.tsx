import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Target } from 'lucide-react'
import api from '../api/client'
import { SavingsGoal } from '../types'
import AppHeader from '../components/AppHeader'
import SavingsGoalCard from '../components/SavingsGoalCard'
import CreateSavingsGoalModal from '../components/CreateSavingsGoalModal'
import SavingsGoalDetailModal from '../components/SavingsGoalDetailModal'

const SavingsGoalsPage: React.FC = () => {

  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [initialized, setInitialized] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null)
  const [detailGoal, setDetailGoal] = useState<SavingsGoal | null>(null)

  const fetchGoals = useCallback(async () => {
    setRefreshing(true)
    try {
      const { data } = await api.get<SavingsGoal[]>('/savings-goals')
      setGoals(data)
      setError('')
    } catch {
      setError('Failed to load savings goals. Please try again.')
    } finally {
      setInitialized(true)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this savings goal?')) return
    try {
      await api.delete(`/savings-goals/${id}`)
      setGoals((prev) => prev.filter((g) => g.id !== id))
    } catch {
      alert('Failed to delete goal.')
    }
  }

  const refresh = fetchGoals
  const activeGoals = goals.filter((g) => g.status === 'Active')
  const totalSavedAll = goals.reduce((s, g) => s + g.totalSaved, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="savings-goals" refreshing={refreshing} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Active Goals</p>
            <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Saved</p>
            <p className="text-2xl font-bold text-indigo-600">${totalSavedAll.toFixed(2)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">All Goals</p>
            <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Savings Goals{' '}
            {goals.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({goals.length})</span>
            )}
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Goal
          </button>
        </div>

        {/* Content */}
        {!initialized ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <p className="text-red-500">{error}</p>
            <button onClick={refresh} className="text-sm text-indigo-600 hover:underline">
              Try again
            </button>
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="bg-indigo-50 rounded-full p-6 mb-4">
              <Target size={40} className="text-indigo-300" />
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No savings goals yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create a goal to start tracking your savings progress.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              New Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <SavingsGoalCard
                key={goal.id}
                goal={goal}
                onViewDetails={() => setDetailGoal(goal)}
                onEdit={() => setEditGoal(goal)}
                onDelete={() => handleDelete(goal.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {(showCreate || editGoal) && (
        <CreateSavingsGoalModal
          goal={editGoal}
          onClose={() => {
            setShowCreate(false)
            setEditGoal(null)
          }}
          onSaved={() => {
            setShowCreate(false)
            setEditGoal(null)
            refresh()
          }}
        />
      )}

      {detailGoal && (
        <SavingsGoalDetailModal goal={detailGoal} onClose={() => setDetailGoal(null)} />
      )}
    </div>
  )
}

export default SavingsGoalsPage
