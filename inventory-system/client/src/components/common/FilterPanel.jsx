export default function FilterPanel({ filters, onFilterChange, onSearch }) {
  const handleReset = () => {
    onFilterChange('status', 'all')
    onFilterChange('inventory_number', '')
    onFilterChange('assigned_to', '')
    onFilterChange('category', '')
    onFilterChange('office', '')
    onFilterChange('location', '')
    onFilterChange('q', '')
    onSearch()
  }

  return (
    <section className="panel">
      <h2>Filtroni paisjet</h2>
      <div className="filters-grid">
        <label>
          Status
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
            <option value="all">Të gjitha</option>
            <option value="available">Lire</option>
            <option value="assigned">Të caktuara</option>
          </select>
        </label>
        <label>
          Barcode
          <input
            value={filters.inventory_number}
            onChange={(e) => onFilterChange('inventory_number', e.target.value)}
            placeholder="Inventory number"
          />
        </label>
        <label>
          Punëtor
          <input
            value={filters.assigned_to}
            onChange={(e) => onFilterChange('assigned_to', e.target.value)}
            placeholder="Emri i punëtorit"
          />
        </label>
        <label>
          Kategori
          <input
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            placeholder="Kategoria"
          />
        </label>
        <label>
          Zyrë
          <input
            value={filters.office}
            onChange={(e) => onFilterChange('office', e.target.value)}
            placeholder="Zyra"
          />
        </label>
        <label>
          Lokacion
          <input
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Lokacioni"
          />
        </label>
        <label>
          Kerkim
          <input
            value={filters.q}
            onChange={(e) => onFilterChange('q', e.target.value)}
            placeholder="Kerko emër / serial"
          />
        </label>
      </div>
      <div className="filter-actions">
        <button className="small-button" onClick={onSearch} disabled={false}>
          🔍 Kerko
        </button>
        <button className="small-button reset-button" onClick={handleReset}>
          ↻ Reset
        </button>
      </div>
    </section>
  )
}
