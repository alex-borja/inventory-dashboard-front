/**
 * Alerts Table Component
 * Displays low stock alerts
 */

import { Component } from '../base/Component.js';
import { escapeHtml } from '../../utils/dom.js';
import { formatCurrency } from '../../utils/formatters.js';

export class AlertsTable extends Component {
  constructor(containerSelector) {
    super(containerSelector);
    this.alerts = [];
  }

  render() {
    this.setHtml(`
      <div class="table-wrapper">
        <table class="data-table alerts-table" id="alerts-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-name">Nombre</th>
              <th class="col-sku">SKU</th>
              <th class="col-price">Precio</th>
              <th class="col-stock">Stock</th>
              <th class="col-category">Categoría</th>
            </tr>
          </thead>
          <tbody id="alerts-tbody">
            ${this.renderRows()}
          </tbody>
        </table>
      </div>
    `);
  }

  renderRows() {
    if (this.alerts.length === 0) {
      return `
        <tr class="empty-row">
          <td colspan="6">
            <div class="empty-state success-state">
              <span class="empty-icon">✅</span>
              <p>No hay productos con stock bajo</p>
              <p class="empty-subtitle">Todos los productos tienen suficiente inventario</p>
            </div>
          </td>
        </tr>
      `;
    }

    return this.alerts.map(product => this.renderRow(product)).join('');
  }

  renderRow(product) {
    return `
      <tr class="alert-row" data-id="${product.id}">
        <td class="col-id">${product.id}</td>
        <td class="col-name">${escapeHtml(product.name)}</td>
        <td class="col-sku"><code>${escapeHtml(product.sku)}</code></td>
        <td class="col-price">${formatCurrency(product.price)}</td>
        <td class="col-stock">
          <span class="stock-badge stock-critical">
            ⚠️ ${product.stock}
          </span>
        </td>
        <td class="col-category">${escapeHtml(product.categoryName)}</td>
      </tr>
    `;
  }

  setAlerts(alerts) {
    this.alerts = alerts;
    const tbody = this.container.querySelector('#alerts-tbody');
    if (tbody) {
      tbody.innerHTML = this.renderRows();
    }
  }

  getAlertCount() {
    return this.alerts.length;
  }

  showLoading() {
    const tbody = this.container.querySelector('#alerts-tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="loading-row">
          <td colspan="6">
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Cargando alertas...</p>
            </div>
          </td>
        </tr>
      `;
    }
  }

  showError(message = 'Error al cargar alertas') {
    const tbody = this.container.querySelector('#alerts-tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="error-row">
          <td colspan="6">
            <div class="error-state">
              <span class="error-icon">❌</span>
              <p>${escapeHtml(message)}</p>
            </div>
          </td>
        </tr>
      `;
    }
  }
}

export default AlertsTable;
