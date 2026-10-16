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

## Slice 4 decisions

- Each user has one current career goal, with history. Changing it keeps enrollments and progress.
- Fuel percent is finished missions divided by total missions in the user's track, computed on the server. The Figma 15% and 30% values were preview states.
- There is no public endpoint to complete a mission. Missions are completed server-side by Slice 5; this slice's tests and factories may write completions.
- Reward strings (`+500 XP`, `200L Plasma Fuel`, and boss reward) are display text only. There is no XP or fuel ledger yet.
- Every track has exactly three missions because the UI lays out three pins.
- The questionnaire-completed state moves from localStorage to the backend.

## Slice 2 scope

This slice implements only the authenticated, read-only course catalog: courses, categories, and structural lesson rows. The static Explore catalog does not contain lesson titles or explicit category assignments, so lesson titles are deterministic structural placeholders and category membership is assigned only when a visible category name occurs in the course title. Those choices should be revisited when authoritative catalog content is available.

## Slice 5 decisions

- Each mission has at most one graded challenge. Passing it finishes the mission; the theory video remains ungraded.
- Answers are graded on the server using stored pattern rules. User code is never executed on the server; the pattern check is not a real test run.
- Challenge rules (the answer key) are never returned by an API endpoint.
- Challenges are linked to missions by mission slug, not by a foreign key. A shared mission, such as `html-css-base`, counts for every track that contains it.
- The server refuses attempts to view or submit challenges for missions that are locked for the authenticated user.
- `MissionVideo` and the Python IDE page remain static in this slice.
