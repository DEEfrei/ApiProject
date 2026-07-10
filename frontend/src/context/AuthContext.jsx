import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { setOnUnauthorized } from '../api/client'

const TOKEN_KEY = 'cinematch_token'

const AuthContext = createContext(null)

function decodeUser(token) {
  try {
    const payload = jwtDecode(token)
    // Un JWT expiré n'est pas utilisable.
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    return stored ? decodeUser(stored) : null
  })
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback((newToken) => {
    const decoded = decodeUser(newToken)
    if (!decoded) {
      throw new Error('Token JWT invalide ou expiré reçu du backend.')
    }
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(decoded)
  }, [])

  // Si l'API renvoie 401/403 (token invalide/expiré côté serveur),
  // on force la déconnexion locale pour rester cohérent.
  useEffect(() => {
    setOnUnauthorized(() => logout())
  }, [logout])

  useEffect(() => {
    setLoading(false)
  }, [])

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un <AuthProvider>')
  }
  return ctx
}
