import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import Placeholder from '@/pages/Placeholder'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Explore from '@/pages/Explore'
import Landing from '@/pages/Landing'
import Learn from '@/pages/Learn'
import Projects from '@/pages/Projects'
import UiPreview from '@/pages/dev/UiPreview'
import { SCREENS } from '@/app/screens'

/* Screens built from Figma. Everything else still renders the Placeholder stub. */
const IMPLEMENTED: Record<string, ReactNode> = {
  '/': <Landing />,
  '/login': <Auth mode="login" />,
  '/signup': <Auth mode="signup" />,
  '/dashboard': <Dashboard />,
  '/learn': <Learn />,
  '/explore': <Explore />,
  '/projects': <Projects />,
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
      {/* Dev-only gallery of the design-system primitives. Remove once the pages exist. */}
      <Route path="/dev/ui" element={<UiPreview />} />
      <Route path="*" element={<Placeholder name="Not found" node="—" path="*" />} />
    </Routes>
  )
}
