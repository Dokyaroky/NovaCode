import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Portal from '@/components/Portal'
import { IconClose } from '@/components/icons'

export type ToastTone = 'info' | 'success' | 'error'

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
  /** ms before auto-dismiss; 0 keeps it open until dismissed. */
  duration?: number
}

interface Toast extends ToastInput {
  id: string
}

interface ToastApi {
  push: (toast: ToastInput) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const DOTS: Record<ToastTone, string> = {
  info: 'bg-info',
  success: 'bg-success',
  error: 'bg-code-red',
}

const DEFAULT_DURATION = 4000

/** Toast host. Mounted once above the router in main.tsx; read it with useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<string, number>())
  const nextId = useRef(0)

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (toast: ToastInput) => {
      const id = String(++nextId.current)
      setToasts((current) => [...current, { ...toast, id }])
      const duration = toast.duration ?? DEFAULT_DURATION
      if (duration > 0) timers.current.set(id, window.setTimeout(() => dismiss(id), duration))
      return id
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer))
      pending.clear()
    }
  }, [])

  const api = useMemo<ToastApi>(() => ({ push, dismiss }), [push, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <div className="pointer-events-none fixed right-6 bottom-6 z-[60] flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className="animate-slide-up pointer-events-auto flex items-start gap-3 rounded-card bg-surface p-4 shadow-shell"
            >
              <span
                className={`mt-2 size-2 shrink-0 rounded-full ${DOTS[toast.tone ?? 'info']}`}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm leading-5 text-ink-soft">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="grid size-7 shrink-0 place-items-center rounded-tile text-ink-soft transition duration-150 hover:bg-white/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <IconClose width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be called inside a ToastProvider')
  return context
}
