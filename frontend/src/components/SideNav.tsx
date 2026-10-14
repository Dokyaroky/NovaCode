import { NavLink } from 'react-router-dom'
import NovaLogo from '@/components/NovaLogo'
import UserCard from '@/components/UserCard'
import {
  IconDashboard,
  IconExplore,
  IconLearn,
  IconProfile,
  IconProjects,
  IconStudyPod,
} from '@/components/icons'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/learn', label: 'Career Path', Icon: IconLearn },
  { to: '/explore', label: 'Explore', Icon: IconExplore },
  { to: '/projects', label: 'Projects', Icon: IconProjects },
  { to: '/studypod', label: 'StudyPod', Icon: IconStudyPod },
  { to: '/profile', label: 'Profile', Icon: IconProfile },
]

interface SideNavProps {
  className?: string
}

/** 288px sidebar: logo, six nav items, the user block pinned to the bottom. */
export default function SideNav({ className = '' }: SideNavProps) {
  return (
    <nav
      className={`no-scrollbar w-72 shrink-0 flex-col overflow-y-auto border-r border-white/6 bg-rail p-6 ${className}`}
      aria-label="Navigasi utama"
    >
      <NovaLogo />

      <div className="mt-16 flex flex-col gap-3">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex h-12 mb-4 shrink-0 items-center gap-4 rounded-tile px-4 transition active:scale-[0.98] ${
                isActive
                  ? 'bg-surface text-brand'
                  : 'text-ink-soft hover:bg-surface/60 hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={isActive ? 'text-brand' : 'text-ink-soft'} />
                <span className="text-base">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <UserCard
        name="Nova Chen"
        level="Level 12"
        initials="N"
        progress={75}
        className="mt-auto"
      />
    </nav>
  )
}
