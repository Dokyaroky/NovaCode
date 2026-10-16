/**
 * Profile screen mock data — frames 99:2175 (Certificates), 99:2676 (Course History),
 * 99:3200 (Projects History) and 96:1673 (Settings).
 *
 * Copy is the frames' copy verbatim. The only non-token values are the per-course tile
 * colours: they are course identities (like a logo colour), not part of the palette.
 */

/* ------------------------------------------------------------------ header ---- */

export const PROFILE = {
  eyebrow: 'Profile & Settings',
  /** The newer frames read `Career: Front-End Developer`; the older 12:568 reads `Front-End Developer`. */
  track: 'Career: Front-End Developer',
  leagueLabel: 'League',
  league: 'Gold League',
  totalXpLabel: 'Total XP',
  totalXp: '12,400',
  radarTitle: 'Skill Radar',
  radarSubtitle: 'Verified strengths from completed projects and AI audits.',
  radarBadge: 'Advanced profile',
  quickStatsTitle: 'Quick Stats',
  quickStatsSubtitle: 'Your learning milestones at a glance.',
}

/* ------------------------------------------------- mock account integrations ---- */

export type AccountLinkId = 'github' | 'linkedin'

export interface AccountLink {
  id: AccountLinkId
  /** Dialog title. */
  title: string
  body: string
  /** What the integration would do once the backend exists. */
  points: string[]
  cta: string
  /** Explains why the CTA is disabled — the modal never pretends to connect. */
  ctaNote: string
}

export const ACCOUNT_LINKS: Record<AccountLinkId, AccountLink> = {
  github: {
    id: 'github',
    title: 'Connect GitHub Account',
    body: 'NovaCode reads the repositories you pin so your proof of work can be audited without uploading anything by hand.',
    points: [
      'Import public repositories and commit activity.',
      'Attach commits to the micro-tasks of a pinned project.',
      'Refresh the AI audit score whenever you push.',
    ],
    cta: 'Connect GitHub',
    ctaNote: 'OAuth is not wired in this build, so this button stays disabled.',
  },
  linkedin: {
    id: 'linkedin',
    title: 'LinkedIn profile',
    body: 'LinkedIn is not on the NovaCode integration list yet. Your certificates are already public on your NovaCode profile.',
    points: [
      'Your public NovaCode profile can showcase your progress.',
      'Every certificate carries a shareable credential link.',
    ],
    cta: 'Connect LinkedIn',
    ctaNote: 'Coming soon — this build cannot link a LinkedIn account.',
  },
}

export const ACCOUNT_MODAL_COPY = {
  closeCta: 'Close',
}

export interface ProfileSocial {
  /** Visible 44px circle label. */
  label: string
  /** Accessible name, taken from the frame's button node. */
  title: string
  link: AccountLinkId
}

export const PROFILE_SOCIALS: ProfileSocial[] = [
  { label: 'GH', title: 'Open your GitHub profile', link: 'github' },
  { label: 'in', title: 'Open your LinkedIn profile', link: 'linkedin' },
]

/* ------------------------------------------------------------- certificates ---- */

export type CertificateKind = 'career-track' | 'proof-of-work' | 'standalone-course'

export interface Certificate {
  id: string
  title: string
  kind: CertificateKind
  /** As printed on the card. */
  issuedLabel: string
  issued: string
  credentialId: string
  issuer: string
  summary: string
  skills: string[]
}

/** Human label per kind, used by the card badge and the detail modal. */
export const CERTIFICATE_KIND_LABELS: Record<CertificateKind, string> = {
  'career-track': 'Career Track',
  'proof-of-work': 'Proof-of-Work',
  'standalone-course': 'Standalone Course',
}

export interface CertificateGroup {
  kind: CertificateKind
  items: Certificate[]
}

