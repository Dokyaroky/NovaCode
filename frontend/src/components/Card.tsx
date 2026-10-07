import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/**
 * The surface used by every panel in the design: #1e293b, 16px radius and the 1px white
 * ring the frames draw as a shadow (never a blur). Padding is left to the call site.
 */
export default function Card({ children, className = '' }: CardProps) {
  return <div className={`rounded-card bg-surface shadow-card ${className}`}>{children}</div>
}
