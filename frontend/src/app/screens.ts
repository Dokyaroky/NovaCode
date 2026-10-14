/**
 * Route table for the NovaCode screens. One entry per Figma frame; `node` is the
 * Figma node id so a screen can be traced back to its design.
 *
 * Frames that are iterations of one screen are listed as the newest node id — see
 * docs/frontend-rebuild-plan.md for the full frame inventory.
 */
export interface Screen {
  path: string
  name: string
  /** Figma node id of the authoritative frame. */
  node: string
}

export const SCREENS: Screen[] = [
  { path: '/', name: 'Landing Page', node: '1:2' },
  { path: '/login', name: 'Login', node: '18:2221' },
  { path: '/signup', name: 'Sign Up', node: '4:215' },
  { path: '/dashboard', name: 'Dashboard', node: '4:577' },
  { path: '/learn', name: 'Career Path', node: '118:5899' },
  { path: '/learn/questionnaire', name: 'Career questionnaire', node: '43:248' },
  { path: '/learn/mission', name: 'Mission video', node: '84:3068' },
  { path: '/learn/quick-check', name: 'Quick check', node: '118:5783' },
  { path: '/explore', name: 'Explore', node: '81:1572' },
  { path: '/projects', name: 'Projects', node: '14:1307' },
  { path: '/projects/review', name: 'Project final review', node: '125:7001' },
  { path: '/studypod', name: 'StudyPod', node: '91:4440' },
  { path: '/studypod/matching', name: 'StudyPod — Matching', node: '12:269' },
  { path: '/studypod/session', name: 'StudyPod — Session', node: '12:333' },
  { path: '/ide', name: 'IDE', node: '125:7483' },
  { path: '/profile', name: 'Profile', node: '99:2175' },
]
