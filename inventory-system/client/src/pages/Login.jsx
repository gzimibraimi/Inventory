import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      // TODO: Implement actual login logic
      // For now, just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store auth token (mock)
      localStorage.setItem('authToken', 'mock-token')

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError('Kredencialet janë të pasakta')
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
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Shkruaj përdoruesin"
          />

          <Input
            label="Fjalëkalimi"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
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
          <p>Demo: admin / admin</p>
        </div>
      </div>
    </div>
  )
}