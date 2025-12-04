import { useState } from 'react';

function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
      <button className="btn btn-primary" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
