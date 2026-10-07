# API Contract

Base URL (dev): `http://localhost:8000/api`
Frontend calls it through the Vite dev proxy, so in the browser it is always `/api/*`.

All responses are JSON. Errors use Laravel's shape:

```json
{ "message": "...", "errors": { "field": ["..."] } }
```
Status codes: 422 validation, 401 unauthenticated, 403 forbidden, 404 missing, 429 rate limited.

## Authentication

Token-based (Laravel Sanctum personal access tokens). Send the token on every
protected request:

```
Authorization: Bearer <token>
Accept: application/json
```

## Endpoints

### GET /api/health
Public. Smoke test that the backend is reachable.

```json
{ "status": "ok", "app": "NovaCode", "time": "2026-10-07T09:00:00+07:00" }
```

### GET /api/user
Requires `auth:sanctum`. Returns the authenticated user.

```json
{ "id": 1, "name": "...", "email": "...", "email_verified_at": null, "created_at": "...", "updated_at": "..." }
```

<!-- Add new endpoints below, in the same shape, as they are built. -->
