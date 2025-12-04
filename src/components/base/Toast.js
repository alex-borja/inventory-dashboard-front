/**
 * Toast Notification Component
 * Displays temporary notification messages
 */

import config from '../../config/index.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.queue = [];
    this.isProcessing = false;
    this.init();
  }

  /**
   * Initialize toast container
   */
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  show(message, type = 'info', duration = config.ui.toastDuration) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  /**
   * Create a toast element
   * @param {string} message - Message to display
   * @param {string} type - Toast type
   * @returns {HTMLElement}
   */
  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = this.getIcon(type);
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;

    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.remove(toast);
    });

    return toast;
  }

  /**
   * Get icon for toast type
   * @param {string} type - Toast type
   * @returns {string}
   */
  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * Remove a toast element
   * @param {HTMLElement} toast - Toast element to remove
   */
  remove(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
      if (toast.parentNode === this.container) {
        this.container.removeChild(toast);
      }
    }, config.ui.animationDuration);
  }

  /**
   * Show success toast
   * @param {string} message - Message to display
   */
  success(message) {
    this.show(message, 'success');
  }

  /**
   * Show error toast
   * @param {string} message - Message to display
   */
  error(message) {
    this.show(message, 'error');
  }

  /**
   * Show warning toast
   * @param {string} message - Message to display
   */
  warning(message) {
    this.show(message, 'warning');
  }

  /**
   * Show info toast
   * @param {string} message - Message to display
   */
  info(message) {
    this.show(message, 'info');
  }
}

// Export singleton instance
export const toast = new ToastManager();
export default toast;
