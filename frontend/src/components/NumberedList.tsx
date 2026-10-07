import type { ReactNode } from 'react'

interface NumberedListProps {
  children: ReactNode
  className?: string
}

/** Ordered list of `ListItem` rows (leaderboards, quest lists). */
export default function NumberedList({ children, className = '' }: NumberedListProps) {
  return <div className={`flex flex-col gap-4 pt-6 ${className}`}>{children}</div>
}
