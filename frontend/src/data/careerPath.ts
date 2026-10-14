/**
 * Career Path — "The Fuel Expedition" mock data.
 * Figma: frame 118:5899 (authoritative: 15% fuel, one mission extracting) and 122:6601
 * (the advanced state: 30% fuel, every mission finished, the boss unlocked).
 * Every string is a text node of those frames.
 *
 * Geometry: the screen draws the missions as a centred, Duolingo-style route, so the pins are
 * placed by index (see MISSION_ROUTE in the page) rather than by the frames' absolute x/y — the
 * old coordinates remain in `docs/figma/frames/118-5899_Career_Path_2.txt`.
 */

export type MissionStatus = 'finished' | 'extracting' | 'locked'

export interface Mission {
  id: string
  /** Label under the map pin. */
  title: string
  status: MissionStatus
  /** Number drawn inside the pin while the mission is not the active one. */
  order: string
}

export interface ExpeditionStage {
  id: 'extracting' | 'advanced'
  badge: string
  title: string
  subtitle: string
  /** Rocket fuel tank, 0–100 — drives the sidebar gauge and the crash report. */
  fuelPercent: number
  missions: Mission[]
  boss: {
    /** Small uppercase eyebrow above the boss title. */
    label: string
    title: string
    reward: string
    /** Locked bosses render a pill; unlocked ones become the way into the final review. */
    locked: boolean
    /** Pill copy — "[Locked]" while the missions are unfinished, "Fight" once they are. */
    action: string
  }
}

/** Sidebar copy shared by both stages (frame 118:5899). */
export const EXPEDITION_SIDEBAR = {
  crash: {
    label: 'Crash Report',
    heading: 'Ship Status: Stranded',
    tankLabel: 'Fuel Tank',
    note: 'Extract Plasma Fuel from coding nodes to restart the engine.',
    cta: 'Change Target Career',
  },
  current: {
    label: 'Current Extraction',
    body: 'Complete the active challenge to extract the next Plasma Fuel reserve.',
    cta: 'Start Extraction',
  },
} as const

/** Frame 122:6601 keeps the label uppercase; the boss reward is the frame's own string. */
export const EXPEDITION: ExpeditionStage = {
  id: 'extracting',
  badge: 'The Fuel Expedition',
  title: 'Expedition: Full Stack Developer',
  subtitle:
    'Your rocket is out of fuel. Complete coding nodes to extract Plasma Fuel and defeat the Final Boss to ignite the engine.',
  fuelPercent: 15,
  missions: [
    { id: 'html-css-base', title: 'HTML/CSS Base', status: 'extracting', order: '1' },
    { id: 'react-ui', title: 'React UI', status: 'locked', order: '2' },
    { id: 'nodejs-backend', title: 'Node.js Backend', status: 'locked', order: '3' },
  ],
  boss: {
    label: 'Boss Lair',
    title: 'Final Boss: E-Commerce Capstone',
    reward: 'Reward: 10,000L Rocket Fuel',
    locked: true,
    action: 'Locked',
  },
}

export const EXPEDITION_ADVANCED: ExpeditionStage = {
  ...EXPEDITION,
  id: 'advanced',
  fuelPercent: 30,
  missions: [
    { id: 'html-css-base', title: 'HTML/CSS Base', status: 'finished', order: '1' },
    { id: 'react-ui', title: 'React UI', status: 'finished', order: '2' },
    { id: 'nodejs-backend', title: 'Node.js Backend', status: 'finished', order: '3' },
  ],
  boss: {
    label: 'Boss Lair',
    title: 'Final Boss: E-Commerce Capstone',
    reward: 'Reward: 10,000L Rocket Fuel',
    locked: false,
    action: 'Fight',
  },
}

/** `?stage=advanced` previews the second design state (frame 122:6601). */
export const EXPEDITION_STAGES: Record<string, ExpeditionStage> = {
  extracting: EXPEDITION,
  advanced: EXPEDITION_ADVANCED,
}

/** The mission the "Current Extraction" card and the primary CTA point at. */
export function activeMission(stage: ExpeditionStage): Mission {
  return (
    stage.missions.find((mission) => mission.status === 'extracting') ??
    stage.missions[stage.missions.length - 1]
  )
}
