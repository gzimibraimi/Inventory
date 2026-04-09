import AddItemForm from '../components/common/AddItemForm'
import ItemDetailModal from '../components/common/ItemDetailModal'
import InventoryTable from '../components/common/InventoryTable'

export default function InventoryPage({ items, showAddForm, selectedItemId, loading, onShowAddForm, onItemSelected, onAddItem, onAssign, onReturn, onGenerateRevers, onCloseModal }) {
  return (
    <div className="page-content inventory-page">
      <header className="page-header">
        <h1>📋 Menaxhimi i Paisjeve</h1>
        <p>Krijo, ndrysho, ose fshi paisjet në sistem</p>
        <button className="primary-btn" onClick={() => onShowAddForm(true)} style={{ marginTop: '1rem' }}>
          ➕ Shto Paisje të Re
        </button>
      </header>

      {showAddForm ? (
        <AddItemForm
          onSubmit={onAddItem}
          onCancel={() => onShowAddForm(false)}
          loading={loading}
        />
      ) : (
        <InventoryTable
          items={items}
          loading={loading}
          selectedItems={[]}
          onAssign={onAssign}
          onReturn={onReturn}
          onGenerateRevers={onGenerateRevers}
          onViewItem={onItemSelected}
          onSelectionChange={() => {}}
          tableClass="inventory-table"
        />
      )}

      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          onClose={onCloseModal}
          onAssign={onAssign}
          onReturn={onReturn}
        />
      )}
    </div>
  )
}
