import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import { useToast } from '@/components/Toast'
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
 * generation step (text + progress bar, never a spinner).
 */
const GENERATION_MS = 1400
const HELPER_ID = 'career-goal-helper'

export default function Questionnaire() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [selectedId, setSelectedId] = useState<CareerGoalId | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const groupRef = useRef<HTMLFieldSetElement>(null)

  const selected = CAREER_GOALS.find((goal) => goal.id === selectedId) ?? null
  const steps = CAREER_QUESTIONNAIRE.generating.steps
  const step = steps[Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))]

  /* The generation step: a timed progress ramp that ends on the Career Path screen with the toast
     that confirms the path. Both timers die with the screen. */
  useEffect(() => {
    if (!generating) return
    const start = Date.now()
    const tick = window.setInterval(() => {
      setProgress(Math.min(100, Math.round(((Date.now() - start) / GENERATION_MS) * 100)))
    }, 60)
    const finish = window.setTimeout(() => {
      if (selected) {
        push({
          title: CAREER_QUESTIONNAIRE.toast.title,
          description: CAREER_QUESTIONNAIRE.toast.body(selected.title),
          tone: 'success',
        })
      }
      navigate('/learn')
    }, GENERATION_MS)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(finish)
    }
  }, [generating, selected, navigate, push])

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
    setGenerating(true)
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
                {CAREER_GOALS.map((goal) => (
                  <label key={goal.id} className="relative flex cursor-pointer">
                    {/* Native radios: one tab stop, arrow keys move and pick, the whole card is
                        the label. The ring and the violet border are peer state, not JS state. */}
                    <input
                      type="radio"
                      name="career-goal"
                      value={goal.id}
                      checked={goal.id === selectedId}
                      onChange={() => choose(goal.id)}
                      aria-invalid={showValidation || undefined}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[208px] w-full flex-col gap-6 rounded-card border-[3.8px] border-transparent bg-surface p-6 shadow-card transition duration-150 peer-checked:border-accent peer-hover:bg-surface/80 peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      <span className="flex items-start justify-between gap-3">
                        <IconTile size="md" tone="accentStrong">
                          <img src={goal.icon} alt="" width={24} height={24} />
                        </IconTile>
                        {goal.id === selectedId && (
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
              {generating ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex w-full max-w-[360px] flex-col gap-3"
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
