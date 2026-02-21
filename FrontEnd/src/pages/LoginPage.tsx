import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Invalid credentials. Please try again.'
  }
  return 'An unexpected error occurred.'
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-100 rounded-full p-3 mb-3">
            <TrendingUp className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Finance App</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your finances</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
