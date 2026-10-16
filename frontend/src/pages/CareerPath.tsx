import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import Modal from '@/components/Modal'
import ProgressBar from '@/components/ProgressBar'
import { IconClose } from '@/components/icons'
import { api, ApiError } from '@/lib/api'
import type { CareerPathResponse } from '@/lib/career'
import {
  EXPEDITION,
  EXPEDITION_SIDEBAR,
} from '@/data/careerPath'
import type { BriefingStep, ExpeditionStage, Mission, MissionStatus } from '@/data/careerPath'

import checkSm from '@/assets/icons/check-sm.svg'
import astronaut from '@/assets/expedition/astronaut.png'
import badgeFuel from '@/assets/expedition/badge-fuel.svg'
import bossIcon from '@/assets/expedition/boss.svg'
import changeCareer from '@/assets/expedition/change-career.svg'
import extractionIcon from '@/assets/expedition/extraction.svg'
import rocket from '@/assets/expedition/rocket.png'
import briefingCode from '@/assets/expedition/briefing-code.svg'
import briefingReward from '@/assets/expedition/briefing-reward.svg'
import briefingTheory from '@/assets/expedition/briefing-theory.svg'

/* The frame draws each pin as an 80px ring with a 5.07px stroke; the finished ring keeps the
   brand orange, the active one is the darker ember tone with the astronaut standing on it. */
const PIN_RING: Record<MissionStatus, string> = {
  extracting:
    'border-[5.067px] border-[rgba(139,97,0,0.37)] bg-[#bc4f11] shadow-[0_0_22.8px_8px_rgba(226,190,44,0.14),0_12px_30px_0_rgba(16,185,129,0.2)]',
  finished: 'border-[5.067px] border-brand/40 bg-brand shadow-[0_0_20px_6px_rgba(249,115,22,0.18)]',
  locked: 'border-[5.067px] border-shell bg-muted',
}

const PIN_LABEL: Record<MissionStatus, string> = {
  finished: '[Finished]',
  extracting: '[Extracting]',
  locked: '[Locked]',
}

/* Duolingo-style route: a centred column where the pins alternate left/right and a curve joins
   their centres. Every number is in the column's own coordinate space, so the map keeps its shape
   at any width — the SVG stretches horizontally while the pins are positioned in percentages. */
const MISSION_ROUTE = {
  /** Width of the route column at desktop; it shrinks to the viewport below that. */
  column: 560,
  /** Pin centres, as a percentage of the column (a 27% swing around the middle). */
  xLeft: 23,
  xRight: 77,
  /** Vertical distance between two pin centres. */
  gap: 168,
  /** Ring diameter, and the height of a ring + its label card. */
  ring: 80,
  unit: 144,
} as const

const FINAL_REVIEW_ROUTE = '/projects/review'

/** Where the first run sends a visitor who has never answered the questionnaire. */
const QUESTIONNAIRE_ROUTE = '/learn/questionnaire'

/* Entrance choreography: hop `n` draws while pin `n` pops in, one step apart (the pins land on
   their line, so they share the delay). Keep the step under the draw duration or the route
   runs ahead of the map. */
const ROUTE_ANIMATION = {
  /** Delay between two hops, in ms. */
  step: 180,
  /** Delay of the first hop — the header is already on screen when the route starts. */
  lead: 120,
} as const

function entranceDelay(index: number): string {
  return `${ROUTE_ANIMATION.lead + index * ROUTE_ANIMATION.step}ms`
}

/** The briefing card's two row icons, keyed by step id (frame 118:6053). */
const BRIEFING_ICONS: Record<BriefingStep['id'], string> = {
  theory: briefingTheory,
  extraction: briefingCode,
}

/** Pins alternate off-centre, starting on the left (frame 118:5899 draws them that way). */
function pinSide(index: number): 'left' | 'right' {
  return index % 2 === 0 ? 'left' : 'right'
}

function pinX(index: number): number {
  return pinSide(index) === 'left' ? MISSION_ROUTE.xLeft : MISSION_ROUTE.xRight
}

/** S-curve between two route points, bending through the vertical midpoint. */
function curve(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const midY = (from.y + to.y) / 2
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
}

