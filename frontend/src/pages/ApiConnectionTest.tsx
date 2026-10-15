
import { useEffect, useState } from 'react'
import { api, type HealthResponse } from '@/lib/api'

export default function ApiConnectionTest() {
  const [result, setResult] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api
      .get<HealthResponse>('/api/health')
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unknown connection error',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Laravel API Connection Test</h1>

      {loading && <p className="mt-4">Connecting to Laravel...</p>}

      {result && (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-green-100 p-4 text-green-900">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-red-100 p-4 text-red-900">
          Connection failed: {error}
        </pre>
      )}
    </main>
  )
}
