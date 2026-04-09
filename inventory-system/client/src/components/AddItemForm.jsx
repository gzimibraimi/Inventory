import { useState } from 'react'

export default function AddItemForm({ onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    asset_id: '',
    inventory_number: '',
    name: '',
    asset_type: '',
    brand: '',
    model: '',
    serial_number: '',
    category: '',
    office: '',
    location: '',
    floor: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.inventory_number || !formData.name) {
      alert('Barcode (Inventory Number) dhe Emri janë të detyrueshme')
      return
    }
    onSubmit(formData)
  }

  return (
    <section className="panel">
      <h2>Shto Paisje të Re</h2>
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Barcode (Inventory Number) *</label>
            <input
              type="text"
              name="inventory_number"
              value={formData.inventory_number}
              onChange={handleChange}
              placeholder="p.sh. INV001"
              required
            />
          </div>

          <div className="form-group">
            <label>Emri i Paisjes *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="p.sh. Laptop HP"
              required
            />
          </div>

          <div className="form-group">
            <label>Asset ID</label>
            <input
              type="text"
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              placeholder="p.sh. AST001"
            />
          </div>

          <div className="form-group">
            <label>Lloji i Paisjes</label>
            <input
              type="text"
              name="asset_type"
              value={formData.asset_type}
              onChange={handleChange}
              placeholder="p.sh. Computer"
            />
          </div>

          <div className="form-group">
            <label>Marka</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="p.sh. HP"
            />
          </div>

          <div className="form-group">
            <label>Modeli</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="p.sh. ProBook 450"
            />
          </div>

          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="p.sh. HP-001-2024"
            />
          </div>

          <div className="form-group">
            <label>Kategoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="p.sh. IT Equipment"
            />
          </div>

          <div className="form-group">
            <label>Zyra</label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleChange}
              placeholder="p.sh. Prishtinë"
            />
          </div>

          <div className="form-group">
            <label>Lokacion</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="p.sh. Desk 1"
            />
          </div>

          <div className="form-group">
            <label>Kati</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="p.sh. 2"
            />
          </div>

          <div className="form-group">
            <label>Shënime</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Shënime shtesë..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Po shtoj...' : '+ Shto Paisje'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Anullo
          </button>
        </div>
      </form>
    </section>
  )
}
