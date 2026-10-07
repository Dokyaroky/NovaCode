import { useState } from 'react'
import AppShell from '@/components/AppShell'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import SkillRadar from '@/components/SkillRadar'
import StatusPill from '@/components/StatusPill'
import Tabs from '@/components/Tabs'
import { EMPTY_PANEL, PROFILE, PROFILE_SOCIALS, PROFILE_TABS, QUICK_STATS } from '@/data/profile'
import certificates from '@/assets/icons/certificates.svg'
import emptyPanel from '@/assets/icons/empty-panel.svg'
import league from '@/assets/icons/league.svg'
import streak from '@/assets/icons/streak.svg'
import verifiedSm from '@/assets/icons/verified-sm.svg'

const STAT_ICONS = { streak, certificates }

export default function Profile() {
  const [tab, setTab] = useState<string>('certificates')

  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <Card className="flex flex-wrap items-center justify-between gap-6 p-6">
          <div className="flex min-w-0 items-center gap-6">
            <div className="relative size-28 shrink-0">
              <div className="grid size-28 place-items-center rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#3b82f6_100%)] shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
                <span className="text-3xl font-black text-white">{PROFILE.initials}</span>
              </div>
              <div className="absolute top-20 left-20 grid size-7 place-items-center rounded-full border-[3.6px] border-surface bg-success">
                <img src={verifiedSm} alt="" width={13} height={13} />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                  {PROFILE.eyebrow}
                </span>
                <h1 className="text-display text-ink">{PROFILE.name}</h1>
                <p className="text-base font-medium text-ink-soft">{PROFILE.track}</p>
              </div>
              <div className="flex items-center gap-3">
                {PROFILE_SOCIALS.map((social) => (
                  <button
                    key={social.label}
                    type="button"
                    title={social.title}
                    className="grid size-11 place-items-center rounded-full border-[0.9px] border-white/30 text-base text-white transition hover:bg-white/5 active:scale-[0.98]"
                  >
                    {social.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 items-center gap-4 rounded-card bg-brand-tint px-6 py-4">
              <IconTile tone="brand" className="rounded-tile bg-brand" size="md">
                <img src={league} alt="" width={23} height={23} />
              </IconTile>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-ink-soft">{PROFILE.leagueLabel}</span>
                <span className="text-xl font-bold text-white">{PROFILE.league}</span>
              </div>
            </div>

            <span className="hidden h-16 w-px bg-white/15 sm:block" aria-hidden="true" />

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-medium text-ink-soft">{PROFILE.totalXpLabel}</span>
              <span className="text-display text-ink">{PROFILE.totalXp}</span>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-wrap items-center justify-between gap-6 p-6">
            <div className="flex max-w-[240px] flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-ink">{PROFILE.radarTitle}</h2>
                <p className="text-sm leading-6 text-ink-soft">{PROFILE.radarSubtitle}</p>
              </div>
              <StatusPill tone="accent" className="bg-accent-tint-strong self-start">
                {PROFILE.radarBadge}
              </StatusPill>
            </div>
            <SkillRadar />
          </Card>

          <Card className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-ink">{PROFILE.quickStatsTitle}</h2>
              <p className="text-sm leading-5 text-ink-soft">{PROFILE.quickStatsSubtitle}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {QUICK_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="flex h-[136px] items-center gap-4 rounded-card bg-shell p-6"
                >
                  <IconTile tone={stat.tone === 'brand' ? 'brand' : 'success'}>
                    <img src={STAT_ICONS[stat.id as keyof typeof STAT_ICONS]} alt="" width={25} height={25} />
                  </IconTile>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-ink-soft">{stat.label}</span>
                    <span className="text-xl font-bold text-white">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Tabs tabs={[...PROFILE_TABS]} value={tab} onChange={setTab} indicatorInset />

        <Card className="flex min-h-[256px] flex-1 flex-col overflow-clip p-6">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <img src={emptyPanel} alt="" width={32} height={32} />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-ink">{EMPTY_PANEL.title}</h2>
              <p className="text-sm leading-5 text-ink-soft">{EMPTY_PANEL.body}</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
