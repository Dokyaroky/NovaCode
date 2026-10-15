import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Portal from '@/components/Portal'
import { useAnchorRect } from '@/lib/interactions'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  label: string
  side?: TooltipSide
  /** ms of hover/focus before the tooltip appears. */
  delay?: number
  /** Extra classes for the wrapper — pass `min-w-0` when it wraps a truncating flex child. */
  className?: string
  children: ReactNode
}

const GAP = 8

export default function Tooltip({
  label,
  side = 'top',
  delay = 180,
  className = '',
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const rect = useAnchorRect(triggerRef, open)
  const id = useId()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }

  const hide = () => {
    window.clearTimeout(timer.current)
    setOpen(false)
  }

  const position = rect
    ? {
        top:
          side === 'top'
            ? rect.top - GAP
            : side === 'bottom'
              ? rect.bottom + GAP
              : rect.top + rect.height / 2,
        left:
          side === 'left'
            ? rect.left - GAP
            : side === 'right'
              ? rect.right + GAP
              : rect.left + rect.width / 2,
        transform:
          side === 'top'
            ? 'translate(-50%, -100%)'
            : side === 'bottom'
              ? 'translate(-50%, 0)'
              : side === 'left'
                ? 'translate(-100%, -50%)'
                : 'translate(0, -50%)',
      }
    : undefined

  return (
    <>
      <span
        ref={triggerRef}
        className={`inline-flex ${className}`}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {open && rect && (
        <Portal>
          <span
            id={id}
            role="tooltip"
            style={position}
            className="animate-fade-in pointer-events-none fixed z-[80] rounded-tile bg-rail px-3 py-2 text-xs font-medium text-ink-soft shadow-card"
          >
            {label}
          </span>
        </Portal>
      )}
    </>
  )
}
