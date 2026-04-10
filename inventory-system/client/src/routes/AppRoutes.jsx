import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AddItemForm from '../components/common/AddItemForm'
import { useAuth } from '../context/AuthContext'
import Dashboard from '../pages/Dashboard'
import InventoryPage from '../pages/InventoryPage'
import Login from '../pages/Login'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Register from '../pages/Register'
import { ProductService } from '../services/productService'

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

function AddItemPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      await ProductService.createProduct(formData)
      navigate('/inventory')
    } catch (error) {
      console.error('Failed to create product:', error)
      alert(error.message || 'Gabim gjatë shtimit të paisjes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content inventory-page">
      <header className="page-header">
        <h1>➕ Shto Paisje</h1>
        <p>Krijo një paisje të re në sistem</p>
      </header>

      <AddItemForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/inventory')}
      />
    </div>
  )
}

export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route path="/products" element={<Navigate to="/search" replace />} />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddItemPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
