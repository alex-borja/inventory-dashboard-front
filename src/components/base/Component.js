/**
 * Base Component
 * Abstract base class for all UI components
 */

import { $, createElement, clearElement } from '../../utils/dom.js';

export class Component {
  constructor(containerSelector) {
    this.container = typeof containerSelector === 'string' 
      ? $(containerSelector) 
      : containerSelector;
    this.eventListeners = [];
  }

  /**
   * Render the component - must be implemented by subclasses
   */
  render() {
    throw new Error('render() must be implemented by subclass');
  }

  /**
   * Mount the component to the DOM
   */
  mount() {
    this.render();
    this.attachEventListeners();
  }

  /**
   * Unmount the component and cleanup
   */
  unmount() {
    this.removeEventListeners();
    if (this.container) {
      clearElement(this.container);
    }
  }

  /**
   * Attach event listeners - can be overridden by subclasses
   */
  attachEventListeners() {
    // Override in subclass
  }

  /**
   * Remove all registered event listeners
   */
  removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  /**
   * Register an event listener (for cleanup)
   * @param {Element} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  /**
   * Set the container's HTML content
   * @param {string} html - HTML string
   */
  setHtml(html) {
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  /**
   * Append a child element
   * @param {Element} element - Element to append
   */
  appendChild(element) {
    if (this.container) {
      this.container.appendChild(element);
    }
  }

  /**
   * Create an element using the createElement utility
   */
  createElement(tag, attributes, children) {
    return createElement(tag, attributes, children);
  }
}

export default Component;
