import { useEffect } from 'react';
import { useAlerts } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/formatters';

function AlertsView() {
  const { alerts, loading, fetchAlerts } = useAlerts();

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span className="section-icon">⚠️</span>
            Alertas de Stock Bajo
          </h2>
          <p className="section-subtitle">
            Productos con menos de 5 unidades en inventario
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAlerts}>
          🔄 Actualizar
        </button>
      </div>

      <div className={`alert-summary-card ${alerts.length > 0 ? 'has-alerts' : 'no-alerts'}`}>
        <span className="alert-count">{alerts.length}</span>
        <span className="alert-label">productos con stock bajo</span>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando alertas...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="empty-state success-state">
            <span className="empty-icon">✅</span>
            <p>No hay productos con stock bajo</p>
            <p className="empty-subtitle">Todos los productos tienen suficiente inventario</p>
          </div>
        ) : (
          <table className="data-table alerts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(product => (
                <tr key={product.id} className="alert-row">
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td><code>{product.sku}</code></td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <span className="stock-badge stock-critical">
                      ⚠️ {product.stock}
                    </span>
                  </td>
                  <td>{product.categoryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default AlertsView;
