import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: location.state?.username || '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(location.state?.registered ? 'Registration successful. Please log in.' : '')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.username, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Kredencialet janë të pasakta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📦 Inventory System</h1>
          <p>Hyni në llogari për të vazhduar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            label="Përdoruesi"
            id="login-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Shkruaj përdoruesin"
          />

          <Input
            label="Fjalëkalimi"
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Shkruaj fjalëkalimin"
          />

          {error && <div className="login-error">{error}</div>}

          <Button
            type="submit"
            loading={loading}
            className="login-submit-btn"
          >
            Hyni
          </Button>
        </form>

        <div className="login-footer">
          <p>Nuk keni llogari? <Link to="/register">Regjistrohuni</Link></p>
        </div>
      </div>
    </div>
  )
}
