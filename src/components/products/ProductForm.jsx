import { useState, useEffect } from 'react';

function ProductForm({ product, categories, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!/^[A-Z]{3}-[0-9]{3}$/.test(formData.sku)) {
      newErrors.sku = 'Formato inválido (AAA-000)';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Seleccione una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sku' ? value.toUpperCase() : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId)
      });
    } catch {
      // Error handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal active" onClick={(e) => e.target.className === 'modal active' && onClose()}>
      <div className="modal-content modal-medium">
        <div className="modal-header">
          <h3>{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
            />
            {errors.name && <span className="form-error visible">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sku" className="form-label">
              SKU <span className="required">*</span>
              <span className="form-hint">(Formato: AAA-000)</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              className={`form-input ${errors.sku ? 'error' : ''}`}
              value={formData.sku}
              onChange={handleChange}
              placeholder="ELE-001"
            />
            {errors.sku && <span className="form-error visible">{errors.sku}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Precio <span className="required">*</span>
              </label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
              {errors.price && <span className="form-error visible">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock" className="form-label">
                Stock <span className="required">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className={`form-input ${errors.stock ? 'error' : ''}`}
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
              {errors.stock && <span className="form-error visible">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId" className="form-label">
              Categoría <span className="required">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className={`form-select ${errors.categoryId ? 'error' : ''}`}
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="form-error visible">{errors.categoryId}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
