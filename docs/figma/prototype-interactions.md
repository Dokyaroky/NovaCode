# Prototype interactions — Figma `m38I3VVhh1y7aR5r4QSvIs` (page `0:1`)

Extracted **from the file's prototype data**, not from screenshots: `use_figma` (Figma Plugin API)
walking `node.reactions` over the whole page. 7 403 nodes, **313 nodes carry reactions, 495 actions**.

Reproduce this file, not a guess: run the same walk again after the designer edits the prototype.
The Figma MCP metadata/screenshot tools do **not** expose interactions, and neither does
`get_design_context` — only the Plugin API does.

## 0. How to re-extract

`use_figma` → read-only script, `fileKey = m38I3VVhh1y7aR5r4QSvIs`, `skillNames = resource:figma-use`:

```js
const page = figma.root.children[0]
await figma.setCurrentPageAsync(page)
for (const n of page.findAll(() => true)) {
  const rx = n.reactions // [{ trigger: {type, timeout?}, actions: [{type, destinationId, navigation, transition}] }]
  if (rx.length) console.log(n.id, n.name, JSON.stringify(rx)) // `return`, not console — see the skill
}
```

Two facts that cost a round each:

- `transition.duration` is in **seconds** (`0.3` = 300 ms, `0.10000000149…` = 100 ms).
- The return value is capped at 20 KB — aggregate or page it; 495 raw actions are ~147 KB.
- Legacy `node.transitionNodeID` / `transitionDuration` / `transitionEasing` **throw** on `INSTANCE`
  nodes ("no such property"); read `reactions` only.

## 1. Global motion rules (what the file actually uses)

| Behaviour | Transition | Duration | Easing |
|---|---|---|---|
| Screen → screen, default (`ON_CLICK`) | SMART_ANIMATE | 300 ms | EASE_OUT |
| Button-ish hops (auth, dashboard quick links, IDE_4→IDE_5) | SMART_ANIMATE | 300 ms / **100 ms** | EASE_OUT_BACK |
| Dialog / card overlays (`navigation: OVERLAY`) | **MOVE_IN, direction TOP** | 300 ms | EASE_OUT_BACK |
| Overlay close (`Button - Close mission briefing`) | **CLOSE, no transition** | — | — |
| StudyPod → loading screen | DISSOLVE | 300 ms | EASE_OUT |
| Questionnaire_2 → _3, FuelExpedition → ending | DISSOLVE | 100 ms | EASE_OUT |
| Component hover (`MOUSE_ENTER` → Variant2) | SMART_ANIMATE | 300 ms | EASE_OUT (nav) / EASE_OUT_BACK (buttons) |
| Component un-hover (`MOUSE_LEAVE` → Default) | SMART_ANIMATE | 300 ms | same as the entry |
| Landing `SignUp_button` → Sign Up | **none** (no transition) | — | — |

Trigger census: `ON_CLICK` 259 · `MOUSE_ENTER` 196 · `AFTER_TIMEOUT` 18 · `MOUSE_LEAVE` 15.
Transition census: SMART_ANIMATE 300 ms EASE_OUT **439** (the workhorse), SMART_ANIMATE 300 ms
EASE_OUT_BACK 35, 100 ms variants 6, DISSOLVE 3, MOVE_IN TOP 4, no transition 7.
No custom cubic-bézier appears anywhere — every easing is a named Figma curve.

## 2. Screen flow (prototype destinations)

