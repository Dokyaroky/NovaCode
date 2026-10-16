# NovaCode project state

Last verified: 2026-10-16. Source code and tests are authoritative; this file is a concise handoff, not a replacement for the code or `docs/api-contract.md`.

## Overview

NovaCode is a learning platform with a Laravel API and a Figma-based React SPA. The current objective is incremental integration of real learning data while preserving the existing UI. The repository is currently on `main`, clean, and three commits ahead of `origin/main`.

Discovered stack:

- Laravel `^13.17`, PHP `^8.3`, Sanctum `^4.0`, PHPUnit `^12.5`.
- React `^19.2.8`, Vite `^8.3.0`, TypeScript `~6.0.2`, Tailwind `^4.3.3`, React Router `^7.18.4`, Oxlint.
- Windows/Laragon development environment; API normally runs on port 8000 and the SPA on port 5173.
- The checked-in example configuration uses SQLite. The local `.env` is intentionally not documented; its active database/service state is not verified here.

## Architecture and conventions

- `backend/` is the Laravel application. API routes are in `backend/routes/api.php`; controllers, Form Requests, API Resources, models, migrations, factories, seeders, and feature tests follow Laravel conventions.
- `frontend/` is a Vite SPA. Routing is centralized in `frontend/src/app/App.tsx`; shared UI primitives are in `frontend/src/components`; page-specific static copy is in `frontend/src/data`; API access goes through `frontend/src/lib/api.ts`.
- Vite proxies `/api/` and `/sanctum/` to the Laravel server. The frontend uses relative API URLs in development.
- Authentication uses Sanctum’s SPA session-cookie flow: obtain CSRF state from `/sanctum/csrf-cookie`, then authenticate through `/api/login` with the XSRF header and session cookie. Logout invalidates the session. Protected frontend routes use a client-side guard, while Laravel remains authoritative.
- API Resources control response shapes. Catalog records use slugs; user-owned records use UUIDs. User-owned queries must be scoped to the authenticated user, and numeric/internal IDs must not be exposed.
- Server input is validated with Form Requests. Avoid `$request->all()` for mass assignment. Do not run destructive database commands or migrations without assessing their impact.
- Preserve the Figma layout and existing responsive shell. Prefer focused changes, explicit loading/error/empty/success states, and existing components/tokens.

## Current implementation status

Confirmed in source and Git history:

- Authenticated user identity is shared across Sidebar, Dashboard, and Profile through the current-user cache; cache reset/retry behavior and route guards are implemented.
- Read-only authenticated course catalog exists: courses, categories, lessons, search/category filters, Explore loading/error/empty states, enrollment action, and API Resources.
- Enrollment and lesson progress exist with UUID public identifiers, server-computed course progress, user-scoped access, idempotent enrollment, and completion handling.
- Career tracks and current career goals exist with history, ordered tracks, server-derived mission fuel/status, and CareerPath integration.
- Graded mission challenges exist. Challenge rules are stored server-side, never returned, and used only for case-insensitive substring checks; user code is not executed. HTML, `//`, and `/* */` comments are stripped before grading. Starter snippets are intentionally non-passing skeletons.
- QuickCheck loads challenge content from the API and submits using the loaded challenge slug. The legacy `/learn/quick-check` route redirects to `/learn`. CareerPath disables unavailable challenge actions.
- Project audits/ZIP upload, StudyPod backend behavior, MissionVideo backend behavior, and the Python IDE remain static by design.
- Current Explore cards use language-specific inline icons and no colored square background. The current StudyPod sidebar icon inherits active/inactive navigation color.

## Verified commands and results

The latest documented implementation work verified:

- Backend `php artisan test`: 33 tests and 211 assertions passed during Slice 5c.
- Frontend `npm run build`: passed.
- Frontend `npm run lint`: passed with existing warnings, including React Fast Refresh and set-state-in-effect warnings.
- The current documentation-only task has not changed application source. The root `npm test` was run after creating these files and passed; lint emitted only existing warnings.

## Important decisions

The supported decision record is `docs/phase3-decisions.md`. Important confirmed decisions include:

- Catalog data is seeded; there is no admin UI yet.
- Career goals have one current record plus history; changing goals preserves enrollment/progress.
- Fuel and course progress are derived values, not ledgers.
- Daily quest/streak timezone is Asia/Jakarta, with UTC storage planned for timestamps.
- Challenges are at most one per mission, linked by mission slug, and a shared mission completion applies to every track containing that slug.
- The challenge pattern check is not a real test runner and must never expose answer rules.
- Project audits, ZIP upload, StudyPod, MissionVideo, and the Python IDE stay static until explicitly scheduled.

## Priorities and risks

Current task: establish and maintain this repository handoff system without changing application behavior.

Known risks and items needing attention:

- The active local database driver/service and migration state are not verified in this documentation pass. Do not assume the checked-in SQLite example matches the developer’s local `.env`.
- Frontend lint has warnings that predate this documentation task; they are not failures but should be reviewed during cleanup.
- Several product areas remain static and have no backend contract yet.
- The latest small UI fixes are present in the current `main` commit; preserve unrelated changes when continuing.

Recommended next task: have Claude review this state and `docs/api-contract.md`, then choose one narrowly scoped integration slice. Acceptance criteria should name the source fields, ownership rules, endpoint shapes, tests, and frontend states before implementation begins.

## Instructions for Claude

Claude is the technical consultant and reviewer, not the primary implementation agent. Claude should inspect this file and the source, analyze Codex reports, diagnose risks, prepare precise implementation prompts, review test results, and recommend the next task. Codex is the primary local coding agent.

The source code is authoritative for implementation details. If this document disagrees with the code, tests, or API contract, investigate and correct the documentation rather than blindly trusting it. Do not invent history that is not present in Git or repository documentation.

