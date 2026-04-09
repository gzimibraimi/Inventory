import FilterPanel from './common/FilterPanel'
import InventoryTable from './common/InventoryTable'

export default function SearchPage({ items, filters, summary, loading, selectedItems, onFilterChange, onSearch, onAssign, onReturn, onGenerateRevers, onViewItem, onSelectionChange, onBulkAssign, onBulkReturn }) {
  return (
    <div className="page-content">
      <header className="page-header">
        <h1>🔍 Kerko Paisje</h1>
        <p>Filtroni dhe kërkoni paisjet në bazën e të dhënave</p>
      </header>

      <FilterPanel filters={filters} onFilterChange={onFilterChange} onSearch={onSearch} />

      <section className="panel">
        <div className="search-summary">
          <span>📊 Rezultate: <strong>{items.length}</strong> paisje</span>
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
            <button onClick={onBulkAssign}>Cakto të gjitha</button>
            <button className="secondary" onClick={onBulkReturn}>Liro të gjitha</button>
            <button className="secondary" onClick={() => onSelectionChange([])}>Pastro zgjedhjen</button>
          </div>
        )}
      </section>

      <InventoryTable
        items={items}
        loading={loading}
        selectedItems={selectedItems}
        onAssign={onAssign}
        onReturn={onReturn}
        onGenerateRevers={onGenerateRevers}
        onViewItem={onViewItem}
        onSelectionChange={onSelectionChange}
      />
    </div>
  )
}
