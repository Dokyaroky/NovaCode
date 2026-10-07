import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import ListItem from '@/components/ListItem'
import NumberedList from '@/components/NumberedList'
import ProgressBar from '@/components/ProgressBar'
import SectionHeader from '@/components/SectionHeader'
import StatRing from '@/components/StatRing'
import StatusPill from '@/components/StatusPill'
import { IconChevronRight } from '@/components/icons'
import {
  AI_AUDITS,
  CURRENT_COURSE,
  DAILY_GOAL,
  DAILY_QUESTS,
  LEADERBOARD,
  TODAY_LABEL,
} from '@/data/dashboard'
import { CURRENT_USER } from '@/data/user'
import auditIcon from '@/assets/icons/audit.svg'
import checkCircle from '@/assets/icons/check-circle.svg'
import flame from '@/assets/icons/flame.svg'
import trophy from '@/assets/icons/trophy.svg'

function StreakCard() {
  const completed = Math.round((DAILY_GOAL.xp / DAILY_GOAL.target) * 100)

  return (
    <Card className="flex flex-col gap-4 p-6 lg:h-[312px]">
      <div className="flex items-center gap-4">
        <IconTile tone="brand">
          <img src={flame} alt="" width={26} height={26} />
        </IconTile>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-ink">{CURRENT_USER.streakDays}-Day Streak</h2>
          <p className="text-xs text-ink-soft">Personal best: {CURRENT_USER.personalBest} days</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-8 pt-6">
        <StatRing value={completed}>
          <span className="text-3xl font-black text-ink">{DAILY_GOAL.xp}</span>
          <span className="text-xs text-ink-soft">of {DAILY_GOAL.target} XP</span>
        </StatRing>
        <div className="flex w-[109px] flex-col gap-3">
          <p className="text-sm font-bold text-ink">Daily goal</p>
          <p className="text-xs leading-5 text-ink-soft">{DAILY_GOAL.hint}</p>
        </div>
      </div>
    </Card>
  )
}

function LeagueCard() {
  return (
    <Card className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-ink">{CURRENT_USER.league}</h2>
          <p className="text-xs text-ink-soft">{CURRENT_USER.leagueCaption}</p>
        </div>
        <img src={trophy} alt="" width={24} height={24} />
      </div>
      <NumberedList>
        {LEADERBOARD.map((row) => (
          <ListItem
            key={row.rank}
            rank={row.rank}
            initials={row.initials}
            name={row.name}
            value={row.value}
            highlighted={row.highlighted}
          />
        ))}
      </NumberedList>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AppShell
      rail={
        <>
          <StreakCard />
          <LeagueCard />
        </>
      }
    >
      <div className="flex w-full flex-1 flex-col gap-6">
        <header className="flex h-20 items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-ink-soft">{TODAY_LABEL}</p>
            <h1 className="text-display text-ink">Welcome back, {CURRENT_USER.firstName}</h1>
          </div>
        </header>

        <Card className="relative overflow-clip p-6">
          <div className="absolute top-[-96px] left-[552px] size-[288px] rounded-full bg-accent-tint blur-[64px]" />
          <div className="relative flex items-center justify-between gap-6">
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex items-center gap-4">
                <IconTile tone="accentSolid">
                  <span className="text-lg font-black text-white">{CURRENT_COURSE.label}</span>
                </IconTile>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold tracking-[0.96px] text-ink-soft uppercase">
                    {CURRENT_COURSE.module}
                  </span>
                  <h2 className="text-3xl font-bold text-ink">{CURRENT_COURSE.title}</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-ink-soft">{CURRENT_COURSE.description}</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">Course progress</span>
                  <span className="text-sm font-bold text-ink-soft">{CURRENT_COURSE.progress}%</span>
                </div>
                <ProgressBar value={CURRENT_COURSE.progress} />
              </div>
            </div>
            <Button icon={<IconChevronRight />} onClick={() => navigate('/learn')}>
              Continue Module
            </Button>
          </div>
        </Card>

        <section className="flex flex-col gap-4">
          <SectionHeader
            title="Daily quests"
            subtitle="Spaced repetition keeps your fundamentals sharp."
          >
            <StatusPill>
              0 / {DAILY_QUESTS.length} complete
            </StatusPill>
          </SectionHeader>
          <div className="grid gap-6 sm:grid-cols-2">
            {DAILY_QUESTS.map((quest) => (
              <Card key={quest.id} className="flex min-h-[160px] items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-4">
                  <IconTile tone="accentStrong">
                    <span className="font-mono text-base font-bold text-white">{quest.label}</span>
                  </IconTile>
                  <div className="flex max-w-[110px] flex-col gap-2">
                    <h3 className="text-lg font-bold text-ink">{quest.title}</h3>
                    <p className="text-xs text-ink-soft">{quest.meta}</p>
                  </div>
                </div>
                <Button variant="small" onClick={() => navigate('/ide')}>
                  Start Quiz
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-4">
          <SectionHeader
            title="Recent AI audits"
            subtitle="Feedback grounded in your submitted code."
          >
            <Button variant="ghost" icon={<IconChevronRight />} onClick={() => navigate('/projects')}>
              View audit history
            </Button>
          </SectionHeader>
          {AI_AUDITS.map((audit) => (
            <Card
              key={audit.id}
              className="flex flex-1 items-center justify-between gap-6 p-6"
            >
              <div className="flex min-w-0 items-center gap-6">
                <IconTile tone="accentStrong" className="h-14 w-[48.8px]">
                  <img src={auditIcon} alt="" width={28} height={28} />
                </IconTile>
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-ink">{audit.title}</h3>
                    <StatusPill icon={<img src={checkCircle} alt="" width={14} height={14} />}>
                      {audit.status}
                    </StatusPill>
                  </div>
                  <p className="text-sm leading-6 text-ink-soft">{audit.note}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-5xl leading-none font-black text-ink">
                  {audit.score}
                  <span className="text-xl">/100</span>
                </p>
                <span className="text-xs font-medium text-ink-soft">{audit.auditedAt}</span>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  )
}
