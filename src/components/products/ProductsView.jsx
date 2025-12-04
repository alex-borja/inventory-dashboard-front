import { useState, useEffect } from 'react';
import { useProducts, useCategories } from '../../hooks/useApi';
import ProductsTable from './ProductsTable';
import ProductForm from './ProductForm';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import DeleteModal from '../common/DeleteModal';
import toast from 'react-hot-toast';

function ProductsView() {
  const { 
    products, 
    pagination, 
    loading, 
    fetchProducts, 
    searchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProduct 
  } = useProducts();
  
  const { categories, fetchCategories } = useCategories();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      setIsSearchMode(true);
      searchProducts(query);
    }
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    fetchProducts(1);
  };

  const handlePageChange = (page) => {
    fetchProducts(page, pagination.pageSize);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (id) => {
    try {
      const product = await getProduct(id);
      setEditingProduct(product);
      setIsFormOpen(true);
    } catch (error) {
      toast.error('Error al cargar el producto');
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(pagination.pageNumber);
    } catch (error) {
      toast.error(error.data?.message || 'Error al eliminar');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchProducts(pagination.pageNumber);
    } catch (error) {
      const message = error.data?.errors 
        ? Object.values(error.data.errors).flat().join(', ')
        : error.data?.message || 'Error al guardar';
      toast.error(message);
      throw error;
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          Productos
        </h2>
        <div className="section-actions">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <button className="btn btn-primary" onClick={handleCreate}>
            <span>+</span> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="table-container">
        <ProductsTable
          products={products}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {!isSearchMode && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          title="Eliminar Producto"
          itemName={productToDelete?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
        />
      )}
    </section>
  );
}

export default ProductsView;
