import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  /** Right-hand slot: the pill, ghost button or icon the design pairs with the title. */
  children?: ReactNode
  className?: string
}

/** Section title (24/32) + optional subtitle (14/20) with a right-aligned action. */
export default function SectionHeader({ title, subtitle, children, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div className="flex min-w-0 flex-col gap-2">
        <h2 className="text-2xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
