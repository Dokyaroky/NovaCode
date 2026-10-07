import { useEffect, useState } from 'react'
import { api, type HealthResponse } from './lib/api'

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<HealthResponse>('/api/health')
      .then(setHealth)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">NovaCode</h1>
        <p className="mt-1 text-sm text-slate-500">
          Laravel + React + Vite + Tailwind + TypeScript
        </p>

        <div className="mt-6 rounded-lg bg-slate-50 p-4 font-mono text-sm">
          {error && <span className="text-red-600">API error: {error}</span>}
          {!error && !health && (
            <span className="text-slate-400">checking API…</span>
          )}
          {health && (
            <span className="text-emerald-700">
              API {health.status} — {health.app} @ {health.time}
            </span>
          )}
        </div>
      </div>
    </main>
  )
}
