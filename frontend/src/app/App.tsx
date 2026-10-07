import { Route, Routes } from 'react-router-dom'
import Placeholder from '@/pages/Placeholder'
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
      <Route path="*" element={<Placeholder name="Not found" node="—" path="*" />} />
    </Routes>
  )
}