/** Frame order: Career Track, Proof-of-Work, Standalone Course. */
export const CERTIFICATE_GROUPS: CertificateGroup[] = [
  {
    kind: 'career-track',
    items: [
      {
        id: 'full-stack-developer',
        title: 'Full-Stack Developer',
        kind: 'career-track',
        issuedLabel: 'Issued: Oct 2026',
        issued: 'Oct 2026',
        credentialId: 'NC-FSD-2026-0041',
        issuer: 'NovaCode Career Track',
        summary: 'Awarded for finishing the Full-Stack Developer track with an audited API and an audited interface.',
        skills: ['Python', 'FastAPI', 'PostgreSQL', 'React'],
      },
    ],
  },
  {
    kind: 'proof-of-work',
    items: [
      {
        id: 'ecommerce-api-capstone',
        title: 'E-Commerce API Capstone',
        kind: 'proof-of-work',
        issuedLabel: 'Issued: Oct 2026',
        issued: 'Oct 2026',
        credentialId: 'NC-POW-2026-0187',
        issuer: 'NovaCode AI Audit',
        summary: 'A shipped capstone that passed the AI audit: clean routing, validated payloads and a seeded database.',
        skills: ['FastAPI', 'SQLAlchemy', 'Pytest'],
      },
    ],
  },
  {
    kind: 'standalone-course',
    items: [
      {
        id: 'python-foundations',
        title: 'Python Foundations',
        kind: 'standalone-course',
        issuedLabel: 'Issued: Oct 2026',
        issued: 'Oct 2026',
        credentialId: 'NC-SC-2026-0312',
        issuer: 'NovaCode Course',
        summary: 'Completed the Python Foundations course: language basics, control flow and collections.',
        skills: ['Python', 'Control flow', 'Collections'],
      },
    ],
  },
]

/**
 * The Quick Stats pill counts the cards above. The frames print `4` there while the
 * Certificates panel draws three cards, so the value is derived to keep the page honest.
 */
export const CERTIFICATE_COUNT = CERTIFICATE_GROUPS.reduce(
  (total, group) => total + group.items.length,
  0,
)

export const CERTIFICATE_COPY = {
  viewCta: 'View Certificate',
}

export const CERTIFICATE_MODAL_COPY = {
  detailsHeading: 'Credential details',
  skillsHeading: 'Verified skills',
  issuerLabel: 'Issuer',
  credentialLabel: 'Credential ID',
  issuedLabel: 'Issued',
  typeLabel: 'Type',
  closeCta: 'Close',
  copyCta: 'Copy Credential ID',
  copiedToast: { title: 'Credential ID copied', description: 'Paste it anywhere to verify this certificate.' },
  copyFailedToast: {
    title: 'Copy failed',
    description: 'Your browser blocked clipboard access on this page.',
  },
}

/* ------------------------------------------------------------- quick stats ---- */

export interface QuickStat {
  id: 'streak' | 'certificates'
  label: string
  value: string
  tone: 'brand' | 'success'
}

export const QUICK_STATS: QuickStat[] = [
  { id: 'streak', label: 'Longest Streak', value: '32 Days', tone: 'brand' },
  { id: 'certificates', label: 'Certificates', value: String(CERTIFICATE_COUNT), tone: 'success' },
]

/* -------------------------------------------------------------------- tabs ---- */

export const PROFILE_TABS = [
  { id: 'certificates', label: 'Certificates' },
  { id: 'history', label: 'Course History' },
  /** 99:2175/99:2676 label this tab `Project History`; the newer 99:3200 says `Projects History`. */
  { id: 'projects', label: 'Projects History' },
  { id: 'settings', label: 'Settings' },
] as const

export type ProfileTabId = (typeof PROFILE_TABS)[number]['id']

export const DEFAULT_PROFILE_TAB: ProfileTabId = 'certificates'

export function isProfileTabId(value: string | null | undefined): value is ProfileTabId {
  return PROFILE_TABS.some((tab) => tab.id === value)
}

/* ------------------------------------------------------------ empty states ---- */

export interface PanelEmptyState {
  title: string
  body: string
}

/** One per panel: a panel without data renders this instead of an empty box. */
export const PANEL_EMPTY_STATES: Record<ProfileTabId, PanelEmptyState> = {
  certificates: {
    title: 'Certificates',
    body: 'Finish a course or ship an audited project to earn your first certificate.',
  },
  history: {
    title: 'Course History',
    body: 'Courses you start appear here with their progress and last activity.',
  },
  projects: {
    title: 'Projects History',
    body: 'Pin a project to follow its micro-tasks and keep the audit result in one place.',
  },
  settings: {
    title: 'Settings',
    body: 'This account has no editable preferences in this build.',
  },
}

/* ----------------------------------------------------------- course history ---- */

export interface CourseHistoryEntry {
  id: string
  name: string
  /** Two/three letter tile label from the frame. */
  badge: string
  /** Course identity colour (node fill), applied inline. */
  tileColor: string
  tileInk: string
  lastActive: string
  /** 0–100, drives the progress bar. */
  progress: number
  /** As printed on the row, e.g. `75% Completed`. */
  progressLabel: string
  completed: boolean
}

