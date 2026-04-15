import { useState, useCallback, createContext, useContext } from 'react'
 
const ToastContext = createContext()
 
export const useToast = () => useContext(ToastContext)
 
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
 
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])
 
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])
 
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              background: toast.type === 'error' ? '#fee2e2' : toast.type === 'success' ? '#dcfce7' : '#e0f2fe',
              color: toast.type === 'error' ? '#991b1b' : toast.type === 'success' ? '#166534' : '#075985',
              border: `1px solid ${toast.type === 'error' ? '#fca5a5' : toast.type === 'success' ? '#86efac' : '#7dd3fc'}`,
              borderRadius: '12px',
              padding: '12px 18px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              maxWidth: '360px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              animation: 'slideUp 0.2s ease',
            }}
          >
            {toast.type === 'error' ? '❌ ' : toast.type === 'success' ? '✅ ' : 'ℹ️ '}
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </ToastContext.Provider>
  )
}