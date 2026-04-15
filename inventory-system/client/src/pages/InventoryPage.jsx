import { useState } from 'react'
import AddItemForm from '../components/common/AddItemForm'
import ItemDetailModal from '../components/common/ItemDetailModal'
import InventoryTable from '../components/common/InventoryTable'
import AssignModal from '../components/common/AssignModal'
import { useProducts } from '../hooks/useProducts'
import { ProductService } from '../services/productService'
import { useToast } from '../components/common/Toast'
 
export default function InventoryPage() {
  const { products, loading, refetch } = useProducts()
  const { addToast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [assignItem, setAssignItem] = useState(null)
 
  const handleAddItem = async (itemData) => {
    try {
      await ProductService.createProduct(itemData)
      setShowAddForm(false)
      await refetch()
      addToast('Paisja u shtua me sukses', 'success')
    } catch (error) {
      console.error('Failed to create product:', error)
      addToast(error.message || 'Gabim gjatë shtimit të paisjes', 'error')
    }
  }
 
  const handleAssign = (item) => {
    setAssignItem(item)
  }
 
  const handleAssignConfirm = async (item, employeeName) => {
    try {
      await ProductService.assignProduct({ itemId: item.id, employeeName })
      setAssignItem(null)
      await refetch()
      addToast('Paisja u caktua me sukses', 'success')
    } catch (error) {
      console.error('Failed to assign product:', error)
      addToast('Gabim gjatë caktimit të paisjes', 'error')
    }
  }
 
  const handleReturn = async (item) => {
    try {
      await ProductService.returnProduct({ itemId: item.id })
      await refetch()
      addToast('Paisja u lirua me sukses', 'success')
    } catch (error) {
      console.error('Failed to return product:', error)
      addToast('Gabim gjatë lirimit të paisjes', 'error')
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
 
      {assignItem && (
        <AssignModal
          item={assignItem}
          onConfirm={handleAssignConfirm}
          onClose={() => setAssignItem(null)}
        />
      )}
    </div>
  )
}