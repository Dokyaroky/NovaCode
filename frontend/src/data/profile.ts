export const PROFILE = {
  eyebrow: 'Profile & Settings',
  name: 'Nova Chen',
  initials: 'NC',
  track: 'Front-End Developer',
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

/** Outlined social buttons on the header card (label + accessible name). */
export const PROFILE_SOCIALS = [
  { label: 'GH', title: "Open Nova Chen's GitHub profile" },
  { label: 'in', title: "Open Nova Chen's LinkedIn profile" },
]

export interface QuickStat {
  id: string
  label: string
  value: string
  tone: 'brand' | 'success'
}

export const QUICK_STATS: QuickStat[] = [
  { id: 'streak', label: 'Longest Streak', value: '32 Days', tone: 'brand' },
  { id: 'certificates', label: 'Certificates', value: '4', tone: 'success' },
]

/** Tab order from the frame. Only the Certificates panel has designed content. */
export const PROFILE_TABS = [
  { id: 'certificates', label: 'Certificates' },
  { id: 'history', label: 'Course History' },
  { id: 'pinned', label: 'Pinned Projects' },
  { id: 'settings', label: 'Settings' },
] as const

export const EMPTY_PANEL = {
  title: 'Certificates',
  body: 'Select Settings to manage your profile preferences.',
}
