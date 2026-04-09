import { useEffect, useState } from 'react'
import './App.css'
import { fetchItems, fetchSummary, assignInventory, returnInventory, seedDatabase, createItem } from './lib/api'
import Sidebar from './components/Sidebar'
import DashboardPage from './components/DashboardPage'
import SearchPage from './components/SearchPage'
import InventoryPage from './components/InventoryPage'
import AddItemForm from './components/AddItemForm'

function App() {
  const [items, setItems] = useState([])
  const [summary, setSummary] = useState({ total: 0, available: 0, assigned: 0, availableItems: [] })
  const [filters, setFilters] = useState({ status: 'all', inventory_number: '', assigned_to: '', category: '', office: '', location: '', q: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await fetchItems(filters)
      setItems(data)
    } catch (error) {
      setMessage(error.message || 'Unable to load items.')
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const data = await fetchSummary()
      setSummary(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadItems()
    loadSummary()
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handleSeedData = async () => {
    const confirm = window.confirm('A jeni siguri? Kjo do t\'shtojë 10 paisje të mostrës në bazën e të dhënave.')
    if (!confirm) return

    try {
      setLoading(true)
      const result = await seedDatabase()
      setMessage(`✓ ${result.count} paisje të mostrës u shtuan me sukses.`)
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage('✗ Gabim gjatë shtimit të mostrës: ' + (error.message || 'Nuk dihet'))
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (itemData) => {
    try {
      setLoading(true)
      await createItem(itemData)
      setMessage(`✓ Paisja u shtua me sukses.`)
      setShowAddForm(false)
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage('✗ Gabim: ' + (error.message || 'Nuk mund të shtohej paisja'))
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (item) => {
    const employee = window.prompt('Shkruaj emrin e punëtorit për këtë paisje:')
    if (!employee) return

    try {
      setLoading(true)
      await assignInventory({ itemId: item.id, employeeName: employee })
      setMessage(`Paisja u caktua tek ${employee}.`)
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Gabim gjatë assign')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (item) => {
    try {
      setLoading(true)
      await returnInventory({ itemId: item.id })
      setMessage(`Paisja u lirua nga ${item.assigned_to || 'punëtori'}.`)
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Gabim gjatë lirimit')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRevers = (item) => {
    window.open(`${import.meta.env.VITE_API_BASE || ''}/api/inventory/revers/${item.id}`, '_blank')
  }

  const handleBulkAssign = async () => {
    const employee = window.prompt('Shkruaj emrin e punëtorit për këto paisje:')
    if (!employee) return

    try {
      setLoading(true)
      for (const itemId of selectedItems) {
        await assignInventory({ itemId, employeeName: employee })
      }
      setMessage(`${selectedItems.length} paisje u caktuan tek ${employee}.`)
      setSelectedItems([])
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Gabim gjatë bulk assign')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkReturn = async () => {
    try {
      setLoading(true)
      for (const itemId of selectedItems) {
        await returnInventory({ itemId })
      }
      setMessage(`${selectedItems.length} paisje u liruan.`)
      setSelectedItems([])
      await loadItems()
      await loadSummary()
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Gabim gjatë bulk return')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onViewChange={(view) => {
        setActiveView(view)
        setShowAddForm(false)
      }} />

      <main className="app-main">
        {message && <p className="message">{message}</p>}

        {activeView === 'dashboard' && (
          <DashboardPage
            summary={summary}
            onNavigate={(view) => {
              setActiveView(view)
              if (view === 'search') {
                setFilters({ status: 'available', inventory_number: '', assigned_to: '', category: '', office: '', location: '', q: '' })
              }
            }}
            loading={loading}
          />
        )}

        {activeView === 'search' && (
          <SearchPage
            items={items}
            filters={filters}
            summary={summary}
            loading={loading}
            selectedItems={selectedItems}
            onFilterChange={handleFilterChange}
            onSearch={loadItems}
            onAssign={handleAssign}
            onReturn={handleReturn}
            onGenerateRevers={handleGenerateRevers}
            onViewItem={setSelectedItemId}
            onSelectionChange={setSelectedItems}
            onBulkAssign={handleBulkAssign}
            onBulkReturn={handleBulkReturn}
          />
        )}

        {activeView === 'inventory' && (
          <InventoryPage
            items={items}
            showAddForm={showAddForm}
            selectedItemId={selectedItemId}
            loading={loading}
            onShowAddForm={setShowAddForm}
            onItemSelected={setSelectedItemId}
            onAddItem={handleAddItem}
            onAssign={handleAssign}
            onReturn={handleReturn}
            onGenerateRevers={handleGenerateRevers}
            onCloseModal={() => setSelectedItemId(null)}
          />
        )}

        {activeView === 'add' && (
          <div className="page-content">
            <header className="page-header">
              <h1>➕ Shto Paisje të Re</h1>
              <p>Krijo një paisje të re në sistem</p>
            </header>
            <AddItemForm
              onSubmit={async (itemData) => {
                await handleAddItem(itemData)
                setActiveView('dashboard')
              }}
              onCancel={() => setActiveView('dashboard')}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
