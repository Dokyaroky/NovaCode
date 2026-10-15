import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import Portal from '@/components/Portal'
import { useAnchorRect, useClickOutside, useEscapeKey } from '@/lib/interactions'

export interface DropdownItem {
  id: string
  label: string
  /** Leading icon, usually a currentColor React icon. */
  icon?: ReactNode
  tone?: 'default' | 'danger'
  disabled?: boolean
  /** Draws a divider above this item. */
  separatorBefore?: boolean
  onSelect?: () => void
}

export interface DropdownProps {
  /** Render prop: the trigger owns its own styling and receives the toggle handler. */
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  /** Tailwind width classes for the menu. */
  width?: string
  label?: string
}

const GAP = 8
const ESTIMATED_HEIGHT = 240

export default function Dropdown({
  trigger,
  items,
  align = 'start',
  width = 'min-w-56',
  label = 'Menu',
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  /* Read through a ref so an inline `items` array cannot restart the open effect. */
  const itemsRef = useRef(items)
  const focused = useRef(false)
  const rect = useAnchorRect(triggerRef, open)

  useEffect(() => {
    itemsRef.current = items
  })

  const close = (restoreFocus: boolean) => {
    setOpen(false)
    focused.current = false
    if (restoreFocus) triggerRef.current?.querySelector<HTMLElement>('button')?.focus()
  }

  useEscapeKey(open, () => close(true))
  useClickOutside([triggerRef, menuRef], open, () => close(false))

  useEffect(() => {
    if (!open) return
    const first = itemsRef.current.findIndex((item) => !item.disabled)
    setActiveIndex(first === -1 ? 0 : first)
  }, [open])

  /* Focus moves into the menu on open: it is portalled, so it sits outside the trigger's
     subtree and would never receive the keydown events handled below. */
  useEffect(() => {
    if (!open || !rect) return
    setFlipped(rect.bottom + ESTIMATED_HEIGHT > window.innerHeight && rect.top > ESTIMATED_HEIGHT)
    if (!focused.current) {
      focused.current = true
      menuRef.current?.focus()
    }
  }, [open, rect])

  const select = (item: DropdownItem) => {
    if (item.disabled) return
    close(true)
    item.onSelect?.()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = itemsRef.current
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled)
    if (enabled.length === 0) return
    const position = enabled.findIndex(({ index }) => index === activeIndex)

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      const next = enabled[(position + step + enabled.length) % enabled.length]
      if (next) setActiveIndex(next.index)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const next = event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]
      if (next) setActiveIndex(next.index)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const current = itemsRef.current[activeIndex]
      if (current) select(current)
    } else if (event.key === 'Tab') {
      close(false)
    }
  }

  const position = rect
    ? {
        top: flipped ? undefined : rect.bottom + GAP,
        bottom: flipped ? window.innerHeight - rect.top + GAP : undefined,
        left: align === 'start' ? rect.left : undefined,
        right: align === 'end' ? window.innerWidth - rect.right : undefined,
      }
    : undefined

  return (
    <>
      <div ref={triggerRef} className="inline-flex">
        {trigger({ open, toggle: () => setOpen((current) => !current) })}
      </div>

      {open && rect && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            style={position}
            onKeyDown={handleKeyDown}
            className={`animate-slide-up fixed z-[70] flex flex-col overflow-clip rounded-card bg-surface p-2 shadow-shell outline-none ${width}`}
          >
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                {item.separatorBefore && <span className="my-2 h-px bg-white/8" />}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(item)}
                  className={`flex items-center gap-3 rounded-tile px-3 py-2 text-left text-sm font-medium transition duration-150 outline-none ${
                    item.tone === 'danger' ? 'text-code-red' : 'text-ink-soft'
                  } ${
                    index === activeIndex && !item.disabled ? 'bg-white/10 text-ink' : ''
                  } ${item.disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-white/10'}`}
                >
                  {item.icon && (
                    <span className="grid size-4 shrink-0 place-items-center">{item.icon}</span>
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </>
  )
}
