import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { clearMinimizedCall, writeMinimizedCall } from '@/components/MinimizedCall'
import { useToast } from '@/components/Toast'
import { CODE_TEMPLATES, END_SESSION, SESSION, SESSION_PEERS } from '@/data/studypod'
import arrowLeft from '@/assets/icons/back-arrow.svg'
import cameraOff from '@/assets/icons/camera-off.svg'
import checkSm from '@/assets/icons/check-sm.svg'
import endSession from '@/assets/icons/end-session.svg'
import groupChallenge from '@/assets/icons/group-challenge.svg'
import micOff from '@/assets/icons/mic-off.svg'
import play from '@/assets/icons/play.svg'
import terminal from '@/assets/icons/terminal.svg'

const TEMPLATE = CODE_TEMPLATES[SESSION.language]
const INITIAL_CODE = TEMPLATE.code.join('\n')
const INDENT = '    '

/* Pulls the literal a print/log/select call would emit, so Run Test reflects edits. */
const STDOUT_PATTERNS = [
  /print\(\s*["'](.+?)["']\s*\)/,
  /console\.log\(\s*["'](.+?)["']\s*\)/,
  /SELECT\s+["'](.+?)["']/i,
]

function CallControl({
  icon,
  label,
  tone = 'muted',
  pressed,
  onClick,
}: {
  icon: string
  label: string
  /** `danger` is the red end-call control (frame 12:333). */
  tone?: 'muted' | 'danger'
  pressed?: boolean
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
        className={`grid size-12 place-items-center rounded-full transition hover:brightness-110 active:scale-[0.98] ${
          tone === 'danger' ? 'bg-[#ef4444]' : 'bg-muted'
        }`}
      >
        <img src={icon} alt="" width={21} height={21} />
      </button>
      <span className="text-xs leading-4 whitespace-nowrap text-ink-soft">{label}</span>
    </div>
  )
}

/** Full-bleed session workspace: the frame is a 504 | 936 split with no sidebar. */
export default function StudyPodSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()
  const [code, setCode] = useState(INITIAL_CODE)
  const [output, setOutput] = useState<string[]>([SESSION.outputReady])
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [endCallOpen, setEndCallOpen] = useState(false)
  const minimizeCallRef = useRef<HTMLButtonElement>(null)

  /**
   * This route means the call is no longer minimised (it is on screen again). When the minimised
   * window's End Call sent us here (`state.endCall`) the call is parked until the user answers
   * the dialog, so "Yes, End Call" resolves as the frame's copy implies; leaving the page with
   * the call still running parks it again for the floating window.
   */
  const endedRef = useRef(false)

  useEffect(() => {
    const flagged = Boolean((location.state as { endCall?: boolean } | null)?.endCall)
    if (flagged) writeMinimizedCall(true)
    else clearMinimizedCall()
    if (flagged) setEndCallOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(
    () => () => {
      if (!endedRef.current) writeMinimizedCall(true)
    },
    [],
  )

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLPreElement>(null)

  const dirty = code !== INITIAL_CODE
  const lines = code.split('\n')

  /* Gutter and caret backdrop are not scrollers: they mirror the textarea. */
  const syncScroll = () => {
    const editor = editorRef.current
    if (!editor) return
    if (gutterRef.current) gutterRef.current.scrollTop = editor.scrollTop
    if (backdropRef.current) {
      backdropRef.current.scrollTop = editor.scrollTop
      backdropRef.current.scrollLeft = editor.scrollLeft
    }
  }

  /* Mirror the textarea into the gutter and caret backdrop: a native listener (React's
     delegated onScroll is not reliable here) plus a sync on every render, which also
     catches the browser's own scroll-to-caret when typing past the fold. */
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const handleScroll = () => syncScroll()
    editor.addEventListener('scroll', handleScroll, { passive: true })
    return () => editor.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    syncScroll()
  })

  /* Mock run: echoes the command and prints what the buffer asks for (no backend yet). */
  const runTest = () => {
    const printed = STDOUT_PATTERNS.map((pattern) => pattern.exec(code)?.[1]).find(
      (value) => value !== undefined,
    )
    setOutput((prev) => [...prev, `$ ${TEMPLATE.runCommand}`, printed ?? TEMPLATE.output])
  }

  /* Tab indents instead of leaving the editor (4 spaces, the file is Python). */
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    const editor = event.currentTarget
    editor.setRangeText(INDENT, editor.selectionStart, editor.selectionEnd, 'end')
    setCode(editor.value)
  }

  /* The frame's rule is that both peers must agree before submitting; without the backend
     the button states the rule instead of faking a successful submission. */
  const submitGroupWork = () => push({ title: SESSION.footerNote, tone: 'info' })

  /* Confirming here always ends the call: the parked flag goes first, so the session page
     un-mounting cannot leave a floating window behind. */
  const endCall = () => {
    endedRef.current = true
    writeMinimizedCall(false)
    setEndCallOpen(false)
    push({ title: END_SESSION.endedMessage, tone: 'success' })
    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-rows-[100%] lg:grid-cols-[504px_minmax(0,1fr)] lg:overflow-hidden">
      <div className="no-scrollbar flex flex-col gap-6 bg-shell p-6 lg:overflow-y-auto">
        {/* Leaving without ending the call is possible: the call minimises to a floating window. */}
        <Button
          variant="outline"
          className="self-start"
          aria-disabled={endCallOpen}
          title={endCallOpen ? SESSION.footerNote : undefined}
          icon={<img src={arrowLeft} alt="" width={17} height={17} />}
          iconPosition="start"
          onClick={() => {
            if (endCallOpen) return
            minimizeCallRef.current?.click()
          }}
        >
          {SESSION.backToDashboard}
        </Button>

        <Card className="flex flex-col overflow-clip p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {SESSION.eyebrow}
              </span>
              <h1 className="text-2xl font-bold text-ink">{SESSION.title}</h1>
            </div>
            <span className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-success-tint px-3 py-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-xs font-bold whitespace-nowrap text-ink-soft">
                {SESSION.status}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            {SESSION_PEERS.map((peer) => (
              <div
                key={peer.id}
                className="relative flex aspect-square flex-col items-center justify-center gap-3 overflow-clip rounded-card bg-code"
              >
                <span
                  className={`grid size-24 shrink-0 place-items-center rounded-full ${peer.gradient}`}
                >
                  <span className="text-2xl font-black text-white">{peer.initials}</span>
                </span>
                <span className="text-sm font-semibold text-white">{peer.name}</span>
                <span className="absolute top-4 right-4 size-3 rounded-full border-[1.8px] border-code bg-success" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-6">
            <CallControl
              icon={micOff}
              label={micOn ? SESSION.controls.mute : 'Unmute'}
              pressed={!micOn}
              onClick={() => setMicOn((on) => !on)}
            />
            <CallControl
              icon={cameraOff}
              label={cameraOn ? SESSION.controls.camera : 'Turn On Camera'}
              pressed={!cameraOn}
              onClick={() => setCameraOn((on) => !on)}
            />
            <CallControl
              icon={endSession}
              label={SESSION.controls.end}
              tone="danger"
              onClick={() => setEndCallOpen(true)}
            />
          </div>
        </Card>

        <Card className="flex flex-1 flex-col gap-6 overflow-clip p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-tile bg-brand-tint">
              <img src={groupChallenge} alt="" width={22} height={22} />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {SESSION.challengeEyebrow}
              </span>
              <h2 className="text-xl font-bold text-ink">{SESSION.challengeTitle}</h2>
            </div>
          </div>

          <p className="text-sm leading-6 text-ink-soft">{SESSION.challengeBody}</p>

          <ul className="flex flex-col gap-4">
            {SESSION.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-3">
                <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-success-tint-strong">
                  <img src={checkSm} alt="" width={11} height={11} />
                </span>
                <span className="text-sm leading-5 text-ink-soft">{objective}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col border-t border-white/10 bg-[#0b1120] lg:border-t-0 lg:border-l">
        <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b-[0.9px] border-white/10 px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-tile bg-brand">
              <img src={groupChallenge} alt="" width={22} height={22} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-xl font-bold text-white">{SESSION.editorTitle}</h1>
              <span className="truncate text-xs leading-4 text-ink-soft">
                {TEMPLATE.filename} · {dirty ? SESSION.unsavedLabel : SESSION.savedLabel}
              </span>
            </div>
          </div>
          <span className="flex h-9 shrink-0 items-center gap-3 rounded-full bg-success-tint px-4 py-2">
            <span
              className={`size-2 rounded-full ${dirty ? 'bg-brand' : 'bg-success'} opacity-95`}
            />
            <span className="text-sm leading-5 font-semibold whitespace-nowrap text-ink-soft">
              {SESSION.peerStatus}
            </span>
          </span>
        </header>

        {/* Editable code area: the textarea scrolls, the gutter and caret backdrop mirror it. */}
        <div className="flex min-h-0 flex-1 overflow-hidden p-8">
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="no-scrollbar flex w-6 shrink-0 flex-col overflow-hidden pr-0"
          >
            {lines.map((_, index) => (
              <span
                key={index}
                className="h-9 shrink-0 text-right font-mono text-[15px] leading-9 text-ink-soft"
              >
                {index + 1}
              </span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1 pl-8">
            {/* Transparent text keeps the metrics; only the peer caret is painted. */}
            <pre
              ref={backdropRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-0 overflow-hidden font-mono text-[15px] leading-9 text-transparent"
            >
              {lines.map((line, index) => (
                <div key={index} className="h-9 whitespace-pre">
                  {line}
                  {!dirty && index + 1 === SESSION.caretLine && (
                    <span className="inline-block h-5 w-0.5 translate-y-1 bg-brand" />
                  )}
                </div>
              ))}
            </pre>

            <textarea
              ref={editorRef}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              wrap="off"
              aria-label="Collaborative code editor"
              className="no-scrollbar absolute inset-0 size-full resize-none overflow-auto border-0 bg-transparent p-0 font-mono text-[15px] leading-9 text-ink-soft outline-none caret-brand"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col overflow-hidden rounded-card bg-code shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="flex h-11 shrink-0 items-center gap-3 border-b-[0.9px] border-white/8 px-4">
              <img src={terminal} alt="" width={17} height={17} />
              <span className="text-sm font-semibold text-white">{SESSION.outputLabel}</span>
            </div>
            <div
              role="log"
              aria-live="polite"
              aria-label={SESSION.outputLabel}
              className="no-scrollbar h-[140px] overflow-y-auto p-4"
            >
              {output.map((line, index) => (
                <p
                  key={index}
                  className="font-mono text-sm leading-5 break-words whitespace-pre-wrap text-ink-soft"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex h-24 shrink-0 flex-wrap items-center justify-between gap-4 border-t-[0.9px] border-white/10 px-6">
          <p className="text-sm leading-5 text-ink-soft">{SESSION.footerNote}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              iconPosition="start"
              icon={<img src={play} alt="" width={18} height={18} />}
              onClick={runTest}
            >
              Run Test
            </Button>
            <Button onClick={submitGroupWork}>Submit Group Work</Button>
          </div>
        </footer>
      </div>

      {/* End Collaborative Session? — frame 106:3843, a centred 420px dialog. */}
      <Modal
        open={endCallOpen}
        onClose={() => setEndCallOpen(false)}
        showClose={false}
        ariaLabel={END_SESSION.title}
        size="sm"
        panelClassName="max-w-[420px]!"
        bodyClassName="flex flex-col items-center p-8 text-center"
      >
        <div className="grid size-14 place-items-center rounded-tile bg-[rgba(239,68,68,0.15)]">
          <img src={endSession} alt="" width={26} height={26} />
        </div>
        <h2 className="pt-5 text-2xl font-bold leading-8 text-white">{END_SESSION.title}</h2>
        <p className="w-[356px] max-w-full pt-3 text-sm leading-6 text-white/70">
          {END_SESSION.body}
        </p>
        <div className="grid w-full grid-cols-2 gap-3 pt-7">
          <button
            type="button"
            onClick={() => setEndCallOpen(false)}
            className="h-12 rounded-pill border-[0.917px] border-white/30 text-base text-white/80 transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {END_SESSION.cancel}
          </button>
          <button
            type="button"
            onClick={endCall}
            className="h-12 rounded-pill bg-[#ef4444] text-base text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {END_SESSION.confirm}
          </button>
        </div>
      </Modal>

      {/* Off-screen trigger: the header's "Back to Dashboard" parks the call and minimises it. */}
      <button
        ref={minimizeCallRef}
        type="button"
        hidden
        onClick={() => {
          writeMinimizedCall(true)
          navigate('/dashboard', { state: { minimizeCall: true } })
        }}
      />
    </div>
  )
}
