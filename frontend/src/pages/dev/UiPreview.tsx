import { useState } from 'react'
import type { ReactNode } from 'react'
import AppShell from '@/components/AppShell'
import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Card from '@/components/Card'
import CodeWindow from '@/components/CodeWindow'
import IconTile from '@/components/IconTile'
import Input from '@/components/Input'
import ListItem from '@/components/ListItem'
import NovaLogo from '@/components/NovaLogo'
import NumberedList from '@/components/NumberedList'
import OAuthButton from '@/components/OAuthButton'
import ProgressBar from '@/components/ProgressBar'
import SectionHeader from '@/components/SectionHeader'
import StatRing from '@/components/StatRing'
import StatusPill from '@/components/StatusPill'
import Tabs from '@/components/Tabs'
import UserCard from '@/components/UserCard'
import {
  IconChevronRight,
  IconChevronSmall,
  IconDashboard,
  IconExplore,
  IconLearn,
  IconProfile,
  IconProjects,
  IconStudyPod,
} from '@/components/icons'
import checkCircle from '@/assets/icons/check-circle.svg'
import flame from '@/assets/icons/flame.svg'
import trophy from '@/assets/icons/trophy.svg'

const NAV = [
  { Icon: IconDashboard, label: 'Dashboard' },
  { Icon: IconLearn, label: 'Learn' },
  { Icon: IconExplore, label: 'Explore' },
  { Icon: IconProjects, label: 'Projects' },
  { Icon: IconStudyPod, label: 'StudyPod' },
  { Icon: IconProfile, label: 'Profile' },
]

const CODE = [
  'def level_up(player):',
  '    player.xp += 500',
  '    if player.xp >= 1000:',
  '        player.rank = "Builder"',
  '    return player',
]

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-[0.96px] text-ink-violet uppercase">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

/** Dev-only gallery of the design-system primitives. Delete once the pages are done. */
export default function UiPreview() {
  const [tab, setTab] = useState('signup')
  const [email, setEmail] = useState('')

  return (
    <main className="flex min-h-full flex-col gap-10 bg-canvas p-8">
      <SectionHeader title="Design system" subtitle="Every primitive rendered with the Figma values.">
        <StatusPill>0 / 2 complete</StatusPill>
      </SectionHeader>

      <Block title="Logo · buttons">
        <NovaLogo />
        <div className="flex flex-wrap items-center gap-4">
          <Button>Start your quest</Button>
          <Button variant="secondary" iconPosition="start" icon={<IconChevronSmall />}>
            Watch demo
          </Button>
          <Button variant="small">Start Quiz</Button>
          <Button variant="ghost" icon={<IconChevronRight />}>
            View audit history
          </Button>
        </div>
      </Block>

      <Block title="Nav icons (currentColor)">
        <div className="flex gap-6 rounded-card bg-rail p-6 shadow-card">
          {NAV.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className={label === 'StudyPod' ? 'text-brand' : 'text-ink-soft'} />
              <span className="text-xs text-ink-soft">{label}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Icons as files">
        <div className="flex items-center gap-4">
          <IconTile tone="success" size="md">
            <img src={checkCircle} alt="" width={14} height={14} />
          </IconTile>
          <IconTile tone="brand" size="md">
            <img src={flame} alt="" width={26} height={26} />
          </IconTile>
          <IconTile tone="accent" size="sm">
            <img src={trophy} alt="" width={24} height={24} />
          </IconTile>
          <IconTile tone="accentSolid">
            <span className="text-lg font-black text-white">Py</span>
          </IconTile>
          <IconTile tone="accentStrong">
            <span className="font-mono text-base font-bold text-white">DB</span>
          </IconTile>
        </div>
      </Block>

      <Block title="Avatars · pills · progress">
        <div className="flex items-center gap-4">
          <Avatar initials="MR" />
          <Avatar initials="NC" size="md" tone="accent" />
        </div>
        <div className="flex flex-col gap-3">
          <StatusPill icon={<img src={checkCircle} alt="" width={14} height={14} />}>Passed</StatusPill>
          <StatusPill tone="accent">Intermediate</StatusPill>
          <StatusPill tone="brand">+500 XP</StatusPill>
        </div>
        <div className="flex w-72 flex-col gap-4">
          <ProgressBar value={65} />
          <ProgressBar value={75} size="sm" />
        </div>
      </Block>

      <Block title="Cards · user block · list">
        <Card className="w-80 p-6">
          <p className="text-sm text-ink-soft">Card surface (ring elevation, 16px radius)</p>
        </Card>
        <UserCard name="Nova Chen" level="Level 12" initials="N" progress={75} className="w-60" />
        <Card className="w-80 p-6">
          <NumberedList>
            <ListItem rank={1} initials="MR" name="Maya R." value="2,940 XP" />
            <ListItem rank={2} initials="TK" name="Theo K." value="2,720 XP" />
            <ListItem rank={3} initials="NC" name="Nova C." value="2,480 XP" highlighted />
          </NumberedList>
        </Card>
      </Block>

      <Block title="Stat ring · code window">
        <StatRing value={75}>
          <span className="text-3xl font-black text-ink">300</span>
          <span className="text-xs text-ink-soft">of 400 XP</span>
        </StatRing>
        <CodeWindow filename="quest.py" lines={CODE} />
      </Block>

      <Block title="Tabs · input · oauth (auth card)">
        <div className="w-96 rounded-[32px] bg-surface px-10 pt-6 pb-10 shadow-card">
          <Tabs
            tabs={[
              { id: 'signup', label: 'Sign Up' },
              { id: 'login', label: 'Log In' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="flex flex-col gap-6 pt-8">
            <Input
              label="Email"
              type="email"
              placeholder="alex@example.com"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <Button size="lg" className="w-full" icon={<IconChevronRight />}>
              Create Account
            </Button>
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-white/20" />
              <span className="text-xs font-medium text-ink-soft">or continue with</span>
              <span className="h-px flex-1 bg-white/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <OAuthButton label="GitHub" mark="GH" />
              <OAuthButton label="Google" mark="G" markClassName="text-lg font-black" />
            </div>
          </div>
        </div>
      </Block>

      <Block title="AppShell (sidebar · content · rail)">
        <div className="w-full overflow-hidden rounded-card">
          <AppShell rail={<Card className="p-6 text-sm text-ink-soft">Rail column · 360px</Card>}>
            <h1 className="text-display text-ink">Welcome back, Nova</h1>
            <p className="mt-2 text-sm text-ink-soft">Content column — the shell at work</p>
          </AppShell>
        </div>
      </Block>
    </main>
  )
}
