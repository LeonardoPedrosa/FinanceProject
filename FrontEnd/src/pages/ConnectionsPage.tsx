import React, { useEffect, useState } from 'react'
import { Trash2, UserPlus, Users } from 'lucide-react'
import api from '../api/client'
import AppHeader from '../components/AppHeader'
import { MyConnection } from '../types'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const ConnectionsPage: React.FC = () => {
  const [connection, setConnection] = useState<MyConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState('')

  const fetchConnection = async () => {
    try {
      const res = await api.get<MyConnection>('/user-connections/my-connection')
      setConnection(res.status === 204 ? null : res.data)
    } catch {
      setError('Failed to load connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnection()
  }, [])

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setConnectError('')
    setConnecting(true)
    try {
      const res = await api.post<MyConnection>('/user-connections', { receiverEmail: email.trim() })
      setConnection(res.data)
      setEmail('')
    } catch (err) {
      setConnectError(getErrorMessage(err))
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!connection) return
    try {
      await api.delete(`/user-connections/${connection.connectionId}`)
      setConnection(null)
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="connections" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : connection ? (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your connection</h2>
            <p className="text-sm text-gray-500 mb-4">
              You and your partner share each other's dashboard — categories, fixed expenses and monthly budget are visible to both.
            </p>
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {connection.partnerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{connection.partnerName}</p>
                  <p className="text-xs text-gray-400">{connection.partnerEmail}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                title="Disconnect"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Connect with someone</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your partner's email to share each other's dashboard. Both of you will see each other's non-private categories, fixed expenses and monthly budget.
            </p>
            <form onSubmit={handleConnect} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@email.com"
                required
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={connecting}
                className="flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus size={15} />
                {connecting ? 'Connecting…' : 'Connect'}
              </button>
            </form>
            {connectError && (
              <p className="mt-2 text-sm text-red-600">{connectError}</p>
            )}
            <div className="mt-6 flex items-center gap-3 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200 p-5">
              <Users size={20} />
              <p className="text-sm">You don't have an active connection yet.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default ConnectionsPage
