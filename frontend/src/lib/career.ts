export interface CareerTrack {
  slug: string
  title: string
  description: string
}

export interface CareerGoalResponse {
  uuid: string
  isCurrent: boolean
  selectedAt: string
  track: CareerTrack
}

export interface CareerMission {
  slug: string
  title: string
  sortOrder: number
  status: 'finished' | 'extracting' | 'locked'
}

export interface CareerPathResponse {
  track: CareerTrack
  missions: CareerMission[]
  fuelPercent: number
  boss: { title: string; rewardLabel: string; locked: boolean }
  briefing: { title: string; theoryTitle: string; theoryMinutes: number; extractionTitle: string; rewardLabel: string } | null
}