export const COURSE_HISTORY: CourseHistoryEntry[] = [
  {
    id: 'python-foundations',
    name: 'Python Foundations',
    badge: 'Py',
    tileColor: '#8b5cf6',
    tileInk: '#ffffff',
    lastActive: 'Last active: 2 days ago',
    progress: 75,
    progressLabel: '75% Completed',
    completed: false,
  },
  {
    id: 'css-basics-and-styling',
    name: 'CSS Basics & Styling',
    badge: 'CSS',
    tileColor: '#2b7fff',
    tileInk: '#ffffff',
    lastActive: 'Last active: 2 days ago',
    progress: 100,
    progressLabel: '100% Completed',
    completed: true,
  },
  {
    id: 'javascript-logic',
    name: 'JavaScript Logic',
    badge: 'JS',
    tileColor: '#fdc700',
    tileInk: '#000000',
    lastActive: 'Last active: 2 days ago',
    progress: 10,
    progressLabel: '10% Completed',
    completed: false,
  },
]

export const COURSE_COPY = {
  resumeCta: 'Continue',
  /** The 100% row has no action in the frame; it reports its state instead. */
  completedLabel: 'Completed',
}

/* ----------------------------------------------------------- pinned projects ---- */

export interface PinnedProjectBase {
  id: string
  title: string
}

export interface PinnedActiveRow extends PinnedProjectBase {
  kind: 'active'
  eyebrow: string
  /** 0–100, drives the micro-task bar. */
  progress: number
  microTasksLabel: string
  cta: string
}

export interface PinnedAuditedRow extends PinnedProjectBase {
  kind: 'audited'
  tags: string[]
  /** As printed in the audit pill, e.g. `AI Audit: 95/100`. */
  auditLabel: string
  cta: string
}

export type PinnedProjectRow = PinnedActiveRow | PinnedAuditedRow

export const AUDITED_PROJECTS_HEADING = 'Completed & Audited'

/** Active project first; the audited cards follow in the order the frame draws them. */
export const PINNED_PROJECTS: PinnedProjectRow[] = [
  {
    id: 'python-oop-console-app',
    kind: 'active',
    eyebrow: 'Active Project',
    title: 'Python OOP Console App',
    progress: 75,
    microTasksLabel: 'Micro-tasks: 3/4 completed',
    cta: 'Resume Work',
  },
  {
    id: 'ecommerce-rest-api',
    kind: 'audited',
    title: 'E-Commerce REST API',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    auditLabel: 'AI Audit: 95/100',
    cta: 'View Audit Result',
  },
  {
    id: 'task-management-dashboard',
    kind: 'audited',
    title: 'Task Management Dashboard',
    tags: ['React', 'TypeScript', 'Tailwind'],
    auditLabel: 'AI Audit: 92/100',
    cta: 'View Audit Result',
  },
]

/* ------------------------------------------------------------------ settings ---- */

export interface SettingsFeedback {
  title: string
  description: string
}

export interface SettingsToggleRow {
  kind: 'toggle'
  id: string
  title: string
  description: string
  icon: 'bell'
  initialOn: boolean
  feedbackOn: SettingsFeedback
  feedbackOff: SettingsFeedback
}

export interface SettingsLinkRow {
  kind: 'link'
  id: string
  title: string
  description: string
  icon: 'github'
  cta: string
  /** Which mock integration the button explains. */
  link: AccountLinkId
}

export type SettingsRow = SettingsToggleRow | SettingsLinkRow

export const SETTINGS_ROWS: SettingsRow[] = [
  {
    kind: 'toggle',
    id: 'notifications',
    title: 'Notifications',
    description: 'Spaced Repetition Reminders',
    icon: 'bell',
    initialOn: true,
    feedbackOn: {
      title: 'Reminders on',
      description: 'Spaced Repetition Reminders arrive once a card is due.',
    },
    feedbackOff: {
      title: 'Reminders off',
      description: 'You will not get a reminder when a card is due. Quests stay in your dashboard.',
    },
  },
  {
    kind: 'link',
    id: 'integrations',
    title: 'Integrations',
    description: 'Keep your public proof of work synchronized.',
    icon: 'github',
    cta: 'Connect GitHub Account',
    link: 'github',
  },
]
