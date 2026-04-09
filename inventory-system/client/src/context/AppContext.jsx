import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? JSON.parse(saved) : false
  })

  // App-wide loading state
  const [loading, setLoading] = useState(false)

  // Global error state
  const [error, setError] = useState(null)

  // Theme effects
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark))
    document.body.className = isDark ? 'dark' : 'light'
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  // Clear global error
  const clearError = () => setError(null)

  // Set global loading
  const setGlobalLoading = (isLoading) => setLoading(isLoading)

  const value = {
    // Theme
    isDark,
    toggleTheme,

    // Global state
    loading,
    error,
    setGlobalLoading,
    setError,
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Backward compatibility - export useTheme as alias
export const useTheme = () => {
  const { isDark, toggleTheme } = useApp()
  return { isDark, toggleTheme }
}