/**
 * Products Service
 * Handles all product-related API operations
 */

import { httpClient } from './httpClient.js';

class ProductsService {
  constructor() {
    this.endpoint = '/Products';
  }

  /**
   * Get paginated list of products
   * @param {number} pageNumber - Page number (1-indexed)
   * @param {number} pageSize - Number of items per page
   * @returns {Promise<PaginatedResult>}
   */
  async getAll(pageNumber = 1, pageSize = 10) {
    return httpClient.get(this.endpoint, { pageNumber, pageSize });
  }

  /**
   * Get a single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Product>}
   */
  async getById(id) {
    return httpClient.get(`${this.endpoint}/${id}`);
  }

  /**
   * Search products by name
   * @param {string} query - Search term
   * @returns {Promise<Product[]>}
   */
  async search(query) {
    return httpClient.get(`${this.endpoint}/search`, { q: query });
  }

  /**
   * Get products with low stock (< 5 units)
   * @returns {Promise<Product[]>}
   */
  async getAlerts() {
    return httpClient.get(`${this.endpoint}/alerts`);
  }

  /**
   * Create a new product
   * @param {ProductCreateDto} product - Product data
   * @returns {Promise<Product>}
   */
  async create(product) {
    return httpClient.post(this.endpoint, product);
  }

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {ProductUpdateDto} product - Updated product data
   * @returns {Promise<Product>}
   */
  async update(id, product) {
    return httpClient.put(`${this.endpoint}/${id}`, product);
  }

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return httpClient.delete(`${this.endpoint}/${id}`);
  }
}

// Export singleton instance
export const productsService = new ProductsService();
export default ProductsService;
