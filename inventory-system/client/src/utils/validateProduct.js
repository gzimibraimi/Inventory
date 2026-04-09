// Product validation utilities

export const validateProduct = (productData) => {
  const errors = {}

  // Required fields validation
  if (!productData.name && !productData.asset_id) {
    errors.name = 'Emri ose Asset ID është i nevojshëm'
  }

  // Field length validations
  if (productData.name && productData.name.length > 255) {
    errors.name = 'Emri është shumë i gjatë (maksimumi 255 karaktere)'
  }

  if (productData.inventory_number && productData.inventory_number.length > 50) {
    errors.inventory_number = 'Numri i inventarit është shumë i gjatë (maksimumi 50 karaktere)'
  }

  if (productData.asset_id && productData.asset_id.length > 50) {
    errors.asset_id = 'Asset ID është shumë i gjatë (maksimumi 50 karaktere)'
  }

  if (productData.brand && productData.brand.length > 100) {
    errors.brand = 'Marka është shumë e gjatë (maksimumi 100 karaktere)'
  }

  if (productData.model && productData.model.length > 100) {
    errors.model = 'Modeli është shumë i gjatë (maksimumi 100 karaktere)'
  }

  if (productData.serial_number && productData.serial_number.length > 100) {
    errors.serial_number = 'Numri serial është shumë i gjatë (maksimumi 100 karaktere)'
  }

  if (productData.category && productData.category.length > 100) {
    errors.category = 'Kategoria është shumë e gjatë (maksimumi 100 karaktere)'
  }

  if (productData.office && productData.office.length > 100) {
    errors.office = 'Zyra është shumë e gjatë (maksimumi 100 karaktere)'
  }

  if (productData.location && productData.location.length > 100) {
    errors.location = 'Lokacioni është shumë i gjatë (maksimumi 100 karaktere)'
  }

  if (productData.assigned_to && productData.assigned_to.length > 255) {
    errors.assigned_to = 'Emri i punëtorit është shumë i gjatë (maksimumi 255 karaktere)'
  }

  if (productData.notes && productData.notes.length > 1000) {
    errors.notes = 'Shënimet janë shumë të gjata (maksimumi 1000 karaktere)'
  }

  // Status validation
  const validStatuses = ['available', 'assigned']
  if (productData.status && !validStatuses.includes(productData.status)) {
    errors.status = 'Statusi duhet të jetë "available" ose "assigned"'
  }

  // Floor validation (should be positive integer or null)
  if (productData.floor !== null && productData.floor !== undefined && productData.floor !== '') {
    const floorNum = Number(productData.floor)
    if (isNaN(floorNum) || floorNum < 0 || !Number.isInteger(floorNum)) {
      errors.floor = 'Kati duhet të jetë një numër i plotë pozitiv'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate product for assignment
export const validateAssignment = (product, employeeName) => {
  const errors = {}

  if (!employeeName || employeeName.trim().length === 0) {
    errors.employeeName = 'Emri i punëtorit është i nevojshëm'
  }

  if (product.status === 'assigned') {
    errors.product = 'Produkti është tashmë i caktuar'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate product for return
export const validateReturn = (product) => {
  const errors = {}

  if (product.status !== 'assigned') {
    errors.product = 'Produkti nuk është i caktuar dhe nuk mund të kthehet'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate file for import
export const validateImportFile = (file) => {
  const errors = {}

  if (!file) {
    errors.file = 'File është i nevojshëm'
    return { isValid: false, errors }
  }

  // Check file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (!allowedTypes.includes(file.type)) {
    errors.file = 'File duhet të jetë CSV ose Excel'
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    errors.file = 'File është shumë i madh (maksimumi 10MB)'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}