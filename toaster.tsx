"use client"

import * as React from "react"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const toastContext = React.createContext<{
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id, open: true }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <toastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </toastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(toastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5"
        >
          {toast.title && (
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {toast.title}
            </div>
          )}
          {toast.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {toast.description}
            </div>
          )}
          {toast.action && <div className="mt-2">{toast.action}</div>}
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
