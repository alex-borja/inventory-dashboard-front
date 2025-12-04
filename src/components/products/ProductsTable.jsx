import { formatCurrency, getStockClass } from '../../utils/formatters';

function ProductsTable({ products, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>SKU</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td><code>{product.sku}</code></td>
            <td>{formatCurrency(product.price)}</td>
            <td>
              <span className={`stock-badge ${getStockClass(product.stock)}`}>
                {product.stock}
              </span>
            </td>
            <td>{product.categoryName}</td>
            <td>
              <div className="action-buttons">
                <button
                  className="btn btn-icon btn-edit"
                  onClick={() => onEdit(product.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn btn-icon btn-delete"
                  onClick={() => onDelete(product)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductsTable;
