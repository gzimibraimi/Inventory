import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItemById } from '../api/productsApi'
import { ProductService } from '../services/productService'
import AssignModal from '../components/common/AssignModal'
import Button from '../components/common/Button'
import { useToast } from '../components/common/Toast'
 
export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const isAssigned = item && ['active', 'assigned'].includes(item.status)
 
  const loadItem = async () => {
    try {
      setLoading(true)
      const data = await getItemById(id)
      setItem(data)
    } catch (error) {
      console.error(error)
      addToast('Gabim gjatë ngarkimit të paisjes', 'error')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    if (id) loadItem()
  }, [id])
 
  const handleAssignConfirm = async (item, employeeName) => {
    try {
      await ProductService.assignProduct({ itemId: item.id, employeeName })
      setAssignModalOpen(false)
      addToast('Paisja u caktua me sukses', 'success')
      await loadItem()
    } catch (error) {
      console.error('Failed to assign product:', error)
      addToast('Gabim gjatë caktimit të paisjes', 'error')
    }
  }
 
  const handleReturn = async () => {
    try {
      await ProductService.returnProduct({ itemId: item.id })
      addToast('Paisja u lirua me sukses', 'success')
      await loadItem()
    } catch (error) {
      console.error('Failed to return product:', error)
      addToast('Gabim gjatë lirimit të paisjes', 'error')
    }
  }
 
  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state">
          <p>Po ngarkohet...</p>
        </div>
      </div>
    )
  }
 
  if (!item) {
    return (
      <div className="page-content">
        <div className="error-state">
          <h2>Paisja nuk u gjet</h2>
          <Button onClick={() => navigate('/products')}>Kthehu tek lista</Button>
        </div>
      </div>
    )
  }
 
  return (
    <div className="page-content">
      <header className="page-header">
        <Button variant="outline" onClick={() => navigate('/products')}>
          ← Kthehu
        </Button>
        <h1>{item.name}</h1>
        <p>Detajet e paisjes</p>
      </header>
 
      <div className="product-details">
        <div className="detail-grid">
          <div className="detail-row"><span className="detail-label">ID:</span><span className="detail-value">{item.id}</span></div>
          <div className="detail-row"><span className="detail-label">Barcode:</span><span className="detail-value barcode-badge">{item.inventory_number}</span></div>
          <div className="detail-row"><span className="detail-label">Asset ID:</span><span className="detail-value">{item.asset_id || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Lloji:</span><span className="detail-value">{item.asset_type || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Marka:</span><span className="detail-value">{item.brand || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Modeli:</span><span className="detail-value">{item.model || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Serial:</span><span className="detail-value">{item.serial_number || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Kategoria:</span><span className="detail-value">{item.category || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Zyra:</span><span className="detail-value">{item.office || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Lokacion:</span><span className="detail-value">{item.location || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Kati:</span><span className="detail-value">{item.floor || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Statusi:</span><span className={`detail-value status-badge status-${item.status}`}>{item.status}</span></div>
          <div className="detail-row"><span className="detail-label">Në dorën e:</span><span className="detail-value">{item.assigned_to || '-'}</span></div>
          <div className="detail-row"><span className="detail-label">Shënime:</span><span className="detail-value">{item.notes || '-'}</span></div>
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
 
        <div className="product-actions">
          <Button onClick={() => setAssignModalOpen(true)}>
            {isAssigned ? 'Transfero' : 'Cakto'}
          </Button>
          {isAssigned && (
            <Button variant="secondary" onClick={handleReturn}>
              Liro
            </Button>
          )}
        </div>
      </div>
 
      {assignModalOpen && (
        <AssignModal
          item={item}
          onConfirm={handleAssignConfirm}
          onClose={() => setAssignModalOpen(false)}
        />
      )}
    </div>
  )
}