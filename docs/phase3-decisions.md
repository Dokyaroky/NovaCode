# Phase 3 decisions

- Catalog data (courses, categories, lessons) is created by seeders. The current Explore data is extracted into seeders so the UI remains visually unchanged. No admin UI is planned for this slice.
- The `myhealthcare` schema is not reused.
- Each user has one current career goal with history. Changing goals preserves enrollments and progress.
- Fuel is derived from completed missions divided by total missions. There is no fuel ledger.
- Course progress is the percentage of lessons completed. Video position is retained only for resume support.
- Assistant messages are session-only and are not persisted.
- Project audits, ZIP upload, and StudyPod remain static for now.
- Daily-quest and streak calculations use Asia/Jakarta; timestamps are stored in UTC.
- Catalog records use slugs. User-owned records use UUIDs. Numeric IDs are not exposed in API responses.
- The leaderboard shows first name, last initial, and XP to authenticated users only.
- Protected frontend pages will redirect unauthenticated users; backend authorization remains authoritative.

## Slice 2 scope

This slice implements only the authenticated, read-only course catalog: courses, categories, and structural lesson rows. The static Explore catalog does not contain lesson titles or explicit category assignments, so lesson titles are deterministic structural placeholders and category membership is assigned only when a visible category name occurs in the course title. Those choices should be revisited when authoritative catalog content is available.
