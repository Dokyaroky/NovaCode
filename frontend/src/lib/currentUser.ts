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

let cachedUser: CurrentUser | null | undefined
let userRequest: Promise<CurrentUser> | null = null

export function getInitials(name: string): string {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
  return initials || '—'
}

export function resetCurrentUserCache(): void {
  cachedUser = undefined
  userRequest = null
}

export function refreshCurrentUser(): Promise<CurrentUser> {
  resetCurrentUserCache()
  return fetchCurrentUser()
}

function fetchCurrentUser(): Promise<CurrentUser> {
  if (cachedUser) return Promise.resolve(cachedUser)
  if (!userRequest) {
    userRequest = api.get<UserResponse>('/api/user').then((response) => {
      cachedUser = response.data
      return response.data
    })
  }
  return userRequest
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(cachedUser ?? null)
  const [loading, setLoading] = useState(cachedUser === undefined)
  const [error, setError] = useState<string | null>(null)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchCurrentUser()
      .then((response) => {
        if (!cancelled) setUser(response)
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof ApiError ? reason.message : 'Unable to load your account.')
          setErrorStatus(reason instanceof ApiError ? reason.status : null)
          cachedUser = undefined
          userRequest = null
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    resetCurrentUserCache()
    setUser(null)
    setError(null)
    setErrorStatus(null)
    setLoading(true)
    setAttempt((current) => current + 1)
  }

  return { user, loading, error, errorStatus, retry }
}
