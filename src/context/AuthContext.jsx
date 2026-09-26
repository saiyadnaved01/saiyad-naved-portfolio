import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => api.getToken())
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const me = await api.get('/api/auth/me')
        if (!cancelled) setUsername(me.username)
      } catch {
        if (!cancelled) {
          api.setToken(null)
          setTokenState(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [token])

  const login = useCallback(async (u, p) => {
    const data = await api.post('/api/auth/login', { username: u, password: p })
    api.setToken(data.token)
    setTokenState(data.token)
    setUsername(data.username)
  }, [])

  const logout = useCallback(() => {
    api.setToken(null)
    setTokenState(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ username, loading, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
