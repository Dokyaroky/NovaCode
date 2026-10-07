import Avatar from '@/components/Avatar'
import ProgressBar from '@/components/ProgressBar'

interface UserCardProps {
  name: string
  level: string
  initials: string
  /** 0–100, drives the level bar under the name. */
  progress: number
  className?: string
}

/** Sidebar footer block: avatar, name, level and the level progress bar. */
export default function UserCard({ name, level, initials, progress, className = '' }: UserCardProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-card bg-surface p-4 shadow-card ${className}`}>
      <div className="flex items-center gap-3">
        <Avatar initials={initials} size="md" tone="accent" />
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-bold text-ink">{name}</p>
          <p className="truncate text-xs text-ink-soft">{level}</p>
        </div>
      </div>
      <ProgressBar value={progress} size="sm" />
    </div>
  )
}
