import { useState, useEffect } from 'react'
import FilterPanel from '../components/common/FilterPanel'
import InventoryTable from '../components/common/InventoryTable'
import { useProducts } from '../hooks/useProducts'
import { ProductService } from '../services/productService'

export default function Products() {

  const [filters, setFilters] = useState({
    status: 'all',
    inventory_number: '',
    assigned_to: '',
    category: '',
    office: '',
    location: '',
    q: ''
  })

  const [selectedItems, setSelectedItems] = useState([])
  const [summary, setSummary] = useState({ available: 0, assigned: 0 })

  const { products, loading, refetch } = useProducts()

  // update filter field
  const updateFilters = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // SEARCH ACTION
  const handleSearch = async (activeFilters = filters) => {
    setSelectedItems([])
    await refetch(activeFilters)
  }

  // load summary
  useEffect(() => {
    const load = async () => {
      try {
        const data = await ProductService.getSummary()
        setSummary({
          available: data.available,
          assigned: data.assigned
        })
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  const handleAssign = async (item) => {
    const employee = window.prompt('Emri i punëtorit:')
    if (!employee) return

    await ProductService.assignProduct({
      itemId: item.id,
      employeeName: employee
    })

    handleSearch(filters)
  }

  const handleReturn = async (item) => {
    await ProductService.returnProduct({ itemId: item.id })
    handleSearch(filters)
  }

  return (
    <div className="page-content">

      <header className="page-header">
        <h1>🔍 Search Paisje</h1>
      </header>

      <FilterPanel
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={updateFilters}
      />

      <div style={{ margin: '10px 0' }}>
        📊 Rezultate: {products?.length || 0}
      </div>

      <InventoryTable
        items={products || []}
        loading={loading}
        selectedItems={selectedItems}
        onAssign={handleAssign}
        onReturn={handleReturn}
        onSelectionChange={setSelectedItems}
      />
    </div>
  )
}