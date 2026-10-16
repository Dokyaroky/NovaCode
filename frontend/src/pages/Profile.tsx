import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import Modal from '@/components/Modal'
import ProgressBar from '@/components/ProgressBar'
import SkillRadar from '@/components/SkillRadar'
import StatusPill from '@/components/StatusPill'
import Tabs from '@/components/Tabs'
import { useToast } from '@/components/Toast'
import {
  ACCOUNT_LINKS,
  ACCOUNT_MODAL_COPY,
  AUDITED_PROJECTS_HEADING,
  CERTIFICATE_COPY,
  CERTIFICATE_GROUPS,
  CERTIFICATE_KIND_LABELS,
  CERTIFICATE_MODAL_COPY,
  COURSE_COPY,
  COURSE_HISTORY,
  DEFAULT_PROFILE_TAB,
  PANEL_EMPTY_STATES,
  PINNED_PROJECTS,
  PROFILE,
  PROFILE_SOCIALS,
  PROFILE_TABS,
  QUICK_STATS,
  SETTINGS_ROWS,
  isProfileTabId,
} from '@/data/profile'
import type {
  AccountLinkId,
  Certificate,
  CertificateKind,
  PanelEmptyState,
  PinnedActiveRow,
  PinnedAuditedRow,
  ProfileTabId,
  QuickStat,
  SettingsToggleRow,
} from '@/data/profile'
import certificatesIcon from '@/assets/icons/certificates.svg'
import emptyPanel from '@/assets/icons/empty-panel.svg'
import githubIcon from '@/assets/icons/github.svg'
import leagueIcon from '@/assets/icons/league.svg'
import bellIcon from '@/assets/icons/settings-bell.svg'
import streakIcon from '@/assets/icons/streak.svg'
import verifiedSmIcon from '@/assets/icons/verified-sm.svg'
import { useCurrentUser } from '@/lib/currentUser'

/* Screens these panel actions open (see src/app/screens.ts). */
const COURSE_ROUTE = '/learn/mission'
const PROJECT_ROUTE = '/projects'
const AUDIT_ROUTE = '/projects/review'

const TABS_ID = 'profile-tabs'

const STAT_ICONS: Record<QuickStat['id'], string> = {
  streak: streakIcon,
  certificates: certificatesIcon,
}

const SETTINGS_ICONS = { bell: bellIcon, github: githubIcon }

/** Every panel draws its inner cards with the frames' 0.9px ring, never a border. */
const PANEL_CARD_RING = 'shadow-[0_0_0_0.9px_rgba(255,255,255,0.1)]'

/** Certificate/course surface: #121a28, one step above the panel's #1e293b. */
const INSET_CARD = `${PANEL_CARD_RING} rounded-tile bg-[#121a28]`

const BADGE_TONES: Record<CertificateKind, string> = {
  'career-track': 'bg-brand text-black',
  'proof-of-work': 'bg-success text-black',
  'standalone-course': 'bg-accent text-white',
}

const TOGGLE_DEFAULTS: Record<string, boolean> = Object.fromEntries(
  SETTINGS_ROWS.filter((row): row is SettingsToggleRow => row.kind === 'toggle').map((row) => [
    row.id,
    row.initialOn,
  ]),
)

interface PillButtonProps {
  children: string
  onClick: () => void
  /** `brand` is the 40px primary the course rows use. */
  tone?: 'outline' | 'brand'
  size?: 'sm' | 'md'
  className?: string
}

