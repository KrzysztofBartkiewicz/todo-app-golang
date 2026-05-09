import { useSetAtom } from 'jotai'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { userNameAtom } from '../state/user'
import { RESET } from 'jotai/utils'

interface AuthContextValue {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const getTokenExpMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const setUserName = useSetAtom(userNameAtom)

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUserName(RESET)
  }

  useEffect(() => {
    if (!token) return
    const expMs = getTokenExpMs(token)
    if (!expMs) return
    const remaining = expMs - Date.now()
    if (remaining <= 0) {
      window.dispatchEvent(new Event('auth:expired'))
      return
    }
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('auth:expired'))
    }, remaining)
    return () => clearTimeout(timer)
  }, [token])

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return ctx
}
