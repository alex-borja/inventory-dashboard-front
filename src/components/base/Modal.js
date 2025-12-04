/**
 * Modal Component
 * Reusable modal dialog component
 */

import { Component } from './Component.js';
import { $ } from '../../utils/dom.js';

export class Modal extends Component {
  constructor(options = {}) {
    super(null);
    this.id = options.id || `modal-${Date.now()}`;
    this.title = options.title || '';
    this.size = options.size || 'medium'; // small, medium, large
    this.onClose = options.onClose || (() => {});
    this.element = null;
  }

  /**
   * Create the modal HTML structure
   * @param {string} content - Modal body content
   * @returns {string}
   */
  createModalHtml(content) {
    return `
      <div id="${this.id}" class="modal">
        <div class="modal-content modal-${this.size}">
          <div class="modal-header">
            <h3 class="modal-title">${this.title}</h3>
            <button class="modal-close-btn" aria-label="Cerrar">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the modal
   * @param {string} content - Modal body content
   */
  render(content = '') {
    // Remove existing modal if present
    const existing = $(`#${this.id}`);
    if (existing) {
      existing.remove();
    }

    // Create and append modal
    const template = document.createElement('template');
    template.innerHTML = this.createModalHtml(content);
    document.body.appendChild(template.content.firstElementChild);

    this.element = $(`#${this.id}`);
    this.attachEventListeners();
  }

  /**
   * Attach modal event listeners
   */
  attachEventListeners() {
    if (!this.element) return;

    const closeBtn = $('.modal-close-btn', this.element);
    
    // Close button click
    this.addEventListener(closeBtn, 'click', () => this.close());

    // Click outside to close
    this.addEventListener(this.element, 'click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    // Escape key to close
    this.escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  /**
   * Open the modal
   */
  open() {
    if (this.element) {
      this.element.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  /**
   * Close the modal
   */
  close() {
    if (this.element) {
      this.element.classList.remove('active');
      document.body.classList.remove('modal-open');
      this.onClose();
    }
  }

  /**
   * Check if modal is open
   * @returns {boolean}
   */
  isOpen() {
    return this.element?.classList.contains('active');
  }

  /**
   * Set modal title
   * @param {string} title - New title
   */
  setTitle(title) {
    this.title = title;
    const titleEl = $('.modal-title', this.element);
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set modal body content
   * @param {string} content - New content HTML
   */
  setContent(content) {
    const bodyEl = $('.modal-body', this.element);
    if (bodyEl) {
      bodyEl.innerHTML = content;
    }
  }

  /**
   * Destroy the modal and cleanup
   */
  destroy() {
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
    }
    this.removeEventListeners();
    if (this.element) {
      this.element.remove();
    }
  }
}

export default Modal;
