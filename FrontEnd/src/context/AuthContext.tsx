import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'
import { AuthResponse } from '../types'

interface AuthUser {
  email: string
  name: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    persist(data)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
    persist(data)
  }

  const persist = (data: AuthResponse) => {
    const authUser: AuthUser = { email: data.email, name: data.name }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
