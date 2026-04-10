import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterPanel from '../components/common/FilterPanel'
import InventoryTable from '../components/common/InventoryTable'
import { useProducts } from '../hooks/useProducts'
import { ProductService } from '../services/productService'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItems, setSelectedItems] = useState([])
  const [summary, setSummary] = useState({ available: 0, assigned: 0 })

  // Initialize filters from URL params
  const initialFilters = {
    status: searchParams.get('status') || 'all',
    inventory_number: searchParams.get('inventory_number') || '',
    assigned_to: searchParams.get('assigned_to') || '',
    category: searchParams.get('category') || '',
    office: searchParams.get('office') || '',
    location: searchParams.get('location') || '',
    q: searchParams.get('q') || ''
  }

  const { products, loading, filters, updateFilters, search } = useProducts(initialFilters)

  const handleSearch = (searchFilters = filters) => {
    const nextParams = new URLSearchParams()

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        nextParams.set(key, value)
      }
    })

    setSearchParams(nextParams)
    setSelectedItems([])
    search(searchFilters)
  }

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await ProductService.getSummary()
        setSummary({ available: data.available, assigned: data.assigned })
      } catch (error) {
        console.error('Failed to load summary:', error)
      }
    }

    loadSummary()
  }, [])

  const handleAssign = async (item) => {
    const employee = window.prompt('Shkruaj emrin e punëtorit për këtë paisje:')
    if (!employee) return

    try {
      await ProductService.assignProduct({ itemId: item.id, employeeName: employee })
      alert(`Paisja u caktua tek ${employee}.`)
      handleSearch() // Refresh the list
    } catch (error) {
      console.error('Failed to assign product:', error)
      alert('Gabim gjatë caktimit të paisjes')
    }
  }

  const handleReturn = async (item) => {
    try {
      await ProductService.returnProduct({ itemId: item.id })
      alert(`Paisja u lirua nga ${item.assigned_to || 'punëtori'}.`)
      handleSearch() // Refresh the list
    } catch (error) {
      console.error('Failed to return product:', error)
      alert('Gabim gjatë lirimit të paisjes')
    }
  }

  const handleGenerateRevers = (item) => {
    window.open(`${import.meta.env.VITE_API_BASE || ''}/api/inventory/revers/${item.id}`, '_blank')
  }

  const handleBulkAssign = async () => {
    const employee = window.prompt('Shkruaj emrin e punëtorit për këto paisje:')
    if (!employee) return

    try {
      for (const itemId of selectedItems) {
        await ProductService.assignProduct({ itemId, employeeName: employee })
      }
      alert(`${selectedItems.length} paisje u caktuan tek ${employee}.`)
      setSelectedItems([])
      handleSearch() // Refresh the list
    } catch (error) {
      console.error('Failed to bulk assign products:', error)
      alert('Gabim gjatë caktimit të paisjeve')
    }
  }

  const handleBulkReturn = async () => {
    try {
      for (const itemId of selectedItems) {
        await ProductService.returnProduct({ itemId })
      }
      alert(`${selectedItems.length} paisje u liruan.`)
      setSelectedItems([])
      handleSearch() // Refresh the list
    } catch (error) {
      console.error('Failed to bulk return products:', error)
      alert('Gabim gjatë lirimit të paisjeve')
    }
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <h1>🔍 Kerko Paisje</h1>
        <p>Filtroni dhe kërkoni paisjet në bazën e të dhënave</p>
      </header>

      <FilterPanel
        filters={filters}
        onFilterChange={updateFilters}
        onSearch={handleSearch}
      />

      <section className="panel">
        <div className="search-summary">
          <span>📊 Rezultate: <strong>{products.length}</strong> paisje</span>
          <span>✓ Lire: <strong>{summary.available}</strong></span>
          <span>👤 Të caktuara: <strong>{summary.assigned}</strong></span>
          <div className="export-options">
            <button className="export-btn" onClick={() => window.open(`${import.meta.env.VITE_API_BASE || ''}/api/inventory/export?${new URLSearchParams(filters).toString()}`, '_blank')}>
              📄 Eksporto CSV
            </button>
            <button className="export-btn" onClick={() => window.open(`${import.meta.env.VITE_API_BASE || ''}/api/inventory/export?${new URLSearchParams(filters).toString()}&format=excel`, '_blank')}>
              📊 Eksporto Excel
            </button>
          </div>
        </div>
        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <span>🗂️ Zgjedhur: {selectedItems.length} paisje</span>
            <button onClick={handleBulkAssign}>Cakto të gjitha</button>
            <button className="secondary" onClick={handleBulkReturn}>Liro të gjitha</button>
            <button className="secondary" onClick={() => setSelectedItems([])}>Pastro zgjedhjen</button>
          </div>
        )}
      </section>

      <InventoryTable
        items={products}
        loading={loading}
        selectedItems={selectedItems}
        onAssign={handleAssign}
        onReturn={handleReturn}
        onGenerateRevers={handleGenerateRevers}
        onViewItem={(id) => window.open(`/products/${id}`, '_blank')}
        onSelectionChange={setSelectedItems}
      />
    </div>
  )
}
