import { useState } from 'react'
 
export default function AssignModal({ item, onConfirm, onClose }) {
  const [employeeName, setEmployeeName] = useState('')
  const [error, setError] = useState('')
 
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!employeeName.trim()) {
      setError('Emri i punëtorit është i detyrueshëm')
      return
    }
    onConfirm(item, employeeName.trim())
  }
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cakto Paisje</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
 
        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
            Paisja: <strong>{item?.name}</strong>
          </p>
 
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Emri i Punëtorit *</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => {
                  setEmployeeName(e.target.value)
                  setError('')
                }}
                placeholder="Shkruaj emrin e punëtorit"
                autoFocus
              />
              {error && (
                <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {error}
                </span>
              )}
            </div>
 
            <div className="modal-footer" style={{ padding: '1rem 0 0' }}>
              <button type="submit" className="btn-primary">
                Cakto Paisjen
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Anullo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}