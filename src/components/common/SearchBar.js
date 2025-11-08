import styles from './SearchBar.module.css';
import { useState, useEffect } from 'react';

const SearchBar = ({ 
  value,
  placeholder = 'Buscar...', 
  onChange,
  onSearch,
  debounceTime = 300,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Sincronizar con el value externo si se proporciona
  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Soportar ambas props: onChange y onSearch
      const callback = onChange || onSearch;
      if (typeof callback === 'function') {
        callback(searchTerm);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime, onChange, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    const callback = onChange || onSearch;
    if (typeof callback === 'function') {
      callback('');
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  return (
    <div className={`${styles.searchBar} ${className}`}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      {searchTerm && (
        <button 
          onClick={handleClear}
          className={styles.clearButton}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Valores por defecto
SearchBar.defaultProps = {
  onChange: undefined,
  onSearch: undefined,
  value: undefined
};

export default SearchBar;
