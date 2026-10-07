/**
 * Route table for the NovaCode screens. One entry per Figma frame; `node` is the
 * Figma node id so a screen can be traced back to its design.
 */
export interface Screen {
  path: string
  name: string
  node: string
}

export const SCREENS: Screen[] = [
  { path: '/', name: 'Landing Page', node: '1:2' },
  { path: '/login', name: 'Login', node: '18:2221' },
  { path: '/signup', name: 'Sign Up', node: '4:215' },
  { path: '/dashboard', name: 'Dashboard', node: '4:577' },
  { path: '/learn', name: 'Learning Path', node: '4:935' },
  { path: '/explore', name: 'Explore', node: '14:1625' },
  { path: '/projects', name: 'Projects', node: '14:1307' },
  { path: '/studypod', name: 'StudyPod', node: '12:2' },
  { path: '/studypod/matching', name: 'StudyPod — Loading Screen', node: '12:269' },
  { path: '/studypod/session', name: 'StudyPod — Matched Peers', node: '12:333' },
  { path: '/ide', name: 'IDE', node: '14:2011' },
  { path: '/profile', name: 'Profile', node: '12:568' },
]
