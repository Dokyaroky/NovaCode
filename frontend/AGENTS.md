# NovaCode frontend — conventions

React 19 + Vite 8 + TypeScript 6 + Tailwind 4 (`@tailwindcss/vite`), `react-router-dom` 7.
Design source: Figma file `m38I3VVhh1y7aR5r4QSvIs` ("Hackathon-UGM (Copy)"), one page `0:1`.
Import alias `@/*` → `src/*`. Fonts: Inter (all UI) + JetBrains Mono (code).

## Commands (run from `frontend/`)

- `npx tsc -b` — type check (must be silent). Never run a command whose text contains
  `vite` on its own line: the shell guard refuses it. `npm run build` and `npm run lint`
  are fine from the repo root (`npm run test` at the root runs backend tests + lint + tsc).
- `npm run lint` — oxlint.

## Design tokens (`src/index.css`, `@theme`)

Colours: `canvas #070b14 · shell #0f172a · surface #1e293b (cards) · rail #111b30 (sidebar/rail) ·
code #111827 · code-header #27364b · muted #334155`; ink `#ffffff / #f8fafc / #c4b5fd`;
accents `brand #f97316 (orange, primary CTA) · accent #8b5cf6 (violet) · success #10b981 ·
info #3b82f6`, code accents `#fb7185 #fbbf24`; tints `brand-tint · accent-tint · accent-tint-strong ·
success-tint` (rgba .15/.2).
Radii: `rounded-tile 12 · rounded-card 16 · rounded-pill 30`. Type: `text-hero/hero-sm/display/logo`
plus Tailwind's scale; mono body is `font-mono text-[15px]`.
Elevation: cards draw their 1px border as a **ring shadow** (`shadow-card = 0 0 0 1px rgba(255,255,255,.07)`),
never `border`. Buttons use `shadow-button`. Keep new surfaces on the same ring.
Spacing: 64 landing gutter · 24 app-shell padding · 24 card padding · 24 grid gap · 16 section gap.

## Primitives (`src/components/`)

`AppShell` (grid `288px | 1fr | rail`, rail optional, `railWidth 300|360`) · `SideNav` · `NovaLogo` ·
`UserCard` · `Button` (`primary|secondary|small|ghost|outline`, `size md|lg`) · `Card` · `IconTile`
(48/36/xs) · `StatusPill` · `ProgressBar` (12/8) · `Avatar` · `SectionHeader` · `CodeWindow` ·
`ListItem` · `NumberedList` · `Tabs` (`indicatorInset`) · `SkillRadar` · `StatRing` · `CodeWindow` ·
overlays `Modal · Drawer · Dropdown · Tooltip · Toast` (all portal into `document.body` via `Portal`,
shared hooks in `src/lib/interactions.ts`; `useToast()` is mounted once above the router in `main.tsx`).
Icons: `src/components/icons/index.tsx` exports React components (`stroke="currentColor"`, so they tint
with `text-*`). Fixed-colour art lives in `src/assets/**` as `.svg` imported by URL.

## Page rules

- A page = full-height screen inside `AppShell`. Never build a second shell.
- Shell columns clip: `lg:h-screen lg:grid-rows-[100%]` on `AppShell` keeps a long file scrolling inside
  its own box instead of stretching the page. Anything fixed-size inside a shell column needs `shrink-0`.
- Copy and lists live in typed modules under `src/data/*.ts` (`export interface X` + `export const Y: X[]`).
  Pages must not inline mock literals.
- Interactions must be real: buttons navigate / open a modal / toggle state, tabs switch panels, forms
  validate, disabled states explain themselves. No decorative control that pretends to work.
- States: loading (`aria-busy`, no spinners per the project's rule — text + progress bar), empty, error,
  validation, success, disabled all need an explicit visual, not just a happy path.
- Accessibility: semantic elements, `<button>` for actions, `<a>/<NavLink>` for navigation, labels tied to
  inputs, visible `focus-visible` ring, `aria-live` for async results, Escape closes overlays.
- Responsive: desktop fidelity at 1440 (the frames are 1440x960); below `lg` stack columns and drop
  decorative absolutes. Mobile layout is ours to invent — no mobile frames exist.
- Never hardcode a data URL or API key. Data access goes through `src/data/*` (mock) and `src/lib/api.ts`
  (backend boundary, currently unused). No `fetch` in a page.

## Visual verification

Compare the rendered page with its Figma frame by DOM measurement, not by eye:
`document.body.scrollWidth === innerWidth` (no horizontal overflow) and the frame's box numbers
(see the frame dump files under `docs/figma/frames/`). Screenshots can be unavailable in the
headless browser; measurement is the reliable check.
