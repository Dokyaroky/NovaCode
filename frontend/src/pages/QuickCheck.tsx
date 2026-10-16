import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, SVGProps } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/Button'
import NovaLogo from '@/components/NovaLogo'
import { useToast } from '@/components/Toast'
import { QUICK_CHECK, formatTimestamp } from '@/data/mission'
import { api, ApiError } from '@/lib/api'

interface Challenge {
  slug: string
  title: string
  instruction: string
  starterCode: string | null
  placeholder: string
  theory: { title: string; minutes: number }
  passed: boolean
}

interface Verdict { passed: boolean; title: string; description: string }

/* Page-local inline icons (17px back arrow, 30px replay/pause), tinted with currentColor. */

function IconArrowLeft({ width = 17, height = 17, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 17 17" fill="none" aria-hidden="true" {...props}>
      <path d="M14 8.5H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7.5 4L3 8.5L7.5 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconReplay({ width = 30, height = 30, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 30 30" fill="none" aria-hidden="true" {...props}>
      <path
        d="M15 5.2A9.8 9.8 0 1 1 5.2 15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 1.6L15 5.2L10.6 8.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPause({ width = 30, height = 30, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 30 30" fill="none" aria-hidden="true" {...props}>
      <rect x="5.5" y="3" width="6.5" height="24" rx="1.5" fill="currentColor" />
      <rect x="18" y="3" width="6.5" height="24" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconArrowRight({ width = 18, height = 18, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9.75 4.5L14.25 9L9.75 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Focused quick-check briefing (Figma 118:5783). The frame has no sidebar: it is a 1440-wide
 * layout with its own 71px top bar, so this page deliberately does not render AppShell.
 *
 * The theory clip is complete in the design (08:00 / 08:00, full bar); Replay restarts it on
 * the same 1s ticker the mission player uses, mapped onto the 900x506.25 video section. The
 * Challenge content is fetched from the API and graded server-side; the theory clip remains a
 * simulated presentation from the original Figma screen.
 */
export default function QuickCheck() {
  const navigate = useNavigate()
  const { slug = '' } = useParams<{ slug: string }>()
  const { push } = useToast()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ status: number | null; message: string } | null>(null)
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [position, setPosition] = useState<number>(QUICK_CHECK.duration)
  const [replaying, setReplaying] = useState(false)

  const returnTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    api.get<{ data: Challenge }>(`/api/me/missions/${slug}/challenge`)
      .then((response) => {
        if (cancelled) return
        setChallenge(response.data)
        setCode(response.data.starterCode ?? '')
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError({ status: reason instanceof ApiError ? reason.status : null, message: reason instanceof ApiError ? reason.message : 'Unable to load this challenge.' })
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug])

  const finished = position >= QUICK_CHECK.duration
  /* The clip ends when the ticker reaches 08:00, so the bar and the state cannot disagree. */
  const isReplaying = replaying && !finished
  const progress = Math.min(100, (position / QUICK_CHECK.duration) * 100)

  /* Replay runs the clip from the start on a real 1s ticker. */
  useEffect(() => {
    if (!isReplaying) return
    const ticker = window.setInterval(() => {
      setPosition((current) => Math.min(QUICK_CHECK.duration, current + 1))
    }, 1000)
    return () => window.clearInterval(ticker)
  }, [isReplaying])

  useEffect(
    () => () => {
      window.clearTimeout(returnTimer.current)
    },
    [],
  )

  const replay = () => {
    if (isReplaying) {
      setReplaying(false)
      return
    }
    setPosition(0)
    setReplaying(true)
  }

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const editor = event.currentTarget
    editor.setRangeText(QUICK_CHECK.indent, editor.selectionStart, editor.selectionEnd, 'end')
    setCode(editor.value)
  }

  const submit = () => {
    if (!challenge || checking) return
    setVerdict(null)
    setChecking(true)
    api.post<{ data: Verdict }>(`/api/challenges/${challenge.slug}/attempts`, { answer: code })
      .then((response) => {
        setVerdict(response.data)
        push({ title: response.data.title, description: response.data.description, tone: response.data.passed ? 'success' : 'error' })
        if (response.data.passed) returnTimer.current = window.setTimeout(() => navigate('/learn'), 1200)
      })
      .catch((reason: unknown) => {
        const failure = reason instanceof ApiError ? { title: 'Unable to submit', description: reason.message } : { title: 'Unable to submit', description: 'Please try again.' }
        setVerdict({ passed: false, ...failure })
        push({ ...failure, tone: 'error' })
      })
      .finally(() => setChecking(false))
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-shell text-sm text-ink-soft">Loading challenge…</div>
  if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-shell p-6 text-center"><p role="alert" className="text-sm text-code-red">{error.status === 403 ? 'This mission is locked or is not in your current track.' : error.status === 404 ? 'This mission does not have a challenge yet.' : error.message}</p><Link to="/learn" className="rounded-pill bg-brand px-6 py-3 text-white">Return to map</Link></div>
  if (!challenge) return null

  return (
    <div className="flex min-h-screen flex-col bg-shell">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-[0.917px] border-white/10 px-5 py-3 md:grid md:h-[71px] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-8 md:py-0">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to={QUICK_CHECK.backPath}
            className="text-button flex shrink-0 items-center gap-2 text-base leading-6 text-white/60 transition hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <IconArrowLeft />
            {QUICK_CHECK.backLabel}
          </Link>
          <div className="hidden md:block">
            <NovaLogo />
          </div>
        </div>
        <h1 className="text-lg leading-7 font-bold text-white">{challenge.title}</h1>
        <span aria-hidden="true" className="hidden md:block" />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-6 md:px-8">
        <div className="flex w-full max-w-[900px] flex-col gap-6">
          <section className="relative aspect-[900/506.25] w-full overflow-clip rounded-card bg-[#020617] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-tint blur-[64px]"
            />

            <button
              type="button"
              onClick={replay}
              aria-label={isReplaying ? QUICK_CHECK.pauseLabel : QUICK_CHECK.replayLabel}
              className="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-[0_14px_20px_rgba(249,115,22,0.35)] transition hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              {isReplaying ? <IconPause /> : <IconReplay />}
            </button>

            <div className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/90 to-transparent px-6 pt-16 pb-5">
              <div
                role="progressbar"
                aria-label={QUICK_CHECK.progressLabel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-valuetext={formatTimestamp(position, QUICK_CHECK.duration)}
                className="h-[6px] w-full overflow-hidden rounded-pill bg-white/20"
              >
                <div
                  className="h-full rounded-pill bg-success"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="pt-3 text-right font-mono text-xs leading-4 font-semibold text-white">
                {formatTimestamp(position, QUICK_CHECK.duration)}
              </p>
            </div>
          </section>

          <article className="flex w-full flex-col overflow-clip rounded-card bg-surface p-6 shadow-card">
            <h2 className="text-2xl leading-8 font-bold text-ink">{challenge.title}</h2>
            <p className="pt-3 text-sm leading-6 text-white/70">{challenge.instruction}</p>

            <div className="pt-5">
              <label htmlFor="quick-check-code" className="sr-only">
                {QUICK_CHECK.editorLabel}
              </label>
              <textarea
                id="quick-check-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                placeholder={challenge.placeholder}
                className="h-20 w-full resize-none rounded-tile bg-shell p-4 font-mono text-sm leading-6 text-ink-soft outline-none transition placeholder:text-ink-soft/50 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)]"
              />
            </div>

            {checking || verdict ? (
              <p
                role="status"
                aria-live="polite"
                className={`pt-3 text-sm leading-6 ${verdict && !verdict.passed && !checking ? 'text-code-red' : 'text-success'}`}
              >
                {checking
                  ? QUICK_CHECK.checkingLabel
                  : `${verdict?.title} — ${verdict?.description}`}
              </p>
            ) : null}

            <div className="flex items-start justify-end pt-5">
              <Button size="lg" onClick={submit} disabled={checking} icon={<IconArrowRight />} className="w-[252px]">
                {QUICK_CHECK.submitLabel}
              </Button>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
