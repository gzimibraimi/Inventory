import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "search", label: "Kerko", icon: "🔍", path: "/search" },
    { id: "inventory", label: "Paisjet", icon: "📋", path: "/inventory" },
    { id: "add", label: "Shto Paisje", icon: "➕", path: "/add" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>📦 Inventory</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item${location.pathname === item.path ? " active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </aside>
  );
}