```
Landing    SignUp_button                 → Sign Up 4:215            (no transition)
           Button (hero/nav)             → hover Variant2/Variant3   (300ms EASE_OUT_BACK)
Login      Tab 18:2268                   → Sign Up 4:215             (300ms BACK)
           Button 45:1282                → Dashboard 4:577           (300ms BACK)
Sign Up    Tab 4:266                     → Login 18:2221             (300ms BACK)
           Button 45:1276                → Dashboard 4:577           (300ms BACK)
Dashboard  Button 4:675                  → Main Video Page 43:2      (100ms BACK)
           Button 4:706 / 4:721          → IDE_4 125:7358            (100ms BACK)
           SideNav items                 → hover Variant2, click the item's own sidebar variant
Studypod   Article 12:74                 → Studypod_2 91:4440        (300ms EASE_OUT)
Studypod_2 Button 91:4537                → Loading Screen 12:269     (DISSOLVE 300ms EASE_OUT)
Studypod_Matched Button 106:3646         → End_Layout 106:3843       OVERLAY MOVE_IN TOP 300ms BACK
End_Layout Button 106:3855 / 106:3858    → Studypod_Matched / Studypod (300ms EASE_OUT)
Explore    Course_Button 84:2391         → Main Video Page 43:2      (300ms EASE_OUT)
Projects   SignUp_button 84:3276         → Projects_2 87:3682        (300ms EASE_OUT)
           Button 87:3840                → Projects_3 91:4004        (300ms EASE_OUT)
           ContinueLater 91:3994/122:6867/125:7062 → Projects 14:1307  (300ms EASE_OUT)
           Button 125:7090               → Projects_3 91:4004        (300ms EASE_OUT)
           Button 122:6920               → Projects_2 125:7001       (300ms BACK)
Projects_4 SignUp_button 91:4432         → Projects_2 87:3682        (300ms EASE_OUT)
Profile    Tab 99:2271/99:2273/99:2275   → Course-History / Pinned / Settings (300ms EASE_OUT)
           (and the same three tabs back from every profile variant)
Main Video Button 43:73 / 84:2738 / 84:2906 / 84:3074 → Explore 81:1572 (300ms BACK)
           Container 43:91               → Main Video Page 84:2732   (300ms EASE_OUT)
IDE        Button 14:2177                → IDE 84:3548               (300ms EASE_OUT)
IDE_4      Button 125:7477               → IDE_5 125:7483            (300ms EASE_OUT)
Questionnaire Button_GenerateLearningPath 78:1564 → Questionnaire_2 110:3992 (300ms EASE_OUT)
Career Path Button 45:944                → Questionnaire 43:248      (300ms EASE_OUT)
           Button_StartExtraction 113:5724 → FuelExpedition 113:5734  OVERLAY MOVE_IN TOP 300ms BACK
Career Path_2 Button 118:5976            → Questionnaire 43:248      (300ms EASE_OUT)
           Button_StartExtraction 118:5994 → FuelExpedition2 118:6053 OVERLAY MOVE_IN TOP 300ms BACK
FuelExpedition  Button 113:5755          → Video_Career 118:5783     (300ms EASE_OUT)   ← "Watch"
FuelExpedition2 Button 118:6074          → Video_Career 118:5783     (300ms EASE_OUT)   ← "Watch"
                Button 118:6110          → IDE 14:2011               (300ms EASE_OUT)   ← "Code"
Video_Career Button 118:5789            → Career Path 45:764        (300ms EASE_OUT)
                Button_GenerateLearningPath 118:5892 → Career Path_2 118:5899 (300ms EASE_OUT)
CareerPath3 Text 122:6656                → Projects_2 122:6806       (300ms BACK)
```

Map to the app's routes with `docs/frontend-rebuild-plan.md` §3. Two things worth knowing:
`Video_Career 118:5783` is our `/learn/quick-check` (theory video + quick check), `IDE 14:2011` is
`/ide`, so the briefing's **Watch → `/learn/quick-check`, Code → `/ide`**.

One reaction is dead: `Button_Explore` (instance `I69:1121;63:1260`) has an `ON_CLICK` action with
`destinationId: null` — an unassigned interaction in the component, not a behaviour to copy.

## 3. Auto-advance chains (`AFTER_TIMEOUT`, 18 reactions)

The prototype plays these; they are demo choreography, not user actions. Delay is
`trigger.timeout` in seconds.

```
Questionnaire 43:248  ──(click Generate)──▶ Questionnaire_2 110:3992   [300ms EASE_OUT]
Questionnaire_2       ──3.0 s──▶ Questionnaire_3 113:4644              [DISSOLVE 100ms EASE_OUT]
Questionnaire_3       ──13.0 s──▶ Career Path 45:764                   [100ms EASE_OUT]
CareerPath Ending 125:7266 ──3.0 s──▶ Questionnaire 43:248             [100ms EASE_OUT_BACK]

StudyPod loading 12:269 ─0.10s▶ 91:4546 ─0.05s▶ 91:4568 ─0.05s▶ 91:4641 ─0.10s▶ 91:4590
                        ─0.10s▶ 91:4613 ; Shell 91:4614 ─0.10s▶ Studypod_Matched Peers 12:333
                        (every step SMART_ANIMATE 300ms EASE_OUT)

Main Video 84:2732 ─0.8s▶ 84:2900 ─0.8s▶ 84:3068                        [300ms EASE_OUT]
IDE 84:3548 ─0.8s▶ CareerPath3 122:6135 [EASE_OUT] ─0.8s▶ 122:6291 [300ms EASE_IN_AND_OUT]
            ─0.8s▶ 122:6444 [300ms EASE_OUT_BACK]
IDE_5 125:7483 ─0.8s▶ Dashboard 4:577                                   [100ms EASE_OUT_BACK]
Projects_3 91:4004 ─0.8s▶ Projects_4 91:4222                            [300ms EASE_OUT]
Projects_2 125:7001 ─0.8s▶ FuelExpedition 125:7213 (OVERLAY, MOVE_IN TOP, 300ms BACK)
FuelExpedition 125:7213 ─1.2s▶ CLOSE + CareerPath Ending 125:7266       [DISSOLVE 100ms EASE_OUT]
```

