# Frontend rebuild plan — NovaCode vs. Figma `m38I3VVhh1y7aR5r4QSvIs`

Generated after inspecting the repo (branch `main`, commit `5d05fb2`) and the current Figma page `0:1`
(55 top-level frames). Frame-by-frame structure dumps live in `docs/figma/frames/<id>_<name>.txt`;
`docs/figma/frames/_index.json` maps id → name → line count.

## 1. Inventory and verdict per frame

The design grew from 12 frames to 55. Many are iterations of one screen (copy-paste in Figma), so the
rule used here is: **for a group of frames with identical copy, the highest node id is the newest and is
the one implemented; the others become states/modes of that screen.**

| Screen | Authoritative frame | Also present (older iterations / states) | Status in repo |
|---|---|---|---|
| Landing | `1:2` | — | implemented, copy matches (only `12,000+ learners building daily`, `Master coding. Build your future.` map to `12,000+ learners building daily` etc. via data module — verify) |
| Login | `18:2221` | — | implemented |
| Sign Up | `4:215` | — | implemented (same screen, `mode` prop) |
| Dashboard | `4:577` | — | implemented; 5 new strings (`14-Day Streak`, `88/100`, `Personal best: 21 days`, `The Big League`, `View Projects history`) |
| Explore | `81:1572` | `14:1625` deleted from the file | implemented; verify against the new frame (10 text nodes) |
| Career Path | `118:5899` | `45:764` (`[Starting]`), `122:6135/6291` (15%, locked), `122:6444/6601` (30%, finished, Fight) | **NEW** — replaces the old Learning Path (`4:935`, no longer in the file) |
| Questionnaire | `43:248` | `110:3992`, `113:4644` (empty shells, newer but unimplemented) | **NEW** |
| Mission video (course player) | `84:3068` | `43:2` (04:12), `84:2732` (10:00 done), `84:2900` (10:00 done, big play) | **NEW** |
| Quick-check briefing (full-width) | `118:5783` | — | **NEW** |
| Projects | `14:1307` | `91:4004` (100% progress state), `91:4222` (0% empty state) | implemented; add the two states |
| Project final review | `125:7001` | `87:3682` (automated review, 82/94/100%), `122:6806` (final task, `--` scores) | **NEW** |
| StudyPod setup | `91:4440` | `12:2` (empty dropdowns) | implemented; frame is the "filled" state |
| StudyPod matching | `12:269` | `91:4546/4568/4590/4613/4641` (spinner 73/122/186px variants) | implemented |
| StudyPod session | `12:333` | modal `106:3843` ("End Collaborative Session?") | implemented; add the modal, "Virtual Call" label, new starter code |
| IDE | `125:7483` | `14:2011`, `84:3548`, `125:7358` | implemented; add `Give Me a hint` + success output state |
| Profile | tabs `99:2175` (Certificates), `99:2676` (Course History), `99:3200` (Pinned Projects), `96:1673` (Settings) | `12:568`, `91:4667`, `91:5161` (older, fewer rows) | implemented as one Certificates-only screen — **rebuild with 4 tabs** |

Non-screen frames (assets / design-system sheets, not routes): `45:1029` Component and Asset,
`63:1341` SideNav variants, `106:3843` End-session modal (used by StudyPod session), `113:5734` /
`118:6053` / `125:7213` FuelExpedition cards+modals (used by Career Path), `125:7266` Career Path ending,
`125:7628` NovaLogo, `125:7637` Cup, `2001:1858` empty scratch frame, `110:3992`/`113:4644` empty
Questionnaire shells.

## 2. Decision: refactor + extend, not rebuild

The existing frontend is sound: token layer in `index.css`, 21 shared primitives with light/dark-safe
props (this is a dark-only design), one `AppShell`, typed `src/data/*` mock modules, 12 working routes,
zero API calls. A from-scratch rewrite would throw away verified geometry (auth split 720|720, shell
`288 | 1fr | 360`, landing hero measurements) that the new frames did not change. So:

