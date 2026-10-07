interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
}

/**
 * Underlined tab row (auth mode switcher, Profile sections). The active tab draws the 4px
 * violet indicator the design puts on the bottom edge.
 */
export default function Tabs({ tabs, value, onChange, className = '' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`grid border-b-[0.9px] border-white/15 ${className}`}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="relative flex h-14 items-center justify-center text-base text-white transition hover:text-brand active:scale-[0.99]"
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-accent" />
            )}
          </button>
        )
      })}
    </div>
  )
}
