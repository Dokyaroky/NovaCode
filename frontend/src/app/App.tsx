import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import Placeholder from '@/pages/Placeholder'
import Auth from '@/pages/Auth'
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

export default function App() {
  return (
    <Routes>
      {SCREENS.map((screen) => (
        <Route
          key={screen.path}
          path={screen.path}
          element={
            IMPLEMENTED[screen.path] ?? (
              <Placeholder name={screen.name} node={screen.node} path={screen.path} />
            )
          }
        />
      ))}
      {/* Dev-only galleries: the design-system primitives and the interaction overlays. */}
      <Route path="/dev/ui" element={<UiPreview />} />
      <Route path="/dev/interactions" element={<Interactions />} />
      <Route path="*" element={<Placeholder name="Not found" node="—" path="*" />} />
    </Routes>
  )
}
