/**
 * Validation Utilities
 * Helper functions for data validation
 */

import config from '../config/index.js';

/**
 * Validate product data
 * @param {Object} product - Product data to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateProduct(product) {
  const errors = {};
  const rules = config.validation.product;

  // Name validation
  if (!product.name || product.name.trim() === '') {
    errors.name = 'El nombre es requerido';
  } else if (product.name.length < rules.nameMinLength) {
    errors.name = `El nombre debe tener al menos ${rules.nameMinLength} caracteres`;
  } else if (product.name.length > rules.nameMaxLength) {
    errors.name = `El nombre no puede exceder ${rules.nameMaxLength} caracteres`;
  }

  // SKU validation
  if (!product.sku || product.sku.trim() === '') {
    errors.sku = 'El SKU es requerido';
  } else if (!rules.skuPattern.test(product.sku.toUpperCase())) {
    errors.sku = 'El SKU debe tener formato AAA-000 (3 letras mayúsculas, guión, 3 números)';
  }

  // Price validation
  if (product.price === undefined || product.price === null || product.price === '') {
    errors.price = 'El precio es requerido';
  } else if (isNaN(product.price) || parseFloat(product.price) < rules.minPrice) {
    errors.price = `El precio debe ser mayor a ${rules.minPrice}`;
  }

  // Stock validation
  if (product.stock === undefined || product.stock === null || product.stock === '') {
    errors.stock = 'El stock es requerido';
  } else if (isNaN(product.stock) || parseInt(product.stock) < 0) {
    errors.stock = 'El stock debe ser mayor o igual a 0';
  }

  // Category validation
  if (!product.categoryId) {
    errors.categoryId = 'La categoría es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check if a value is empty
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
