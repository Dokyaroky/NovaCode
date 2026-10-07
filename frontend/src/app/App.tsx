import { Route, Routes } from 'react-router-dom'
import Placeholder from '@/pages/Placeholder'
import UiPreview from '@/pages/dev/UiPreview'
import { SCREENS } from '@/app/screens'

export default function App() {
  return (
    <Routes>
      {SCREENS.map((screen) => (
        <Route
          key={screen.path}
          path={screen.path}
          element={<Placeholder name={screen.name} node={screen.node} path={screen.path} />}
        />
      ))}
      {/* Dev-only gallery of the design-system primitives. Remove once the pages exist. */}
      <Route path="/dev/ui" element={<UiPreview />} />
      <Route path="*" element={<Placeholder name="Not found" node="—" path="*" />} />
    </Routes>
  )
}
