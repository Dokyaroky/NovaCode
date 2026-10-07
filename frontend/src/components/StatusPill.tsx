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
  className?: string
}

/** Tinted rounded pill for counters and statuses ("0 / 2 complete", "Passed"). */
export default function StatusPill({ children, tone = 'success', icon, className = '' }: StatusPillProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap text-ink-soft ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </div>
  )
}
