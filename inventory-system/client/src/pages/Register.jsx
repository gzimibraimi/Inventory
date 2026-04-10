import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await register({
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password
      })
      navigate('/login', {
        replace: true,
        state: { registered: true, username: formData.username }
      })
    } catch (err) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📦 Create Account</h1>
          <p>Regjistro përdoruesin për hyrjen e parë në sistem</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            label="Emri i plotë"
            id="register-full-name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Shkruaj emrin e plotë"
          />

          <Input
            label="Përdoruesi"
            id="register-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Minimum 3 karaktere"
          />

          <Input
            label="Fjalëkalimi"
            id="register-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Minimum 6 karaktere"
          />

          <Input
            label="Konfirmo fjalëkalimin"
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Rishkruaj fjalëkalimin"
          />

          {error && <div className="login-error">{error}</div>}

          <Button
            type="submit"
            loading={loading}
            className="login-submit-btn"
          >
            Regjistrohu
          </Button>
        </form>

        <div className="login-footer">
          <p>Keni llogari? <Link to="/login">Hyni këtu</Link></p>
        </div>
      </div>
    </div>
  )
}
