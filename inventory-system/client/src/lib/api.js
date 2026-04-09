const apiBase = import.meta.env.VITE_API_BASE || ''

const parseJsonResponse = async (response) => {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { error: text }
  }
}

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      params.append(key, value)
    }
  })
  return params.toString()
}

export const fetchItems = async (filters = {}) => {
  const query = buildQuery(filters)
  const response = await fetch(`${apiBase}/api/inventory${query ? `?${query}` : ''}`)
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Unable to load items.')
  }
  return json.data || []
}

export const fetchSummary = async () => {
  const response = await fetch(`${apiBase}/api/inventory/summary`)
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Unable to load summary.')
  }
  return json.data || { total: 0, available: 0, assigned: 0, availableItems: [] }
}

export const importInventory = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${apiBase}/api/inventory/import`, {
    method: 'POST',
    body: formData,
  })

  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Import failed')
  }
  return json
}

export const assignInventory = async ({ itemId, employeeName }) => {
  const response = await fetch(`${apiBase}/api/inventory/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, employeeName }),
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Assign failed')
  }
  return json.data
}

export const returnInventory = async ({ itemId }) => {
  const response = await fetch(`${apiBase}/api/inventory/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Return failed')
  }
  return json.data
}

export const seedDatabase = async () => {
  const response = await fetch(`${apiBase}/api/inventory/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Seed failed')
  }
  return json
}

export const createItem = async (itemData) => {
  const response = await fetch(`${apiBase}/api/inventory/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Create failed')
  }
  return json.data
}

export const getItemById = async (itemId) => {
  const response = await fetch(`${apiBase}/api/inventory/${itemId}`)
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Failed to fetch item')
  }
  return json.data
}

export const getItemHistory = async (itemId) => {
  const response = await fetch(`${apiBase}/api/inventory/${itemId}/history`)
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Failed to fetch history')
  }
  return json.data
}

export const updateItem = async (itemId, itemData) => {
  const response = await fetch(`${apiBase}/api/inventory/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Update failed')
  }
  return json.data
}

export const deleteItem = async (itemId) => {
  const response = await fetch(`${apiBase}/api/inventory/${itemId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  const json = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(json.error || 'Delete failed')
  }
  return json.data
}
