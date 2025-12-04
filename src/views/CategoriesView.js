/**
 * Categories View
 * Manages the categories section of the application
 */

import { CategoriesGrid, toast } from '../components/index.js';
import { categoriesService } from '../services/index.js';

export class CategoriesView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.categoriesGrid = null;
    this.categories = [];
  }

  async init() {
    this.render();
    this.initComponents();
  }

  render() {
    this.container.innerHTML = `
      <section id="categories-section" class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">🏷️</span>
            Categorías
          </h2>
          <p class="section-subtitle">
            Explora las categorías de productos disponibles
          </p>
        </div>
        
        <div id="categories-grid-container"></div>
      </section>
    `;
  }

  initComponents() {
    this.categoriesGrid = new CategoriesGrid('#categories-grid-container', {
      onClick: (id) => this.handleCategoryClick(id)
    });
    this.categoriesGrid.mount();
  }

  async loadCategories() {
    this.categoriesGrid.showLoading();

    try {
      this.categories = await categoriesService.getAll();
      this.categoriesGrid.setCategories(this.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categoriesGrid.showError('Error al cargar categorías. Verifique la conexión con el servidor.');
      toast.error('Error al cargar categorías');
    }
  }

  handleCategoryClick(id) {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      toast.info(`Categoría: ${category.name} (${category.productCount} productos)`);
    }
  }

  async refresh() {
    await this.loadCategories();
  }

  show() {
    this.container.style.display = 'block';
    this.loadCategories();
  }

  hide() {
    this.container.style.display = 'none';
  }
}

export default CategoriesView;
