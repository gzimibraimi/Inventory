export default function FilterPanel({
  filters = {},
  onSearch = () => {},
  onFilterChange = () => {}
}) {

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      inventory_number: '',
      assigned_to: '',
      category: '',
      office: '',
      location: '',
      q: ''
    }

    onFilterChange(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <section className="panel">
      <h2>Filtroni paisjet</h2>

      <div className="filters-grid">

        <label>
          Status
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">Të gjitha</option>
            <option value="inactive">Lire</option>
            <option value="active">Të caktuara</option>
          </select>
        </label>

        <label>
          Barcode
          <input
            value={filters.inventory_number || ''}
            onChange={(e) => onFilterChange('inventory_number', e.target.value)}
          />
        </label>

        <label>
          Punëtor
          <input
            value={filters.assigned_to || ''}
            onChange={(e) => onFilterChange('assigned_to', e.target.value)}
          />
        </label>

        <label>
          Kategori
          <input
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          />
        </label>

        <label>
          Zyrë
          <input
            value={filters.office || ''}
            onChange={(e) => onFilterChange('office', e.target.value)}
          />
        </label>

        <label>
          Lokacion
          <input
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </label>

        <label>
          Kerkim
          <input
            value={filters.q || ''}
            onChange={(e) => onFilterChange('q', e.target.value)}
          />
        </label>

      </div>

      <div className="filter-actions">
        <button onClick={handleSearch}>
          🔍 Kerko
        </button>

        <button onClick={handleReset}>
          ↻ Reset
        </button>
      </div>
    </section>
  )
}