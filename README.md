# NovaCode

NovaCode is a gamified learning platform for people building practical software skills. It combines course discovery, lesson progress, career paths, mission challenges, project exploration, and a Figma-based learning interface.

## Technology

- Laravel 13 API with PHP 8.3+
- Laravel Sanctum SPA session-cookie authentication
- React 19, TypeScript, Vite 8, and Tailwind CSS v4
- SQLite by default for local development; MySQL can be configured through Laravel’s environment settings
- PHPUnit for backend tests and Oxlint for frontend linting

The repository is split into two applications:

```text
backend/    Laravel API, authentication, migrations, seeders, and tests
frontend/   React SPA, routes, UI components, and API integration
docs/       API contract, project decisions, Figma notes, and handoff documentation
```

## Features

- Authenticated dashboard, profile, Explore catalog, and career paths
- Course catalog with search and category filters
- Course enrollment and lesson progress tracking
- Career goals, ordered career tracks, mission fuel, and mission status
- Server-graded mission challenges using stored substring rules
- Challenge attempts scoped to the authenticated user
- Sanctum-protected API endpoints and frontend route guards
- Figma-based responsive UI with shared design components

Project audits, ZIP uploads, StudyPod backend behavior, MissionVideo backend behavior, and the Python IDE remain static prototype areas in the current version.

## Requirements

Install these tools before starting:

- PHP 8.3 or newer
- Composer
- Node.js and npm
- Git
- SQLite for the default setup, or MySQL if you configure another Laravel database connection

Windows users can run PHP and MySQL through [Laragon](https://laragon.org/).

## Installation on Windows

Clone the repository and open PowerShell in the project directory:

```powershell
git clone <repository-url>
cd NovaCode
```

Install the Laravel backend:

```powershell
cd backend
composer install

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
}

php artisan key:generate
php artisan migrate
```

Install the React frontend:

```powershell
cd ..\frontend
npm install
cd ..
```

The checked-in backend example configuration uses SQLite and includes the local database file. To use MySQL instead, configure the `DB_*` values in `backend/.env` and make sure the Laragon MySQL service is running before migrating. Never commit `.env` files or credentials.

## Run locally

Start both applications from the repository root:

```powershell
npm run dev
```

Or run them separately in two terminals:

```powershell
# Terminal 1
npm run dev:api

# Terminal 2
npm run dev:web
```

Open the frontend at [http://localhost:5173](http://localhost:5173). The Laravel API runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

The frontend uses relative API URLs in development. Vite proxies `/api/` and `/sanctum/` to Laravel, so `frontend/.env.local` normally contains an empty `VITE_API_URL`.

## Useful commands

Run from the repository root:

```powershell
npm run build       # Type-check and build the frontend
npm test            # Backend tests, frontend lint, and TypeScript validation
```

Run backend commands from `backend/`:

```powershell
php artisan test
php artisan route:list
php artisan migrate:status
```

Run frontend commands from `frontend/`:

```powershell
npm run dev
npm run build
npm run lint
npx tsc -b
```

Do not use destructive commands such as `migrate:fresh` or database resets unless you have explicitly confirmed that existing data can be removed.

## Authentication

NovaCode uses Laravel Sanctum’s SPA cookie flow, not bearer tokens:

1. Request `/sanctum/csrf-cookie`.
2. Send the XSRF header and session cookie with `POST /api/login` or `POST /api/register`.
3. Use the authenticated session for protected API requests.
4. Call `POST /api/logout` to invalidate the session.

The frontend API client is at `frontend/src/lib/api.ts`. The backend authentication implementation is in `backend/app/Http/Controllers/AuthController.php`.

## API and documentation

- [API contract](docs/api-contract.md)
- [Phase 3 decisions](docs/phase3-decisions.md)
- [Current project state](PROJECT_STATE.md)
- [Work log](WORK_LOG.md)
- [Agent instructions](AGENTS.md)

The API contract should be updated in the same change as any new or changed endpoint. API Resources control public response fields, catalog records use slugs, and user-owned records use UUIDs without exposing numeric database IDs.

## Development guidelines

Inspect the existing implementation before making changes. Preserve the Figma-based UI, prefer focused changes, validate input on the server, scope user-owned queries to the authenticated user, and report exactly what was changed and tested. See the root and directory-specific `AGENTS.md` files for the project’s working conventions.

## License

No project-specific license has been identified in the repository yet. Add an appropriate license before distributing NovaCode publicly.
