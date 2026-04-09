import { useTheme } from './ThemeContext'

export default function Sidebar({ activeView, onViewChange }) {
  const { isDark, toggleTheme } = useTheme()

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'search', label: '🔍 Kerko', icon: '🔍' },
    { id: 'inventory', label: '📋 Paisjet', icon: '📋' },
    { id: 'add', label: '➕ Shto Paisje', icon: '➕' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>📦 Inventory</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} title="Ndrysho temën">
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="app-version">v1.0</div>
      </div>
    </aside>
  )
}
