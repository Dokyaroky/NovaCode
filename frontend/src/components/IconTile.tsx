import type { ReactNode } from 'react'

type TileSize = 'md' | 'sm' | 'xs'

const SIZES: Record<TileSize, string> = {
  md: 'size-12',
  sm: 'size-9',
  xs: 'size-10',
}

/* Tints sit on the surface; the two solid tones are the letter tiles (course/subject
   badges) that the design fills with a flat colour. */
const TONES = {
  brand: 'bg-brand-tint',
  accent: 'bg-accent-tint',
  accentStrong: 'bg-accent-tint-strong',
  success: 'bg-success-tint',
  accentSolid: 'bg-accent',
  muted: 'bg-muted',
} as const

interface IconTileProps {
  children: ReactNode
  size?: TileSize
  tone?: keyof typeof TONES
  className?: string
}

/** 48px (`md`) or 36px (`sm`) rounded tile holding an icon or a short subject label. */
export default function IconTile({ children, size = 'md', tone = 'accent', className = '' }: IconTileProps) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-tile ${SIZES[size]} ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  )
}
