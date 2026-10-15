/**
 * Projects & Portfolio + Project final review mock data.
 *
 * Frames: 14:1307 (in progress, 75%), 91:4004 (completed & audited, 100%), 91:4222 (not
 * started, 0%), 125:7001 (final review, resolved), 122:6806 (final review, `--` scores),
 * 87:3682 (automated review with the step checklist).
 */

/* ------------------------------------------------------------------ Projects page */

export interface ActiveProject {
  label: string
  module: string
  title: string
  /** 0–100 */
  progress: number
}

export interface CompletedProject {
  id: string
  title: string
  description: string
  auditScore: number
  tech: string[]
}

export interface Challenge {
  id: string
  meta: string
  title: string
}

/** The three snapshots the design ships for this screen. */
export type ProjectsStateId = 'in-progress' | 'completed' | 'empty'

export interface ProjectsState {
  id: ProjectsStateId
  /** Label of the page's state switcher. */
  label: string
  activeProject: ActiveProject
  /** Primary action of the active-project card; `to` is the route it opens. */
  action: { label: string; to: string }
  challenges: Challenge[]
}

/** 14:1307 — the shipped default. */
export const ACTIVE_PROJECT: ActiveProject = {
  label: 'Py',
  module: 'Active project · Object-oriented programming',
  title: 'Python OOP Console App',
  progress: 75,
}

/** 91:4004 — the same challenge finished: progress full, no CTA in the frame (we link the review). */
export const COMPLETED_ACTIVE_PROJECT: ActiveProject = {
  label: 'Py',
  module: 'Active project · Object-oriented programming',
  title: 'Python OOP Console App',
  progress: 100,
}

/** 91:4222 — a fresh challenge at 0%. The frame keeps the title of the brief above it. */
export const EMPTY_ACTIVE_PROJECT: ActiveProject = {
  label: 'FS',
  module: 'FINTECH SYSTEMS · Advanced',
  title: 'Python OOP Console App',
  progress: 0,
}

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'relational-database-schema',
    title: 'Relational Database Schema',
    description: 'A normalized commerce database with safe migrations.',
    auditScore: 92,
    tech: ['SQL', 'PostgreSQL', 'Prisma'],
  },
  {
    id: 'real-time-analytics-board',
    title: 'Real-Time Analytics Board',
    description: 'An event dashboard with live filters and data streams.',
    auditScore: 89,
    tech: ['React', 'TypeScript', 'D3'],
  },
  {
    id: 'secure-rest-api',
    title: 'Secure REST API',
    description: 'A tested service with authentication and role access.',
    auditScore: 95,
    tech: ['Python', 'FastAPI', 'Pytest'],
  },
]

export const CHALLENGES: Challenge[] = [
  { id: 'fintech', meta: 'Fintech systems · Advanced', title: 'Design a payment ledger' },
  { id: 'ai', meta: 'Applied AI · Intermediate', title: 'Build a support copilot' },
  { id: 'cloud', meta: 'Cloud operations · Advanced', title: 'Create an incident console' },
  { id: 'consumer', meta: 'Consumer platforms · Intermediate', title: 'Model a social graph' },
]

export const PROJECTS_STATES: Record<ProjectsStateId, ProjectsState> = {
  'in-progress': {
    id: 'in-progress',
    label: 'In progress · 75%',
    activeProject: ACTIVE_PROJECT,
    action: { label: 'Continue Coding', to: '/ide' },
    challenges: CHALLENGES,
  },
  completed: {
    id: 'completed',
    label: 'Completed & audited · 100%',
    activeProject: COMPLETED_ACTIVE_PROJECT,
    action: { label: 'View final review', to: '/projects/review' },
    challenges: CHALLENGES,
  },
  empty: {
    id: 'empty',
    label: 'Not started · 0%',
    activeProject: EMPTY_ACTIVE_PROJECT,
    action: { label: 'Continue Coding', to: '/ide' },
    /* The fintech brief became the active project, so it left the "build next" row (91:4222). */
    challenges: CHALLENGES.filter((challenge) => challenge.id !== 'fintech'),
  },
}

export const PROJECTS_STATE_ORDER: ProjectsStateId[] = ['in-progress', 'completed', 'empty']
export const DEFAULT_PROJECTS_STATE: ProjectsStateId = 'in-progress'

export function isProjectsStateId(value: string | null): value is ProjectsStateId {
  return value !== null && PROJECTS_STATE_ORDER.some((id) => id === value)
}

/* ------------------------------------------------------------- Project final review */

export type ReviewMode = 'automated' | 'final'

export interface ReviewModeTab {
  id: ReviewMode
  label: string
}

export type StepStatus = 'complete' | 'active' | 'pending'

export interface ReviewStep {
  id: string
  title: string
  status: StepStatus
  statusLabel: string
}

export type FindingSeverity = 'ok' | 'minor' | 'major'

export interface AuditFinding {
  id: string
  severity: FindingSeverity
  /** Criterion the finding belongs to. */
  area: string
  detail: string
}

export interface AuditCriterion {
  id: string
  label: string
  /** 0–100; `null` while the audit has not scored the submission yet. */
  percent: number | null
}

export interface ProjectAudit {
  /** Total score the brief demands (122:6806). Pass/fail is derived from it. */
  minimumScore: number
  /** Total score 0–100; `null` until the audit has run. */
  score: number | null
  /** Pass verdict copy; only shown when the score clears the minimum. */
  verdict: string
  summary: string
  criteria: AuditCriterion[]
  findings: AuditFinding[]
  /** Latency of one mock audit run — the timeout boundary lives here, never in a page. */
  runMs: number
}

