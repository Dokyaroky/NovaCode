/** The signed-in learner. Mock data — one module so pages never inline literals. */
export interface User {
  name: string
  firstName: string
  initials: string
  level: number
  levelLabel: string
  levelProgress: number
  totalXp: number
  streakDays: number
  personalBest: number
  league: string
  leagueCaption: string
  leaguePosition: string
  track: string
}

export const CURRENT_USER: User = {
  name: 'Nova Chen',
  firstName: 'Nova',
  initials: 'NC',
  level: 12,
  levelLabel: 'Level 12',
  levelProgress: 75,
  totalXp: 8420,
  streakDays: 14,
  personalBest: 21,
  league: 'Bronze League',
  leagueCaption: 'Top learners this week',
  leaguePosition: 'Gold III',
  track: 'Front-End Developer',
}
