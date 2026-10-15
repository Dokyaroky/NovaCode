import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import MinimizedCall, { readMinimizedCall } from '@/components/MinimizedCall'
import NovaLogo from '@/components/NovaLogo'
import SideNav from '@/components/SideNav'
import type { ReactNode } from 'react'

/* Renders into document.body: the shell's own columns clip, so a floating window anchored
   inside them would be cut off (same reason Modal/Drawer/Tooltip portal out). */
function FloatingLayer({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}

type RailWidth = 300 | 360

interface AppShellProps {
  children: ReactNode
  /** Right column content. Width comes from `railWidth` (360 Dashboard, 300 Learn). */
  rail?: ReactNode
  railWidth?: RailWidth
  /** Padding of the content column; defaults to the app-shell 24px. */
  mainClassName?: string
  /** Padding/gap of the rail column; defaults to 24px padding with a 24px gap. */
  railClassName?: string
  className?: string
  /** The screen is the minimised StudyPod call itself; never show the floating window here. */
  bare?: boolean
}

const RAIL_GRID: Record<RailWidth, string> = {
  300: 'lg:grid-cols-[288px_minmax(0,1fr)_300px]',
  360: 'lg:grid-cols-[288px_minmax(0,1fr)_360px]',
}

/**
 * Application chrome from the design: 288px sidebar, fluid content, optional rail column.
 * At 1440px the content column lands on the designed width.
 * Below lg the sidebar becomes a drawer behind a compact top bar (mobile layout is ours).
 */
export default function AppShell({
  children,
  rail,
  railWidth = 360,
  mainClassName = 'p-4 md:p-6',
  railClassName = 'gap-6 p-6',
  className = '',
  bare = false,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [callMinimized, setCallMinimized] = useState(false)
  const { pathname, state } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  /* The call resumes its floating window after a navigation or a reload while it is running.
     The toast is only for the moment of minimising (the session page hands it over in state). */
  const [callNotice, setCallNotice] = useState(false)

  useEffect(() => {
    setCallMinimized(readMinimizedCall())
    setCallNotice(Boolean((state as { minimizeCall?: boolean } | null)?.minimizeCall))
  }, [pathname, state])

  return (
    <div
      className={`grid min-h-screen grid-cols-1 bg-shell lg:h-screen lg:grid-rows-[100%] lg:overflow-hidden ${
        rail ? RAIL_GRID[railWidth] : 'lg:grid-cols-[288px_minmax(0,1fr)]'
      } ${className}`}
    >
      <SideNav className="hidden lg:flex" />

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/6 bg-rail px-4 lg:hidden">
        <NovaLogo />
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-tile text-ink-soft transition hover:bg-surface active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <SideNav className="relative z-10 flex h-full max-w-[85vw]" />
        </div>
      )}

      <main
        className={`no-scrollbar flex min-w-0 flex-col lg:overflow-y-auto ${mainClassName}`}
      >
        {children}
      </main>

      {rail && (
        <aside
          className={`no-scrollbar flex min-w-0 flex-col border-t border-white/10 bg-rail lg:overflow-y-auto lg:border-t-0 lg:border-l ${railClassName}`}
        >
          {rail}
        </aside>
      )}

      {!bare && callMinimized && (
        <FloatingLayer>
          <MinimizedCall
            minimized
            announce={callNotice}
            onRestore={() => setCallMinimized(false)}
          />
        </FloatingLayer>
      )}
    </div>
  )
}
