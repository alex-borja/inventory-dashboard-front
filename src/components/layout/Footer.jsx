import { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import toast from 'react-hot-toast';

function Footer() {
  const { baseUrl, isConnected, updateBaseUrl, testConnection } = useApi();
  const [url, setUrl] = useState(baseUrl);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    updateBaseUrl(url);
    const connected = await testConnection();
    setTesting(false);
    
    if (connected) {
      toast.success('Conexión exitosa');
    } else {
      toast.error('Error de conexión');
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="api-config">
          <label htmlFor="api-url" className="api-label">
            <span className="api-icon">🔗</span>
            API URL:
          </label>
          <input
            type="url"
            id="api-url"
            className="api-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:5027/api"
          />
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Probando...' : 'Probar Conexión'}
          </button>
          {isConnected !== null && (
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              ● {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          )}
        </div>
        <div className="footer-info">
          <span>Inventory Dashboard v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
