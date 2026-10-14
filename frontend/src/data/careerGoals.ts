/**
 * Career questionnaire — mock data for the six career goals.
 *
 * Figma: page frame 43:248 ("Questionnaire") with the "Section - Career goals" component set
 * `78:819`. The page frame only carries an instance (`78:1463`) of that component, so the options
 * were read from the component set itself: `78:818` (Default, Full Stack selected), `78:820`
 * (Variant2, Front-End selected) and the remaining variants only move the "Selected" pill.
 * Titles, descriptions and the option order are the component's text nodes; the 24px glyphs are
 * the component's exported icons (`search.svg` / `feature-web-ide.svg` / `feature-ai-roleplay.svg`
 * are the frames' own icons, reused because the art is identical).
 */
import fullStackIcon from '@/assets/icons/goal-fullstack.svg'
import frontEndIcon from '@/assets/icons/goal-frontend.svg'
import backEndIcon from '@/assets/icons/feature-web-ide.svg'
import cybersecurityIcon from '@/assets/icons/goal-cybersecurity.svg'
import dataIcon from '@/assets/icons/goal-data.svg'
import aiIcon from '@/assets/icons/feature-ai-roleplay.svg'

export type CareerGoalId =
  | 'full-stack'
  | 'front-end'
  | 'back-end'
  | 'cybersecurity'
  | 'data-scientist'
  | 'ai-engineer'

export interface CareerGoal {
  id: CareerGoalId
  /** 20px/28 card heading — node 78:766 and siblings. */
  title: string
  /** 14px/24 card body — node 78:767 and siblings. */
  description: string
  /** 24px fixed-colour glyph painted inside the card's 48px violet tile (node 78:755). */
  icon: string
}

/** Card order is the frame's reading order: three columns, two rows. */
export const CAREER_GOALS: CareerGoal[] = [
  {
    id: 'full-stack',
    title: 'Full Stack Developer',
    description: 'Build complete products across modern front-end and back-end systems.',
    icon: fullStackIcon,
  },
  {
    id: 'front-end',
    title: 'Front-End Engineer',
    description: 'Create accessible, responsive interfaces with modern web frameworks.',
    icon: frontEndIcon,
  },
  {
    id: 'back-end',
    title: 'Back-End Developer',
    description: 'Design secure APIs, services, databases, and scalable infrastructure.',
    icon: backEndIcon,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    description: 'Protect applications and investigate vulnerabilities across systems.',
    icon: cybersecurityIcon,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Transform complex data into useful models, insights, and decisions.',
    icon: dataIcon,
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Build intelligent products with machine learning and language models.',
    icon: aiIcon,
  },
]

/**
 * Screen copy. Badge, H1, subtitle and the CTA label are text nodes of frame 43:248; the states
 * the frame does not draw (unselected helper, validation, generation progress, toast) are ours,
 * because the frame only ships the answered state.
 */
export const CAREER_QUESTIONNAIRE = {
  /** Node 43:323, 12px/18 bold uppercase tracking-0.72 in a violet pill. */
  badge: 'Career questionnaire',
  /** Node 43:327, 48px/48 black, tracking -1.92. */
  title: 'What is your career goal?',
  /** Node 43:330 — the frame truncates this string at the node dump, the MCP text node is complete. */
  subtitle: 'Choose a role and we will generate a personalized learning path to get you there.',
  /** The frame draws no visible group label; screen readers need one. */
  legend: 'Career goal',
  /** Node 78:1530 — the CTA inside frame 43:248. */
  submit: 'Generate My Learning Path',
  /** Node 78:763 — the pill on the selected card. */
  selectedLabel: 'Selected',
  /** Shown while nothing is chosen — this is why the CTA is aria-disabled. */
  hintEmpty: 'Pick a career goal to enable the path generator.',
  hintReady: (title: string) => `Your path will start from the ${title} track.`,
  /** Validation state: the CTA was pressed (or the form submitted) with no choice. */
  hintError: 'Select a career goal before generating your path.',
  generating: {
    label: 'Generating your learning path',
    /** Stage line under the progress bar; no spinner anywhere. */
    steps: [
      'Reading your career goal',
      'Selecting missions and courses',
      'Sequencing your first week',
    ],
  },
  toast: {
    title: 'Learning path generated',
    body: (title: string) => `${title} path is ready on the Career Path screen.`,
  },
} as const
