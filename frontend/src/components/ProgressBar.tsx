interface ProgressBarProps {
  /** 0–100 */
  value: number
  size?: 'md' | 'sm'
  className?: string
  /** Accessible name, e.g. "Project progress". */
  label?: string
}

const SIZES = {
  md: 'h-3',
  sm: 'h-2',
} as const

/** Slate track with a green fill — 12px in course cards, 8px in the user blocks. */
export default function ProgressBar({ value, size = 'md', label, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full bg-muted ${SIZES[size]} ${className}`}
    >
      <div className="h-full rounded-full bg-success" style={{ width: `${clamped}%` }} />
    </div>
  )
}
