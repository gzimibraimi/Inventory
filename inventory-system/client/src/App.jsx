import { BrowserRouter as Router, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'
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
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Layout />
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}
 
export default App