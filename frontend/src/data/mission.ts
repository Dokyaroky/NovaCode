/**
 * Mission video player (Figma 84:3068, states in 84:2732 / 84:2900 / 43:2) and the focused
 * quick-check briefing (118:5783).
 *
 * Every string here is a frame text node except three groups the frames do not contain and
 * that the screen needs to be honest about its states: the validation notices, the check
 * delay/pending label, and the AI assistant's canned replies (there is no model call — the
 * page is a mock, so the replies say so).
 */

export type PlaybackState = 'idle' | 'playing' | 'ended'

export interface MissionModule {
  id: string
  /** Sidebar eyebrow line, e.g. `Module 1`. */
  label: string
  /** Sidebar title, e.g. `Props Basics`. */
  title: string
  /** Player heading, e.g. `Module 2: React State Management`. */
  heading: string
  /** Lesson length in seconds (all three mission frames show `10:00`). */
  duration: number
  /** Second the lesson resumes at; `>= duration` means it is finished. */
  resumeAt: number
}

export const MISSION = {
  backLabel: 'Back to Explore',
  backPath: '/explore',
  expedition: 'React Interface Lab',
  playLabel: 'Play lesson video',
  pauseLabel: 'Pause lesson video',
  replayLabel: 'Replay lesson video',
  volumeOnLabel: 'Mute video',
  volumeOffLabel: 'Unmute video',
  progressLabel: 'Lesson progress',
  practiceEyebrow: 'Practice as you learn',
  practiceTitle: 'Interactive Micro-Task',
  microTaskLabel: 'Declare a state variable called "count"',
  microTaskPlaceholder: 'Write your state declaration',
  microTaskCode: 'const [count, setCount] = useState(0)',
  submitTaskLabel: 'Submit Task',
  checkingLabel: 'Checking your code…',
  upNextEyebrow: 'Up Next',
  courseContentTitle: 'Course Content',
  /** Appended to the selected row while its lesson is playing (`Module 3 · Playing`). */
  playingSuffix: '· Playing',
  /** Spoken status of the selected row. */
  playingLabel: 'Playing',
  pausedLabel: 'Paused',
  completedLabel: 'Completed',
  upcomingLabel: 'Not started',
  assistantTitle: 'AI Assistant',
  assistantStatus: 'Online and ready to help',
  assistantSuggestion: 'Need help with React State?',
  assistantPlaceholder: 'Ask a question...',
  assistantSendLabel: 'Send question',
  assistantTypingLabel: 'AI assistant is typing',
} as const

export const MISSION_MODULES: MissionModule[] = [
  {
    id: 'module-1',
    label: 'Module 1',
    title: 'Props Basics',
    heading: 'Module 1: Props Basics',
    duration: 600,
    resumeAt: 600,
  },
  {
    id: 'module-2',
    label: 'Module 2',
    title: 'State Management',
    heading: 'Module 2: React State Management',
    duration: 600,
    resumeAt: 5,
  },
  {
    id: 'module-3',
    label: 'Module 3',
    title: 'Effect Hook',
    heading: 'Module 3: Effect Hook',
    duration: 600,
    resumeAt: 0,
  },
]

/** The frame opens on module 2 at `00:05 / 10:00`. */
export const DEFAULT_MODULE_ID = 'module-2'

/** Four-space-free file: two spaces is what the frame's snippet uses. */
export const MICRO_TASK_INDENT = '  '

/** Token the micro-task answer has to mention to pass the check. */
export const MICRO_TASK_REQUIREMENT = 'useState'

/** Mock check duration; there is no backend, so the run is a timeout, not a request. */
export const CHECK_DELAY = 700

export interface Verdict {
  title: string
  description: string
}

export const MICRO_TASK_MESSAGES: Record<'empty' | 'missingToken' | 'success', Verdict> = {
  empty: {
    title: 'Nothing to submit',
    description: 'Write your state declaration before submitting the task.',
  },
  missingToken: {
    title: 'useState not found',
    description: 'The task asks for a useState declaration — add one and submit again.',
  },
  success: {
    title: 'Task accepted',
    description: 'Your micro-task passed the automated check for this module.',
  },
}

/** `null` when the answer is acceptable. Pure so the page only renders the verdict. */
export function validateMicroTask(answer: string): Verdict | null {
  if (!answer.trim()) return MICRO_TASK_MESSAGES.empty
  if (!answer.toLowerCase().includes(MICRO_TASK_REQUIREMENT.toLowerCase())) {
    return MICRO_TASK_MESSAGES.missingToken
  }
  return null
}

export const QUICK_CHECK = {
  title: 'Theory: HTML & CSS',
  backLabel: 'Back to Expedition',
  backPath: '/learn',
  /** The theory clip is complete: the frame shows `08:00 / 08:00` and a full bar. */
  duration: 480,
  replayLabel: 'Replay theory video',
  pauseLabel: 'Pause theory video',
  progressLabel: 'Theory video progress',
  cardTitle: 'Quick Check: HTML Structure',
  instruction: 'Write a basic <h1> tag with the text "Hello World" to confirm your understanding.',
  editorLabel: 'HTML quick check code editor',
  editorValue: '<h1>Hello World</h1>',
  editorPlaceholder: 'Write your heading here',
  submitLabel: 'Done & Return to Map',
  submitPath: '/learn',
  checkingLabel: 'Checking your markup…',
  indent: '  ',
} as const

export interface AssistantReply {
  id: string
  /** Lower-case substrings that route the question to this reply. */
  match: string[]
  reply: string
}

/** Canned answers — keyword routed, no model call. Each reply says it is a demo answer. */
export const ASSISTANT_REPLIES: AssistantReply[] = [
  {
    id: 'state',
    match: ['state', 'usestate', 'count', 'setter'],
    reply:
      'Demo answer: useState gives a component memory. const [count, setCount] = useState(0) returns the value plus its setter; calling the setter re-renders with the new value.',
  },
  {
    id: 'props',
    match: ['prop'],
    reply:
      'Demo answer: props are read-only inputs a parent passes down. Read them from the parameter object inside the child and never assign to them.',
  },
  {
    id: 'effect',
    match: ['effect', 'useeffect', 'lifecycle', 'cleanup'],
    reply:
      'Demo answer: useEffect runs after paint. Return a cleanup function to unsubscribe or cancel, and use the dependency array to choose when it runs again.',
  },
]

export const ASSISTANT_FALLBACK_REPLY =
  'Demo answer: this assistant is mocked and only covers this expedition — ask about state, props or the effect hook.'

export const ASSISTANT_REPLY_DELAY = 900

/** Picks the canned reply for a question (keyword match, else the fallback). */
export function assistantReply(question: string): string {
  const normalized = question.toLowerCase()
  const entry = ASSISTANT_REPLIES.find((candidate) =>
    candidate.match.some((token) => normalized.includes(token)),
  )
  return entry?.reply ?? ASSISTANT_FALLBACK_REPLY
}

/** `05:00` — the mm:ss both screens print. */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(total / 60)
  const remainder = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

/** `00:05 / 10:00` — the frame's timestamp format. */
export function formatTimestamp(position: number, duration: number): string {
  return `${formatClock(position)} / ${formatClock(duration)}`
}
