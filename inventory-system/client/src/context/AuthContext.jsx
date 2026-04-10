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

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    if (token) {
      // mock user
      setUser({ username: 'admin', role: 'admin' })
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    if (!username || !password) {
      throw new Error('Invalid credentials')
    }

    const mockUser = { username, role: 'admin' }

    setUser(mockUser)
    localStorage.setItem('authToken', 'mock-token')

    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}