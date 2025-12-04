/**
 * Products Table Component
 * Displays products in a table with actions
 */

import { Component } from '../base/Component.js';
import { escapeHtml } from '../../utils/dom.js';
import { formatCurrency } from '../../utils/formatters.js';
import config from '../../config/index.js';

export class ProductsTable extends Component {
  constructor(containerSelector, options = {}) {
    super(containerSelector);
    this.products = [];
    this.onEdit = options.onEdit || (() => {});
    this.onDelete = options.onDelete || (() => {});
  }

  render() {
    this.setHtml(`
      <div class="table-wrapper">
        <table class="data-table" id="products-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-name">Nombre</th>
              <th class="col-sku">SKU</th>
              <th class="col-price">Precio</th>
              <th class="col-stock">Stock</th>
              <th class="col-category">Categoría</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody id="products-tbody">
            ${this.renderRows()}
          </tbody>
        </table>
      </div>
    `);
  }

  renderRows() {
    if (this.products.length === 0) {
      return `
        <tr class="empty-row">
          <td colspan="7">
            <div class="empty-state">
              <span class="empty-icon">📦</span>
              <p>No hay productos disponibles</p>
            </div>
          </td>
        </tr>
      `;
    }

    return this.products.map(product => this.renderRow(product)).join('');
  }

  renderRow(product) {
    const stockClass = this.getStockClass(product.stock);
    const stockIcon = this.getStockIcon(product.stock);

    return `
      <tr data-id="${product.id}">
        <td class="col-id">${product.id}</td>
        <td class="col-name">${escapeHtml(product.name)}</td>
        <td class="col-sku"><code>${escapeHtml(product.sku)}</code></td>
        <td class="col-price">${formatCurrency(product.price)}</td>
        <td class="col-stock">
          <span class="stock-badge ${stockClass}">
            ${stockIcon} ${product.stock}
          </span>
        </td>
        <td class="col-category">${escapeHtml(product.categoryName)}</td>
        <td class="col-actions">
          <div class="action-buttons">
            <button 
              class="btn btn-icon btn-edit" 
              data-action="edit" 
              data-id="${product.id}"
              title="Editar producto"
            >
              ✏️
            </button>
            <button 
              class="btn btn-icon btn-delete" 
              data-action="delete" 
              data-id="${product.id}"
              data-name="${escapeHtml(product.name)}"
              title="Eliminar producto"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  getStockClass(stock) {
    if (stock < config.stock.lowThreshold) return 'stock-low';
    if (stock < config.stock.warningThreshold) return 'stock-warning';
    return 'stock-ok';
  }

  getStockIcon(stock) {
    if (stock < config.stock.lowThreshold) return '⚠️';
    if (stock < config.stock.warningThreshold) return '⚡';
    return '✓';
  }

  attachEventListeners() {
    const tbody = this.container.querySelector('#products-tbody');
    
    this.addEventListener(tbody, 'click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const id = parseInt(button.dataset.id);
      const name = button.dataset.name;

      if (action === 'edit') {
        this.onEdit(id);
      } else if (action === 'delete') {
        this.onDelete(id, name);
      }
    });
  }

  setProducts(products) {
    this.products = products;
    const tbody = this.container.querySelector('#products-tbody');
    if (tbody) {
      tbody.innerHTML = this.renderRows();
    }
  }

  showLoading() {
    const tbody = this.container.querySelector('#products-tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="loading-row">
          <td colspan="7">
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          </td>
        </tr>
      `;
    }
  }

  showError(message = 'Error al cargar productos') {
    const tbody = this.container.querySelector('#products-tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="error-row">
          <td colspan="7">
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

export default ProductsTable;
