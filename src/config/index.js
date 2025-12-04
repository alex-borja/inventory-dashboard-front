/**
 * Application Configuration
 * Centralized configuration for the inventory management system
 */

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5027/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
    pageSizeOptions: [5, 10, 25, 50]
  },

  // Stock thresholds
  stock: {
    lowThreshold: 5,
    warningThreshold: 15
  },

  // UI Configuration
  ui: {
    toastDuration: 3000,
    debounceDelay: 300,
    animationDuration: 300
  },

  // Validation rules
  validation: {
    product: {
      nameMinLength: 2,
      nameMaxLength: 200,
      skuPattern: /^[A-Z]{3}-[0-9]{3}$/,
      minPrice: 0.01
    }
  },

  // Local storage keys
  storage: {
    apiUrl: 'inventory_api_url',
    theme: 'inventory_theme',
    pageSize: 'inventory_page_size'
  }
};

// Freeze to prevent accidental modifications
Object.freeze(config);
Object.freeze(config.api);
Object.freeze(config.pagination);
Object.freeze(config.stock);
Object.freeze(config.ui);
Object.freeze(config.validation);
Object.freeze(config.storage);

export default config;
