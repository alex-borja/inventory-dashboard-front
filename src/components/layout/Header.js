/**
 * Header Component
 * Application header with navigation
 */

import { Component } from '../base/Component.js';

export class Header extends Component {
  constructor(containerSelector, options = {}) {
    super(containerSelector);
    this.onNavigate = options.onNavigate || (() => {});
    this.activeSection = options.activeSection || 'products';
    this.navItems = [
      { id: 'products', label: 'Productos', icon: '📦' },
      { id: 'categories', label: 'Categorías', icon: '🏷️' },
      { id: 'alerts', label: 'Alertas Stock', icon: '⚠️' }
    ];
  }

  render() {
    this.setHtml(`
      <header class="app-header">
        <div class="header-content">
          <div class="header-brand">
            <h1 class="header-title">
              <span class="header-icon">📦</span>
              Gestión de Inventario
            </h1>
          </div>
          <nav class="header-nav" role="navigation" aria-label="Navegación principal">
            ${this.renderNavItems()}
          </nav>
        </div>
      </header>
    `);
  }

  renderNavItems() {
    return this.navItems
      .map(item => `
        <button 
          class="nav-btn ${item.id === this.activeSection ? 'active' : ''}"
          data-section="${item.id}"
          aria-current="${item.id === this.activeSection ? 'page' : 'false'}"
        >
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </button>
      `)
      .join('');
  }

  attachEventListeners() {
    const navBtns = this.container.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.setActiveSection(section);
        this.onNavigate(section);
      });
    });
  }

  setActiveSection(section) {
    this.activeSection = section;
    const navBtns = this.container.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      const isActive = btn.dataset.section === section;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}

export default Header;