- **Keep**: build system, Tailwind token layer, `AppShell`, `SideNav`, primitives, data-module pattern,
  route table (`src/app/screens.ts`).
- **Extend**: bring the two unmerged commits of `feature/interactive-ui` in as primitives only
  (`Portal`, `Modal`, `Drawer`, `Dropdown`, `Tooltip`, `Toast`, `lib/interactions.ts`, motion tokens,
  extra icons) — additive, no page overwrite.
- **Rebuild**: Profile (tabs), Explore (verify), StudyPod session wiring, IDE hints — page by page.
- **Add**: Career Path, Questionnaire, Mission video, Quick-check, Project final review.

## 3. Routes

```
/                       Landing 1:2
/login  /signup         Auth 18:2221 / 4:215 (one screen, two modes)
/dashboard              Dashboard 4:577
/learn                  Career Path 118:5899      (was Learning Path 4:935)
/learn/questionnaire    Questionnaire 43:248
/learn/mission          Mission video 84:3068
/learn/quick-check      Quick-check briefing 118:5783
/explore                Explore 81:1572
/projects               Projects 14:1307
/projects/review        Project final review 125:7001
/studypod               StudyPod setup 91:4440
/studypod/matching      StudyPod matching 12:269
/studypod/session       StudyPod session 12:333 (+ end-session modal 106:3843)
/ide                    IDE 125:7483
/profile                Profile 99:2175 / 99:2676 / 99:3200 / 96:1673 (tab via ?tab=)
/dev/ui  /dev/interactions   dev-only primitive galleries
```

Sidebar nav loses "Learn" and gains "Career Path" (`Button_CareerPath` exists in the component sheet
`45:1029`), matching the frames' sidebars.

## 4. Work split

| Workstream | Files | Owner |
|---|---|---|
| Career Path map + expedition sidebar | `src/pages/CareerPath.tsx`, `src/data/careerPath.ts` | main agent |
| StudyPod session: end modal, Virtual Call, starter code | `src/pages/StudyPodSession.tsx`, `src/data/studypod.ts` | main agent |
| IDE: hint button, success output, states | `src/pages/Ide.tsx`, `src/data/ide.ts` | main agent |
| Dashboard deltas, Explore verification | `src/pages/Dashboard.tsx`, `src/pages/Explore.tsx`, data | main agent |
| Mission video + quick check | `src/pages/MissionVideo.tsx`, `src/pages/QuickCheck.tsx`, `src/data/mission.ts` | delegate |
| Profile tabs (4 panels) | `src/pages/Profile.tsx`, `src/data/profile.ts` | delegate |
| Project final review + Projects states | `src/pages/ProjectReview.tsx`, `src/data/projects.ts` | delegate |
| Questionnaire | `src/pages/Questionnaire.tsx`, `src/data/careerGoals.ts` | delegate |

## 5. Risks

- **No backend contract changes.** `src/lib/api.ts` stays the only network boundary; every page reads
  typed mock modules, so wiring Laravel later means replacing those modules. Do not touch `backend/`.
- **Iteration frames**: if a design decision looks wrong (e.g. a copy-paste artefact), the newest frame
  wins and the deviation is reported, not silently "fixed".
- **Assets**: images embedded in frames (rocket PNG in the expedition sidebar, node thumbnails,
  `Cup`) exist only as Figma node images. Export them via the MCP asset URLs into `src/assets/` in the
  same session that uses them; URLs expire (~7 days).
- **No variables in the file** (`get_variable_defs` → `{}`): colours are node fills, already captured in
  the token layer.
- **Verification**: `npx tsc -b`, `npm run lint`, `npm run build`, then DOM measurement per screen
  (`scrollWidth === innerWidth`, frame box numbers) — screenshots are unreliable in this environment.
