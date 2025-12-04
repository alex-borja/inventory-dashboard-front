/**
 * Search Bar Component
 * Product search functionality
 */

import { Component } from '../base/Component.js';
import { debounce } from '../../utils/helpers.js';
import config from '../../config/index.js';

export class SearchBar extends Component {
  constructor(containerSelector, options = {}) {
    super(containerSelector);
    this.onSearch = options.onSearch || (() => {});
    this.onClear = options.onClear || (() => {});
    this.placeholder = options.placeholder || 'Buscar productos...';
    this.debouncedSearch = debounce(
      (query) => this.onSearch(query),
      config.ui.debounceDelay
    );
  }

  render() {
    this.setHtml(`
      <div class="search-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="search" 
            id="search-input" 
            class="search-input"
            placeholder="${this.placeholder}"
            autocomplete="off"
          >
          <button 
            id="clear-search" 
            class="btn btn-icon search-clear" 
            title="Limpiar búsqueda"
            hidden
          >
            ✕
          </button>
        </div>
        <button id="search-btn" class="btn btn-primary search-btn">
          Buscar
        </button>
      </div>
    `);
  }

  attachEventListeners() {
    const input = this.container.querySelector('#search-input');
    const searchBtn = this.container.querySelector('#search-btn');
    const clearBtn = this.container.querySelector('#clear-search');

    // Search on button click
    this.addEventListener(searchBtn, 'click', () => this.performSearch());

    // Search on Enter key
    this.addEventListener(input, 'keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // Show/hide clear button
    this.addEventListener(input, 'input', (e) => {
      const hasValue = e.target.value.length > 0;
      clearBtn.hidden = !hasValue;
    });

    // Clear search
    this.addEventListener(clearBtn, 'click', () => this.clear());
  }

  performSearch() {
    const input = this.container.querySelector('#search-input');
    const query = input.value.trim();
    
    if (query) {
      this.onSearch(query);
    }
  }

  clear() {
    const input = this.container.querySelector('#search-input');
    const clearBtn = this.container.querySelector('#clear-search');
    
    input.value = '';
    clearBtn.hidden = true;
    input.focus();
    this.onClear();
  }

  getValue() {
    const input = this.container.querySelector('#search-input');
    return input?.value.trim() || '';
  }

  setValue(value) {
    const input = this.container.querySelector('#search-input');
    const clearBtn = this.container.querySelector('#clear-search');
    
    if (input) {
      input.value = value;
      clearBtn.hidden = !value;
    }
  }

  focus() {
    const input = this.container.querySelector('#search-input');
    if (input) {
      input.focus();
    }
  }
}

export default SearchBar;
