import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Dropdown from '@/components/Dropdown'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import StatusPill from '@/components/StatusPill'
import { useToast } from '@/components/Toast'
import { IconChevronDown } from '@/components/icons'
import {
  COMPLETED_PROJECTS,
  DEFAULT_PROJECTS_STATE,
  PROJECTS_STATES,
  PROJECTS_STATE_ORDER,
  isProjectsStateId,
} from '@/data/projects'
import challenge1 from '@/assets/icons/challenge-1.svg'
import challenge2 from '@/assets/icons/challenge-2.svg'
import challenge3 from '@/assets/icons/challenge-3.svg'
import challenge4 from '@/assets/icons/challenge-4.svg'
import arrowRight from '@/assets/icons/arrow-right.svg'
import externalLink from '@/assets/icons/external-link.svg'
import github from '@/assets/icons/github.svg'
import verified from '@/assets/icons/verified.svg'

/* Keyed by challenge id: the "not started" state drops the fintech brief, which would shift
   an array index and paint the wrong icon. */
const CHALLENGE_ICONS: Record<string, string> = {
  fintech: challenge1,
  ai: challenge2,
  cloud: challenge3,
  consumer: challenge4,
}

/**
 * Projects & Portfolio. One screen, three data-driven snapshots: 14:1307 (75%, the default),
 * 91:4004 (100%, audited) and 91:4222 (0%, not started). The state lives in `?state=`.
 */
export default function Projects() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { push } = useToast()

  const requested = params.get('state')
  const view = PROJECTS_STATES[isProjectsStateId(requested) ? requested : DEFAULT_PROJECTS_STATE]
  const { activeProject } = view

  const selectState = (id: (typeof PROJECTS_STATE_ORDER)[number]) => {
    setParams(id === DEFAULT_PROJECTS_STATE ? {} : { state: id }, { replace: true })
  }

  const syncWithGithub = () => {
    push({
      title: 'GitHub sync queued',
      description: 'Commits are matched by email once the backend is wired — this build is mock data.',
      tone: 'info',
    })
  }

  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
              Projects &amp; Portfolio
            </span>
            <h1 className="text-display text-ink">Your Proof of Work</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Dropdown
              label="Project state"
              align="end"
              items={PROJECTS_STATE_ORDER.map((id) => ({
                id,
                label: PROJECTS_STATES[id].label,
                onSelect: () => selectState(id),
              }))}
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={toggle}
                  className="inline-flex h-12 shrink-0 items-center gap-2 rounded-pill border-[0.9px] border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/5 active:scale-[0.98]"
                >
                  <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                    State
                  </span>
                  {view.label}
                  <IconChevronDown />
                </button>
              )}
            />
            <Button
              variant="outline"
              iconPosition="start"
              icon={<img src={github} alt="" width={18} height={18} />}
              onClick={syncWithGithub}
            >
              Sync with GitHub
            </Button>
          </div>
        </header>

        <Card className="relative min-h-[200px] overflow-clip p-6">
          <div className="absolute top-[-64px] left-[912px] size-64 rounded-full bg-accent-tint blur-[64px]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="flex items-center gap-4">
                <IconTile tone="accentStrong">
                  <span className="font-mono text-lg font-black text-white">{activeProject.label}</span>
                </IconTile>
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="text-xs font-bold tracking-[0.96px] text-ink-soft uppercase">
                    {activeProject.module}
                  </span>
                  <h2 className="text-3xl font-bold text-ink">{activeProject.title}</h2>
                </div>
              </div>
              <div className="flex w-full max-w-[680px] flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Project progress</span>
                  <span className="text-sm font-bold text-ink-soft">{activeProject.progress}%</span>
                </div>
                <ProgressBar
                  value={activeProject.progress}
                  label={`Project progress: ${activeProject.title}, ${activeProject.progress}%`}
                />
              </div>
            </div>
            <Button
              className="w-full md:w-fit"
              icon={<img src={arrowRight} alt="" width={18} height={18} />}
              onClick={() => navigate(view.action.to)}
            >
              {view.action.label}
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
                  onClick={() => navigate('/ide')}
                  aria-label={`View the code of ${project.title}`}
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
            {view.challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="flex h-[120px] min-w-[288px] flex-1 items-center gap-4 p-6"
              >
                <div className="grid size-14 shrink-0 place-items-center rounded-tile border-[0.9px] border-dashed border-white/40">
                  <img src={CHALLENGE_ICONS[challenge.id]} alt="" width={25} height={25} />
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
