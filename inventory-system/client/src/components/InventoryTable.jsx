import { useState } from 'react'

export default function InventoryTable({ items, loading, selectedItems, onAssign, onReturn, onGenerateRevers, onViewItem, onSelectionChange, tableClass, viewMode }) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const totalItems = items?.length || 0
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = items?.slice(startIndex, endIndex) || []

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange((items || []).map(item => item.id))
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
    setCurrentPage(page)
  }

  const Pagination = () => (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>← Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next →</button>
    </div>
  )

  return (
    <section className="panel">
      <h2>Lista e paisjeve ({totalItems} total)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : viewMode === "cards" ? (
        <>
          <div className="cards-grid">
            {currentItems.map((item) => (
              <div key={item.id} className="item-card" onClick={() => onViewItem(item.id)}>
                <div className="card-header">
                  <h3>{item.name}</h3>
                  <span className={`status-badge status-${item.status}`}>{item.status}</span>
                </div>
                <div className="card-details">
                  <div className="detail-row"><strong>ID:</strong> {item.id}</div>
                  <div className="detail-row"><strong>Barcode:</strong> {item.inventory_number || '-'}</div>
                  <div className="detail-row"><strong>Brand:</strong> {item.brand || '-'}</div>
                  <div className="detail-row"><strong>Model:</strong> {item.model || '-'}</div>
                  <div className="detail-row"><strong>Kategoria:</strong> {item.category || '-'}</div>
                  <div className="detail-row"><strong>Zyra:</strong> {item.office || '-'}</div>
                  <div className="detail-row"><strong>Lokacion:</strong> {item.location || '-'}</div>
                  <div className="detail-row"><strong>Floor:</strong> {item.floor || '-'}</div>
                  <div className="detail-row"><strong>Punëtor:</strong> {item.assigned_to || '-'}</div>
                  <div className="detail-row"><strong>Notes:</strong> {item.notes || '-'}</div>
                </div>
                <div className="card-actions">
                  <button onClick={(e) => {e.stopPropagation(); onAssign(item);}}>
                    {item.status === 'assigned' ? 'Transfero' : 'Cakto'}
                  </button>
                  {item.status === 'assigned' && (
                    <button className="secondary" onClick={(e) => {e.stopPropagation(); onReturn(item);}}>
                      Liro
                    </button>
                  )}
                  <button className="secondary" onClick={(e) => {e.stopPropagation(); onGenerateRevers(item);}}>
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
                      checked={selectedItems.length === (items || []).length && (items || []).length > 0}
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
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onViewItem(item.id)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td className="barcode-cell">
                      <div className="barcode-value">{item.inventory_number || '-'}</div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.brand || '-'}</td>
                    <td>{item.model || '-'}</td>
                    <td>{item.category || '-'}</td>
                    <td>{item.office || '-'}</td>
                    <td>{item.location || '-'}</td>
                    <td>{item.status}</td>
                    <td>{item.assigned_to || '-'}</td>
                    <td className="actions-cell">
                      <button onClick={(e) => {e.stopPropagation(); onAssign(item);}}>
                        {item.status === 'assigned' ? 'Transfero' : 'Cakto'}
                      </button>
                      {item.status === 'assigned' && (
                        <button className="secondary" onClick={(e) => {e.stopPropagation(); onReturn(item);}}>
                          Liro
                        </button>
                      )}
                      <button className="secondary" onClick={(e) => {e.stopPropagation(); onGenerateRevers(item);}}>
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
