import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
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
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App