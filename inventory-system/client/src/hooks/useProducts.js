import { useState, useCallback } from 'react'
import * as productsApi from '../api/productsApi'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const data = await productsApi.fetchItems(filters)
      setProducts(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}