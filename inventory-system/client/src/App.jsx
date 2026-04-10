import { BrowserRouter as Router } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import './App.css'

function Layout() {
  const { user } = useContext(AuthContext)

  // 🔐 Nese NUK ka user → mos shfaq layout
  if (!user) {
    return <AppRoutes />
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar
          title="📦 Inventory System"
          subtitle="Menaxhimi i paisjeve"
        />
        <AppRoutes />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App