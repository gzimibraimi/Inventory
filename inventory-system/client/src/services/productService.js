import * as productsApi from '../api/productsApi'

// Product service - business logic layer
export class ProductService {
  // Get all products with optional filters
  static async getProducts(filters = {}) {
    try {
      const products = await productsApi.fetchItems(filters)
      return this.transformProducts(products)
    } catch (error) {
      console.error('ProductService.getProducts error:', error)
      throw new Error('Failed to fetch products')
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const product = await productsApi.getItemById(id)
      return this.transformProduct(product)
    } catch (error) {
      console.error('ProductService.getProductById error:', error)
      throw new Error('Failed to fetch product')
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      const result = await productsApi.createItem(productData)
      return result
    } catch (error) {
      console.error('ProductService.createProduct error:', error)
      throw new Error('Failed to create product')
    }
  }

  // Update product
  static async updateProduct(id, productData) {
    try {
      const result = await productsApi.updateItem(id, productData)
      return result
    } catch (error) {
      console.error('ProductService.updateProduct error:', error)
      throw new Error('Failed to update product')
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const result = await productsApi.deleteItem(id)
      return result
    } catch (error) {
      console.error('ProductService.deleteProduct error:', error)
      throw new Error('Failed to delete product')
    }
  }

  // Assign product to employee
  static async assignProduct({ itemId, employeeName }) {
    try {
      const result = await productsApi.assignInventory({ itemId, employeeName })
      return result
    } catch (error) {
      console.error('ProductService.assignProduct error:', error)
      throw new Error('Failed to assign product')
    }
  }

  // Return product
  static async returnProduct({ itemId }) {
    try {
      const result = await productsApi.returnInventory({ itemId })
      return result
    } catch (error) {
      console.error('ProductService.returnProduct error:', error)
      throw new Error('Failed to return product')
    }
  }

  // Get product summary
  static async getSummary() {
    try {
      const summary = await productsApi.fetchSummary()
      return summary
    } catch (error) {
      console.error('ProductService.getSummary error:', error)
      throw new Error('Failed to fetch summary')
    }
  }

  // Import products from file
  static async importProducts(file) {
    try {
      const result = await productsApi.importInventory(file)
      return result
    } catch (error) {
      console.error('ProductService.importProducts error:', error)
      throw new Error('Failed to import products')
    }
  }

  // Seed database with sample data
  static async seedDatabase() {
    try {
      const result = await productsApi.seedDatabase()
      return result
    } catch (error) {
      console.error('ProductService.seedDatabase error:', error)
      throw new Error('Failed to seed database')
    }
  }

  // Transform product data for frontend use
  static transformProduct(product) {
    return {
      ...product,
      displayName: product.name || product.asset_id || `Product ${product.id}`,
      statusLabel: this.getStatusLabel(product.status),
      isAvailable: ['inactive', 'available'].includes(product.status),
      isAssigned: ['active', 'assigned'].includes(product.status)
    }
  }

  // Transform products array
  static transformProducts(products) {
    return products.map(product => this.transformProduct(product))
  }

  // Get human-readable status label
  static getStatusLabel(status) {
    const labels = {
      inactive: 'I lirë',
      active: 'I caktuar',
      available: 'I lirë',
      assigned: 'I caktuar'
    }
    return labels[status] || status
  }

  // Validate product data
  static validateProduct(productData) {
    const errors = []

    if (!productData.name && !productData.asset_id) {
      errors.push('Emri ose Asset ID është i nevojshëm')
    }

    if (productData.inventory_number && productData.inventory_number.length > 50) {
      errors.push('Numri i inventarit është shumë i gjatë')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
