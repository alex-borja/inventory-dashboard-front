import { useState } from 'react';

function DeleteModal({ title, itemName, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal active" onClick={(e) => e.target.className === 'modal active' && onCancel()}>
      <div className="modal-content modal-small">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="delete-confirmation">
            <div className="delete-icon">🗑️</div>
            <p className="delete-message">
              ¿Está seguro de que desea eliminar este elemento?
            </p>
            <p className="delete-product-name">{itemName}</p>
            <p className="delete-warning">
              Esta acción no se puede deshacer.
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={onCancel} disabled={deleting}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
