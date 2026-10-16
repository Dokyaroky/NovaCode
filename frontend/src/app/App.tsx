import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Button from '@/components/Button'
import { useCurrentUser } from '@/lib/currentUser'
import Placeholder from '@/pages/Placeholder'
import Auth from '@/pages/Auth'
import ApiConnectionTest from '@/pages/ApiConnectionTest'
import CareerPath from '@/pages/CareerPath'
import Dashboard from '@/pages/Dashboard'
import Explore from '@/pages/Explore'
import Ide from '@/pages/Ide'
import Landing from '@/pages/Landing'
import MissionVideo from '@/pages/MissionVideo'
import Profile from '@/pages/Profile'
import ProjectReview from '@/pages/ProjectReview'
import Projects from '@/pages/Projects'
import Questionnaire from '@/pages/Questionnaire'
import QuickCheck from '@/pages/QuickCheck'
import StudyPod from '@/pages/StudyPod'
import StudyPodMatching from '@/pages/StudyPodMatching'
import StudyPodSession from '@/pages/StudyPodSession'
import UiPreview from '@/pages/dev/UiPreview'
import Interactions from '@/pages/dev/Interactions'
import { SCREENS } from '@/app/screens'

/* Screens built from Figma. Everything else still renders the Placeholder stub. */
const IMPLEMENTED: Record<string, ReactNode> = {
  '/': <Landing />,
  '/login': <Auth mode="login" />,
  '/signup': <Auth mode="signup" />,
  '/dashboard': <Dashboard />,
  '/learn': <CareerPath />,
  '/learn/questionnaire': <Questionnaire />,
  '/learn/mission': <MissionVideo />,
  '/learn/quick-check': <QuickCheck />,
  '/explore': <Explore />,
  '/projects': <Projects />,
  '/projects/review': <ProjectReview />,
  '/profile': <Profile />,
  '/studypod': <StudyPod />,
  '/studypod/matching': <StudyPodMatching />,
  '/studypod/session': <StudyPodSession />,
  '/ide': <Ide />,
}

const isProtectedPath = (path: string) =>
  path === '/dashboard' || path === '/explore' || path === '/ide' || path === '/profile' ||
  path === '/learn' || path.startsWith('/learn/') || path === '/projects' || path.startsWith('/projects/') ||
  path === '/studypod' || path.startsWith('/studypod/')

function AuthLoading() {
  return <div className="grid min-h-screen place-items-center bg-shell text-sm text-ink-soft">Loading…</div>
}

function AuthError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-shell p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-code-red" role="alert">Unable to verify your account.</p>
        <Button variant="outline" onClick={onRetry}>Retry</Button>
      </div>
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, error, errorStatus, retry } = useCurrentUser()
  if (loading) return <AuthLoading />
  if (errorStatus === 401) return <Navigate to="/login" replace />
  if (error) return <AuthError onRetry={retry} />
  return user ? children : <Navigate to="/login" replace />
}

function RequireGuest({ children }: { children: ReactNode }) {
  const { user, loading, error, errorStatus, retry } = useCurrentUser()
  if (loading) return <AuthLoading />
  if (user) return <Navigate to="/dashboard" replace />
  if (error && errorStatus !== 401) return <AuthError onRetry={retry} />
  return children
}

export default function App() {
  const { pathname } = useLocation()

  /* Every screen change in the file is a SMART_ANIMATE (300 ms, EASE_OUT) — a morph between two
     frames, which has no CSS equivalent. The stand-in is the file's own cross-fade duration and
     easing on the incoming screen. Keying on the pathname makes the wrapper remount per route,
     which replays the fade; a query-only change (e.g. `?tab=`) does not. */
  return (
    <div key={pathname} className="animate-dissolve h-full">
      <Routes>
        {SCREENS.map((screen) => (
          <Route
            key={screen.path}
            path={screen.path}
            element={
              isProtectedPath(screen.path) ? (
                <RequireAuth>{IMPLEMENTED[screen.path] ?? <Placeholder name={screen.name} node={screen.node} path={screen.path} />}</RequireAuth>
              ) : screen.path === '/login' || screen.path === '/signup' ? (
                <RequireGuest>{IMPLEMENTED[screen.path]}</RequireGuest>
              ) : IMPLEMENTED[screen.path] ?? (
                <Placeholder name={screen.name} node={screen.node} path={screen.path} />
              )
            }
          />
        ))}
        {/* Dev-only galleries: the design-system primitives and the interaction overlays. */}
        <Route path="/dev/ui" element={<UiPreview />} />
        <Route path="/dev/interactions" element={<Interactions />} />
        <Route path="/api-test" element={<ApiConnectionTest />} />
        <Route path="*" element={<Placeholder name="Not found" node="—" path="*" />} />
      </Routes>
    </div>
  )
}
