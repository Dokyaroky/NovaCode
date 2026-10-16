import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import { useToast } from '@/components/Toast'
import { api, ApiError } from '@/lib/api'
import type { CareerTrack, CareerGoalResponse } from '@/lib/career'
import { CAREER_GOALS, CAREER_QUESTIONNAIRE } from '@/data/careerGoals'
import type { CareerGoalId } from '@/data/careerGoals'
import arrowRight from '@/assets/icons/arrow-right.svg'
import goalSelected from '@/assets/icons/goal-selected.svg'
import badgeIcon from '@/assets/icons/search.svg'

/**
 * Career questionnaire — Figma frame 43:248, options from the "Section - Career goals"
 * component set 78:819.
 *
 * Card metrics straight from the component: 317.33x239.6 grid cells at a 24px gap, 24px padding,
 * 16px radius, `#1e293b` surface on the 1px white ring, a 48px `rgba(139,92,246,.2)` icon tile and
 * a 3.8px `#8b5cf6` border + violet "✓ Selected" pill on the chosen card.
 *
 * The frame only draws the answered state, so three states are ours: nothing chosen (the CTA is
 * `aria-disabled` and the helper line says why), a blocked submit (validation alert) and the
 * generation corridor. The corridor is the prototype's: state 2 (frame 110:3992) holds 3s, state 3
 * (113:4644) holds 13s, then the screen leaves for the Career Path with a 100ms ease-out. Those two
 * frames are still empty in the file, so the states share this screen's placeholder checklist and
 * only their timing and the entry transition are the reference's.
 */
const PHASES = CAREER_QUESTIONNAIRE.generating.phases
/** Total corridor length, derived from the phases' own holds. */
const CORRIDOR_MS = PHASES.reduce((total, phase) => total + phase.hold, 0)

/* The transition the file plays INTO each state: SMART_ANIMATE 300ms EASE_OUT (the morph itself
   has no CSS equivalent, so the fade stands in) and DISSOLVE 100ms EASE_OUT. */
const PHASE_ENTRY: Record<(typeof PHASES)[number]['entry'], string> = {
  smart: 'animate-dissolve',
  dissolve: 'animate-dissolve-fast',
}

const HELPER_ID = 'career-goal-helper'

