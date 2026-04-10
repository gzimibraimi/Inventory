import { useState, useMemo } from 'react'

export default function InventoryTable({
  items = [],
  loading,
  selectedItems = [],
  onAssign,
  onReturn,
  onGenerateRevers,
  onViewItem,
  onSelectionChange,
  tableClass,
  viewMode
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // ✅ NORMALIZE DATA (SUPER IMPORTANT FIX)
  const safeItems = Array.isArray(items) ? items : []

  const totalItems = safeItems.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return safeItems.slice(startIndex, startIndex + pageSize)
  }, [safeItems, currentPage])

  const isAssignedStatus = (status) => ['active', 'assigned'].includes(status)

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(safeItems.map(item => item.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId])
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const Pagination = () => (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
        ← Previous
      </button>

      <span>Page {currentPage} of {totalPages}</span>

      <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
        Next →
      </button>
    </div>
  )

  if (loading) return <p>Loading...</p>

  return (
    <section className="panel">
      <h2>Lista e paisjeve ({totalItems} total)</h2>

      {viewMode === "cards" ? (
        <>
          <div className="cards-grid">
            {currentItems.map((item) => (
              <div key={item.id} className="item-card" onClick={() => onViewItem(item.id)}>
                <div className="card-header">
                  <h3>{item.name}</h3>
                  <span className={`status-badge status-${item.status}`}>
                    {item.status}
                  </span>
                </div>

                <div className="card-details">
                  <div><strong>ID:</strong> {item.id}</div>
                  <div><strong>Barcode:</strong> {item.inventory_number || '-'}</div>
                  <div><strong>Brand:</strong> {item.brand || '-'}</div>
                  <div><strong>Model:</strong> {item.model || '-'}</div>
                  <div><strong>Kategoria:</strong> {item.category || '-'}</div>
                  <div><strong>Zyra:</strong> {item.office || '-'}</div>
                  <div><strong>Lokacion:</strong> {item.location || '-'}</div>
                  <div><strong>Floor:</strong> {item.floor || '-'}</div>
                  <div><strong>Punëtor:</strong> {item.assigned_to || '-'}</div>
                  <div><strong>Notes:</strong> {item.notes || '-'}</div>
                </div>

                <div className="card-actions">
                  <button onClick={(e) => { e.stopPropagation(); onAssign(item); }}>
                    {isAssignedStatus(item.status) ? 'Transfero' : 'Cakto'}
                  </button>

                  {isAssignedStatus(item.status) && (
                    <button className="secondary" onClick={(e) => { e.stopPropagation(); onReturn(item); }}>
                      Liro
                    </button>
                  )}

                  <button className="secondary" onClick={(e) => { e.stopPropagation(); onGenerateRevers(item); }}>
                    Revers
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination />
        </>
      ) : (
        <>
          <div className={`table-wrap ${tableClass || ''}`}>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === safeItems.length && safeItems.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>ID</th>
                  <th>Barcode</th>
                  <th>Emri</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Kategoria</th>
                  <th>Zyra</th>
                  <th>Lokacion</th>
                  <th>Status</th>
                  <th>Punëtor</th>
                  <th>Veprime</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} onClick={() => onViewItem(item.id)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      />
                    </td>

                    <td>{item.id}</td>
                    <td>{item.inventory_number || '-'}</td>
                    <td>{item.name}</td>
                    <td>{item.brand || '-'}</td>
                    <td>{item.model || '-'}</td>
                    <td>{item.category || '-'}</td>
                    <td>{item.office || '-'}</td>
                    <td>{item.location || '-'}</td>
                    <td>{item.status}</td>
                    <td>{item.assigned_to || '-'}</td>

                    <td>
                      <button onClick={(e) => { e.stopPropagation(); onAssign(item); }}>
                        {isAssignedStatus(item.status) ? 'Transfero' : 'Cakto'}
                      </button>

                      {isAssignedStatus(item.status) && (
                        <button onClick={(e) => { e.stopPropagation(); onReturn(item); }}>
                          Liro
                        </button>
                      )}

                      <button onClick={(e) => { e.stopPropagation(); onGenerateRevers(item); }}>
                        Revers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination />
        </>
      )}
    </section>
  )
}