export default function CareerPath() {
  const [crashOpen, setCrashOpen] = useState(false)
  /* The briefing card both the primary CTA and the unlocked map pins open (frame 118:6053). */
  const [briefingOpen, setBriefingOpen] = useState(false)
  const [path, setPath] = useState<CareerPathResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noGoal, setNoGoal] = useState(false)
  useEffect(() => {
    let cancelled = false
    api.get<{ data: CareerPathResponse }>('/api/me/career-path')
      .then((response) => { if (!cancelled) setPath(response.data) })
      .catch((reason: unknown) => {
        if (cancelled) return
        if (reason instanceof ApiError && reason.status === 409) setNoGoal(true)
        else setError(reason instanceof ApiError ? reason.message : 'Unable to load your career path.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <AppShell mainClassName="p-6"><p role="status" className="text-sm text-ink-soft">Loading career path…</p></AppShell>
  if (noGoal) return <Navigate to={QUESTIONNAIRE_ROUTE} replace />
  if (error || !path) return <AppShell mainClassName="p-6"><div className="flex flex-col gap-4"><p role="alert" className="text-sm text-code-red">{error ?? 'Career path unavailable.'}</p><Button variant="outline" onClick={() => window.location.reload()}>Retry</Button></div></AppShell>

  const stage: ExpeditionStage = {
    id: 'extracting',
    badge: EXPEDITION.badge,
    title: `Expedition: ${path.track.title}`,
    subtitle: EXPEDITION.subtitle,
    fuelPercent: path.fuelPercent,
    missions: path.missions.map((mission) => ({ id: mission.slug, title: mission.title, status: mission.status, order: String(mission.sortOrder) })),
    boss: { label: 'Boss Lair', title: path.boss.title, reward: `Reward: ${path.boss.rewardLabel}`, locked: path.boss.locked, action: path.boss.locked ? 'Locked' : 'Fight' },
  }
  const current = stage.missions.find((mission) => mission.status === 'extracting') ?? stage.missions[stage.missions.length - 1]
  const sidebar = EXPEDITION_SIDEBAR
  const briefing = path.briefing ? {
    title: path.briefing.title,
    subtitle: 'Complete the sequence to unlock the extraction zone.',
    closeLabel: 'Close mission briefing',
    steps: [
      { id: 'theory' as const, label: `1. ${path.briefing.theoryTitle}`, meta: `Duration: ${path.briefing.theoryMinutes} Mins`, action: 'Watch', path: '/learn/quick-check' },
      { id: 'extraction' as const, label: `2. ${path.briefing.extractionTitle}`, action: 'Code', path: '/ide' },
    ],
    reward: `Reward upon completion: ${path.briefing.rewardLabel}`,
  } : null

  const { column, gap, ring, unit } = MISSION_ROUTE
  const routeHeight = (stage.missions.length - 1) * gap + unit
  const points = stage.missions.map((_, index) => ({
    x: (pinX(index) / 100) * column,
    y: index * gap + ring / 2,
  }))

  if (!briefing) return <AppShell mainClassName="p-6"><p role="alert" className="text-sm text-code-red">No active mission is available.</p></AppShell>

  return (
    <AppShell mainClassName="p-0">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_346px]">
        {/* ── Expedition route ───────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden px-6 py-8 lg:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-40 left-8 hidden size-64 rounded-full bg-success/5 blur-[100px] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[520px] right-10 hidden size-72 rounded-full bg-accent/10 blur-[110px] lg:block"
          />

          <div className="mx-auto flex w-full max-w-[560px] flex-col">
            <header className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent-tint px-3.5 py-2 text-xs font-bold uppercase leading-[18px] tracking-[0.72px] text-ink-violet">
                <img src={badgeFuel} alt="" className="size-4" />
                {stage.badge}
              </span>
              <h1 className="text-display text-white">{stage.title}</h1>
              <p className="text-sm leading-6 text-ink-soft lg:max-w-[700px]">{stage.subtitle}</p>
            </header>

            {/* The route itself: one curve per hop, tinted by the mission it leads into. */}
            <div className="relative mt-10" style={{ height: routeHeight }}>
              <svg
                viewBox={`0 0 ${column} ${routeHeight}`}
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full"
              >
                {stage.missions.map((mission, index) => {
                  const to = points[index]
                  // The first hop starts above the column so the route has a lead-in.
                  const from = index === 0 ? { x: to.x, y: 0 } : points[index - 1]
                  const reached = mission.status !== 'locked'
                  return (
                    <path
                      key={mission.id}
                      d={curve(from, to)}
                      fill="none"
                      stroke={reached ? 'var(--color-brand)' : 'var(--color-muted)'}
                      strokeWidth={6}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      /* `pathLength=1` makes the dash the whole hop, so the draw needs no
                         measurement of the curve in JS. */
                      pathLength={1}
                      strokeDasharray={1}
                      style={{ animationDelay: entranceDelay(index) }}
                      className="animate-draw-route"
                    />
                  )
                })}
              </svg>

              <ul>
                {stage.missions.map((mission, index) => (
                  <MissionPin
                    key={mission.id}
                    mission={mission}
                    side={pinSide(index)}
                    top={index * gap}
                    x={pinX(index)}
                    index={index}
                    onOpen={() => setBriefingOpen(true)}
                  />
                ))}
              </ul>
            </div>

            <BossCard stage={stage} />
          </div>
        </section>

        {/* ── Expedition sidebar ─────────────────────────────────────────── */}
        <aside className="flex flex-col gap-6 border-t border-white/10 bg-rail p-6 lg:h-[960px] lg:border-t-0 lg:border-l lg:border-l-[1.267px]">
          <Card className="flex w-full flex-col p-6">
            {/* Below lg the report is collapsed behind this toggle; desktop keeps it open. */}
            <Button
              variant="outline"
              className="w-full lg:hidden"
              aria-expanded={crashOpen}
              aria-controls="crash-report"
              icon={<img src={rocket} alt="" className="size-[18px]" />}
              iconPosition="start"
              onClick={() => setCrashOpen((open) => !open)}
            >
              {sidebar.crash.label}
            </Button>

            <div
              id="crash-report"
              className={`${crashOpen ? 'flex' : 'hidden'} flex-col lg:flex`}
            >
              <div className="grid h-[220px] place-items-center rounded-card border-[1.267px] border-dashed border-white/25 bg-shell">
                <img src={rocket} alt="" className="size-[164px]" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.96px] text-ink-soft">
                  {sidebar.crash.label}
                </p>
                <h2 className="text-2xl font-bold leading-8 text-white">{sidebar.crash.heading}</h2>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{sidebar.crash.tankLabel}</span>
                  <span className="text-sm font-bold text-ink-soft">{stage.fuelPercent}%</span>
                </div>
                <ProgressBar value={stage.fuelPercent} label={sidebar.crash.tankLabel} />
                <p className="text-xs leading-5 text-ink-soft">{sidebar.crash.note}</p>
              </div>

              <Link
                to="/learn/questionnaire"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[20px] border-[1.267px] border-[#94a3b8] text-base text-[#94a3b8] transition duration-300 ease-out hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <img src={changeCareer} alt="" className="size-[17px]" />
                {sidebar.crash.cta}
              </Link>
            </div>
          </Card>

          <Card className="flex w-full flex-col p-6 lg:flex-1">
            <div className="flex items-start gap-4">
              <IconTile tone="brand" className="size-11 rounded-tile">
                <img src={extractionIcon} alt="" className="size-[22px]" />
              </IconTile>
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.96px] text-ink-soft">
                  {sidebar.current.label}
                </p>
                <h2 className="text-xl font-bold leading-7 text-white">{current.title}</h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-ink-soft">{sidebar.current.body}</p>

            <Button
              className="mt-6 w-full lg:mt-auto"
              icon={<img src={extractionIcon} alt="" className="size-[17px]" />}
              onClick={() => setBriefingOpen(true)}
            >
              {sidebar.current.cta}
            </Button>
          </Card>
        </aside>
      </div>

      {/* Mission briefing — frame 118:6053, the 480x419 FuelExpedition overlay. The design's
          own close button makes it a dialog (portal, so the shell's clipped columns cannot
          crop it), and it is the step between the route and the two screens it links to. */}
      <Modal
        open={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        showClose={false}
        ariaLabel={`${briefing.title} mission briefing`}
        size="sm"
        panelClassName="max-w-[480px]!"
        bodyClassName="p-7"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex min-w-0 flex-col">
            <h2 className="text-2xl leading-8 font-bold text-white">{briefing.title}</h2>
            <p className="pt-2 text-sm leading-6 text-ink-soft">{briefing.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setBriefingOpen(false)}
            aria-label={briefing.closeLabel}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink-soft transition hover:bg-white/10 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-95"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-3 pt-7">
          {briefing.steps.map((step) => (
            <li
              key={step.id}
              className="flex h-[76px] items-center gap-4 rounded-card bg-shell p-4"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-tile bg-brand-tint">
                <img src={BRIEFING_ICONS[step.id]} alt="" className="size-[21px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm leading-5 font-bold text-white">{step.label}</span>
                {step.meta && <span className="pt-1 text-xs leading-4 text-ink-soft">{step.meta}</span>}
              </span>
              <Link
                to={step.path}
                className="grid h-9 w-[108px] shrink-0 place-items-center rounded-pill bg-brand text-base text-white shadow-button transition duration-300 ease-out-back hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
              >
                {step.action}
              </Link>
            </li>
          ))}
        </ul>

        {/* The violet reward strip sits on the card's own 24px bottom margin, not the body's. */}
        <div className="mt-6 flex items-center gap-3 rounded-tile border-[1.267px] border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.1)] p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent">
            <img src={briefingReward} alt="" className="size-[18px]" />
          </span>
          <p className="text-sm leading-6 font-semibold text-white">{briefing.reward}</p>
        </div>
      </Modal>
    </AppShell>
  )
}

interface MissionPinProps {
  mission: Mission
  side: 'left' | 'right'
  top: number
  x: number
  /** Position on the route — drives the entrance delay, not the geometry. */
  index: number
  onOpen: () => void
}

/** One stop on the route: an 80px ring with the astronaut standing in front of the active one. */
function MissionPin({ mission, side, top, x, index, onOpen }: MissionPinProps) {
  const locked = mission.status === 'locked'

  return (
    <li
      className="absolute flex w-20 -translate-x-1/2 flex-col items-center"
      style={{ left: `${x}%`, top }}
    >
      {/* The pin pops in when its hop lands. The animation owns `transform`, so it lives on this
          wrapper rather than on the li, whose centring translate would be overwritten. */}
      <div
        className="flex w-20 animate-pop-in flex-col items-center"
        style={{ animationDelay: entranceDelay(index) }}
      >
        <div className="relative w-20">
          {mission.status === 'extracting' && (
            <img
              src={astronaut}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none absolute -top-4 z-10 size-[92px] max-w-none drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)] ${
                side === 'left' ? 'left-9' : 'right-9'
              }`}
            />
          )}
          <button
            type="button"
            onClick={onOpen}
            disabled={locked}
            aria-label={`${mission.title} ${PIN_LABEL[mission.status]}`}
            className={`relative z-0 grid size-20 place-items-center overflow-clip rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              locked ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-110 active:scale-[0.98]'
            } ${PIN_RING[mission.status]}`}
          >
            {mission.status === 'locked' ? (
              <span className="text-base text-white">{mission.order}</span>
            ) : (
              <img src={checkSm} alt="" className="size-4" />
            )}
          </button>
        </div>

        <span className="mt-3 flex w-max min-w-[112px] flex-col rounded-card bg-surface px-4 py-2 text-center shadow-card">
          <span className="text-sm font-semibold text-white">{mission.title}</span>
          <span className="text-xs font-semibold text-ink-soft">{PIN_LABEL[mission.status]}</span>
        </span>
      </div>
    </li>
  )
}

/** The Final Boss card: a locked pill, or — once every mission is done — the way to the review. */
function BossCard({ stage }: { stage: ExpeditionStage }) {
  const { boss } = stage
  const pill = (
    <span
      className={`shrink-0 rounded-pill px-4 py-2 text-xs font-bold text-ink-soft ${
        boss.locked ? 'bg-[rgba(139,92,246,0.25)]' : 'bg-accent text-white'
      }`}
    >
      {boss.action}
    </span>
  )

  /* The design puts a 3.8px violet stroke plus a wide violet glow on this card only. */
  const shell =
    'mt-12 flex min-h-[144px] w-full flex-col gap-5 rounded-card border-[3.8px] border-accent bg-surface p-6 shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_0_60px_0_rgba(139,92,246,0.24)] sm:flex-row sm:items-center sm:justify-between sm:gap-6'

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-5">
        <IconTile tone="accentSolid" className="size-16 rounded-card">
          <img src={bossIcon} alt="" className="size-[30px]" />
        </IconTile>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.96px] text-ink-soft">{boss.label}</p>
          <p className="text-2xl font-bold leading-8 text-white">{boss.title}</p>
          <p className="text-sm leading-5 text-ink-soft">{boss.reward}</p>
        </div>
      </div>
      {pill}
    </>
  )

  if (boss.locked) {
    return (
      <div className={shell} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <Link
      to={FINAL_REVIEW_ROUTE}
      className={`${shell} transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {content}
    </Link>
  )
}
