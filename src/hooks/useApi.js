import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../context/ApiContext';
import toast from 'react-hot-toast';

export function useProducts() {
  const { apiRequest } = useApi();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (page = 1, pageSize = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        pageNumber: page,
        pageSize: pageSize
      });
      
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minStock) params.append('minStock', filters.minStock);
      if (filters.maxStock) params.append('maxStock', filters.maxStock);
      
      const data = await apiRequest(`/products?${params.toString()}`);
      setProducts(data.items);
      setPagination({
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPreviousPage: data.hasPreviousPage,
        hasNextPage: data.hasNextPage
      });
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
      setProducts(data);
      setPagination(prev => ({ ...prev, totalCount: data.length, totalPages: 1 }));
    } catch (err) {
      setError(err.message);
      toast.error('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const createProduct = useCallback(async (product) => {
    const data = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    toast.success('Producto creado correctamente');
    return data;
  }, [apiRequest]);

  const updateProduct = useCallback(async (id, product) => {
    const data = await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
    toast.success('Producto actualizado correctamente');
    return data;
  }, [apiRequest]);

  const deleteProduct = useCallback(async (id) => {
    await apiRequest(`/products/${id}`, { method: 'DELETE' });
    toast.success('Producto eliminado correctamente');
  }, [apiRequest]);

  const getProduct = useCallback(async (id) => {
    return await apiRequest(`/products/${id}`);
  }, [apiRequest]);

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct
  };
}

export function useCategories() {
  const { apiRequest } = useApi();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const createCategory = useCallback(async (category) => {
    const data = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
    toast.success('Categoría creada correctamente');
    return data;
  }, [apiRequest]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory
  };
}

export function useAlerts() {
  const { apiRequest } = useApi();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/products/alerts');
      setAlerts(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  return {
    alerts,
    loading,
    error,
    fetchAlerts
  };
}
