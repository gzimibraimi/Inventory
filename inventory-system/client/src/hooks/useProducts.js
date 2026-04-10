import { useState, useEffect, useCallback } from 'react'
import * as productsApi from '../api/productsApi'

const DEFAULT_FILTERS = {}

export const useProducts = (initialFilters = DEFAULT_FILTERS) => {
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

  const updateFilters = useCallback((keyOrFilters, value) => {
    setFilters(prev => {
      if (typeof keyOrFilters === 'string') {
        return { ...prev, [keyOrFilters]: value }
      }

      return { ...prev, ...keyOrFilters }
    })
  }, [])

  const search = useCallback((searchFilters = filters) => {
    fetchProducts(searchFilters)
  }, [fetchProducts, filters])

  // Sync with externally provided filters, such as URL query params.
  useEffect(() => {
    setFilters(initialFilters)
    fetchProducts(initialFilters)
  }, [fetchProducts, initialFilters])

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