## 4. Component variants (15 sets, each with a single `Property 1`)

| Set | id | Variants |
|---|---|---|
| `SideNav` | 63:1341 | Default 57:834 + Variant2…Variant6 63:1342/1403/1464/1524/1586 (one per active route) |
| `Button_CareerPath` | 52:679 | Default 52:678 · Variant2 52:680 (hover) · Variant3 57:904 |
| `Button_Explore` | 60:1009 | Default 60:1010 · Variant2 60:1015 (hover) · Variant3 60:1020 |
| `Button_Projects` | 60:1040 | Default 60:1041 · Variant2 60:1046 · Variant3 60:1051 |
| `Button_StudyPod` ×2 | 60:1068, 60:1099 | Default/Variant2/Variant3 each |
| `Button_Dashboard` | 57:978 | Default 57:979 · Variant2 57:984 · Variant3 57:989 |
| `Button_StartExtraction` | 113:5697 | Default 113:5696 · Variant2 113:5698 (hover, 300ms EASE_OUT_BACK) |
| `Button_GenerateLearningPath` | 78:1536 | Default 78:1535 · Variant2 78:1537 |
| `ContinueLater` | 84:3512 | Default 84:3511 · Variant2 84:3513 |
| `Course_Button` | 81:2175 | Default 81:2174 · Variant2 84:2299 |
| `Section - Career goals` | 78:819 | 6 variants: Default + the five selected goal cards (78:820/891/1231/1306/1382) |
| `SignUp_button` | 45:1021 | Default 45:1020 · Variant2 45:1022 |
| `Login page` | 45:1085 | Default · Variant2 45:1086 · Variant3 45:1132 |
| `Button` | 45:1230 | Default 45:1229 · Variant2 45:1231 |

Hover/un-hover is the whole pattern: `MOUSE_ENTER` → Variant2, `MOUSE_LEAVE` → Default, both 300 ms.
The sidebar's `ON_CLICK` additionally swaps the **SideNav** set to the clicked route's variant
(e.g. Explore → 63:1403), which is the app's active-nav state.

## 5. What the app reproduces, and what it cannot

Reproduced (values are the file's): 300 ms / EASE_OUT on nav + tabs, 300 ms / EASE_OUT_BACK on
buttons and pills (`--ease-out-back`, `duration-300`), dialogs enter with `animate-move-in-top`
(MOVE_IN / TOP / 300 ms / EASE_OUT_BACK) and close instantly (CLOSE), the StudyPod hand-off and the
questionnaire state changes use DISSOLVE.

Not reproducible from the prototype data — do not invent these:

1. **SMART_ANIMATE is a Figma morph**, not a CSS transition: it interpolates shared layers between
   two frames. The app approximates it with the matching duration/easing on whatever property
   changes (colour, background, ring). There is no such thing as a faithful CSS smart-animate for
   a page→page morph; a cross-fade is the closest honest stand-in, and page-level morphs are not
   implemented.
2. **MOVE_IN travel distance is not in the API** — only type, direction, duration and easing are.
   The app uses a 24 px offset; the direction and timing are the file's.
3. **`overlayRelativePosition` is unusable**: it is reported in the trigger's nested coordinate
   space (Career Path's briefing says `x: -663.27, y: -594`), so it cannot place the overlay. The
   app centres dialogs, which is how the design presents them.
4. **Playback cannot be watched**: the prototype's own preview only runs inside Figma. To judge
   timing, load the file and press Present, or export the flow — the app's values come from the
   settings above, not from watching it move.
5. **The `AFTER_TIMEOUT` chains in §3 are not wired** except where a screen genuinely auto-advances
   (the StudyPod loading steps, the storyboard hops). Wire them only on request: several are demo
   devices (the Main Video Page chain is one screen's three states, the IDE 0.8 s hops are a
   storyboard), not product behaviour.
6. **The StudyPod loading ring is a deliberate, user-approved deviation**: the file steps six ring
   variants every 50–100 ms (a strobe), the app runs one `spin-momentum` revolution per 1.6 s. The
   screen's entrance uses the file's DISSOLVE (300 ms, EASE_OUT) instead.
