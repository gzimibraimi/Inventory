import { BrowserRouter as Router, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import './App.css'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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
          actions={[
            {
              label: 'Dil',
              icon: '↪',
              variant: 'outline',
              onClick: handleLogout
            }
          ]}
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
