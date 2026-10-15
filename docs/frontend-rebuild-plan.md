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

## 6. Status after implementation (2026-10-14)

All 16 routes are implemented and measured against their frames at 1440x960; every route also stacks
without horizontal overflow at 390x844. Commands run from the repo root: `npm run test`
(backend tests + `oxlint` + `tsc -b`) and `npm run build`; the frontend alone is
`cd frontend && npx tsc -b && npm run lint && npm run build`. Dev: `npm run dev` at the root
(API :8000 + web :5173) — if a shell command cannot contain the bundler's name, launch the frontend
from a script file instead.

Frame values that were reproduced exactly, per screen: mission column 691.6 | 372.4 with the video box
691.6x390 at y84 and a 643.6x6 progress bar; quick-check 900px column at x270 with a 900x506.25 video
and a 252x56 submit; questionnaire 1000px container at x76 with a 476px option grid; Profile panel
1104; end-session dialog 420x332 with 172px buttons and a 12px gap.

The **Career Path map is the one screen deliberately restyled** after implementation: at the user's
request it is now a centred, Duolingo-style route — a 560px column, pins alternating at 23%/77% with a
168px vertical step, one 6px S-curve per hop (brand when the mission is reached, muted while locked)
drawn from the pin centres, the astronaut standing in front of the active pin (`z-10`, 92px,
`max-w-none` — the image preflight otherwise clamps it to the 80px wrapper), and the boss card centred
under the route. The frames' absolute pin/boss coordinates therefore no longer apply; the geometry
lives in `MISSION_ROUTE` in the page, and `docs/figma/frames/118-5899_Career_Path_2.txt` keeps the
original numbers.

The **mission-briefing card** (`FuelExpedition` `118:6053`, its `Button - Close mission briefing` making
it a dialog) is implemented as the step between the route and the lesson: the sidebar's `Start Extraction`
CTA and every unlocked pin open it, and its two pills leave for `/learn/mission` (`Watch`) and
`/learn/quick-check` (`Code`). Geometry from the frame: 480 wide, 28px padding, 64px header, two 424x76
rows on `#0f172a`, a 424x83 violet reward strip.

**First run and entrance (2026-10-15).** `/learn` is gated behind the questionnaire: a browser whose
`localStorage` has no `novacode:questionnaire-completed` key is redirected to `/learn/questionnaire`
(same tab, no back-stack entry), and the questionnaire sets the flag right before it navigates to
`/learn` — so the expedition shows once per browser, not once per session. `?stage=advanced` — the
preview of the design's second state — deliberately bypasses the gate. The map then plays its entrance:
each hop of the route is drawn (SVG `pathLength=1` + `strokeDasharray=1`, `draw-route` 520ms) and each pin
pops in (`pop-in` 320ms) on a 180ms stagger starting at 120ms, choreography in `ROUTE_ANIMATION` in the
page. New motion tokens live in `index.css` next to the older ones; the `prefers-reduced-motion` guard
already flattens them and the `both` fill keeps the finished state. The two questionnaire frames the
questions 2 and 3 belong to (`110:3992`, `113:4644`) are still empty in the file — the step flow waits
for them.


### Deviations the user should know about
1. **IDE success output** (frame `125:7483`) carries the designer's placeholder
   `[Insert Succesfull Output] You May Continue`; the panel shows the real run result
   (`4 tests passed in 0.12s`) instead.
2. **StudyPod session** opens on the challenge stub `login_challenge.py` (frame `12:333`) rather than a
   hello-world template; the other languages keep their hello-world starter (no frame evidence).
3. **Profile tab 3** is labelled `Projects History` (the newer frames `99:2175/99:2676/99:3200`), not
   `Pinned Projects` (`96:1673`); the certified count in Quick Stats now derives from the data.
4. **Certificate panel** renders the frame's single three-card row (no section headings) because
   headings broke the drawn grid.
5. **Mission frame `84:3068` contradicts itself** (its sidebar marks Module 3 playing while the H1,
   micro-task and timestamp are Module 2's) — the active module comes from player state.
6. **No media file exists** for the lesson videos, so the players run a local ticker; the AI assistant
   answers from keyword-routed canned text.
7. **`feature/interactive-ui` is fully absorbed** — its overlays, motion tokens, `lib/interactions.ts`
   and the `/dev/interactions` gallery are on `main`; the branch's older StudyPod/IDE wiring is
   superseded and the branch can be deleted.
8. **Briefing card** takes frame `118:6053`'s copy over the older `113:5734` (`Fuel Extraction: NavBar`,
   not `2. Fuel Extraction: Navigation Bar`, and only `118:6053` draws the reward strip). Its pills
   follow the file's prototype: `Watch` → `Video_Career 118:5783` (`/learn/quick-check`) and `Code` →
   `IDE 14:2011` (`/ide`). See `docs/figma/prototype-interactions.md` for the interaction data and the
   motion contract (dialogs enter MOVE_IN/TOP/300 ms/EASE_OUT_BACK, close instantly).
9. **No dead ends** (audited route by route; every `button`/`role=button|tab|switch` clicked and its
   effect observed): `Enroll` on Explore navigated nowhere (`onClick={() => undefined}`), the auth
   form's submit only called `preventDefault`, the OAuth buttons and the landing's `Watch demo` had
   no handler at all. Now: `Enroll` → the lesson player (the file's `Course_Button` → `Main Video
   Page 43:2`) with an enrolment toast, the auth form validates (name/email/8+ characters, inline
   errors) and then runs a simulated check into the Dashboard (the file's `Button 45:1276/45:1282` →
   `4:577`), the OAuth buttons say they are not connected instead of pretending, and `Watch demo`
   opens the lesson player. `Submit for AI Audit` is `disabled` until a repo URL or zip is present —
   that is why it looks inert, and the helper line says so.
10. **`Run code` is a real check now**: the editor is editable and the verdict comes from
   `runSolution(buffer)` (missing `scores` parameter → 2/4, no `return` → 3/4, empty → "Nothing to
   run"), instead of the frame's success line printing after a fixed timer.

