# API Contract

Base URL (dev): `http://localhost:8000/api`. The Vite development proxy lets the frontend call `/api/*` directly. All responses are JSON unless noted.

Errors use Laravel's shape: `{ "message": "...", "errors": { "field": ["..."] } }`.

## Authentication

The SPA uses Laravel Sanctum's session-cookie flow, not bearer tokens:

1. `GET /sanctum/csrf-cookie` with credentials enabled.
2. Read the `XSRF-TOKEN` cookie and send it as the `X-XSRF-TOKEN` header on POST requests.
3. `POST /api/login` with the session cookie and XSRF header.
4. Keep the session cookie for subsequent protected requests.

Laravel's stateful-domain configuration must include the frontend origin (`localhost:5173` for this setup). The frontend API client sends `credentials: include`. Logout invalidates the session and regenerates the CSRF token.

User shape:

```json
{ "name": "Alex Morgan", "email": "alex@example.com", "email_verified_at": null }
```

## Public endpoints

### GET /api/health

Returns `{ "status": "ok", "app": "NovaCode", "time": "..." }`.

### POST /api/register

Request: `{ "name": "Alex Morgan", "email": "alex@example.com", "password": "..." }`.

Returns HTTP 201: `{ "user": { ...user shape } }`. The server logs the user into the session.

### POST /api/login

Request: `{ "email": "alex@example.com", "password": "..." }`.

Returns `{ "user": { ...user shape } }` and regenerates the session. Invalid credentials return 422.

## Protected endpoints

All endpoints below require the authenticated Sanctum session cookie.

### GET /api/user

Returns the authenticated user wrapped in `data`:

```json
{ "data": { "name": "Alex Morgan", "email": "alex@example.com", "email_verified_at": null } }
```

### POST /api/logout

No request body. Returns HTTP 204 and invalidates the session.

### GET /api/courses

Optional query parameters: `search` and `category` (category slug).

```json
{ "data": [{ "slug": "python-foundations", "title": "Python Foundations", "label": "PY", "labelBg": "bg-info", "xp": "+500 XP", "level": "Beginner", "lessons": 24, "categories": [{ "slug": "python", "name": "Python" }] }], "meta": { "total": 1 } }
```

### GET /api/courses/{slug}

Returns one catalog course using the course shape above. Catalog identifiers are slugs; numeric IDs are not exposed.

### GET /api/course-categories

Returns `{ "data": [{ "slug": "python", "name": "Python" }] }`.

### POST /api/courses/{slug}/enroll

No request body. Creates or returns the authenticated user's enrollment. Repeating the request is idempotent.

```json
{ "data": { "uuid": "...", "status": "active", "progress": 0, "started_at": "...", "last_active_at": "...", "completed_at": null, "course": { "slug": "python-foundations", "title": "Python Foundations", "label": "PY", "labelBg": "bg-info", "xp": "+500 XP", "level": "Beginner", "lessons": 24, "categories": [] } } }
```

### GET /api/me/enrollments

Returns the authenticated user's enrollments, ordered by most recently active:

```json
{ "data": [{ "uuid": "...", "status": "active", "progress": 25, "started_at": "...", "last_active_at": "...", "completed_at": null, "course": { "slug": "...", "title": "...", "label": "...", "labelBg": "...", "xp": "...", "level": "Beginner", "lessons": 4, "categories": [] } }] }
```

### GET /api/me/courses/{slug}

Returns the authenticated user's enrollment for that course using the enrollment shape above. If the user is not enrolled, it returns 404.

### POST /api/me/lessons/{lessonUuid}/progress

Request: `{ "position_seconds": 42 }`. The server stores resume position and returns:

```json
{ "data": { "uuid": "...", "lessonUuid": "...", "positionSeconds": 42, "status": "in_progress", "completedAt": null } }
```

The lesson must belong to a course in the authenticated user's enrollments. `position_seconds` is an integer from 0 through 86400. The client does not send a percentage.

### POST /api/me/lessons/{lessonUuid}/complete

No request body. Marks the lesson complete and returns the updated enrollment. Progress is computed as completed lessons divided by total lessons. When all lessons are complete, enrollment `status` becomes `completed` and `completed_at` is populated.

## Identifier and ownership rules

Catalog routes use slugs. User-owned enrollment and progress responses use UUIDs and never expose numeric database IDs. Enrollment and progress queries are scoped to the authenticated user; a user cannot read or modify another user's records.
