import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import StatusPill from '@/components/StatusPill'
import { ACTIVE_PROJECT, CHALLENGES, COMPLETED_PROJECTS } from '@/data/projects'
import challenge1 from '@/assets/icons/challenge-1.svg'
import challenge2 from '@/assets/icons/challenge-2.svg'
import challenge3 from '@/assets/icons/challenge-3.svg'
import challenge4 from '@/assets/icons/challenge-4.svg'
import arrowRight from '@/assets/icons/arrow-right.svg'
import externalLink from '@/assets/icons/external-link.svg'
import github from '@/assets/icons/github.svg'
import verified from '@/assets/icons/verified.svg'

const CHALLENGE_ICONS = [challenge1, challenge2, challenge3, challenge4]

export default function Projects() {
  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
              Projects & Portfolio
            </span>
            <h1 className="text-display text-ink">Your Proof of Work</h1>
          </div>
          <Button variant="outline" iconPosition="start" icon={<img src={github} alt="" width={18} height={18} />}>
            Sync with GitHub
          </Button>
        </header>

        <Card className="relative min-h-[200px] overflow-clip p-6">
          <div className="absolute top-[-64px] left-[912px] size-64 rounded-full bg-accent-tint blur-[64px]" />
          <div className="relative flex items-center justify-between gap-6">
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex items-center gap-4">
                <IconTile tone="accentStrong">
                  <span className="font-mono text-lg font-black text-white">{ACTIVE_PROJECT.label}</span>
                </IconTile>
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="text-xs font-bold tracking-[0.96px] text-ink-soft uppercase">
                    {ACTIVE_PROJECT.module}
                  </span>
                  <h2 className="text-3xl font-bold text-ink">{ACTIVE_PROJECT.title}</h2>
                </div>
              </div>
              <div className="flex max-w-[680px] flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Project progress</span>
                  <span className="text-sm font-bold text-ink-soft">{ACTIVE_PROJECT.progress}%</span>
                </div>
                <ProgressBar value={ACTIVE_PROJECT.progress} />
              </div>
            </div>
            <Button icon={<img src={arrowRight} alt="" width={18} height={18} />}>
              Continue Coding
            </Button>
          </div>
        </Card>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <h2 className="text-2xl font-bold text-ink">Completed &amp; AI-Audited</h2>
              <p className="text-sm leading-5 text-ink-soft">
                Verified projects that demonstrate production-ready skills.
              </p>
            </div>
            <StatusPill>{COMPLETED_PROJECTS.length} verified projects</StatusPill>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {COMPLETED_PROJECTS.map((project) => (
              <Card key={project.id} className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <IconTile tone="success" size="xs">
                    <img src={verified} alt="" width={20} height={20} />
                  </IconTile>
                  <StatusPill>AI Audit: {project.auditScore}/100</StatusPill>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-ink">{project.title}</h3>
                  <p className="text-xs leading-5 text-ink-soft">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-[rgba(139,92,246,0.25)] px-3 py-2 text-[10px] leading-[15px] font-bold text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 pt-1 text-sm font-semibold text-white underline transition hover:text-brand"
                >
                  View Code
                  <img src={externalLink} alt="" width={15} height={15} />
                </button>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <h2 className="text-2xl font-bold text-ink">Industry Challenges to Build Next</h2>
              <p className="text-sm leading-5 text-ink-soft">
                Practice briefs inspired by real product teams.
              </p>
            </div>
            <span className="text-xs leading-4 font-medium text-ink-soft">Scroll to explore</span>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-2">
            {CHALLENGES.map((challenge, index) => (
              <Card
                key={challenge.id}
                className="flex h-[120px] min-w-[288px] flex-1 items-center gap-4 p-6"
              >
                <div className="grid size-14 shrink-0 place-items-center rounded-tile border-[0.9px] border-dashed border-white/40">
                  <img src={CHALLENGE_ICONS[index]} alt="" width={25} height={25} />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="text-xs leading-4 font-medium text-ink-soft">{challenge.meta}</span>
                  <h3 className="text-base leading-6 font-bold text-ink">{challenge.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
