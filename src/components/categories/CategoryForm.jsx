import { useState } from 'react';
import toast from 'react-hot-toast';

function CategoryForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        name: formData.name.trim(),
        description: formData.description.trim()
      });
    } catch (error) {
      const message = error.data?.errors 
        ? Object.values(error.data.errors).flat().join(', ')
        : error.data?.message || 'Error al crear categoría';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal active" onClick={(e) => e.target.className === 'modal active' && onClose()}>
      <div className="modal-content modal-medium">
        <div className="modal-header">
          <h3>Nueva Categoría</h3>
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
              placeholder="Nombre de la categoría"
              maxLength={100}
            />
            {errors.name && <span className="form-error visible">{errors.name}</span>}
            <span className="form-hint">{formData.name.length}/100 caracteres</span>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la categoría (opcional)"
              rows={4}
              maxLength={500}
            />
            {errors.description && <span className="form-error visible">{errors.description}</span>}
            <span className="form-hint">{formData.description.length}/500 caracteres</span>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
