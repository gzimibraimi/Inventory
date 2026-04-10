import { useState } from 'react'
import AddItemForm from '../components/common/AddItemForm'
import ItemDetailModal from '../components/common/ItemDetailModal'
import InventoryTable from '../components/common/InventoryTable'
import { useProducts } from '../hooks/useProducts'
import { ProductService } from '../services/productService'

export default function InventoryPage() {
  const { products, loading, refetch } = useProducts()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const handleAddItem = async (itemData) => {
    try {
      await ProductService.createProduct(itemData)
      setShowAddForm(false)
      await refetch()
    } catch (error) {
      console.error('Failed to create product:', error)
      alert(error.message || 'Gabim gjatë shtimit të paisjes')
    }
  }

  const handleAssign = async (item) => {
    const employee = window.prompt('Shkruaj emrin e punëtorit për këtë paisje:')
    if (!employee) return

    try {
      await ProductService.assignProduct({ itemId: item.id, employeeName: employee })
      await refetch()
    } catch (error) {
      console.error('Failed to assign product:', error)
      alert('Gabim gjatë caktimit të paisjes')
    }
  }

  const handleReturn = async (item) => {
    try {
      await ProductService.returnProduct({ itemId: item.id })
      await refetch()
    } catch (error) {
      console.error('Failed to return product:', error)
      alert('Gabim gjatë lirimit të paisjes')
    }
  }

  const handleGenerateRevers = (item) => {
    window.open(`${import.meta.env.VITE_API_BASE || ''}/api/inventory/revers/${item.id}`, '_blank')
  }

  return (
    <div className="page-content inventory-page">
      <header className="page-header">
        <h1>📋 Menaxhimi i Paisjeve</h1>
        <p>Krijo, ndrysho, ose fshi paisjet në sistem</p>
        <button className="primary-btn" onClick={() => setShowAddForm(true)} style={{ marginTop: '1rem' }}>
          ➕ Shto Paisje të Re
        </button>
      </header>

      {showAddForm ? (
        <AddItemForm
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
          loading={loading}
        />
      ) : (
        <InventoryTable
          items={products}
          loading={loading}
          selectedItems={[]}
          onAssign={handleAssign}
          onReturn={handleReturn}
          onGenerateRevers={handleGenerateRevers}
          onViewItem={setSelectedItemId}
          onSelectionChange={() => {}}
          tableClass="inventory-table"
        />
      )}

      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
          onAssign={handleAssign}
          onReturn={handleReturn}
        />
      )}
    </div>
  )
}
