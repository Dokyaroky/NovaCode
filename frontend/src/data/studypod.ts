export const STUDY_TOPICS = ['Python', 'JavaScript', 'SQL & Data Modeling', 'React', 'Algorithms']

export const STUDY_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

export interface SessionPeer {
  id: string
  initials: string
  name: string
  /** Tailwind gradient class from the design. */
  gradient: string
}

export const SESSION = {
  eyebrow: 'StudyPod Session',
  title: 'Video Call',
  status: 'Connected',
  challengeEyebrow: 'Group Challenge',
  challengeTitle: 'Build a Login Function',
  challengeBody:
    'Work together to create a secure login function that handles validation and returns a predictable response.',
  objectives: [
    'Reject empty usernames and passwords',
    'Look up the user before checking credentials',
    'Return a consistent success response',
    'Pass all four shared test cases',
  ],
  editorTitle: 'Collaborative Editor - Python',
  /** The starter template the session opens with — see CODE_TEMPLATES. */
  language: 'python' as CodeLanguage,
  savedLabel: 'Changes saved',
  unsavedLabel: 'Unsaved changes',
  peerStatus: 'Peer is typing...',
  footerNote: 'Both collaborators must agree before submitting.',
  outputLabel: 'Output',
  outputReady: 'Ready. Run your test to see the output.',
  /** Line carrying the peer's caret in the untouched buffer. */
  caretLine: 2,
}

export type CodeLanguage = 'python' | 'javascript' | 'typescript' | 'sql'

export interface CodeTemplate {
  filename: string
  runCommand: string
  /** What this template prints when it runs. */
  output: string
  code: string[]
}

/** Hello-World starter for every language a session can run in. */
export const CODE_TEMPLATES: Record<CodeLanguage, CodeTemplate> = {
  python: {
    filename: 'hello_world.py',
    runCommand: 'python hello_world.py',
    output: 'Hello World',
    code: ['# Print "Hello World" to the console', 'print("Hello World")'],
  },
  javascript: {
    filename: 'hello_world.js',
    runCommand: 'node hello_world.js',
    output: 'Hello World',
    code: ['// Print "Hello World" to the console', 'console.log("Hello World")'],
  },
  typescript: {
    filename: 'hello_world.ts',
    runCommand: 'ts-node hello_world.ts',
    output: 'Hello World',
    code: ['// Print "Hello World" to the console', 'console.log("Hello World")'],
  },
  sql: {
    filename: 'hello_world.sql',
    runCommand: 'psql -f hello_world.sql',
    output: 'Hello World',
    code: ['-- Print "Hello World"', "SELECT 'Hello World' AS greeting;"],
  },
}

export const SESSION_PEERS: SessionPeer[] = [
  { id: 'you', initials: 'NC', name: 'You', gradient: 'bg-[linear-gradient(135deg,#8b5cf6_0%,#3b82f6_100%)]' },
  { id: 'peer', initials: 'AM', name: 'Alex Morgan', gradient: 'bg-[linear-gradient(135deg,#f97316_0%,#c2410c_100%)]' },
]

export const MATCHING = {
  eyebrow: 'StudyPod Matchmaking',
  title: 'Finding your peer...',
  subtitle: 'Matching you for a beginner python session.',
  searchLabel: 'Searching for an available collaborator',
}

export const SETUP = {
  eyebrow: 'StudyPod Matchmaking',
  title: 'Start a Collaborative Session',
  subtitle: 'Pair up with a peer to solve real-world coding challenges.',
  topicLabel: 'Select Topic',
  topicPlaceholder: 'Choose a coding topic',
  difficultyLabel: 'Select Difficulty',
  difficultyPlaceholder: 'Choose your difficulty',
  submit: 'Find a Match',
  waitNote: 'Average wait time: 45 seconds',
}
