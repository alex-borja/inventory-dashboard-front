/**
 * Categories Service
 * Handles all category-related API operations
 */

import { httpClient } from './httpClient.js';

class CategoriesService {
  constructor() {
    this.endpoint = '/Categories';
  }

  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll() {
    return httpClient.get(this.endpoint);
  }

  /**
   * Get a single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Category>}
   */
  async getById(id) {
    return httpClient.get(`${this.endpoint}/${id}`);
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();
export default CategoriesService;
