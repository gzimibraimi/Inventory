import { useState, useEffect, useCallback } from 'react'

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (fetchUrl = url, fetchOptions = options) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(fetchUrl, fetchOptions)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }

      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      console.error('Fetch error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (url && options.autoFetch !== false) {
      fetchData()
    }
  }, [fetchData, url, options.autoFetch])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}