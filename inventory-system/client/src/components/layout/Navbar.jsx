import Button from '../common/Button.jsx';
import './Navbar.css';

const Navbar = ({
  title,
  subtitle,
  actions = [],
  onMenuClick,
  showMenuButton = false
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showMenuButton && (
          <Button
            variant="outline"
            size="small"
            onClick={onMenuClick}
            className="navbar-menu-btn"
            aria-label="Toggle menu"
          >
            ☰
          </Button>
        )}

        <div className="navbar-title-section">
          {title && <h1 className="navbar-title">{title}</h1>}
          {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'secondary'}
            size={action.size || 'medium'}
            onClick={action.onClick}
            disabled={action.disabled}
            loading={action.loading}
            className={action.className}
          >
            {action.icon && <span className="navbar-action-icon">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;