export type AuditOutcome = 'pending' | 'passed' | 'failed'

/** The single source of truth for the pass/fail badge: score vs the brief's minimum. */
export function auditOutcome(audit: ProjectAudit): AuditOutcome {
  if (audit.score === null) return 'pending'
  return audit.score >= audit.minimumScore ? 'passed' : 'failed'
}

/** Points still missing to pass (0 when the submission passed). */
export function auditGap(audit: ProjectAudit): number {
  if (audit.score === null) return audit.minimumScore
  return Math.max(0, audit.minimumScore - audit.score)
}

/** The `--` snapshot the frame 122:6806 draws: nothing scored yet. */
export function pendingAuditOf(audit: ProjectAudit): ProjectAudit {
  return {
    ...audit,
    score: null,
    verdict: '',
    summary: '',
    criteria: audit.criteria.map((criterion) => ({ ...criterion, percent: null })),
    findings: [],
  }
}

/** Mock audit boundary: resolves with `audit` once its latency has elapsed. */
export function simulateAudit(audit: ProjectAudit): Promise<ProjectAudit> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(audit), audit.runMs)
  })
}

export interface ProjectReviewData {
  heading: string
  /** Header eyebrow per mode: 87:3682 breadcrumb vs 125:7001 final-task line. */
  eyebrow: Record<ReviewMode, string>
  continueLabel: string
  modes: ReviewModeTab[]
  brief: {
    eyebrow: string
    title: string
    body: string
    requirements: string[]
  }
  steps: {
    title: string
    items: ReviewStep[]
  }
  submission: {
    eyebrow: string
    automatedTitle: string
    finalTitle: string
    urlLabel: string
    urlPlaceholder: string
    dropHint: string
    dropNote: string
    submitLabel: string
  }
  result: {
    automatedEyebrow: string
    automatedTitle: string
    finalEyebrow: string
    finalTitle: string
    pendingEyebrow: string
    pendingLabel: string
    pendingNote: string
    auditingLabel: string
    rerunLabel: string
    rerunningLabel: string
    certificateLabel: string
    findingsLabel: string
    minimumLabel: string
  }
  audit: ProjectAudit
}

export const PROJECT_REVIEW: ProjectReviewData = {
  heading: 'Project Workspace',
  eyebrow: {
    automated: 'Projects / Python OOP Console App',
    final: 'Final Task: Full Stack Developer',
  },
  continueLabel: 'Continue later',
  modes: [
    { id: 'automated', label: 'Automated Review' },
    { id: 'final', label: 'Final Review' },
  ],
  brief: {
    eyebrow: 'Project Brief',
    title: 'Project Requirements',
    body: 'Build a command-line application that models real-world entities with reusable classes, inheritance, and clear error handling.',
    requirements: [
      'Use at least three related classes',
      'Include input validation and exceptions',
      'Document setup and usage in a README',
    ],
  },
  steps: {
    title: 'Step 1: Skill Preparation',
    items: [
      {
        id: 'design-class-structure',
        title: 'Design Class Structure',
        status: 'complete',
        statusLabel: 'Completed',
      },
      {
        id: 'implement-error-handling',
        title: 'Implement Error Handling',
        status: 'active',
        statusLabel: 'Ready to begin',
      },
    ],
  },
  submission: {
    eyebrow: 'Final Review',
    automatedTitle: 'Step 2: Submit Proof of Work',
    finalTitle: 'Final Boss: E-Commerce Capstone',
    urlLabel: 'Paste GitHub Repository URL',
    urlPlaceholder: 'https://github.com/username/project',
    dropHint: 'Click or drag .zip file here',
    dropNote: 'Maximum file size: 25 MB',
    submitLabel: 'Submit for AI Audit',
  },
  result: {
    automatedEyebrow: 'Automated Review',
    automatedTitle: 'Step 1: Skill Preparation',
    finalEyebrow: 'Result',
    finalTitle: 'YOUR SCORE',
    pendingEyebrow: 'Minimum Score',
    pendingLabel: 'WAITING',
    pendingNote: 'Waiting for Submission',
    auditingLabel: 'Auditing submission…',
    rerunLabel: 'Re-run audit',
    rerunningLabel: 'Auditing…',
    certificateLabel: 'View Certificate',
    findingsLabel: 'Findings',
    minimumLabel: 'Minimum score',
  },
  audit: {
    minimumScore: 75,
    score: 92,
    verdict: 'Production-ready submission',
    summary: 'Excellent use of polymorphism and clean folder structure.',
    criteria: [
      { id: 'code-quality', label: 'Code quality', percent: 94 },
      { id: 'requirements', label: 'Requirements', percent: 100 },
      { id: 'documentation', label: 'Documentation', percent: 82 },
    ],
    /* Limitations behind the sub-100 criteria, so the score is explainable row by row. */
    findings: [
      {
        id: 'finding-documentation',
        severity: 'minor',
        area: 'Documentation',
        detail: 'The README stops before the deployment section.',
      },
      {
        id: 'finding-code-quality',
        severity: 'minor',
        area: 'Code quality',
        detail: 'Store mixes persistence with the pricing rules.',
      },
      {
        id: 'finding-requirements',
        severity: 'ok',
        area: 'Requirements',
        detail: 'Every item of the brief is covered.',
      },
    ],
    runMs: 1600,
  },
}

export const DEFAULT_REVIEW_MODE: ReviewMode = 'final'

export function isReviewMode(value: string | null): value is ReviewMode {
  return value === 'automated' || value === 'final'
}
