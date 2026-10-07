import type { ReactNode } from 'react'

interface StatRingProps {
  /** 0–100 */
  value: number
  children?: ReactNode
  /** Design size of the ring box (the circle itself is 108.8px across). */
  size?: number
  className?: string
}

/* Geometry from the Figma asset: centre (61.175, 61.175), r 49.28, stroke 10.1958. */
const CENTER = 61.175
const RADIUS = 49.28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Circular progress with centred content (the "300 of 400 XP" daily goal). */
export default function StatRing({ value, children, size = 122.35, className = '' }: StatRingProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 122.35 122.35" className="block -rotate-90">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={10.1958}
          className="stroke-muted"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={10.1958}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped / 100)}
          className="stroke-success"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      )}
    </div>
  )
}
