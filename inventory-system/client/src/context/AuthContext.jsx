import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/authApi'

export const AuthContext = createContext()
const AUTH_STORAGE_KEY = 'authUser'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
  })
  const loading = false

  const login = async (username, password) => {
    const loggedInUser = await loginUser({ username, password })
    setUser(loggedInUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser))
    return loggedInUser
  }

  const register = async ({ username, password, fullName }) => {
    return registerUser({ username, password, fullName })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