export default function Questionnaire() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [selectedId, setSelectedId] = useState<CareerGoalId | null>(null)
  const [tracks, setTracks] = useState<CareerTrack[]>([])
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const groupRef = useRef<HTMLFieldSetElement>(null)

  const goals = tracks.map((track) => ({ ...track, icon: CAREER_GOALS.find((goal) => goal.id === track.slug)?.icon ?? '' }))
  const selected = goals.find((goal) => goal.slug === selectedId) ?? null
  const steps = CAREER_QUESTIONNAIRE.generating.steps
  const step = steps[Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))]
  const phase = PHASES[Math.min(phaseIndex, PHASES.length - 1)]
  const lastPhase = phaseIndex === PHASES.length - 1

  /* Progress runs across the whole corridor, so the bar reflects the reference's 3s + 13s. */
  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.get<{ data: CareerTrack[] }>('/api/career-tracks'),
      api.get<{ data: CareerGoalResponse | null }>('/api/me/career-goal'),
    ]).then(([trackResponse, goalResponse]) => {
      if (cancelled) return
      setTracks(trackResponse.data)
      setSelectedId((goalResponse.data?.track.slug as CareerGoalId | undefined) ?? null)
    }).catch((reason: unknown) => {
      if (!cancelled) setLoadError(reason instanceof ApiError ? reason.message : 'Unable to load career goals.')
    }).finally(() => {
      if (!cancelled) setLoadingTracks(false)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!generating) return
    const start = Date.now()
    const tick = window.setInterval(() => {
      setProgress(Math.min(100, Math.round(((Date.now() - start) / CORRIDOR_MS) * 100)))
    }, 60)
    return () => window.clearInterval(tick)
  }, [generating])

  /* One timer per state: state 2 hands over to state 3, state 3 lands on the Career Path. The
     timers die with the screen, and both ends are the reference's own holds. */
  useEffect(() => {
    if (!generating) return
    const timer = window.setTimeout(() => {
      if (!lastPhase) {
        setPhaseIndex((index) => index + 1)
        return
      }
      if (selected) {
        push({
          title: CAREER_QUESTIONNAIRE.toast.title,
          description: CAREER_QUESTIONNAIRE.toast.body(selected.title),
          tone: 'success',
        })
      }
      navigate('/learn')
    }, phase.hold)
    return () => window.clearTimeout(timer)
  }, [generating, phase.hold, lastPhase, selected, navigate, push])

  function choose(id: CareerGoalId) {
    setSelectedId(id)
    setShowValidation(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (generating) return
    if (!selected) {
      /* The CTA is aria-disabled, not inert: pressing it says what is missing and lands the
         caret on the first card. */
      setShowValidation(true)
      groupRef.current?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus()
      return
    }
    setShowValidation(false)
    setProgress(0)
    setPhaseIndex(0)
    void api.put('/api/me/career-goal', { track_slug: selected.slug })
      .then(() => setGenerating(true))
      .catch((reason: unknown) => {
        push({ title: 'Unable to save career goal', description: reason instanceof ApiError ? reason.message : 'Please try again.', tone: 'error' })
        setGenerating(false)
      })
  }

  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-[1000px] flex-col items-center">
          {/* Header — frame 43:318: 34px badge, 48px H1, 16px subtitle, 16px/12px gaps. */}
          <header className="flex flex-col items-center gap-6">
            <span className="flex h-[34px] items-center gap-2 rounded-pill bg-accent-tint px-3.5 text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
              <img src={badgeIcon} alt="" width={16} height={16} />
              {CAREER_QUESTIONNAIRE.badge}
            </span>
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-center text-5xl font-black tracking-[-1.92px] text-ink">
                {CAREER_QUESTIONNAIRE.title}
              </h1>
              <p className="text-center text-base leading-7 text-ink-soft">
                {CAREER_QUESTIONNAIRE.subtitle}
              </p>
            </div>
          </header>

          <form
            className="flex w-full flex-col items-center pt-10"
            onSubmit={handleSubmit}
            aria-busy={generating}
          >
            <fieldset
              ref={groupRef}
              disabled={generating}
              aria-describedby={HELPER_ID}
              className={`w-full min-w-0 transition-opacity duration-200 ${
                generating ? 'opacity-60' : ''
              }`}
            >
              <legend className="sr-only">{CAREER_QUESTIONNAIRE.legend}</legend>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <label key={goal.slug} className="relative flex cursor-pointer">
                    {/* Native radios: one tab stop, arrow keys move and pick, the whole card is
                        the label. The ring and the violet border are peer state, not JS state. */}
                    <input
                      type="radio"
                      name="career-goal"
                      value={goal.slug}
                      checked={goal.slug === selectedId}
                      onChange={() => choose(goal.slug as CareerGoalId)}
                      aria-invalid={showValidation || undefined}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[208px] w-full flex-col gap-6 rounded-card border-[3.8px] border-transparent bg-surface p-6 shadow-card transition duration-150 peer-checked:border-accent peer-hover:bg-surface/80 peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      <span className="flex items-start justify-between gap-3">
                        <IconTile size="md" tone="accentStrong">
                          <img src={goal.icon} alt="" width={24} height={24} />
                        </IconTile>
                        {goal.slug === selectedId && (
                          <span
                            aria-hidden="true"
                            className="flex h-8 shrink-0 items-center gap-2 rounded-pill bg-accent px-3 text-xs leading-4 font-bold text-ink"
                          >
                            <img src={goalSelected} alt="" width={14} height={14} />
                            {CAREER_QUESTIONNAIRE.selectedLabel}
                          </span>
                        )}
                      </span>
                      <span className="flex flex-col gap-3">
                        <span className="text-xl leading-7 font-bold text-ink">{goal.title}</span>
                        <span className="text-sm leading-6 text-ink-soft">{goal.description}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* CTA — frame 43:423: a 56px brand pill, 40px below the section. */}
            <div className="flex w-full flex-col items-center gap-3 pt-10">
              {loadingTracks ? <p role="status" className="text-sm text-ink-soft">Loading career goals…</p> : loadError ? <p role="alert" className="text-sm text-code-red">{loadError}</p> : generating ? (
                /* Keyed by state, so entering state 3 replays the file's DISSOLVE (100ms) and
                   entering state 2 the 300ms ease-out the smart animate would use. */
                <div
                  key={phase.id}
                  role="status"
                  aria-live="polite"
                  className={`flex w-full max-w-[360px] flex-col gap-3 ${PHASE_ENTRY[phase.entry]}`}
                >
                  <p className="text-center text-sm leading-5 font-semibold text-ink">
                    {CAREER_QUESTIONNAIRE.generating.label} · {progress}%
                  </p>
                  <ProgressBar value={progress} size="sm" />
                  <p className="text-center text-sm leading-5 text-ink-soft">{step}</p>
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    aria-disabled={!selected}
                    aria-describedby={HELPER_ID}
                    className={`inline-flex h-14 items-center justify-center gap-3 rounded-pill bg-brand px-8 text-base text-white ${
                      selected
                        ? 'shadow-[0_12px_16px_0_rgba(249,115,22,0.28)] transition hover:brightness-110 active:scale-[0.98]'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    {CAREER_QUESTIONNAIRE.submit}
                    <img src={arrowRight} alt="" width={18} height={18} />
                  </button>
                  <div id={HELPER_ID} className="flex flex-col items-center">
                    {showValidation ? (
                      <p role="alert" className="text-sm leading-5 text-code-red">
                        {CAREER_QUESTIONNAIRE.hintError}
                      </p>
                    ) : (
                      <p className="text-sm leading-5 text-ink-soft">
                        {selected
                          ? CAREER_QUESTIONNAIRE.hintReady(selected.title)
                          : CAREER_QUESTIONNAIRE.hintEmpty}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
