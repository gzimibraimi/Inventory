import { useState, useEffect, useCallback } from 'react'
import * as productsApi from '../api/productsApi'

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const fetchProducts = useCallback(async (searchFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsApi.fetchItems(searchFilters)
      setProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const search = useCallback(() => {
    fetchProducts(filters)
  }, [fetchProducts, filters])

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    filters,
    updateFilters,
    search,
    refetch: fetchProducts
  }
}