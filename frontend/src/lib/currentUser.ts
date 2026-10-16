import { useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api'

export interface CurrentUser {
  name: string
  email: string
  email_verified_at: string | null
}

interface UserResponse {
  data: CurrentUser
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    api
      .get<UserResponse>('/api/user')
      .then((response) => {
        if (!cancelled) setUser(response.data)
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : 'Unable to load your account.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { user, loading, error }
}
