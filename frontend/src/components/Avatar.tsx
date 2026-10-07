interface AvatarProps {
  initials: string
  size?: 'sm' | 'md'
  tone?: 'muted' | 'accent'
  className?: string
}

const SIZES = {
  sm: 'size-9',
  md: 'size-10',
} as const

const TONES = {
  muted: 'bg-muted',
  accent: 'bg-accent',
} as const

/** Initials avatar. 36px (`sm`) in list rows, 40px (`md`) in user/header blocks. */
export default function Avatar({ initials, size = 'sm', tone = 'muted', className = '' }: AvatarProps) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full text-xs font-bold text-white ${SIZES[size]} ${TONES[tone]} ${className}`}
    >
      {initials}
    </div>
  )
}
