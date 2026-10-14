import type { CSSProperties } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import { EXPEDITION, EXPEDITION_SIDEBAR, EXPEDITION_STAGES, activeMission } from '@/data/careerPath'
import type { ExpeditionStage, Mission, MissionStatus } from '@/data/careerPath'

import checkSm from '@/assets/icons/check-sm.svg'
import astronaut from '@/assets/expedition/astronaut.png'
import badgeFuel from '@/assets/expedition/badge-fuel.svg'
import bossIcon from '@/assets/expedition/boss.svg'
import changeCareer from '@/assets/expedition/change-career.svg'
import extractionIcon from '@/assets/expedition/extraction.svg'
import rocket from '@/assets/expedition/rocket.png'
import routePath from '@/assets/expedition/route-path.svg'

/* The frame draws each pin as an 80px ring with a 5.07px stroke; the finished ring keeps the
   brand orange, the active one is the darker ember tone with the astronaut peeking out. */
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

const MISSION_ROUTE = '/learn/mission'
const FINAL_REVIEW_ROUTE = '/projects/review'

export default function CareerPath() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const stage: ExpeditionStage = EXPEDITION_STAGES[params.get('stage') ?? ''] ?? EXPEDITION
  const current = activeMission(stage)
  const sidebar = EXPEDITION_SIDEBAR

  return (
    <AppShell mainClassName="p-0">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_346px]">
        {/* ── Expedition map ─────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden px-6 pt-6 lg:h-[960px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-16 top-56 hidden size-64 rounded-full bg-success/5 blur-[100px] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[454px] top-[640px] hidden size-72 rounded-full bg-accent/10 blur-[110px] lg:block"
          />

          <header className="flex flex-col gap-3 lg:absolute lg:left-6 lg:top-6 lg:w-[758px]">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent-tint px-3.5 py-2 text-xs font-bold uppercase leading-[18px] tracking-[0.72px] text-ink-violet">
              <img src={badgeFuel} alt="" className="size-4" />
              {stage.badge}
            </span>
            <h1 className="text-display text-white">{stage.title}</h1>
            <p className="max-w-[700px] text-sm leading-6 text-ink-soft">{stage.subtitle}</p>
          </header>

          {/* Departure route: the frame's 758x742 vector, decorative at desktop only. */}
          <img
            src={routePath}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-[194px] hidden h-[742px] w-[758px] lg:block"
          />

          <ul className="relative mt-6 flex flex-col gap-6 lg:static lg:mt-0 lg:block">
            {stage.missions.map((mission) => (
              <MissionPin key={mission.id} mission={mission} onOpen={() => navigate(MISSION_ROUTE)} />
            ))}
          </ul>

          <BossCard stage={stage} />
        </section>

        {/* ── Expedition sidebar ─────────────────────────────────────────── */}
        <aside className="flex flex-col gap-6 border-t border-white/10 bg-rail p-6 lg:h-[960px] lg:border-t-0 lg:border-l lg:border-l-[1.267px]">
          <Card className="flex w-full flex-col p-6">
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
              <ProgressBar value={stage.fuelPercent} />
              <p className="text-xs leading-5 text-ink-soft">{sidebar.crash.note}</p>
            </div>

            <Link
              to="/learn/questionnaire"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[20px] border-[1.267px] border-[#94a3b8] text-base text-[#94a3b8] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <img src={changeCareer} alt="" className="size-[17px]" />
              {sidebar.crash.cta}
            </Link>
          </Card>

          <Card className="flex w-full flex-1 flex-col p-6">
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
              className="mt-auto w-full"
              icon={<img src={extractionIcon} alt="" className="size-[17px]" />}
              onClick={() => navigate(MISSION_ROUTE)}
            >
              {sidebar.current.cta}
            </Button>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

interface MissionPinProps {
  mission: Mission
  onOpen: () => void
}

/** One map pin: 80px ring + label card, absolutely placed on the desktop canvas. */
function MissionPin({ mission, onOpen }: MissionPinProps) {
  const locked = mission.status === 'locked'

  return (
    <li
      className="lg:absolute lg:left-[var(--pin-x)] lg:top-[var(--pin-y)]"
      style={{ '--pin-x': `${mission.x}px`, '--pin-y': `${mission.y}px` } as CSSProperties}
    >
      <div className="flex items-center gap-4 lg:w-[220px] lg:flex-col lg:gap-3">
        <div className="relative shrink-0">
          {mission.status === 'extracting' && (
            <img
              src={astronaut}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-[52px] -top-4 size-[92px]"
            />
          )}
          <button
            type="button"
            onClick={onOpen}
            disabled={locked}
            aria-label={`${mission.title} ${PIN_LABEL[mission.status]}`}
            className={`grid size-20 place-items-center overflow-clip rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
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

        <span className="flex w-auto min-w-[112px] flex-col rounded-card bg-surface px-4 py-2 text-center shadow-card">
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
    'flex min-h-[144px] items-center justify-between gap-6 rounded-card border-[3.8px] border-accent bg-surface p-6 shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_0_60px_0_rgba(139,92,246,0.24)]'

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

  const placement = 'mt-8 lg:absolute lg:left-[84px] lg:top-[764.4px] lg:mt-0 lg:w-[620px]'

  if (boss.locked) {
    return (
      <div className={`${shell} ${placement}`} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <Link
      to={FINAL_REVIEW_ROUTE}
      className={`${shell} ${placement} transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {content}
    </Link>
  )
}
