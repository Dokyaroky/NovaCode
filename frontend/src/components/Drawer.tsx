import { useRef } from 'react'
import type { ReactNode } from 'react'
import Portal from '@/components/Portal'
import { IconClose } from '@/components/icons'
import { useClickOutside, useEscapeKey, useFocusTrap, useScrollLock } from '@/lib/interactions'

export type DrawerSide = 'right' | 'left'

const SIDES: Record<DrawerSide, string> = {
  right: 'right-0 animate-slide-in-right border-l-[0.9px]',
  left: 'left-0 animate-slide-in-left border-r-[0.9px]',
}

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  title?: string
  description?: string
  /** Tailwind width classes for the panel. */
  width?: string
  footer?: ReactNode
  children?: ReactNode
}

export default function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  description,
  width = 'w-full max-w-md',
  footer,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEscapeKey(open, onClose)
  useScrollLock(open)
  useFocusTrap(panelRef, open)
  useClickOutside([panelRef], open, onClose)

  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <div
          className="animate-fade-in absolute inset-0 bg-canvas/80 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Panel'}
          tabIndex={-1}
          className={`absolute inset-y-0 flex ${width} ${SIDES[side]} flex-col overflow-clip border-white/8 bg-surface shadow-shell outline-none`}
        >
          <div className="flex items-start justify-between gap-6 border-b-[0.9px] border-white/8 p-6">
            <div className="flex min-w-0 flex-col gap-2">
              {title && <h2 className="text-xl font-bold text-ink">{title}</h2>}
              {description && <p className="text-sm leading-6 text-ink-soft">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="grid size-9 shrink-0 place-items-center rounded-tile text-ink-soft transition duration-150 hover:bg-white/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-95"
            >
              <IconClose width={18} height={18} />
            </button>
          </div>

          <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
            {children}
          </div>

          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-4 border-t-[0.9px] border-white/8 p-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
