const NAV_ITEMS = [
  { id: 'products', label: 'Productos', icon: '📦' },
  { id: 'categories', label: 'Categorías', icon: '🏷️' },
  { id: 'alerts', label: 'Alertas Stock', icon: '⚠️' }
];

function Header({ activeSection, onNavigate }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1 className="header-title">
            <span className="header-icon">📦</span>
            Gestión de Inventario
          </h1>
        </div>
        <nav className="header-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
