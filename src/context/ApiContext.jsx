import { createContext, useContext, useState, useCallback } from 'react';

const API_DEFAULT_URL = 'http://localhost:5027/api';

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState(() => {
    return localStorage.getItem('api_base_url') || API_DEFAULT_URL;
  });
  const [isConnected, setIsConnected] = useState(null);

  const updateBaseUrl = useCallback((url) => {
    setBaseUrl(url);
    localStorage.setItem('api_base_url', url);
    setIsConnected(null);
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/categories`);
      const connected = response.ok;
      setIsConnected(connected);
      return connected;
    } catch {
      setIsConnected(false);
      return false;
    }
  }, [baseUrl]);

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (response.status === 204) {
      return { success: true };
    }

    const data = response.headers.get('content-type')?.includes('application/json')
      ? await response.json()
      : null;

    if (!response.ok) {
      const error = new Error(data?.message || `Error: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }, [baseUrl]);

  const value = {
    baseUrl,
    isConnected,
    updateBaseUrl,
    testConnection,
    apiRequest
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
