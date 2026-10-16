const BASE_URL = import.meta.env.VITE_API_URL ?? ''

type Json = Record<string, unknown>

function readXsrfToken() {
  if (typeof document === 'undefined') return undefined

  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith('XSRF-TOKEN='))

  return cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : undefined
}

async function ensureCsrfCookie() {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const mutating = !['GET', 'HEAD', 'OPTIONS'].includes(method)

  if (mutating) await ensureCsrfCookie()

  const xsrfToken = mutating ? readXsrfToken() : undefined
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      ...init.headers,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null as Json | null)
    throw new ApiError(
      (body?.message as string | undefined) ?? res.statusText,
      res.status,
    )
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export interface HealthResponse {
  status: string
  app: string
  time: string
}
