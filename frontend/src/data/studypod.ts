export const STUDY_TOPICS = ['Python', 'JavaScript', 'SQL & Data Modeling', 'React', 'Algorithms']

export const STUDY_DIFFICULTIES = ['Beginner', 'Medium', 'Advanced']

export interface SessionPeer {
  id: string
  initials: string
  name: string
  /** Tailwind gradient class from the design. */
  gradient: string
}

export const SESSION = {
  eyebrow: 'StudyPod Session',
  title: 'Virtual Call',
  status: 'Connected',
  /** Call controls under the peer tiles (frame 106:3843 ends the call). */
  controls: { mute: 'Mute', camera: 'Turn Off Camera', end: 'End Call' },
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
    /* The session frame (12:333) opens on the challenge's own stub, not a hello world. */
    filename: 'login_challenge.py',
    runCommand: 'python login_challenge.py',
    output: 'Process finished with exit code 0',
    code: [
      'def login(username, password):',
      '    if not username or not password:',
      '        return {"success": False}',
      '    user = find_user(username)',
      '    if user and verify(password, user.hash):',
      '        return {"success": True, "user": user}',
      '    return {"success": False}',
    ],
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
  /* Frame 91:4440 shows the form with both selectors already answered. */
  defaultTopic: 'Python',
  defaultDifficulty: 'Medium',
}

/** The "End Collaborative Session?" dialog (frame 106:3843). */
export const END_SESSION = {
  title: 'End Collaborative Session?',
  body: 'Are you sure you want to leave? Your peer is still in the session. Unsubmitted group work may be lost if both peers leave.',
  cancel: 'Cancel',
  confirm: 'Yes, End Call',
  /** Toast shown once the call is actually ended. */
  endedMessage: 'You left the collaborative session.',
}
