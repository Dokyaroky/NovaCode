import Avatar from '@/components/Avatar'

interface ListItemProps {
  rank: number
  initials: string
  name: string
  value: string
  /** The row highlighting the current user (violet tint in the design). */
  highlighted?: boolean
}

/** Leaderboard row: rank, avatar, name, trailing value. */
export default function ListItem({ rank, initials, name, value, highlighted = false }: ListItemProps) {
  return (
    <div
      className={`flex h-13 items-center gap-4 rounded-tile px-3 py-2 ${highlighted ? 'bg-accent-tint' : ''}`}
    >
      <span className="w-4 shrink-0 text-sm font-bold text-ink-soft">{rank}</span>
      <Avatar initials={initials} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{name}</span>
      <span className="shrink-0 text-xs font-bold text-ink-soft">{value}</span>
    </div>
  )
}
