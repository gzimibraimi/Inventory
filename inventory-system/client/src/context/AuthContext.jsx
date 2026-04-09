import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem('authToken')
    if (token) {
      // TODO: Validate token with backend
      setUser({ username: 'admin', role: 'admin' }) // Mock user
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // TODO: Implement actual login API call
      // For now, accept any non-empty credentials
      if (username && password) {
        const mockUser = { username, role: 'admin' }
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem('authToken', 'mock-token')
        return mockUser
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}