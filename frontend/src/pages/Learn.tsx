import AppShell from '@/components/AppShell'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import StatusPill from '@/components/StatusPill'
import { CAREER_TRACKS, MOMENTUM, TRACK_CANVAS, TRACK_PROGRESS } from '@/data/learn'
import type { CareerTrack, TrackState } from '@/data/learn'
import badgeTracks from '@/assets/icons/badge-tracks.svg'
import chipProgress from '@/assets/icons/chip-progress.svg'
import flameLg from '@/assets/icons/flame-lg.svg'
import nodeCheck from '@/assets/icons/node-check.svg'
import trackPath from '@/assets/icons/track-path.svg'
import trophy from '@/assets/icons/trophy.svg'

/* 82px node with a 5.4px canvas-coloured border; the ring + glow differ per state. */
const NODE_STYLES: Record<TrackState, string> = {
  done: 'bg-success border-[5.4px] border-shell shadow-[0_0_0_8px_rgba(16,185,129,0.14),0_12px_28px_0_rgba(16,185,129,0.25)]',
  active:
    'bg-brand border-[5.4px] border-shell shadow-[0_0_0_10px_rgba(249,115,22,0.14),0_12px_35px_0_rgba(249,115,22,0.3)]',
  locked: 'bg-muted border-[5.4px] border-shell',
}

function TrackNode({ track }: { track: CareerTrack }) {
  return (
    <div
      className="absolute flex w-[200px] flex-col items-center gap-4"
      style={{ left: track.x, top: track.y }}
    >
      <div
        className={`grid size-[82px] shrink-0 place-items-center overflow-clip rounded-full ${NODE_STYLES[track.state]}`}
      >
        {track.state === 'done' ? (
          <img src={nodeCheck} alt="" width={30} height={30} />
        ) : (
          <span className={`text-base ${track.state === 'active' ? 'text-white' : 'text-ink-soft'}`}>
            {track.step}
          </span>
        )}
      </div>
      <span
        className={`flex h-9 shrink-0 items-center rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-button ${
          track.state === 'active' ? 'text-white' : 'text-ink-soft'
        }`}
      >
        {track.name}
      </span>
    </div>
  )
}

function MomentumSidebar() {
  return (
    <>
      <h2 className="text-xl font-bold text-ink">Your momentum</h2>

      <div className="flex flex-col gap-6 pt-2">
        <Card className="flex flex-col gap-6 overflow-clip p-6">
          <div className="flex items-center justify-between">
            <IconTile tone="brand" size="sm" className="size-11 rounded-tile">
              <img src={flameLg} alt="" width={24} height={24} />
            </IconTile>
            <StatusPill tone="brand" dense>
              {MOMENTUM.personalBestLabel}
            </StatusPill>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl leading-[48px] font-black text-ink">{MOMENTUM.streak}</span>
            <span className="pt-2 text-sm leading-5 text-ink-soft">{MOMENTUM.streakCaption}</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {MOMENTUM.week.map((dot, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className={`size-3 rounded-full ${dot.done ? 'bg-brand' : 'bg-[#475569]'}`} />
                <span className="text-[10px] leading-[15px] text-ink-soft">{dot.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-6 overflow-clip p-6">
          <div className="flex items-center justify-between">
            <IconTile tone="success" size="sm" className="size-11 rounded-tile">
              <img src={trophy} alt="" width={24} height={24} />
            </IconTile>
            <span className="text-xs font-bold text-ink-soft">{MOMENTUM.leaguePercent}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl leading-[36px] font-black text-ink">{MOMENTUM.league}</span>
            <span className="pt-2 text-sm leading-5 text-ink-soft">{MOMENTUM.leagueCaption}</span>
          </div>
          <ProgressBar value={MOMENTUM.leagueProgress} size="sm" />
          <span className="text-xs leading-4 text-ink-soft">{MOMENTUM.nextLeague}</span>
        </Card>
      </div>
    </>
  )
}

export default function Learn() {
  return (
    <AppShell
      railWidth={300}
      mainClassName="p-6 lg:px-12 lg:py-10"
      railClassName="gap-6 px-6 py-10"
      rail={<MomentumSidebar />}
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="inline-flex h-[34px] w-fit shrink-0 items-center gap-2 rounded-full bg-accent-tint px-[14px] py-2">
            <img src={badgeTracks} alt="" width={15} height={15} />
            <span className="text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
              Career tracks
            </span>
          </div>
          <h1 className="text-display text-ink">Choose Your Career Path</h1>
          <p className="text-base leading-6 text-ink-soft">
            Master the specific skills needed for your dream job in tech.
          </p>
        </div>

        <div className="flex h-12 shrink-0 items-center gap-3 rounded-card bg-surface px-5 py-3 shadow-card">
          <img src={chipProgress} alt="" width={20} height={20} />
          <span className="text-base font-semibold whitespace-nowrap text-white">
            {TRACK_PROGRESS}% complete
          </span>
        </div>
      </div>

      <div className="no-scrollbar mt-10 flex min-h-[680px] w-full shrink-0 justify-center overflow-x-auto pb-6">
        <div
          className="relative shrink-0"
          style={{ width: TRACK_CANVAS.width, height: TRACK_CANVAS.height }}
        >
          <img
            src={trackPath}
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            width={TRACK_CANVAS.width}
            height={TRACK_CANVAS.height}
          />
          {CAREER_TRACKS.map((track) => (
            <TrackNode key={track.id} track={track} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
