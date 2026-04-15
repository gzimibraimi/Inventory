import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductService } from '../services/productService'

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState({ total: 0, available: 0, assigned: 0, availableItems: [] })
  const [loading, setLoading] = useState(true)

  const quickStats = [
    { label: 'Total Paisje', value: summary.total, color: '#4338ca' },
    { label: 'Lire', value: summary.available, color: '#10b981' },
    { label: 'Të Caktuara', value: summary.assigned, color: '#f59e0b' },
  ]

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await ProductService.getSummary()
        setSummary(data)
      } catch (error) {
        console.error('Failed to load summary:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  const handleNavigate = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state">
          <p>Po ngarkohet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Mirëseardhje në Sistemin e Inventarit. Këtu mund të shikoni statistikat dhe të acsesoni funksionet e sistemit.</p>
      </header>

      <div className="dashboard-grid">
        {/* Statistics Cards */}
        <section className="dashboard-section full-width">
          <h2>📊 Statistika në Kohë Reale</h2>
          <div className="stats-grid">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <h2>⚡ Qasje të Shpejta</h2>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => handleNavigate('/search')}>
              <div className="btn-icon">🔍</div>
              <div className="btn-text">
                <div className="btn-title">Kerko Paisje</div>
                <div className="btn-desc">Filtro dhe gjej paisjet</div>
              </div>
            </button>
            <button className="quick-action-btn" onClick={() => handleNavigate('/search?status=Inactive')}>
              <div className="btn-icon">📋</div>
              <div className="btn-text">
                <div className="btn-title">Paisjet Lire</div>
                <div className="btn-desc">Shiko paisjet e lira</div>
              </div>
            </button>
            <button className="quick-action-btn" onClick={() => handleNavigate('/search?status=Active')}>
              <div className="btn-icon">👤</div>
              <div className="btn-text">
                <div className="btn-title">Paisjet e Caktuara</div>
                <div className="btn-desc">Shiko paisjet e caktuara</div>
              </div>
            </button>
          </div>
        </section>

        {/* Available Items */}
        <section className="dashboard-section">
          <h2>📦 Paisjet e Lira</h2>
          {summary.availableItems && summary.availableItems.length > 0 ? (
            <div className="quick-items">
              {summary.availableItems.slice(0, 5).map((item, idx) => (
                <div key={idx} className="quick-item">
                  <div className="item-badge">{item.inventory_number}</div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-location">{item.office} • {item.location}</div>
                  </div>
                </div>
              ))}
              {summary.availableItems.length > 5 && (
                <button className="view-all-btn" onClick={() => handleNavigate('/search?status=inactive')}>
                  Shiko të gjitha ({summary.availableItems.length})
                </button>
              )}
            </div>
          ) : (
            <p className="empty-state">Nuk ka paisje të lira në këtë moment</p>
          )}
        </section>

        {/* System Info */}
        <section className="dashboard-section">
          <h2>ℹ️ Informacioni</h2>
          <div className="info-box">
            <p>
              <strong>Versioni:</strong> 1.0<br />
              <strong>Përditësimi pasues:</strong> {new Date().toLocaleDateString()}<br />
              <strong>Gjendja:</strong> <span className="status-ok">✓ Aktiv</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
