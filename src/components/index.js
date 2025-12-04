/**
 * Components Index
 * Centralizes all component exports
 */

// Base components
export { Component, Modal, toast } from './base/index.js';

// Layout components
export { Header, Footer } from './layout/index.js';

// Product components
export { 
  ProductsTable, 
  ProductForm, 
  Pagination, 
  SearchBar, 
  DeleteConfirmation 
} from './products/index.js';

// Category components
export { CategoriesGrid } from './categories/index.js';

// Alert components
export { AlertsTable } from './alerts/index.js';
