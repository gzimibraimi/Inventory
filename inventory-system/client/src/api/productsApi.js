import httpClient from './httpClient.js';

// Build query string from filters object
const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      params.append(key, value);
    }
  });
  return params.toString();
};

// Products/Inventory API functions
export const fetchItems = async (filters = {}) => {
  const query = buildQuery(filters);
  const endpoint = `/api/inventory${query ? `?${query}` : ''}`;
  const response = await httpClient.get(endpoint);
  return response.data || [];
};

export const fetchSummary = async () => {
  const response = await httpClient.get('/api/inventory/summary');
  return response.data || { total: 0, available: 0, assigned: 0, availableItems: [] };
};

export const importInventory = async (file) => {
  return httpClient.upload('/api/inventory/import', file);
};

export const assignInventory = async ({ itemId, employeeName }) => {
  const response = await httpClient.post('/api/inventory/assign', { itemId, employeeName });
  return response.data;
};

export const returnInventory = async ({ itemId }) => {
  const response = await httpClient.post('/api/inventory/return', { itemId });
  return response.data;
};

export const seedDatabase = async () => {
  const response = await httpClient.post('/api/inventory/seed');
  return response;
};

export const createItem = async (itemData) => {
  const response = await httpClient.post('/api/inventory/create', itemData);
  return response.data;
};

export const getItemById = async (itemId) => {
  const response = await httpClient.get(`/api/inventory/${itemId}`);
  return response.data;
};

export const getItemHistory = async (itemId) => {
  const response = await httpClient.get(`/api/inventory/${itemId}/history`);
  return response.data;
};

export const updateItem = async (itemId, itemData) => {
  const response = await httpClient.put(`/api/inventory/${itemId}`, itemData);
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await httpClient.delete(`/api/inventory/${itemId}`);
  return response.data;
};