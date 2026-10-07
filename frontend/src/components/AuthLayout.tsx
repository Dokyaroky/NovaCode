import type { ReactNode } from 'react'
import NovaLogo from '@/components/NovaLogo'

interface AuthLayoutProps {
  /** Marketing column content (badge, headline, illustration) — the left pane in Figma. */
  aside: ReactNode
  /** Form content, rendered inside the 480px card on the right pane. */
  children: ReactNode
}

/**
 * Auth split from the design: two 720px panes — #0f172a on the left with the logo and the
 * marketing column, #111b30 on the right holding a 480px, 32px-radius card. Below lg the
 * marketing pane drops and the card takes the full width.
 */
export default function AuthLayout({ aside, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-shell lg:grid-cols-2">
      <aside className="hidden flex-col gap-24 bg-shell px-16 py-12 lg:flex">
        <NovaLogo />
        <div className="flex flex-1 flex-col items-center justify-center pb-16">{aside}</div>
      </aside>

      <main className="flex items-center justify-center bg-rail px-6 py-12 lg:px-16">
        <div className="w-full max-w-[480px] rounded-[32px] bg-surface px-10 pt-6 pb-10 shadow-card">
          {children}
        </div>
      </main>
    </div>
  )
}
