import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MATCHING } from '@/data/studypod'
import studypod from '@/assets/icons/studypod.svg'

/**
 * Full-page matching state — the frame has no sidebar, so it renders on its own.
 * The ring's arc is static: this project bans CSS animations/keyframes.
 */
export default function StudyPodMatching() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/studypod/session'), 2600)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-shell px-6 py-12">
      <div className="flex w-full max-w-[337px] flex-col items-center gap-8">
        <div className="relative grid size-28 place-items-center">
          <span className="absolute inset-0 rounded-full border-[3.6px] border-accent-tint" />
          <span className="absolute inset-0 -rotate-[84.6deg] rounded-full border-[3.6px] border-transparent border-t-accent" />
          <span className="grid size-16 place-items-center rounded-full bg-accent-tint-strong">
            <img src={studypod} alt="" width={30} height={30} />
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
            {MATCHING.eyebrow}
          </span>
          <h1 className="text-display text-center text-ink">{MATCHING.title}</h1>
          <p className="text-center text-base leading-6 text-ink-soft">{MATCHING.subtitle}</p>
        </div>

        <div className="flex w-full items-center justify-center gap-4 rounded-card bg-surface px-6 py-4 shadow-card">
          <span className="size-3 shrink-0 rounded-full bg-success opacity-60" />
          <span className="text-sm leading-5 font-semibold text-ink-soft">{MATCHING.searchLabel}</span>
        </div>
      </div>
    </div>
  )
}
