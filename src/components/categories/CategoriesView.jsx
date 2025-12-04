import { useEffect, useState } from 'react';
import { useCategories, useProducts } from '../../hooks/useApi';
import CategoryForm from './CategoryForm';
import ProductsTable from '../products/ProductsTable';
import Pagination from '../products/Pagination';
import { formatCurrency } from '../../utils/formatters';

function CategoriesView() {
  const { categories, loading, fetchCategories, createCategory } = useCategories();
  const { products, pagination, loading: productsLoading, fetchProducts } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🏷️</span>
            Categorías
          </h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </section>
    );
  }

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (data) => {
    await createCategory(data);
    setIsFormOpen(false);
    fetchCategories();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(1, 10, { categoryId: category.id });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handlePageChange = (page) => {
    fetchProducts(page, pagination.pageSize, { categoryId: selectedCategory.id });
  };

  // Show products for selected category
  if (selectedCategory) {
    return (
      <section className="section">
        <div className="section-header">
          <div>
            <button className="btn btn-secondary btn-back" onClick={handleBackToCategories}>
              ← Volver a Categorías
            </button>
            <h2 className="section-title">
              <span className="section-icon">🏷️</span>
              {selectedCategory.name}
            </h2>
            <p className="section-subtitle">
              {selectedCategory.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        <div className="table-container">
          <ProductsTable
            products={products}
            loading={productsLoading}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span className="section-icon">🏷️</span>
            Categorías
          </h2>
          <p className="section-subtitle">
            Explora las categorías de productos disponibles
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <span>+</span> Nueva Categoría
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏷️</span>
          <p>No hay categorías disponibles</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-header">
                <span className="category-icon">🏷️</span>
                <h3 className="category-name">{category.name}</h3>
              </div>
              <p className="category-description">
                {category.description || 'Sin descripción'}
              </p>
              <div className="category-footer">
                <span className="category-product-count">
                  <span className="count-number">{category.productCount}</span>
                  {category.productCount === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <CategoryForm
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </section>
  );
}

export default CategoriesView;
