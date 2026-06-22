import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { verifyLogin } from '../lib/api'

type AuthState = {
  token: string | null
  role: string | null
  fullName: string | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  signOut: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthState | null>(null)

function parseToken(token: string): { exp: number; role: string; full_name: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseToken(token)
  if (!payload) return true
  return Date.now() / 1000 > payload.exp
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aura_token'))
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('aura_role'))
  const [fullName, setFullName] = useState<string | null>(() => localStorage.getItem('aura_name'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      signOut()
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await verifyLogin(email, password)
      setToken(result.token)
      setRole(result.role)
      setFullName(result.full_name)
      localStorage.setItem('aura_token', result.token)
      localStorage.setItem('aura_role', result.role)
      localStorage.setItem('aura_name', result.full_name)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setRole(null)
    setFullName(null)
    localStorage.removeItem('aura_token')
    localStorage.removeItem('aura_role')
    localStorage.removeItem('aura_name')
  }, [])

  const isAdmin = Boolean(token && !isTokenExpired(token) && role === 'admin')

  return (
    <AuthContext.Provider value={{ token, role, fullName, isAdmin, login, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
