import { useEffect, useState } from 'react'
import { getItemById } from '../../api/productsApi'

export default function ItemDetailModal({ itemId, onClose, onAssign, onReturn }) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAssigned = item && ['active', 'assigned'].includes(item.status)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        const data = await getItemById(itemId)
        setItem(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      loadItem()
    }
  }, [itemId])

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Po ngarkohet...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Paisja nuk u gjet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{item.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Barcode:</span>
              <span className="detail-value barcode-badge">{item.inventory_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Asset ID:</span>
              <span className="detail-value">{item.asset_id || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lloji:</span>
              <span className="detail-value">{item.asset_type || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Marka:</span>
              <span className="detail-value">{item.brand || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Modeli:</span>
              <span className="detail-value">{item.model || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Serial:</span>
              <span className="detail-value">{item.serial_number || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Kategoria:</span>
              <span className="detail-value">{item.category || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Zyra:</span>
              <span className="detail-value">{item.office || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Lokacion:</span>
              <span className="detail-value">{item.location || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Kati:</span>
              <span className="detail-value">{item.floor || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Statusi:</span>
              <span className={`detail-value status-badge status-${item.status}`}>{item.status}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Në dorën e:</span>
              <span className="detail-value">{item.assigned_to || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Shënime:</span>
              <span className="detail-value">{item.notes || '-'}</span>
            </div>
          </div>

          {item.history && item.history.length > 0 && (
            <div className="history-section">
              <h3>Historiku i Paisjes</h3>
              <ul className="history-list">
                {item.history.map((record, idx) => (
                  <li key={idx}>
                    <span className="history-action">{record.action}</span>
                    <span className="history-date">{new Date(record.created_at).toLocaleDateString()}</span>
                    {record.to_employee && <span className="history-employee">→ {record.to_employee}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-primary"
            onClick={() => {
              onAssign(item)
              onClose()
            }}
          >
            {isAssigned ? 'Transfero' : 'Cakto'}
          </button>
          {isAssigned && (
            <button
              className="btn-secondary"
              onClick={() => {
                onReturn(item)
                onClose()
              }}
            >
              Liro
            </button>
          )}
          <button className="btn-outline" onClick={onClose}>
            Mbyll
          </button>
        </div>
      </div>
    </div>
  )
}
