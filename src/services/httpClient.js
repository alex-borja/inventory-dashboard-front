/**
 * HTTP Client Service
 * Handles all HTTP requests with error handling, retries, and interceptors
 */

import config from '../config/index.js';

class HttpClient {
  constructor(baseUrl = config.api.baseUrl) {
    this.baseUrl = baseUrl;
    this.timeout = config.api.timeout;
    this.retryAttempts = config.api.retryAttempts;
    this.retryDelay = config.api.retryDelay;
  }

  /**
   * Set the base URL for API requests
   * @param {string} url - The new base URL
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  /**
   * Get the current base URL
   * @returns {string} The current base URL
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Create an AbortController with timeout
   * @returns {AbortController}
   */
  createAbortController() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller;
  }

  /**
   * Sleep for a specified duration (for retry logic)
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make an HTTP request with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @param {number} attempt - Current attempt number
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}, attempt = 1) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = this.createAbortController();

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    };

    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, fetchOptions);

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true, status: 204 };
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP Error: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new Error('La solicitud ha excedido el tiempo de espera');
      }

      // Handle network errors with retry
      if (!error.status && attempt < this.retryAttempts) {
        console.warn(`Request failed, retrying... (attempt ${attempt + 1}/${this.retryAttempts})`);
        await this.sleep(this.retryDelay * attempt);
        return this.request(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Test connection to the API
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      await this.get('/categories');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default HttpClient;
