// src/components/ui/use-toast.ts
import * as React from "react"

// Define the type for a toast
type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  variant?: "default" | "destructive" // Or whatever variants you have
}

// Define the type for the toast object returned by useToast
type ToastMethods = {
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastMethods | undefined>(
  undefined
)

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

// You would also need a ToastProvider component that manages the state
// of the toasts and renders the Toaster component.
// This is usually done in a higher-level component like your layout.
