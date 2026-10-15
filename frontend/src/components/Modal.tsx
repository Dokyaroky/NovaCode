import { useRef } from 'react'
import type { ReactNode } from 'react'
import Portal from '@/components/Portal'
import { IconClose } from '@/components/icons'
import { useClickOutside, useEscapeKey, useFocusTrap, useScrollLock } from '@/lib/interactions'

export type ModalSize = 'sm' | 'md' | 'lg'

const SIZES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: ModalSize
  /** Right-aligned action row inside the dialog. */
  footer?: ReactNode
  children?: ReactNode
  /** Accessible name when the dialog has no title row (centred dialogs). */
  ariaLabel?: string
  /** Hide the top-right close button — the design's centred dialogs draw none. */
  showClose?: boolean
  /** Panel width override (the centred end-session dialog is 420px). */
  panelClassName?: string
  /** Body wrapper padding; override when the body owns the dialog's layout. */
  bodyClassName?: string
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  ariaLabel,
  showClose = true,
  panelClassName = '',
  bodyClassName = 'px-6 pb-6',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEscapeKey(open, onClose)
  useScrollLock(open)
  useFocusTrap(panelRef, open)
  /* The scrim is a sibling of the panel, so an outside press covers both. */
  useClickOutside([panelRef], open, onClose)

  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-6">
        <div
          className="animate-fade-in fixed inset-0 bg-canvas/80 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ?? title ?? 'Dialog'}
          tabIndex={-1}
          /* The prototype enters every dialog it draws as an OVERLAY with MOVE_IN / TOP / 300ms /
             EASE_OUT_BACK and closes with no transition at all (`Button - Close mission briefing`
             → CLOSE), which is what the unmount already does. */
          className={`animate-move-in-top relative flex w-full ${SIZES[size]} flex-col overflow-clip rounded-card bg-surface shadow-shell outline-none ${panelClassName}`}
        >
          {(showClose || title || description) && (
            <div className="flex items-start justify-between gap-6 p-6">
              <div className="flex min-w-0 flex-col gap-2">
                {title && <h2 className="text-xl font-bold text-ink">{title}</h2>}
                {description && <p className="text-sm leading-6 text-ink-soft">{description}</p>}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="grid size-9 shrink-0 place-items-center rounded-tile text-ink-soft transition duration-150 hover:bg-white/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-95"
                >
                  <IconClose width={18} height={18} />
                </button>
              )}
            </div>
          )}

          {children && <div className={bodyClassName}>{children}</div>}

          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-4 border-t-[0.9px] border-white/8 px-6 py-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
