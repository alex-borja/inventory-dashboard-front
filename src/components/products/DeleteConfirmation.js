/**
 * Delete Confirmation Dialog
 * Modal for confirming product deletion
 */

import { Modal } from '../base/Modal.js';

export class DeleteConfirmation {
  constructor(options = {}) {
    this.modal = null;
    this.productId = null;
    this.productName = '';
    this.onConfirm = options.onConfirm || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.createModal();
  }

  createModal() {
    this.modal = new Modal({
      id: 'delete-confirmation-modal',
      title: 'Confirmar Eliminación',
      size: 'small',
      onClose: () => this.onCancel()
    });

    this.modal.render(this.renderContent());
    this.attachListeners();
  }

  renderContent() {
    return `
      <div class="delete-confirmation">
        <div class="delete-icon">🗑️</div>
        <p class="delete-message">
          ¿Está seguro de que desea eliminar este producto?
        </p>
        <p class="delete-product-name" id="delete-product-name"></p>
        <p class="delete-warning">
          Esta acción no se puede deshacer.
        </p>
        <div class="form-actions">
          <button class="btn btn-secondary" id="cancel-delete-btn">
            Cancelar
          </button>
          <button class="btn btn-danger" id="confirm-delete-btn">
            <span class="btn-text">Eliminar</span>
            <span class="btn-loading" hidden>
              <span class="spinner-small"></span>
              Eliminando...
            </span>
          </button>
        </div>
      </div>
    `;
  }

  attachListeners() {
    const cancelBtn = document.querySelector('#cancel-delete-btn');
    const confirmBtn = document.querySelector('#confirm-delete-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirm());
    }
  }

  open(productId, productName) {
    this.productId = productId;
    this.productName = productName;

    const nameEl = document.querySelector('#delete-product-name');
    if (nameEl) {
      nameEl.textContent = productName;
    }

    this.modal.open();
  }

  close() {
    this.modal.close();
    this.productId = null;
    this.productName = '';
    this.setLoading(false);
    this.onCancel();
  }

  async confirm() {
    if (!this.productId) return;

    this.setLoading(true);

    try {
      await this.onConfirm(this.productId);
      this.close();
    } catch (error) {
      this.setLoading(false);
      throw error;
    }
  }

  setLoading(loading) {
    const confirmBtn = document.querySelector('#confirm-delete-btn');
    const btnText = confirmBtn?.querySelector('.btn-text');
    const btnLoading = confirmBtn?.querySelector('.btn-loading');
    const cancelBtn = document.querySelector('#cancel-delete-btn');

    if (confirmBtn) confirmBtn.disabled = loading;
    if (cancelBtn) cancelBtn.disabled = loading;
    if (btnText) btnText.hidden = loading;
    if (btnLoading) btnLoading.hidden = !loading;
  }
}

export default DeleteConfirmation;