/** The 40px in-card action the certificate, course and audit cards use. */
function PillButton({ children, onClick, tone = 'outline', size = 'md', className = '' }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center justify-center rounded-pill whitespace-nowrap transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-[0.98] ${
        tone === 'brand'
          ? 'bg-brand text-white'
          : 'border-[0.9px] border-white/30 text-white hover:bg-white/5'
      } ${size === 'sm' ? 'px-4 text-sm' : 'px-5 text-base'} ${className}`}
    >
      {children}
    </button>
  )
}

/** Design 91:4667/91:5161: 32px glyph, title, one line of guidance, centred in the panel. */
function PanelEmpty({ state }: { state: PanelEmptyState }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <img src={emptyPanel} alt="" width={32} height={32} />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-ink">{state.title}</h2>
        <p className="max-w-[380px] text-sm leading-5 text-ink-soft">{state.body}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ certificates ---- */

function CertificateCard({
  certificate,
  onView,
}: {
  certificate: Certificate
  onView: (certificate: Certificate) => void
}) {
  return (
    <article className={`flex min-h-[268px] flex-col p-5 ${INSET_CARD}`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`grid size-20 shrink-0 place-items-center rounded-tile bg-shell ${PANEL_CARD_RING}`}>
          <img src={certificatesIcon} alt="" width={36} height={36} />
        </div>
        <span className="pt-1 text-xs whitespace-nowrap text-white/60">{certificate.issuedLabel}</span>
      </div>

      <div className="flex flex-col gap-3 pt-5">
        <h3 className="text-lg leading-[22.5px] font-bold text-ink">{certificate.title}</h3>
        <span
          className={`w-fit rounded-pill px-3 py-1 text-xs font-bold ${BADGE_TONES[certificate.kind]}`}
        >
          {CERTIFICATE_KIND_LABELS[certificate.kind]}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton size="sm" className="w-full" onClick={() => onView(certificate)}>
          {CERTIFICATE_COPY.viewCta}
        </PillButton>
      </div>
    </article>
  )
}

function CertificatesPanel({
  empty,
  onView,
}: {
  empty: boolean
  onView: (certificate: Certificate) => void
}) {
  /* The frame draws one row of three cards, each badged with its kind, so the panel
     renders a single grid in group order (Career Track → Proof-of-Work → Standalone). */
  const certificates = CERTIFICATE_GROUPS.flatMap((group) => group.items)

  if (empty || certificates.length === 0) return <PanelEmpty state={PANEL_EMPTY_STATES.certificates} />

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} onView={onView} />
      ))}
    </div>
  )
}

/* ---------------------------------------------------------- course history ---- */

function CourseHistoryPanel({ empty, onContinue }: { empty: boolean; onContinue: () => void }) {
  if (empty || COURSE_HISTORY.length === 0) return <PanelEmpty state={PANEL_EMPTY_STATES.history} />

  return (
    <>
      {COURSE_HISTORY.map((course) => (
        <article key={course.id} className={`flex items-center gap-4 p-4 ${INSET_CARD}`}>
          <div
            className="grid size-14 shrink-0 place-items-center rounded-tile text-base font-bold"
            style={{ backgroundColor: course.tileColor, color: course.tileInk }}
            aria-hidden="true"
          >
            {course.badge}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate text-base font-bold text-ink">{course.name}</h3>
                <p className="text-xs text-white/60">{course.lastActive}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-white/70">{course.progressLabel}</span>
            </div>
            <ProgressBar value={course.progress} size="sm" className="bg-surface!" />
          </div>

          {course.completed ? (
            <StatusPill tone="success" dense>
              {COURSE_COPY.completedLabel}
            </StatusPill>
          ) : (
            <PillButton tone="brand" className="min-w-[128px]" onClick={onContinue}>
              {COURSE_COPY.resumeCta}
            </PillButton>
          )}
        </article>
      ))}
    </>
  )
}

/* --------------------------------------------------------- pinned projects ---- */

function ProjectsPanel({
  empty,
  onResume,
  onViewAudit,
}: {
  empty: boolean
  onResume: () => void
  onViewAudit: () => void
}) {
  const active = PINNED_PROJECTS.find(
    (project): project is PinnedActiveRow => project.kind === 'active',
  )
  const audited = PINNED_PROJECTS.filter(
    (project): project is PinnedAuditedRow => project.kind === 'audited',
  )

  if (empty || PINNED_PROJECTS.length === 0) return <PanelEmpty state={PANEL_EMPTY_STATES.projects} />

  return (
    <>
      {active && (
        <article className={`flex flex-wrap items-center justify-between gap-6 rounded-card bg-surface p-5 ${PANEL_CARD_RING}`}>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-xs font-bold tracking-[0.96px] text-white/60 uppercase">
              {active.eyebrow}
            </span>
            <h3 className="text-xl leading-7 font-bold text-ink">{active.title}</h3>
            <div className="flex items-center gap-4 pt-2">
              <ProgressBar value={active.progress} size="sm" className="bg-shell!" />
              <span className="shrink-0 text-xs font-medium text-white/70">{active.microTasksLabel}</span>
            </div>
          </div>
          <Button onClick={onResume}>{active.cta}</Button>
        </article>
      )}

      {audited.length > 0 && (
        <section className="flex flex-col gap-3 pt-1">
          <h3 className="text-lg leading-7 font-bold text-ink">{AUDITED_PROJECTS_HEADING}</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {audited.map((project) => (
              <article
                key={project.id}
                className={`flex flex-col justify-between gap-3 rounded-card bg-surface p-4 ${PANEL_CARD_RING}`}
              >
                <div className="flex flex-col gap-3">
                  <h4 className="text-base font-bold text-ink">{project.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-pill bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                  <span className="rounded-pill bg-success px-3 py-1.5 text-xs font-bold text-black">
                    {project.auditLabel}
                  </span>
                  <PillButton onClick={onViewAudit}>{project.cta}</PillButton>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- settings ---- */

function SettingsSwitch({
  row,
  on,
  onChange,
}: {
  row: SettingsToggleRow
  on: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={`${row.id}-title`}
      aria-describedby={`${row.id}-description`}
      onClick={onChange}
      className={`flex h-11 w-16 shrink-0 items-center rounded-pill p-1 transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-[0.98] ${
        on ? 'justify-end bg-success' : 'justify-start bg-muted'
      }`}
    >
      <span
        className="size-9 rounded-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.1),0_2px_4px_0_rgba(0,0,0,0.1)]"
        aria-hidden="true"
      />
    </button>
  )
}

function SettingsPanel({
  empty,
  toggles,
  onToggle,
  onOpenLink,
}: {
  empty: boolean
  toggles: Record<string, boolean>
  onToggle: (row: SettingsToggleRow) => void
  onOpenLink: (link: AccountLinkId) => void
}) {
  if (empty || SETTINGS_ROWS.length === 0) return <PanelEmpty state={PANEL_EMPTY_STATES.settings} />

  return (
    <>
      {SETTINGS_ROWS.map((row) => (
        <div
          key={row.id}
          className="flex flex-wrap items-center justify-between gap-6 border-b-[0.9px] border-white/10 pt-6 pb-6 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="flex min-w-0 items-center gap-4">
            <IconTile tone={row.kind === 'toggle' ? 'brand' : 'success'}>
              <img src={SETTINGS_ICONS[row.icon]} alt="" width={22} height={22} />
            </IconTile>
            <div className="flex min-w-0 flex-col gap-2">
              <h3 id={`${row.id}-title`} className="text-lg leading-7 font-bold text-ink">
                {row.title}
              </h3>
              <p id={`${row.id}-description`} className="text-sm leading-5 text-ink-soft">
                {row.description}
              </p>
            </div>
          </div>

          {row.kind === 'toggle' ? (
            <SettingsSwitch
              row={row}
              on={toggles[row.id] ?? row.initialOn}
              onChange={() => onToggle(row)}
            />
          ) : (
            <Button variant="outline" onClick={() => onOpenLink(row.link)}>
              {row.cta}
            </Button>
          )}
        </div>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------- page ---- */

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const { user, loading, error } = useCurrentUser()
  const profileName = user?.name ?? (loading ? 'Loading…' : 'Account unavailable')
  const profileInitials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '—'

  const tabParam = searchParams.get('tab')
  /** The tab lives in the URL so it survives a refresh and can be deep linked. */
  const tab: ProfileTabId = isProfileTabId(tabParam) ? tabParam : DEFAULT_PROFILE_TAB
  /** QA switch: `/profile?tab=history&empty=1` shows a panel's empty state. */
  const empty = searchParams.get('empty') === '1'

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => ({ ...TOGGLE_DEFAULTS }))
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null)
  const [activeLink, setActiveLink] = useState<AccountLinkId | null>(null)

  const accountLink = activeLink ? ACCOUNT_LINKS[activeLink] : null

  const selectTab = (id: string) => {
    if (!isProfileTabId(id)) return
    const next = new URLSearchParams(searchParams)
    next.set('tab', id)
    setSearchParams(next)
  }

  const toggleSetting = (row: SettingsToggleRow) => {
    const next = !(toggles[row.id] ?? row.initialOn)
    setToggles((current) => ({ ...current, [row.id]: next }))
    const feedback = next ? row.feedbackOn : row.feedbackOff
    push({ title: feedback.title, description: feedback.description, tone: next ? 'success' : 'info' })
  }

  const copyCredentialId = async (certificate: Certificate) => {
    try {
      await navigator.clipboard.writeText(certificate.credentialId)
      push({ ...CERTIFICATE_MODAL_COPY.copiedToast, tone: 'success' })
    } catch {
      push({ ...CERTIFICATE_MODAL_COPY.copyFailedToast, tone: 'error' })
    }
  }

  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <Card className="flex flex-wrap items-center justify-between gap-6 p-6">
          <div className="flex min-w-0 items-center gap-6">
            <div className="relative size-28 shrink-0">
              <div className="grid size-28 place-items-center rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#3b82f6_100%)] shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
                <span className="text-3xl font-black text-white">{profileInitials}</span>
              </div>
              <div className="absolute top-20 left-20 grid size-7 place-items-center rounded-full border-[3.6px] border-surface bg-success">
                <img src={verifiedSmIcon} alt="" width={13} height={13} />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                  {PROFILE.eyebrow}
                </span>
                <h1 className="text-display text-ink">{profileName}</h1>
                <p className="text-base font-medium text-ink-soft">{PROFILE.track}</p>
                {error && <p className="text-xs text-code-red" role="alert">{error}</p>}
              </div>
              <div className="flex items-center gap-3">
                {PROFILE_SOCIALS.map((social) => (
                  <button
                    key={social.label}
                    type="button"
                    title={social.title}
                    aria-haspopup="dialog"
                    onClick={() => setActiveLink(social.link)}
                    className="grid size-11 place-items-center rounded-full border-[0.9px] border-white/30 text-base text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-[0.98]"
                  >
                    {social.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 items-center gap-4 rounded-card bg-brand-tint px-6 py-4">
              <IconTile tone="brand" className="rounded-tile bg-brand!" size="md">
                <img src={leagueIcon} alt="" width={23} height={23} />
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
                <div key={stat.id} className="flex h-[136px] items-center gap-4 rounded-card bg-shell p-6">
                  <IconTile tone={stat.tone === 'brand' ? 'brand' : 'success'}>
                    <img src={STAT_ICONS[stat.id]} alt="" width={25} height={25} />
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

        <Tabs
          idBase={TABS_ID}
          tabs={[...PROFILE_TABS]}
          value={tab}
          onChange={selectTab}
          indicatorInset
        />

        <div
          id={`${TABS_ID}-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`${TABS_ID}-tab-${tab}`}
          className="flex min-h-[256px] flex-1 flex-col"
        >
          <Card className="flex flex-1 flex-col gap-3 overflow-clip p-6">
            {tab === 'certificates' && <CertificatesPanel empty={empty} onView={setActiveCertificate} />}
            {tab === 'history' && (
              <CourseHistoryPanel empty={empty} onContinue={() => navigate(COURSE_ROUTE)} />
            )}
            {tab === 'projects' && (
              <ProjectsPanel
                empty={empty}
                onResume={() => navigate(PROJECT_ROUTE)}
                onViewAudit={() => navigate(AUDIT_ROUTE)}
              />
            )}
            {tab === 'settings' && (
              <SettingsPanel
                empty={empty}
                toggles={toggles}
                onToggle={toggleSetting}
                onOpenLink={setActiveLink}
              />
            )}
          </Card>
        </div>
      </div>

      {activeCertificate && (
        <Modal
          open
          onClose={() => setActiveCertificate(null)}
          title={activeCertificate.title}
          description={activeCertificate.summary}
          footer={
            <>
              <Button variant="outline" onClick={() => setActiveCertificate(null)}>
                {CERTIFICATE_MODAL_COPY.closeCta}
              </Button>
              <Button onClick={() => void copyCredentialId(activeCertificate)}>
                {CERTIFICATE_MODAL_COPY.copyCta}
              </Button>
            </>
          }
        >
          <h3 className="pb-4 text-sm font-bold text-ink">{CERTIFICATE_MODAL_COPY.detailsHeading}</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { id: 'type', label: CERTIFICATE_MODAL_COPY.typeLabel, value: CERTIFICATE_KIND_LABELS[activeCertificate.kind] },
              { id: 'issuer', label: CERTIFICATE_MODAL_COPY.issuerLabel, value: activeCertificate.issuer },
              { id: 'credential', label: CERTIFICATE_MODAL_COPY.credentialLabel, value: activeCertificate.credentialId },
              { id: 'issued', label: CERTIFICATE_MODAL_COPY.issuedLabel, value: activeCertificate.issued },
            ].map((entry) => (
              <div key={entry.id} className="flex flex-col gap-1 rounded-tile bg-shell p-4">
                <dt className="text-xs font-bold tracking-[0.96px] text-white/60 uppercase">{entry.label}</dt>
                <dd className="text-sm font-semibold text-ink">{entry.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="pt-6 text-sm font-bold text-ink">{CERTIFICATE_MODAL_COPY.skillsHeading}</h3>
          <div className="flex flex-wrap gap-2 pt-3">
            {activeCertificate.skills.map((skill) => (
              <StatusPill key={skill} tone="accent" dense>
                {skill}
              </StatusPill>
            ))}
          </div>
        </Modal>
      )}

      {accountLink && (
        <Modal
          open
          onClose={() => setActiveLink(null)}
          title={accountLink.title}
          description={accountLink.body}
          footer={
            <>
              <p className="mr-auto max-w-[180px] text-xs leading-5 text-ink-soft">{accountLink.ctaNote}</p>
              <Button variant="outline" onClick={() => setActiveLink(null)}>
                {ACCOUNT_MODAL_COPY.closeCta}
              </Button>
              <Button disabled>{accountLink.cta}</Button>
            </>
          }
        >
          <ul className="flex flex-col gap-3">
            {accountLink.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </AppShell>
  )
}
