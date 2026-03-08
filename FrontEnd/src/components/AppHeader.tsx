import React, { useState } from 'react'
import { TrendingUp, LogOut, RefreshCw, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  currentPage: 'dashboard' | 'savings-goals' | 'fixed-expenses'
  refreshing?: boolean
}

const AppHeader: React.FC<Props> = ({ currentPage, refreshing }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={26} />
          <span className="text-xl font-bold text-gray-900">Finance App</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          {refreshing && <RefreshCw size={16} className="text-indigo-400 animate-spin" />}
          {currentPage !== 'dashboard' && (
            <button
              onClick={() => navigate('/')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Dashboard
            </button>
          )}
          {currentPage !== 'savings-goals' && (
            <button
              onClick={() => navigate('/savings-goals')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Savings Goals
            </button>
          )}
          {currentPage !== 'fixed-expenses' && (
            <button
              onClick={() => navigate('/fixed-expenses')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Fixed Expenses
            </button>
          )}
          <span className="text-sm text-gray-600">
            Hello, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile right side */}
        <div className="flex sm:hidden items-center gap-3">
          {refreshing && <RefreshCw size={16} className="text-indigo-400 animate-spin" />}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          <p className="text-sm text-gray-500 pb-2 border-b border-gray-100">
            Hello, <strong className="text-gray-800">{user?.name}</strong>
          </p>
          {currentPage !== 'dashboard' && (
            <button
              onClick={() => { navigate('/'); setMenuOpen(false) }}
              className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
            >
              Dashboard
            </button>
          )}
          {currentPage !== 'savings-goals' && (
            <button
              onClick={() => { navigate('/savings-goals'); setMenuOpen(false) }}
              className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
            >
              Savings Goals
            </button>
          )}
          {currentPage !== 'fixed-expenses' && (
            <button
              onClick={() => { navigate('/fixed-expenses'); setMenuOpen(false) }}
              className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-800 py-2 transition-colors"
            >
              Fixed Expenses
            </button>
          )}
          <button
            onClick={logout}
            className="text-left flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 py-2 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

export default AppHeader
