/**
 * Formatting Utilities
 * Helper functions for data formatting
 */

/**
 * Format a number as currency (USD)
 * @param {number} value - Value to format
 * @param {string} locale - Locale for formatting
 * @param {string} currency - Currency code
 * @returns {string}
 */
export function formatCurrency(value, locale = 'es-ES', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Format a number with thousand separators
 * @param {number} value - Value to format
 * @param {string} locale - Locale for formatting
 * @returns {string}
 */
export function formatNumber(value, locale = 'es-ES') {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a date
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, locale = 'es-ES', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of a string
 * @param {string} text - Text to capitalize
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to title case
 * @param {string} text - Text to convert
 * @returns {string}
 */
export function titleCase(text) {
  if (!text) return '';
  return text.split(' ').map(capitalize).join(' ');
}
