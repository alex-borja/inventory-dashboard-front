/**
 * Product Form Component
 * Form for creating and editing products
 */

import { Component } from '../base/Component.js';
import { Modal } from '../base/Modal.js';
import { toast } from '../base/Toast.js';
import { validateProduct } from '../../utils/validators.js';
import { categoriesService } from '../../services/categoriesService.js';

export class ProductForm extends Component {
  constructor(options = {}) {
    super(null);
    this.modal = null;
    this.categories = [];
    this.isEditing = false;
    this.currentProduct = null;
    this.onSave = options.onSave || (() => {});
    this.onCancel = options.onCancel || (() => {});
  }

  async init() {
    await this.loadCategories();
    this.createModal();
  }

  async loadCategories() {
    try {
      this.categories = await categoriesService.getAll();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
  }

  createModal() {
    this.modal = new Modal({
      id: 'product-form-modal',
      title: 'Nuevo Producto',
      size: 'medium',
      onClose: () => this.onCancel()
    });

    this.modal.render(this.renderForm());
    this.attachFormListeners();
  }

  renderForm() {
    return `
      <form id="product-form" class="form" novalidate>
        <div class="form-group">
          <label for="product-name" class="form-label">
            Nombre <span class="required">*</span>
          </label>
          <input 
            type="text" 
            id="product-name" 
            name="name"
            class="form-input" 
            required 
            minlength="2" 
            maxlength="200" 
            placeholder="Nombre del producto"
          >
          <span class="form-error" id="name-error"></span>
        </div>

        <div class="form-group">
          <label for="product-sku" class="form-label">
            SKU <span class="required">*</span>
            <span class="form-hint">(Formato: AAA-000)</span>
          </label>
          <input 
            type="text" 
            id="product-sku" 
            name="sku"
            class="form-input" 
            required 
            pattern="[A-Z]{3}-[0-9]{3}" 
            placeholder="ELE-001"
            style="text-transform: uppercase;"
          >
          <span class="form-error" id="sku-error"></span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="product-price" class="form-label">
              Precio <span class="required">*</span>
            </label>
            <div class="input-group">
              <span class="input-prefix">$</span>
              <input 
                type="number" 
                id="product-price" 
                name="price"
                class="form-input" 
                required 
                min="0.01" 
                step="0.01" 
                placeholder="0.00"
              >
            </div>
            <span class="form-error" id="price-error"></span>
          </div>

          <div class="form-group">
            <label for="product-stock" class="form-label">
              Stock <span class="required">*</span>
            </label>
            <input 
              type="number" 
              id="product-stock" 
              name="stock"
              class="form-input" 
              required 
              min="0" 
              placeholder="0"
            >
            <span class="form-error" id="stock-error"></span>
          </div>
        </div>

        <div class="form-group">
          <label for="product-category" class="form-label">
            Categoría <span class="required">*</span>
          </label>
          <select id="product-category" name="categoryId" class="form-select" required>
            <option value="">Seleccione una categoría</option>
            ${this.renderCategoryOptions()}
          </select>
          <span class="form-error" id="category-error"></span>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="cancel-btn">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" id="save-btn">
            <span class="btn-text">Guardar</span>
            <span class="btn-loading" hidden>
              <span class="spinner-small"></span>
              Guardando...
            </span>
          </button>
        </div>
      </form>
    `;
  }

  renderCategoryOptions() {
    return this.categories
      .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');
  }

  attachFormListeners() {
    const form = document.querySelector('#product-form');
    const cancelBtn = document.querySelector('#cancel-btn');
    const skuInput = document.querySelector('#product-sku');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    // Auto-uppercase SKU
    if (skuInput) {
      skuInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
      });
    }

    // Clear errors on input
    const inputs = document.querySelectorAll('#product-form .form-input, #product-form .form-select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.clearFieldError(input.name);
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = this.getFormData();
    const validation = validateProduct(formData);

    if (!validation.isValid) {
      this.showErrors(validation.errors);
      return;
    }

    this.setLoading(true);

    try {
      await this.onSave(formData, this.isEditing, this.currentProduct?.id);
      this.close();
    } catch (error) {
      this.handleSaveError(error);
    } finally {
      this.setLoading(false);
    }
  }

  getFormData() {
    return {
      name: document.querySelector('#product-name').value.trim(),
      sku: document.querySelector('#product-sku').value.toUpperCase().trim(),
      price: parseFloat(document.querySelector('#product-price').value),
      stock: parseInt(document.querySelector('#product-stock').value),
      categoryId: parseInt(document.querySelector('#product-category').value)
    };
  }

  showErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
      const errorEl = document.querySelector(`#${field}-error`);
      const inputEl = document.querySelector(`[name="${field}"]`);
      
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
      if (inputEl) {
        inputEl.classList.add('error');
      }
    });
  }

  clearFieldError(fieldName) {
    const errorEl = document.querySelector(`#${fieldName}-error`);
    const inputEl = document.querySelector(`[name="${fieldName}"]`);
    
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    if (inputEl) {
      inputEl.classList.remove('error');
    }
  }

  clearAllErrors() {
    const errors = document.querySelectorAll('.form-error');
    const inputs = document.querySelectorAll('.form-input.error, .form-select.error');
    
    errors.forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    inputs.forEach(el => el.classList.remove('error'));
  }

  handleSaveError(error) {
    if (error.data?.errors) {
      const errors = {};
      Object.entries(error.data.errors).forEach(([key, messages]) => {
        errors[key.toLowerCase()] = Array.isArray(messages) ? messages[0] : messages;
      });
      this.showErrors(errors);
    } else if (error.data?.message) {
      toast.error(error.data.message);
    } else {
      toast.error('Error al guardar el producto');
    }
  }

  setLoading(loading) {
    const saveBtn = document.querySelector('#save-btn');
    const btnText = saveBtn?.querySelector('.btn-text');
    const btnLoading = saveBtn?.querySelector('.btn-loading');

    if (saveBtn) {
      saveBtn.disabled = loading;
    }
    if (btnText) {
      btnText.hidden = loading;
    }
    if (btnLoading) {
      btnLoading.hidden = !loading;
    }
  }

  openCreate() {
    this.isEditing = false;
    this.currentProduct = null;
    this.modal.setTitle('Nuevo Producto');
    this.resetForm();
    this.modal.open();
  }

  openEdit(product) {
    this.isEditing = true;
    this.currentProduct = product;
    this.modal.setTitle('Editar Producto');
    this.populateForm(product);
    this.modal.open();
  }

  populateForm(product) {
    document.querySelector('#product-name').value = product.name;
    document.querySelector('#product-sku').value = product.sku;
    document.querySelector('#product-price').value = product.price;
    document.querySelector('#product-stock').value = product.stock;
    document.querySelector('#product-category').value = product.categoryId;
  }

  resetForm() {
    const form = document.querySelector('#product-form');
    if (form) {
      form.reset();
    }
    this.clearAllErrors();
  }

  close() {
    this.modal.close();
    this.resetForm();
    this.onCancel();
  }

  async refreshCategories() {
    await this.loadCategories();
    const select = document.querySelector('#product-category');
    if (select) {
      const currentValue = select.value;
      select.innerHTML = `
        <option value="">Seleccione una categoría</option>
        ${this.renderCategoryOptions()}
      `;
      select.value = currentValue;
    }
  }
}

export default ProductForm;
