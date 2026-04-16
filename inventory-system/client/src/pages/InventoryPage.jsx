import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import AddItemForm from '../components/common/AddItemForm'
import ItemDetailModal from '../components/common/ItemDetailModal'
import InventoryTable from '../components/common/InventoryTable'
import AssignModal from '../components/common/AssignModal'

import { useProducts } from '../hooks/useProducts'
import { ProductService } from '../services/productService'
import { useToast } from '../components/common/Toast'

export default function InventoryPage() {
  const location = useLocation()

  const [search, setSearch] = useState('')
  const filters = useMemo(() => ({ search }), [search])

  const { products, loading, refetch } = useProducts(filters)
  const { addToast } = useToast()

  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [assignItem, setAssignItem] = useState(null)

  useEffect(() => {
    if (location.state?.showAddForm) {
      setShowAddForm(true)
    }
  }, [location.state])

  async function handleAddItem(itemData) {
    try {
      await ProductService.createProduct(itemData)
      setShowAddForm(false)
      await refetch()
      addToast('Paisja u shtua me sukses', 'success')
    } catch (err) {
      addToast(err?.message || 'Gabim gjatë shtimit', 'error')
    }
  }

  const handleAssign = (item) => setAssignItem(item)

  const handleAssignConfirm = async (item, employeeName) => {
    try {
      await ProductService.assignProduct({
        itemId: item.id,
        employeeName
      })
      setAssignItem(null)
      await refetch()
      addToast('Paisja u caktua me sukses', 'success')
    } catch {
      addToast('Gabim gjatë caktimit', 'error')
    }
  }

  const handleReturn = async (item) => {
    try {
      await ProductService.returnProduct({ itemId: item.id })
      await refetch()
      addToast('Paisja u lirua me sukses', 'success')
    } catch {
      addToast('Gabim gjatë lirimit', 'error')
    }
  }

  const handleGenerateRevers = (item) => {
    const base = import.meta.env.VITE_API_BASE || ''
    window.open(`${base}/api/inventory/revers/${item.id}`, '_blank')
  }

  return (
    <div className="page-content inventory-page">
      <header className="page-header">
        <h1>📋 Menaxhimi i Paisjeve</h1>

        <input
          placeholder="Kerko..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowAddForm(true)}>
          ➕ Shto Paisje
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
          items={products || []}
          loading={loading}
          selectedItems={[]}
          onAssign={handleAssign}
          onReturn={handleReturn}
          onGenerateRevers={handleGenerateRevers}
          onViewItem={setSelectedItemId}
          onSelectionChange={() => {}}
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