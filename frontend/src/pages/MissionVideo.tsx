import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import { useToast } from '@/components/Toast'
import {
  ASSISTANT_REPLY_DELAY,
  CHECK_DELAY,
  DEFAULT_MODULE_ID,
  MICRO_TASK_INDENT,
  MICRO_TASK_MESSAGES,
  MISSION,
  MISSION_MODULES,
  assistantReply,
  formatTimestamp,
  validateMicroTask,
} from '@/data/mission'
import type { MissionModule, PlaybackState, Verdict } from '@/data/mission'

/* ------------------------------------------------------------------ icons
   The glyphs this screen draws are page-local and inline: they tint with currentColor,
   so they stay out of the shared icon module while other workstreams edit it. Geometry
   follows the frame vectors (17px back arrow, 30px play/pause, 20px volume, 18px check
   / sparkle / send). */

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

function IconPlay({ width = 30, height = 30, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 30 30" fill="none" aria-hidden="true" {...props}>
      <path d="M6 2.5L27 15L6 27.5V2.5Z" fill="currentColor" />
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

function IconVolume({ muted, width = 20, height = 20, ...props }: SVGProps<SVGSVGElement> & { muted?: boolean }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M2 7.5H5L10 3.5V16.5L5 12.5H2V7.5Z" fill="currentColor" />
      {muted ? (
        <path d="M13 7.5L17 12.5M17 7.5L13 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M13 6.5C15 8 15 12 13 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  )
}

function IconCheck({ width = 18, height = 18, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.75 9.5L7.25 13L14.25 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSparkle({ width = 20, height = 20, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.66667 1.33333L3.33333 9.33333H8L7.33333 14.6667L12.6667 6.66667H8L8.66667 1.33333Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSend({ width = 18, height = 18, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 2L2 8L8 10L10 16L16 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconArrowRight({ width = 17, height = 17, ...props }: SVGProps<SVGSVGElement>) {
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

/* ------------------------------------------------------------------ state */

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const DEFAULT_MODULE = MISSION_MODULES.find((module) => module.id === DEFAULT_MODULE_ID) ?? MISSION_MODULES[0]

/* ------------------------------------------------------------------ screen */

/**
 * Mission video course player (Figma 84:3068; playback states 43:2, 84:2732, 84:2900).
 * The frame's content column is a `691.6 | 372.4` grid inside the 1152 shell column, so the
 * sidebar is an inner grid column rather than the AppShell rail (300/360 would move the video
 * box off the frame's numbers).
 *
 * Playback is a real state machine (idle → playing → ended) driven by a 1s ticker: the design
 * ships no media file, so the ticker is the source of truth for the bar and the timestamp.
 * The task check and the assistant are mocked (no fetch) — see src/data/mission.ts.
 */
export default function MissionVideo() {
  const { push } = useToast()

  const [selectedId, setSelectedId] = useState(DEFAULT_MODULE.id)
  const [position, setPosition] = useState(DEFAULT_MODULE.resumeAt)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [code, setCode] = useState<string>(MISSION.microTaskCode)
  const [checking, setChecking] = useState(false)
  const [verdict, setVerdict] = useState<{ ok: boolean; message: Verdict } | null>(null)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [asking, setAsking] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const checkTimer = useRef<number | undefined>(undefined)
  const replyTimer = useRef<number | undefined>(undefined)
  const messageSeq = useRef(0)

  const active = MISSION_MODULES.find((module) => module.id === selectedId) ?? DEFAULT_MODULE
  const finished = position >= active.duration
  const isPlaying = playing && !finished
  /* idle → playing → ended: `ended` is the ticker reaching the clip's end, so the state
     change and the bar/timestamp can never disagree. */
  const playback: PlaybackState = isPlaying ? 'playing' : finished ? 'ended' : 'idle'
  const progress = active.duration === 0 ? 0 : Math.min(100, (position / active.duration) * 100)

  /* One tick per second while playing; reaching the end stops the ticker. */
  useEffect(() => {
    if (!isPlaying) return
    const ticker = window.setInterval(() => {
      setPosition((current) => Math.min(active.duration, current + 1))
    }, 1000)
    return () => window.clearInterval(ticker)
  }, [isPlaying, active.duration])

  /* Pending timers are dropped on unmount. */
  useEffect(
    () => () => {
      window.clearTimeout(checkTimer.current)
      window.clearTimeout(replyTimer.current)
    },
    [],
  )

  const togglePlayback = () => {
    if (isPlaying) {
      setPlaying(false)
      return
    }
    if (finished) setPosition(0)
    setPlaying(true)
  }

  /* Another module loads its own position and stops playback; the active row toggles. */
  const selectModule = (module: MissionModule) => {
    if (module.id === active.id) {
      togglePlayback()
      return
    }
    setSelectedId(module.id)
    setPosition(module.resumeAt)
    setPlaying(false)
  }

  /* Tab indents instead of leaving the editor, like the StudyPod session editor. */
  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const editor = event.currentTarget
    editor.setRangeText(MICRO_TASK_INDENT, editor.selectionStart, editor.selectionEnd, 'end')
    setCode(editor.value)
  }

  const submitTask = () => {
    setVerdict(null)
    const failure = validateMicroTask(code)
    if (failure) {
      setVerdict({ ok: false, message: failure })
      push({ ...failure, tone: 'error' })
      return
    }
    setChecking(true)
    window.clearTimeout(checkTimer.current)
    checkTimer.current = window.setTimeout(() => {
      setChecking(false)
      setVerdict({ ok: true, message: MICRO_TASK_MESSAGES.success })
      push({ ...MICRO_TASK_MESSAGES.success, tone: 'success' })
    }, CHECK_DELAY)
  }

  const askAssistant = (event: FormEvent) => {
    event.preventDefault()
    const question = draft.trim()
    if (!question || asking) return
    messageSeq.current += 1
    setMessages((current) => [...current, { id: `q${messageSeq.current}`, role: 'user', text: question }])
    setDraft('')
    setAsking(true)
    window.clearTimeout(replyTimer.current)
    replyTimer.current = window.setTimeout(() => {
      messageSeq.current += 1
      setMessages((current) => [
        ...current,
        { id: `a${messageSeq.current}`, role: 'assistant', text: assistantReply(question) },
      ])
      setAsking(false)
    }, ASSISTANT_REPLY_DELAY)
  }

  const useSuggestion = () => {
    setDraft(MISSION.assistantSuggestion)
    inputRef.current?.focus()
  }

  return (
    <AppShell mainClassName="p-4 md:p-6 lg:p-8">
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,691.6fr)_minmax(0,372.4fr)]">
        {/* -------------------------------------------------------- main column */}
        <section className="flex min-w-0 flex-col">
          <div className="flex h-8 shrink-0 items-center justify-between gap-4">
            <Link
              to={MISSION.backPath}
              className="flex h-6 shrink-0 items-center gap-2 rounded-sm text-base leading-6 text-ink-soft transition hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <IconArrowLeft />
              {MISSION.backLabel}
            </Link>
            <span className="flex h-8 shrink-0 items-center rounded-pill bg-accent-tint px-4 py-2">
              <span className="text-xs leading-4 font-bold whitespace-nowrap text-ink-violet">
                {MISSION.expedition}
              </span>
            </span>
          </div>

          <div className="shrink-0 pt-5">
            <div className="relative h-[390px] overflow-clip rounded-card bg-[#020617] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 size-[288px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-tint blur-[64px]"
              />

              <button
                type="button"
                onClick={togglePlayback}
                aria-label={
                  playback === 'playing' ? MISSION.pauseLabel : finished ? MISSION.replayLabel : MISSION.playLabel
                }
                className="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-[0_14px_20px_rgba(249,115,22,0.35)] transition hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {playback === 'playing' ? <IconPause /> : <IconPlay />}
              </button>

              <div className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/90 to-transparent px-6 pt-14 pb-5">
                <div
                  role="progressbar"
                  aria-label={MISSION.progressLabel}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-valuetext={formatTimestamp(position, active.duration)}
                  className="h-[6px] w-full overflow-hidden rounded-pill bg-white/20"
                >
                  <div
                    className="h-full rounded-pill bg-success"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex h-9 items-center justify-between pt-4">
                  <span className="text-xs leading-4 font-bold text-white">
                    {formatTimestamp(position, active.duration)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMuted((current) => !current)}
                    aria-pressed={muted}
                    aria-label={muted ? MISSION.volumeOffLabel : MISSION.volumeOnLabel}
                    className="grid size-5 place-items-center text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    <IconVolume muted={muted} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-6">
            <h1 className="text-3xl leading-9 font-bold text-ink">{active.heading}</h1>
          </div>

          <div className="shrink-0 pt-5">
            <Card className="flex flex-col p-6">
              <div className="flex flex-col">
                <span className="text-xs leading-4 font-bold tracking-[0.96px] text-brand uppercase">
                  {MISSION.practiceEyebrow}
                </span>
                <h2 className="pt-2 text-xl leading-7 font-bold text-ink">{MISSION.practiceTitle}</h2>
              </div>

              <div className="pt-5">
                <label htmlFor="micro-task" className="text-sm leading-5 font-medium text-ink-soft">
                  {MISSION.microTaskLabel}
                </label>
                <textarea
                  id="micro-task"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  spellCheck={false}
                  placeholder={MISSION.microTaskPlaceholder}
                  className="mt-3 h-24 w-full resize-none rounded-tile bg-shell p-4 font-mono text-sm leading-6 text-success outline-none transition placeholder:text-ink-soft/40 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)]"
                />
                {checking || verdict ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`pt-2 text-xs leading-4 ${verdict && !verdict.ok && !checking ? 'text-code-red' : 'text-success'}`}
                  >
                    {checking
                      ? MISSION.checkingLabel
                      : `${verdict?.message.title} — ${verdict?.message.description}`}
                  </p>
                ) : null}
              </div>

              <div className="flex h-16 items-start justify-end pt-4">
                <Button onClick={submitTask} disabled={checking} icon={<IconArrowRight />}>
                  {MISSION.submitTaskLabel}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* ----------------------------------------------------- sidebar column */}
        <aside className="flex min-w-0 flex-col gap-6">
          <Card className="flex shrink-0 flex-col overflow-clip lg:h-[408px]">
            <div className="shrink-0 border-b-[1.267px] border-white/8 px-6 py-5">
              <p className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {MISSION.upNextEyebrow}
              </p>
              <div className="pt-2">
                <h2 className="text-2xl leading-8 font-bold text-ink">{MISSION.courseContentTitle}</h2>
              </div>
            </div>

            <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
              {MISSION_MODULES.map((module) => {
                const isActive = module.id === active.id
                const isCompleted = module.resumeAt >= module.duration || (isActive && finished)
                const eyebrow =
                  isActive && playback === 'playing'
                    ? `${module.label} ${MISSION.playingSuffix}`
                    : module.label

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => selectModule(module)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${module.label}: ${module.title} — ${
                      isCompleted
                        ? MISSION.completedLabel
                        : isActive
                          ? playback === 'playing'
                            ? MISSION.playingLabel
                            : MISSION.pausedLabel
                          : MISSION.upcomingLabel
                    }`}
                    className={`flex h-[84px] w-full shrink-0 items-center gap-4 rounded-tile px-4 py-5 text-left transition ${
                      isActive ? 'border-l-[3.8px] border-accent bg-accent-tint' : 'hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full ${
                        isActive
                          ? 'bg-accent text-white'
                          : isCompleted
                            ? 'bg-success-tint text-success'
                            : 'bg-muted text-ink-soft'
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <IconCheck />
                      ) : isActive && playback === 'playing' ? (
                        <IconPause width={16} height={16} />
                      ) : (
                        <IconPlay width={16} height={16} />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span
                        className={`text-xs leading-4 font-semibold whitespace-nowrap ${
                          isActive ? 'text-ink-violet' : 'text-ink-soft'
                        }`}
                      >
                        {eyebrow}
                      </span>
                      <span className="truncate text-base leading-6 font-bold text-ink">{module.title}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="flex min-h-[416px] flex-1 flex-col p-6">
            <div className="flex h-12 shrink-0 items-center gap-3">
              <IconTile size="xs" tone="accentSolid" className="text-white">
                <IconSparkle />
              </IconTile>
              <div className="flex min-w-0 flex-col">
                <h2 className="text-xl leading-7 font-bold text-ink">{MISSION.assistantTitle}</h2>
                <p className="pt-1 text-xs leading-4 text-ink-soft">{MISSION.assistantStatus}</p>
              </div>
            </div>

            <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pt-6">
              {messages.length === 0 ? (
                <button
                  type="button"
                  onClick={useSuggestion}
                  className="h-12 w-fit max-w-full shrink-0 rounded-card bg-accent px-4 py-3 text-left text-sm leading-6 text-white transition hover:brightness-110 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  {MISSION.assistantSuggestion}
                </button>
              ) : (
                messages.map((message) => (
                  <p
                    key={message.id}
                    className={`max-w-full rounded-card px-4 py-3 text-sm leading-6 ${
                      message.role === 'user' ? 'self-end bg-shell text-ink-soft' : 'bg-accent text-white'
                    }`}
                  >
                    {message.text}
                  </p>
                ))
              )}

              {asking && (
                <p
                  role="status"
                  aria-live="polite"
                  aria-label={MISSION.assistantTypingLabel}
                  className="w-fit rounded-card bg-accent px-4 py-3 text-sm leading-6 font-bold text-white"
                >
                  …
                </p>
              )}
            </div>

            <form onSubmit={askAssistant} className="mt-5 flex h-14 shrink-0 items-center gap-2 rounded-tile bg-shell p-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={MISSION.assistantPlaceholder}
                aria-label={MISSION.assistantPlaceholder}
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-ink-soft/60"
              />
              <button
                type="submit"
                disabled={!draft.trim() || asking}
                aria-label={MISSION.assistantSendLabel}
                className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-accent text-white transition hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconSend />
              </button>
            </form>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}
