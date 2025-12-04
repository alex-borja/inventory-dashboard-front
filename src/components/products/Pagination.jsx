function Pagination({ pagination, onPageChange }) {
  const { pageNumber, totalPages, totalCount, pageSize } = pagination;
  
  const start = ((pageNumber - 1) * pageSize) + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {totalCount > 0 
          ? `Mostrando ${start}-${end} de ${totalCount} productos`
          : 'No hay productos'}
      </div>
      <div className="pagination-controls">
        <button
          className="btn btn-icon"
          onClick={() => onPageChange(1)}
          disabled={pageNumber <= 1}
          title="Primera página"
        >
          ⏮️
        </button>
        <button
          className="btn btn-icon"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          title="Anterior"
        >
          ◀️
        </button>
        <span className="pagination-pages">
          {pageNumber} / {totalPages}
        </span>
        <button
          className="btn btn-icon"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          title="Siguiente"
        >
          ▶️
        </button>
        <button
          className="btn btn-icon"
          onClick={() => onPageChange(totalPages)}
          disabled={pageNumber >= totalPages}
          title="Última página"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
}

export default Pagination;
