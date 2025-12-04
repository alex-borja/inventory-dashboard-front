/**
 * Pagination Component
 * Reusable pagination control
 */

import { Component } from '../base/Component.js';

export class Pagination extends Component {
  constructor(containerSelector, options = {}) {
    super(containerSelector);
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalCount = 0;
    this.pageSize = options.pageSize || 10;
    this.onPageChange = options.onPageChange || (() => {});
  }

  render() {
    this.setHtml(`
      <div class="pagination">
        <div class="pagination-info">
          <span id="pagination-summary">
            Mostrando 0 de 0 productos
          </span>
        </div>
        <div class="pagination-controls">
          <button 
            id="first-page" 
            class="btn btn-icon pagination-btn" 
            title="Primera página"
            disabled
          >
            ⏮️
          </button>
          <button 
            id="prev-page" 
            class="btn btn-icon pagination-btn" 
            title="Página anterior"
            disabled
          >
            ◀️
          </button>
          <span class="pagination-pages">
            <span id="current-page">1</span>
            <span class="pagination-separator">/</span>
            <span id="total-pages">1</span>
          </span>
          <button 
            id="next-page" 
            class="btn btn-icon pagination-btn" 
            title="Página siguiente"
            disabled
          >
            ▶️
          </button>
          <button 
            id="last-page" 
            class="btn btn-icon pagination-btn" 
            title="Última página"
            disabled
          >
            ⏭️
          </button>
        </div>
      </div>
    `);
  }

  attachEventListeners() {
    const firstBtn = this.container.querySelector('#first-page');
    const prevBtn = this.container.querySelector('#prev-page');
    const nextBtn = this.container.querySelector('#next-page');
    const lastBtn = this.container.querySelector('#last-page');

    this.addEventListener(firstBtn, 'click', () => this.goToPage(1));
    this.addEventListener(prevBtn, 'click', () => this.goToPage(this.currentPage - 1));
    this.addEventListener(nextBtn, 'click', () => this.goToPage(this.currentPage + 1));
    this.addEventListener(lastBtn, 'click', () => this.goToPage(this.totalPages));
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updateDisplay();
    this.onPageChange(page);
  }

  update(paginationData) {
    this.currentPage = paginationData.pageNumber;
    this.totalPages = paginationData.totalPages;
    this.totalCount = paginationData.totalCount;
    this.pageSize = paginationData.pageSize;
    this.updateDisplay();
  }

  updateDisplay() {
    const currentPageEl = this.container.querySelector('#current-page');
    const totalPagesEl = this.container.querySelector('#total-pages');
    const summaryEl = this.container.querySelector('#pagination-summary');
    const firstBtn = this.container.querySelector('#first-page');
    const prevBtn = this.container.querySelector('#prev-page');
    const nextBtn = this.container.querySelector('#next-page');
    const lastBtn = this.container.querySelector('#last-page');

    // Update text
    if (currentPageEl) currentPageEl.textContent = this.currentPage;
    if (totalPagesEl) totalPagesEl.textContent = this.totalPages;

    // Update summary
    if (summaryEl) {
      const start = ((this.currentPage - 1) * this.pageSize) + 1;
      const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
      summaryEl.textContent = this.totalCount > 0
        ? `Mostrando ${start}-${end} de ${this.totalCount} productos`
        : 'No hay productos';
    }

    // Update button states
    const isFirstPage = this.currentPage <= 1;
    const isLastPage = this.currentPage >= this.totalPages;

    if (firstBtn) firstBtn.disabled = isFirstPage;
    if (prevBtn) prevBtn.disabled = isFirstPage;
    if (nextBtn) nextBtn.disabled = isLastPage;
    if (lastBtn) lastBtn.disabled = isLastPage;
  }

  reset() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalCount = 0;
    this.updateDisplay();
  }
}

export default Pagination;
