/**
 * Application Main Entry Point
 * Initializes and manages the inventory management application
 */

import { Header, Footer } from './components/index.js';
import { ProductsView, CategoriesView, AlertsView } from './views/index.js';
import { httpClient } from './services/index.js';
import { getFromStorage } from './utils/helpers.js';
import config from './config/index.js';

// Import styles
import './styles/main.css';

class App {
  constructor() {
    this.currentSection = 'products';
    this.header = null;
    this.footer = null;
    this.views = {};
  }

  async init() {
    // Restore saved API URL
    const savedUrl = getFromStorage(config.storage.apiUrl);
    if (savedUrl) {
      httpClient.setBaseUrl(savedUrl);
    }

    this.renderLayout();
    await this.initComponents();
    this.attachGlobalListeners();
    
    // Show initial section
    this.showSection('products');
  }

  renderLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-layout">
        <div id="header-container"></div>
        <main class="main-content">
          <div id="products-view" class="view"></div>
          <div id="categories-view" class="view" style="display: none;"></div>
          <div id="alerts-view" class="view" style="display: none;"></div>
        </main>
        <div id="footer-container"></div>
      </div>
    `;
  }

  async initComponents() {
    // Header
    this.header = new Header('#header-container', {
      activeSection: this.currentSection,
      onNavigate: (section) => this.showSection(section)
    });
    this.header.mount();

    // Footer
    this.footer = new Footer('#footer-container');
    this.footer.mount();

    // Views
    this.views.products = new ProductsView('#products-view');
    this.views.categories = new CategoriesView('#categories-view');
    this.views.alerts = new AlertsView('#alerts-view');

    await Promise.all([
      this.views.products.init(),
      this.views.categories.init(),
      this.views.alerts.init()
    ]);
  }

  attachGlobalListeners() {
    // Listen for API connection events
    window.addEventListener('api:connected', () => {
      this.refreshCurrentView();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + 1/2/3 to switch sections
      if (e.altKey) {
        switch (e.key) {
          case '1':
            this.showSection('products');
            break;
          case '2':
            this.showSection('categories');
            break;
          case '3':
            this.showSection('alerts');
            break;
        }
      }
    });
  }

  showSection(section) {
    // Hide all views
    Object.values(this.views).forEach(view => view.hide());

    // Show selected view
    this.currentSection = section;
    if (this.views[section]) {
      this.views[section].show();
    }

    // Update header navigation
    this.header.setActiveSection(section);
  }

  async refreshCurrentView() {
    const currentView = this.views[this.currentSection];
    if (currentView && typeof currentView.refresh === 'function') {
      await currentView.refresh();
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(error => {
    console.error('Failed to initialize application:', error);
  });
});

export default App;
