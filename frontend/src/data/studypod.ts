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
  editorMeta: 'login_challenge.py · Changes saved',
  peerStatus: 'Peer is typing...',
  runStatus: '4 tests passed in 0.12s',
  footerNote: 'Both collaborators must agree before submitting.',
  /** Line 6 carries the peer's caret in the design. */
  caretLine: 6,
}

export const SESSION_PEERS: SessionPeer[] = [
  { id: 'you', initials: 'NC', name: 'You', gradient: 'bg-[linear-gradient(135deg,#8b5cf6_0%,#3b82f6_100%)]' },
  { id: 'peer', initials: 'AM', name: 'Alex Morgan', gradient: 'bg-[linear-gradient(135deg,#f97316_0%,#c2410c_100%)]' },
]

export const SESSION_CODE = [
  'def login(username, password):',
  '    if not username or not password:',
  '        return {"success": False}',
  '',
  '    user = find_user(username)',
  '    if user and verify(password, user.hash):',
  '        return {"success": True, "user": user}',
  '',
  '    return {"success": False}',
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
