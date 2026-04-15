import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Dashboard from '../pages/Dashboard'
import InventoryPage from '../pages/InventoryPage'
import Login from '../pages/Login'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Register from '../pages/Register'
 
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
 
  if (loading) {
    return <div className="page-content"><p>Po ngarkohet...</p></div>
  }
 
  return user ? children : <Navigate to="/login" replace />
}
 
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
 
  if (loading) {
    return <div className="page-content"><p>Po ngarkohet...</p></div>
  }
 
  return user ? <Navigate to="/dashboard" replace /> : children
}
 
export default function AppRoutes() {
  const { user } = useAuth()
 
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
 
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
 
      {/* /add now shows the inline form inside InventoryPage */}
      <Route path="/add" element={<Navigate to="/inventory" replace />} />
 
      <Route path="/products" element={<Navigate to="/search" replace />} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
 
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}