/**
 * Footer Component
 * Application footer with API configuration
 */

import { Component } from '../base/Component.js';
import { toast } from '../base/Toast.js';
import { httpClient } from '../../services/httpClient.js';
import { getFromStorage, setToStorage } from '../../utils/helpers.js';
import config from '../../config/index.js';

export class Footer extends Component {
  constructor(containerSelector) {
    super(containerSelector);
    this.isConnected = false;
  }

  render() {
    const savedUrl = getFromStorage(config.storage.apiUrl) || config.api.baseUrl;
    
    this.setHtml(`
      <footer class="app-footer">
        <div class="footer-content">
          <div class="api-config">
            <div class="api-config-group">
              <label for="api-url" class="api-label">
                <span class="api-icon">🔗</span>
                API URL:
              </label>
              <input 
                type="url" 
                id="api-url" 
                class="api-input"
                value="${savedUrl}" 
                placeholder="https://localhost:7001/api"
              >
              <button id="test-connection" class="btn btn-secondary btn-sm">
                Probar Conexión
              </button>
              <span id="connection-status" class="connection-status"></span>
            </div>
          </div>
          <div class="footer-info">
            <span class="footer-text">Inventory Management System v1.0.0</span>
          </div>
        </div>
      </footer>
    `);
  }

  attachEventListeners() {
    const testBtn = this.container.querySelector('#test-connection');
    const apiInput = this.container.querySelector('#api-url');

    this.addEventListener(testBtn, 'click', () => this.testConnection());
    this.addEventListener(apiInput, 'change', (e) => this.updateApiUrl(e.target.value));
    this.addEventListener(apiInput, 'keypress', (e) => {
      if (e.key === 'Enter') {
        this.testConnection();
      }
    });
  }

  updateApiUrl(url) {
    httpClient.setBaseUrl(url);
    setToStorage(config.storage.apiUrl, url);
    this.updateConnectionStatus(null);
  }

  async testConnection() {
    const testBtn = this.container.querySelector('#test-connection');
    const apiInput = this.container.querySelector('#api-url');
    
    testBtn.disabled = true;
    testBtn.textContent = 'Probando...';
    
    this.updateApiUrl(apiInput.value);

    try {
      const connected = await httpClient.testConnection();
      this.isConnected = connected;
      this.updateConnectionStatus(connected);
      
      if (connected) {
        toast.success('Conexión exitosa con el servidor');
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('api:connected'));
      } else {
        toast.error('No se pudo conectar con el servidor');
      }
    } catch (error) {
      this.isConnected = false;
      this.updateConnectionStatus(false);
      toast.error('Error de conexión: ' + error.message);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Probar Conexión';
    }
  }

  updateConnectionStatus(connected) {
    const statusEl = this.container.querySelector('#connection-status');
    
    if (connected === null) {
      statusEl.className = 'connection-status';
      statusEl.textContent = '';
    } else if (connected) {
      statusEl.className = 'connection-status connected';
      statusEl.textContent = '● Conectado';
    } else {
      statusEl.className = 'connection-status disconnected';
      statusEl.textContent = '● Desconectado';
    }
  }
}

export default Footer;
