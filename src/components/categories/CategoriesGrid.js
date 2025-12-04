/**
 * Categories Grid Component
 * Displays categories in a card grid layout
 */

import { Component } from '../base/Component.js';
import { escapeHtml } from '../../utils/dom.js';

export class CategoriesGrid extends Component {
  constructor(containerSelector, options = {}) {
    super(containerSelector);
    this.categories = [];
    this.onClick = options.onClick || (() => {});
  }

  render() {
    this.setHtml(`
      <div class="categories-grid" id="categories-grid">
        ${this.renderCards()}
      </div>
    `);
  }

  renderCards() {
    if (this.categories.length === 0) {
      return `
        <div class="empty-state categories-empty">
          <span class="empty-icon">🏷️</span>
          <p>No hay categorías disponibles</p>
        </div>
      `;
    }

    return this.categories.map(category => this.renderCard(category)).join('');
  }

  renderCard(category) {
    const productLabel = category.productCount === 1 ? 'producto' : 'productos';
    
    return `
      <div class="category-card" data-id="${category.id}">
        <div class="category-header">
          <span class="category-icon">🏷️</span>
          <h3 class="category-name">${escapeHtml(category.name)}</h3>
        </div>
        <p class="category-description">
          ${escapeHtml(category.description || 'Sin descripción')}
        </p>
        <div class="category-footer">
          <span class="category-product-count">
            <span class="count-number">${category.productCount}</span>
            ${productLabel}
          </span>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const grid = this.container.querySelector('#categories-grid');
    
    this.addEventListener(grid, 'click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) {
        const id = parseInt(card.dataset.id);
        this.onClick(id);
      }
    });
  }

  setCategories(categories) {
    this.categories = categories;
    const grid = this.container.querySelector('#categories-grid');
    if (grid) {
      grid.innerHTML = this.renderCards();
    }
  }

  showLoading() {
    const grid = this.container.querySelector('#categories-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      `;
    }
  }

  showError(message = 'Error al cargar categorías') {
    const grid = this.container.querySelector('#categories-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <span class="error-icon">❌</span>
          <p>${escapeHtml(message)}</p>
        </div>
      `;
    }
  }
}

export default CategoriesGrid;
