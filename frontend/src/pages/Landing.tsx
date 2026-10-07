import { useNavigate } from 'react-router-dom'
import CodeWindow from '@/components/CodeWindow'
import IconTile from '@/components/IconTile'
import NovaLogo from '@/components/NovaLogo'
import Button from '@/components/Button'
import arrowRight from '@/assets/icons/arrow-right.svg'
import challengePassed from '@/assets/icons/challenge-passed.svg'
import codeWindowAction from '@/assets/icons/code-window-action.svg'
import featureAiRoleplay from '@/assets/icons/feature-ai-roleplay.svg'
import featureGamified from '@/assets/icons/feature-gamified.svg'
import featureWebIde from '@/assets/icons/feature-web-ide.svg'
import play from '@/assets/icons/play.svg'
import sparkle from '@/assets/icons/sparkle.svg'

const CODE = [
  'def level_up(player):',
  '    player.xp += 500',
  '    if player.xp >= 1000:',
  '        player.rank = "Builder"',
  '    return player',
]

const AVATARS = [
  { initials: 'AK', tone: 'bg-accent' },
  { initials: 'JS', tone: 'bg-success' },
  { initials: 'ML', tone: 'bg-brand' },
  { initials: 'TR', tone: 'bg-info' },
]

const FEATURES = [
  {
    icon: featureGamified,
    tone: 'success' as const,
    title: 'Gamified path',
    body: 'Earn XP, unlock ranks, and make every lesson feel like progress.',
  },
  {
    icon: featureAiRoleplay,
    tone: 'accent' as const,
    title: 'AI roleplay',
    body: 'Practice interviews and code reviews with an adaptive AI mentor.',
  },
  {
    icon: featureWebIde,
    tone: 'brand' as const,
    title: 'Web IDE',
    body: 'Write and run real code without leaving your learning path.',
  },
]

/** The floating card that sits beside the code window (Figma: "Challenge passed"). */
function ChallengeCard() {
  return (
    <div className="flex h-[72px] w-[189px] items-center gap-3 rounded-card bg-surface px-5 py-4 shadow-card">
      <IconTile size="sm" tone="success">
        <img src={challengePassed} alt="" width={20} height={20} />
      </IconTile>
      <div className="flex flex-col">
        <span className="text-xs text-ink-soft">Challenge passed</span>
        <span className="text-base font-bold text-ink-soft">+120 XP</span>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-shell">
      <header className="flex h-24 shrink-0 items-center justify-between px-4 md:px-8 lg:px-16">
        <NovaLogo />
        <Button
          icon={<img src={arrowRight} alt="" width={18} height={18} />}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </Button>
      </header>

      <section className="grid shrink-0 items-center gap-16 px-4 pt-14 md:px-8 lg:grid-cols-2 lg:px-16">
        <div className="flex flex-col gap-8">
          <div className="inline-flex h-[34px] w-fit shrink-0 items-center gap-2 rounded-full bg-accent-tint px-[14px] py-2">
            <img src={sparkle} alt="" width={16} height={16} />
            <span className="text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
              The fun way to become a developer
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-hero text-ink">
              Master coding.
              <br />
              Build your future.
            </h1>
            <p className="max-w-[580px] text-lg leading-8 text-ink-soft">
              Level up from first line to hired developer with hands-on quests, instant feedback,
              and an AI mentor who never clocks out.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Button
              icon={<img src={arrowRight} alt="" width={18} height={18} />}
              onClick={() => navigate('/signup')}
            >
              Start your quest
            </Button>
            <Button
              variant="secondary"
              iconPosition="start"
              icon={<img src={play} alt="" width={18} height={18} />}
            >
              Watch demo
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex shrink-0">
              {AVATARS.map(({ initials, tone }) => (
                <span
                  key={initials}
                  className={`-ml-2 grid size-9 place-items-center rounded-full border-[1.8px] border-shell text-[10px] font-bold text-ink-soft first:ml-0 ${tone}`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              <span className="font-bold text-ink">12,000+</span> learners building daily
            </p>
          </div>
        </div>

        {/* Desktop: the decorative composition from the frame. Below lg: just the editor. */}
        <div className="relative hidden h-[443px] lg:block">
          <div className="absolute top-[-72px] left-[-62px] size-[440px] rounded-full bg-accent-tint blur-[130px]" />
          <div className="absolute top-[77px] left-6 w-[570px] rotate-1">
            <CodeWindow
              filename="quest.py"
              lines={CODE}
              headerAction={<img src={codeWindowAction} alt="" width={18} height={18} />}
            />
          </div>
          <div className="absolute top-[43px] left-[415px]">
            <ChallengeCard />
          </div>
          <div className="absolute top-[322px] left-0 flex h-[72px] w-[197px] items-center gap-4 rounded-card bg-surface px-5 py-4 shadow-card">
            <span className="text-3xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-base font-bold whitespace-nowrap text-ink">14 day streak</span>
              <span className="text-xs whitespace-nowrap text-ink-soft">Personal best</span>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <CodeWindow
            filename="quest.py"
            lines={CODE}
            headerAction={<img src={codeWindowAction} alt="" width={18} height={18} />}
          />
        </div>
      </section>

      <section className="grid gap-6 px-4 pt-24 pb-16 md:px-8 lg:grid-cols-3 lg:px-16">
        {FEATURES.map(({ icon, tone, title, body }) => (
          <article
            key={title}
            className="flex min-h-[144px] items-start gap-6 overflow-clip rounded-card bg-surface p-6 shadow-card"
          >
            <IconTile tone={tone}>
              <img src={icon} alt="" width={24} height={24} />
            </IconTile>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-ink">{title}</h2>
              <p className="text-sm leading-6 text-ink-soft">{body}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
