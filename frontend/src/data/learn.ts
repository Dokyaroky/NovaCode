export type TrackState = 'done' | 'active' | 'locked'

export interface CareerTrack {
  id: string
  name: string
  state: TrackState
  /** Step number shown on active/locked nodes. */
  step?: number
  /** Position inside the 660x680 node-map canvas (Figma coordinates). */
  x: number
  y: number
}

/** Figma node 4:1019 — a 660x680 canvas; each node is a 200px column at (x, y). */
export const TRACK_CANVAS = { width: 660, height: 680 }

export const CAREER_TRACKS: CareerTrack[] = [
  { id: 'frontend', name: 'Front-End Developer', state: 'done', x: 181, y: 38 },
  { id: 'backend', name: 'Back-End Developer', state: 'done', x: 306, y: 170 },
  { id: 'fullstack', name: 'Full-Stack Engineer', state: 'active', step: 3, x: 191, y: 302 },
  { id: 'cyber', name: 'Cybersecurity Analyst', state: 'locked', step: 4, x: 311, y: 434 },
  { id: 'data', name: 'Data Scientist', state: 'locked', step: 5, x: 186, y: 566 },
]

export const TRACK_PROGRESS = 62

export interface WeekDot {
  day: string
  done: boolean
}

export const MOMENTUM = {
  streak: 14,
  streakCaption: 'Day streak',
  personalBestLabel: 'PERSONAL BEST',
  week: [
    { day: 'M', done: true },
    { day: 'T', done: true },
    { day: 'W', done: true },
    { day: 'T', done: true },
    { day: 'F', done: true },
    { day: 'S', done: false },
    { day: 'S', done: false },
  ] as WeekDot[],
  league: 'Gold III',
  leagueCaption: '8,420 total XP',
  leaguePercent: 'TOP 8%',
  leagueProgress: 68,
  nextLeague: '580 XP to Gold II',
}
