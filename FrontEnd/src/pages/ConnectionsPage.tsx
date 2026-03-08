import React, { useEffect, useState } from 'react'
import { Trash2, UserPlus, Users } from 'lucide-react'
import api from '../api/client'
import AppHeader from '../components/AppHeader'
import { UserConnection } from '../types'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const ConnectionsPage: React.FC = () => {
  const [asSharer, setAsSharer] = useState<UserConnection[]>([])
  const [asReceiver, setAsReceiver] = useState<UserConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState('')
  const [connectSuccess, setConnectSuccess] = useState('')

  const fetchConnections = async () => {
    try {
      const [sharerRes, receiverRes] = await Promise.all([
        api.get<UserConnection[]>('/user-connections/as-sharer'),
        api.get<UserConnection[]>('/user-connections/as-receiver'),
      ])
      setAsSharer(sharerRes.data)
      setAsReceiver(receiverRes.data)
    } catch {
      setError('Failed to load connections.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setConnectError('')
    setConnectSuccess('')
    setConnecting(true)
    try {
      await api.post('/user-connections', { receiverEmail: email.trim() })
      setEmail('')
      setConnectSuccess('Connection created successfully.')
      fetchConnections()
    } catch (err) {
      setConnectError(getErrorMessage(err))
    } finally {
      setConnecting(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/user-connections/${id}`)
      setAsSharer((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="connections" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Share my data section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Share my data with someone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter someone's email to let them see your categories and fixed expenses on their dashboard.
          </p>
          <form onSubmit={handleConnect} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="their@email.com"
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
          {connectSuccess && (
            <p className="mt-2 text-sm text-green-600">{connectSuccess}</p>
          )}
        </section>

        {/* People I share with */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">People I share with</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : asSharer.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200 p-5">
              <Users size={20} />
              <p className="text-sm">You haven't shared your data with anyone yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {asSharer.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.receiverName}</p>
                    <p className="text-xs text-gray-400">{c.receiverEmail}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(c.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                    title="Remove connection"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* People sharing with me */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">People sharing with me</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : asReceiver.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200 p-5">
              <Users size={20} />
              <p className="text-sm">No one is sharing their data with you yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {asReceiver.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.sharerName}</p>
                    <p className="text-xs text-gray-400">{c.sharerEmail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default ConnectionsPage
