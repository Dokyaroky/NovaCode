# NovaCode

Website project scaffold: **Laravel 13 API + React 19 SPA (Vite, TypeScript, Tailwind v4)**.

```
backend/    Laravel 13 API (SQLite, Sanctum token auth)
frontend/   React 19 + Vite + TypeScript + Tailwind v4 SPA
docs/       api-contract.md — single source of truth for the HTTP contract
```

## First run

```sh
npm run setup     # composer install, .env, key, migrate, npm install
npm run dev       # API on :8000, SPA on :5173 in one terminal
```

Then open http://localhost:5173 — the home screen calls `GET /api/health` and
shows green when the API is reachable.

## Day-to-day

```sh
npm run dev:api   # php artisan serve :8000
npm run dev:web   # vite :5173
npm run build     # typecheck + production build of the SPA
npm test          # backend test suite, frontend lint + typecheck
```

## Conventions

- Frontend never hardcodes a host: all calls go through `src/lib/api.ts`, which
  prefixes `VITE_API_URL` (empty in dev → Vite proxy `/api` → `:8000`).
- Any new endpoint gets documented in `docs/api-contract.md` in the same commit
  that implements it.
- Auth is Sanctum bearer tokens; the token is sent by the shared `api.ts` client.
