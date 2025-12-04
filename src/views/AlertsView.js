/**
 * Alerts View
 * Manages the low stock alerts section of the application
 */

import { AlertsTable, toast } from '../components/index.js';
import { productsService } from '../services/index.js';
import config from '../config/index.js';

export class AlertsView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.alertsTable = null;
  }

  async init() {
    this.render();
    this.initComponents();
  }

  render() {
    this.container.innerHTML = `
      <section id="alerts-section" class="section">
        <div class="section-header">
          <div class="section-header-content">
            <h2 class="section-title">
              <span class="section-icon">⚠️</span>
              Alertas de Stock Bajo
            </h2>
            <p class="section-subtitle">
              Productos con menos de ${config.stock.lowThreshold} unidades en inventario
            </p>
          </div>
          <div class="section-actions">
            <button id="refresh-alerts-btn" class="btn btn-secondary">
              🔄 Actualizar
            </button>
          </div>
        </div>
        
        <div class="alert-summary" id="alert-summary">
          <div class="alert-summary-card">
            <span class="alert-count" id="alert-count">0</span>
            <span class="alert-label">productos con stock bajo</span>
          </div>
        </div>
        
        <div id="alerts-table-container" class="table-container"></div>
      </section>
    `;
  }

  initComponents() {
    this.alertsTable = new AlertsTable('#alerts-table-container');
    this.alertsTable.mount();

    // Refresh button
    const refreshBtn = this.container.querySelector('#refresh-alerts-btn');
    refreshBtn.addEventListener('click', () => this.loadAlerts());
  }

  async loadAlerts() {
    this.alertsTable.showLoading();

    try {
      const alerts = await productsService.getAlerts();
      this.alertsTable.setAlerts(alerts);
      this.updateSummary(alerts.length);
    } catch (error) {
      console.error('Error loading alerts:', error);
      this.alertsTable.showError('Error al cargar alertas. Verifique la conexión con el servidor.');
      toast.error('Error al cargar alertas');
    }
  }

  updateSummary(count) {
    const countEl = this.container.querySelector('#alert-count');
    const summaryCard = this.container.querySelector('.alert-summary-card');
    
    if (countEl) {
      countEl.textContent = count;
    }

    if (summaryCard) {
      summaryCard.classList.toggle('has-alerts', count > 0);
      summaryCard.classList.toggle('no-alerts', count === 0);
    }
  }

  async refresh() {
    await this.loadAlerts();
  }

  show() {
    this.container.style.display = 'block';
    this.loadAlerts();
  }

  hide() {
    this.container.style.display = 'none';
  }
}

export default AlertsView;
