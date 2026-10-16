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

## Career goal and path endpoints

### GET /api/career-tracks

Returns active career tracks in questionnaire order (`full-stack`, `front-end`, `back-end`, `cybersecurity`, `data-scientist`, `ai-engineer`). The ordering is server-controlled; `sort_order` is not exposed as a database field:

```json
{ "data": [{ "slug": "full-stack", "title": "Full Stack Developer", "description": "Build complete products across modern front-end and back-end systems." }] }
```

### GET /api/me/career-goal

Returns the current goal, or `{ "data": null }` when none is selected:

```json
{ "data": { "uuid": "...", "isCurrent": true, "selectedAt": "...", "track": { "slug": "full-stack", "title": "Full Stack Developer", "description": "..." } } }
```

### PUT /api/me/career-goal

Request: `{ "track_slug": "full-stack" }`. The slug must identify an active track. The previous goal is retained as history and marked non-current; selecting the current track again is idempotent. Returns the goal shape above.

### GET /api/me/career-path

Returns the current track, exactly three missions, derived status and fuel, boss state, and the active mission briefing:

```json
{
  "data": {
    "track": { "slug": "full-stack", "title": "Full Stack Developer", "description": "..." },
    "missions": [
      { "slug": "html-css-base", "title": "HTML/CSS Base", "sortOrder": 1, "status": "extracting" },
      { "slug": "react-ui", "title": "React UI", "sortOrder": 2, "status": "locked" },
      { "slug": "node-js-backend", "title": "Node.js Backend", "sortOrder": 3, "status": "locked" }
    ],
    "fuelPercent": 0,
    "boss": { "title": "Final Boss: E-Commerce Capstone", "rewardLabel": "10,000L Rocket Fuel", "locked": true },
    "briefing": { "title": "HTML/CSS Base", "theoryTitle": "Theory: HTML & CSS", "theoryMinutes": 8, "extractionTitle": "Fuel Extraction: NavBar", "rewardLabel": "+500 XP and 200L Plasma Fuel" }
  }
}
```

Mission status is `finished`, `extracting` for the first unfinished mission, or `locked`. Each mission also includes `hasChallenge`; the active briefing includes `missionSlug` and `hasChallenge`. Fuel is completed missions divided by the three missions. No public mission-completion endpoint exists yet; mission completion is server-side in the graded challenge flow. A user without a current goal receives HTTP 409.

## Identifier and ownership rules

Catalog routes use slugs. User-owned enrollment and progress responses use UUIDs and never expose numeric database IDs. Enrollment and progress queries are scoped to the authenticated user; a user cannot read or modify another user's records.

## Graded mission challenges

### GET /api/me/missions/{missionSlug}/challenge

Returns the challenge for a mission in the authenticated user's current career track:

```json
{
  "data": {
    "slug": "html-css-base",
    "title": "Quick Check: HTML Structure",
    "instruction": "Write a basic <h1> tag with the text \"Hello World\" to confirm your understanding.",
    "starterCode": "<h1>Hello World</h1>",
    "placeholder": "Write your HTML heading",
    "theory": { "title": "Theory: HTML & CSS", "minutes": 8 },
    "passed": false
  }
}
```

The `rules` answer key is never returned. A mission that is locked or outside the current track returns HTTP 403; a mission without a challenge returns HTTP 404.

### POST /api/challenges/{slug}/attempts

Request:

```json
{ "answer": "<h1>Hello World</h1>" }
```

`answer` is required, nullable after Laravel's empty-string normalization, and limited to 5000 characters. The endpoint is limited to 30 attempts per minute per authenticated user and returns:

```json
{ "data": { "passed": true, "title": "Quick check passed", "description": "Your heading matches the expected structure.", "missionFinished": true } }
```

Rules are stored as an ordered JSON list. Each item has either `all_of` or `any_of`, containing lowercase substrings, plus `failure_title` and `failure_description`. Matching is case-insensitive against the trimmed answer. An empty answer fails with `Nothing to submit`. The server checks these patterns only; it never executes user code, so this is not a real test run. The answer key is never included in a response.

Challenges reference missions by `mission_slug`, not a foreign key. Passing a shared mission creates the authenticated user's completion for every track mission with that slug, idempotently. Attempts for locked or out-of-track missions return HTTP 403. No numeric database IDs are exposed.
