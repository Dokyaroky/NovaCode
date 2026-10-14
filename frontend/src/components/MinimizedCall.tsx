import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/Toast'
import { SESSION, SESSION_PEERS } from '@/data/studypod'
import groupChallenge from '@/assets/icons/group-challenge.svg'
import micOff from '@/assets/icons/mic-off.svg'

/* The minimised call remembers itself across a reload — leaving the session page without
   ending the call is a state, not a transient view. */
const STORAGE_KEY = 'novacode:studypod-call'

export function readMinimizedCall(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === 'minimized'
  } catch {
    return false
  }
}

export function writeMinimizedCall(minimized: boolean) {
  try {
    if (minimized) window.sessionStorage.setItem(STORAGE_KEY, 'minimized')
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode / storage disabled: the call simply does not survive a reload */
  }
}

/** Callers set this on mount when they arrive at `/studypod/session` directly. */
export function clearMinimizedCall() {
  writeMinimizedCall(false)
}

const PANEL = { w: 300, h: 92 }
const MARGIN = 24

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export interface MinimizedCallProps {
  minimized: boolean
  onRestore: () => void
  /** Show the "keeps running while you browse" toast — only for the moment of minimising. */
  announce?: boolean
}

/**
 * The StudyPod call, shrunk to a draggable picture-in-picture window pinned to the bottom-right.
 * It floats over every screen (portalled, fixed) while the session is still running, the way a
 * video call keeps going when you leave its tab. Drag it anywhere; the drag is clamped to the
 * viewport and re-clamped on resize. Keyboard: Alt+Arrow nudges it, Home snaps it back.
 */
export default function MinimizedCall({ minimized, onRestore, announce = false }: MinimizedCallProps) {
  const { push } = useToast()
  const navigate = useNavigate()
  const dragRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  /* Default anchor: bottom-right, where the design language puts floating surfaces. */
  useEffect(() => {
    if (!minimized) return
    setPos((current) => {
      if (current) return current
      const width = window.innerWidth
      const height = window.innerHeight
      return {
        x: clamp(width - PANEL.w - MARGIN, 8, Math.max(8, width - PANEL.w - 8)),
        y: clamp(height - PANEL.h - MARGIN, 8, Math.max(8, height - PANEL.h - 8)),
      }
    })
    if (announce) push({ title: SESSION.minimizedNotice, tone: 'info' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized])

  useEffect(() => {
    if (!minimized) return
    const onResize = () =>
      setPos((current) =>
        current
          ? {
              x: clamp(current.x, 8, Math.max(8, window.innerWidth - PANEL.w - 8)),
              y: clamp(current.y, 8, Math.max(8, window.innerHeight - PANEL.h - 8)),
            }
          : current,
      )
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [minimized])

  /* Pointer-driven drag: the handle captures the pointer, so the window keeps following
     outside its own bounds and the page never selects text mid-drag. */
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const node = dragRef.current
    if (!node || !pos) return
    event.preventDefault()
    const originX = event.clientX - pos.x
    const originY = event.clientY - pos.y
    node.setPointerCapture(event.pointerId)
    setDragging(true)

    const move = (moveEvent: PointerEvent) => {
      setPos({
        x: clamp(moveEvent.clientX - originX, 8, Math.max(8, window.innerWidth - PANEL.w - 8)),
        y: clamp(moveEvent.clientY - originY, 8, Math.max(8, window.innerHeight - PANEL.h - 8)),
      })
    }

    const end = () => {
      setDragging(false)
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerup', end)
      node.removeEventListener('pointercancel', end)
    }

    node.addEventListener('pointermove', move)
    node.addEventListener('pointerup', end)
    node.addEventListener('pointercancel', end)
  }

  const nudge = (dx: number, dy: number) =>
    setPos((current) =>
      current
        ? {
            x: clamp(current.x + dx, 8, Math.max(8, window.innerWidth - PANEL.w - 8)),
            y: clamp(current.y + dy, 8, Math.max(8, window.innerHeight - PANEL.h - 8)),
          }
        : current,
    )

  /* Leaving from here is a request, not an action: it puts you back in the session with the
     frame's "End Collaborative Session?" dialog on screen (frame 106:3843). */
  const requestEndCall = () => {
    onRestore()
    navigate('/studypod/session', { state: { endCall: true } })
  }

  if (!minimized || !pos) return null

  const [you, peer] = SESSION_PEERS

  return (
    <div
      ref={dragRef}
      role="complementary"
      aria-label={SESSION.minimizedLabel}
      style={{ left: pos.x, top: pos.y, width: PANEL.w }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 48 : 16
        if (event.key === 'ArrowLeft') nudge(-step, 0)
        else if (event.key === 'ArrowRight') nudge(step, 0)
        else if (event.key === 'ArrowUp') nudge(0, -step)
        else if (event.key === 'ArrowDown') nudge(0, step)
        else if (event.key === 'Home') setPos(null)
        else return
        event.preventDefault()
      }}
      className={`animate-slide-up fixed z-40 flex touch-none flex-col overflow-clip rounded-card bg-surface shadow-shell ${
        dragging ? 'cursor-grabbing select-none' : ''
      }`}
    >
      {/* Drag handle: the whole strip, so a small window is still easy to grab. */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={onRestore}
        title={SESSION.dragHint}
        className="flex cursor-grab items-center gap-3 px-4 pt-3 pb-2"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-tile bg-brand">
          <img src={groupChallenge} alt="" width={18} height={18} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-white">{SESSION.challengeTitle}</span>
          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className="size-2 shrink-0 rounded-full bg-success" />
            {SESSION.status}
          </span>
        </span>
        <button
          type="button"
          onClick={onRestore}
          aria-label={SESSION.restoreLabel}
          className="grid size-7 shrink-0 place-items-center rounded-tile text-ink-soft transition hover:bg-white/10 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 2.5H2.5V5M9 11.5h2.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-3">
        <span className="flex items-center gap-2">
          {[you, peer].map((person) => (
            <span
              key={person.id}
              className={`grid size-7 place-items-center rounded-full text-[10px] font-bold text-white ${person.gradient}`}
              title={person.name}
            >
              {person.initials}
            </span>
          ))}
          <span className="text-xs text-ink-soft">{SESSION.minimizedPeer}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full bg-muted transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-brand"
            aria-label={SESSION.controls.mute}
          >
            <img src={micOff} alt="" width={15} height={15} />
          </button>
          <Link
            to="/studypod/session"
            onClick={onRestore}
            className="rounded-pill bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {SESSION.rejoin}
          </Link>
          <button
            type="button"
            onClick={requestEndCall}
            className="rounded-pill bg-[#ef4444] px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {SESSION.controls.end}
          </button>
        </span>
      </div>
    </div>
  )
}
