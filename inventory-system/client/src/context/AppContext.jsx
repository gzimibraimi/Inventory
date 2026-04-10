import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  // 🔥 FETCH INVENTORY
  const fetchInventory = async () => {
    try {
      setLoading(true)

      const res = await axios.get('http://localhost:5000/api/inventory')

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data

      setItems(data)
    } catch (err) {
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  return (
    <AppContext.Provider
      value={{
        items,
        loading,
        showAddForm,
        selectedItemId,
        fetchInventory,
        onShowAddForm: setShowAddForm,
        onItemSelected: setSelectedItemId,
        onCloseModal: () => setSelectedItemId(null)
      }}
    >
      {children}
    </AppContext.Provider>
  )
}