export interface Course {
  label: string
  module: string
  title: string
  description: string
  /** 0–100 */
  progress: number
}

export interface Quest {
  id: string
  label: string
  title: string
  meta: string
}

export interface Audit {
  id: string
  title: string
  status: string
  score: number
  note: string
  auditedAt: string
}

export interface LeaderRow {
  rank: number
  initials: string
  name: string
  value: string
  highlighted?: boolean
}

export const TODAY_LABEL = 'Tuesday, October 6'

export const CURRENT_COURSE: Course = {
  label: 'Py',
  module: 'Current course · Module 4',
  title: 'Python Data Structures',
  description: 'Continue with dictionaries and learn how to model connected data efficiently.',
  progress: 65,
}

export const DAILY_QUESTS: Quest[] = [
  { id: 'sql-basics', label: 'DB', title: 'Daily Review: SQL Basics', meta: '12 cards · 8 min' },
  { id: 'python-loops', label: 'Py', title: 'Daily Review: Python Loops', meta: '10 cards · 6 min' },
]

export const AI_AUDITS: Audit[] = [
  {
    id: 'inventory-api',
    title: 'Inventory Management API',
    status: 'Passed',
    score: 88,
    note: 'Strong data modeling and error handling. Add integration tests for edge cases before your next submission.',
    auditedAt: 'Audited today',
  },
]

export const LEADERBOARD: LeaderRow[] = [
  { rank: 1, initials: 'MR', name: 'Maya R.', value: '2,940 XP' },
  { rank: 2, initials: 'TK', name: 'Theo K.', value: '2,720 XP' },
  { rank: 3, initials: 'NC', name: 'Nova C.', value: '2,480 XP', highlighted: true },
]

export const DAILY_GOAL = { xp: 300, target: 400, hint: 'Earn 100 more XP to complete today.' }
