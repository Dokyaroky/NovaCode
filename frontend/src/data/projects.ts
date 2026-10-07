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

export const ACTIVE_PROJECT: ActiveProject = {
  label: 'Py',
  module: 'Active project · Object-oriented programming',
  title: 'Python OOP Console App',
  progress: 75,
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
