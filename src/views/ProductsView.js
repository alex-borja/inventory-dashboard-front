/**
 * Products View
 * Manages the products section of the application
 */

import { ProductsTable, ProductForm, Pagination, SearchBar, DeleteConfirmation, toast } from '../components/index.js';
import { productsService } from '../services/index.js';
import config from '../config/index.js';

export class ProductsView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.currentPage = 1;
    this.pageSize = config.pagination.defaultPageSize;
    this.isSearchMode = false;
    this.searchQuery = '';
    
    // Components
    this.searchBar = null;
    this.table = null;
    this.pagination = null;
    this.productForm = null;
    this.deleteConfirmation = null;
  }

  async init() {
    this.render();
    await this.initComponents();
    await this.loadProducts();
  }

  render() {
    this.container.innerHTML = `
      <section id="products-section" class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">📦</span>
            Productos
          </h2>
          <div class="section-actions">
            <div id="search-container"></div>
            <button id="add-product-btn" class="btn btn-primary">
              <span class="btn-icon">+</span>
              Nuevo Producto
            </button>
          </div>
        </div>
        
        <div id="products-table-container" class="table-container"></div>
        <div id="pagination-container"></div>
      </section>
    `;
  }

  async initComponents() {
    // Search Bar
    this.searchBar = new SearchBar('#search-container', {
      placeholder: 'Buscar ',
      onSearch: (query) => this.handleSearch(query),
      onClear: () => this.handleClearSearch()
    });
    this.searchBar.mount();

    // Products Table
    this.table = new ProductsTable('#products-table-container', {
      onEdit: (id) => this.handleEdit(id),
      onDelete: (id, name) => this.handleDelete(id, name)
    });
    this.table.mount();

    // Pagination
    this.pagination = new Pagination('#pagination-container', {
      pageSize: this.pageSize,
      onPageChange: (page) => this.handlePageChange(page)
    });
    this.pagination.mount();

    // Product Form
    this.productForm = new ProductForm({
      onSave: (data, isEdit, id) => this.handleSave(data, isEdit, id),
      onCancel: () => {}
    });
    await this.productForm.init();

    // Delete Confirmation
    this.deleteConfirmation = new DeleteConfirmation({
      onConfirm: (id) => this.handleConfirmDelete(id),
      onCancel: () => {}
    });

    // Add Product Button
    const addBtn = this.container.querySelector('#add-product-btn');
    addBtn.addEventListener('click', () => this.productForm.openCreate());
  }

  async loadProducts() {
    this.table.showLoading();

    try {
      if (this.isSearchMode) {
        const products = await productsService.search(this.searchQuery);
        this.table.setProducts(products);
        this.pagination.update({
          pageNumber: 1,
          totalPages: 1,
          totalCount: products.length,
          pageSize: products.length
        });
      } else {
        const result = await productsService.getAll(this.currentPage, this.pageSize);
        this.table.setProducts(result.items);
        this.pagination.update(result);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.table.showError('Error al cargar productos. Verifique la conexión con el servidor.');
      toast.error('Error al cargar productos');
    }
  }

  async handleSearch(query) {
    this.isSearchMode = true;
    this.searchQuery = query;
    this.currentPage = 1;
    await this.loadProducts();
  }

  async handleClearSearch() {
    this.isSearchMode = false;
    this.searchQuery = '';
    this.currentPage = 1;
    await this.loadProducts();
  }

  async handlePageChange(page) {
    this.currentPage = page;
    await this.loadProducts();
  }

  async handleEdit(id) {
    try {
      const product = await productsService.getById(id);
      this.productForm.openEdit(product);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error al cargar el producto');
    }
  }

  handleDelete(id, name) {
    this.deleteConfirmation.open(id, name);
  }

  async handleConfirmDelete(id) {
    try {
      await productsService.delete(id);
      toast.success('Producto eliminado correctamente');
      await this.loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const message = error.data?.message || 'Error al eliminar el producto';
      toast.error(message);
      throw error;
    }
  }

  async handleSave(data, isEdit, id) {
    try {
      if (isEdit) {
        await productsService.update(id, data);
        toast.success('Producto actualizado correctamente');
      } else {
        await productsService.create(data);
        toast.success('Producto creado correctamente');
      }
      await this.loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async refresh() {
    await this.loadProducts();
    await this.productForm.refreshCategories();
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }
}

export default ProductsView;
