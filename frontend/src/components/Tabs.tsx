import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  /** Inset the active indicator 24px from the tab edges (the Profile tab strip). */
  indicatorInset?: boolean
  className?: string
  /**
   * Owning the pattern's ids: when set, a tab becomes `${idBase}-tab-${tab.id}` and
   * points at `${idBase}-panel-${tab.id}` through `aria-controls`.
   */
  idBase?: string
}

/**
 * Underlined tab row (auth mode switcher, Profile sections). The active tab draws the 4px
 * violet indicator the design puts on the bottom edge.
 *
 * Accessibility: `tablist`/`tab` roles, roving `tabindex` (only the selected tab is in the
 * tab order) and Left/Right/Home/End move the selection, per the APG tabs pattern. The
 * page owns the matching `tabpanel`.
 */
export default function Tabs({
  tabs,
  value,
  onChange,
  indicatorInset = false,
  className = '',
  idBase,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const selectedIndex = tabs.findIndex((tab) => tab.id === value)

  const moveTo = (index: number) => {
    const target = (index + tabs.length) % tabs.length
    const tab = tabs[target]
    if (!tab) return
    onChange(tab.id)
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') moveTo(index + 1)
    else if (event.key === 'ArrowLeft') moveTo(index - 1)
    else if (event.key === 'Home') moveTo(0)
    else if (event.key === 'End') moveTo(tabs.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      className={`grid border-b-[0.9px] border-white/15 ${className}`}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === value

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={idBase ? `${idBase}-tab-${tab.id}` : undefined}
            aria-controls={idBase ? `${idBase}-panel-${tab.id}` : undefined}
            aria-selected={isActive}
            tabIndex={isActive || (selectedIndex === -1 && index === 0) ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="relative flex h-14 items-center justify-center text-base text-white transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset focus-visible:outline-none active:scale-[0.99]"
          >
            {tab.label}
            {isActive && (
              <span
                className={`absolute bottom-0 h-1 rounded-full bg-accent ${
                  indicatorInset ? 'inset-x-6' : 'inset-x-0'
                }`}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
