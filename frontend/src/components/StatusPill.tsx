import type { ReactNode } from 'react'

const TONES = {
  success: 'bg-success-tint',
  accent: 'bg-accent-tint',
  brand: 'bg-brand-tint',
} as const

interface StatusPillProps {
  children: ReactNode
  tone?: keyof typeof TONES
  icon?: ReactNode
  /** 24px pill (the momentum badges) instead of the default 32px. */
  dense?: boolean
  className?: string
}

/** Tinted rounded pill for counters and statuses ("0 / 2 complete", "Passed"). */
export default function StatusPill({
  children,
  tone = 'success',
  icon,
  dense = false,
  className = '',
}: StatusPillProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 rounded-full text-xs font-bold whitespace-nowrap text-ink-soft ${TONES[tone]} ${
        dense ? 'px-3 py-1' : 'px-3 py-2'
      } ${className}`}
    >
      {icon}
      {children}
    </div>
  )
}
