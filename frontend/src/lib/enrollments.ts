import { useEffect, useState } from 'react'
import { api, ApiError } from './api'
import type { CatalogCourse } from './catalog'

export interface Enrollment {
  uuid: string
  status: 'active' | 'completed'
  progress: number
  started_at: string | null
  last_active_at: string | null
  completed_at: string | null
  course: CatalogCourse
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    api.get<{ data: Enrollment[] }>('/api/me/enrollments')
      .then((response) => { if (!cancelled) setEnrollments(response.data) })
      .catch((reason: unknown) => { if (!cancelled) setError(reason instanceof ApiError ? reason.message : 'Unable to load enrollments.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  return { enrollments, loading, error }
}
