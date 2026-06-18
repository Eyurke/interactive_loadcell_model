# Wind-Tunnel Force Balance — Interactive Build Guide

A single-page, interactive guide that walks a student through building a **3-axis
load-cell force balance** to measure **lift, drag, and pitching moment** on an
**FMS 3000mm Fox** RC glider in a wind tunnel.

Each of the 10 build steps pairs written instructions with a live **Three.js**
scene of the balance, built entirely from primitives. The final step computes
live (simulated) aerodynamics from the real equations as you move the airspeed
and angle-of-attack sliders.

![steps: overview → bench-test → frame → cells → plate → drag → sting → stops → calibrate → run]

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Build & preview the production bundle:

```bash
npm run build    # type-checks, then bundles to ./dist
npm run preview  # serves ./dist locally
```

Type-check only:

```bash
npm run typecheck
```

---

## Deploy to Vercel

This is a static SPA — any static host works. For **Vercel**:

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Vercel, **New Project → Import** the repo.
3. Vercel auto-detects Vite (settings are also pinned in [`vercel.json`](./vercel.json)):
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

Or from the CLI:

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

There is no backend and no environment configuration — everything runs in the
browser and progress is stored in `localStorage`.

---

## Tech stack

| Concern        | Choice |
| -------------- | ------ |
| Framework      | React 18 + TypeScript |
| Bundler        | Vite 5 |
| 3D             | Three.js via `@react-three/fiber` + `@react-three/drei` (`OrbitControls`, `Html`, `Grid`, `ContactShadows`, `Line`) |
| Styling        | Tailwind CSS (dark-slate theme, single cyan accent, monospace numerics) |
| Animation      | Framer Motion (step transitions, modal) |
| Persistence    | `localStorage` (checked steps + last-viewed step) |

All 3D geometry is built **from primitives in code** — no GLTF/model files.

---

## Project structure

```
.
├── index.html                 app shell
├── vite.config.ts             Vite config (outputs to ./dist)
├── tailwind.config.js         theme (colors, fonts, glow shadow)
├── vercel.json                deploy config (framework: vite, SPA rewrite)
├── public/favicon.svg
└── src/
    ├── main.tsx               React entry
    ├── App.tsx                layout, step state, keyboard nav, exploded tween
    ├── index.css              Tailwind + themed sliders/scrollbars
    │
    ├── config.ts          ★  ALL tweakable numbers: dimensions, colors,
    │                          explode offsets, derived positions
    ├── physics.ts         ★  the aerodynamic equations (q, L, D, Re, M, C_L, C_D)
    ├── types.ts               Step / ScenePreset / PartName / Controls
    │
    ├── hooks/
    │   └── useLocalStorage.ts progress persistence
    ├── steps/
    │   └── steps.tsx          the 10 steps' content (title/goal/instructions/…)
    │
    ├── components/            (DOM / UI)
    │   ├── TopBar.tsx         progress bar + Exploded + Reset camera + Shopping list
    │   ├── Sidebar.tsx        vertical stepper with persistent checkboxes
    │   ├── StepContent.tsx    text panel (Framer Motion transitions)
    │   ├── Callout.tsx        warning / why-this-matters boxes
    │   ├── StepControls.tsx   per-step sliders (pitch / airspeed / known mass)
    │   ├── LiveReadout.tsx    step-10 L/D/M/q/C_L/C_D/Re panel
    │   ├── ShoppingList.tsx   bill-of-materials modal + gotchas
    │   └── Viewport.tsx       R3F <Canvas> wrapper + orbit hint
    │
    └── three/                 (3D)
        ├── Scene.tsx          composes every part per step preset
        ├── CameraRig.tsx      smooth per-step camera fly-to + reset
        ├── Label.tsx          drei <Html> billboard label
        ├── ForceArrow.tsx     reusable labeled force arrow
        ├── partMaterial.ts    highlight-glow / fade-opacity helper + explode math
        └── parts/
            ├── BaseFrame.tsx       fixed extrusion frame + drag-cell post
            ├── LiftCell.tsx        vertical 50 kg S-beam (used ×2)
            ├── MovingPlate.tsx     floating semi-transparent plate
            ├── DragCell.tsx        horizontal 5 kg S-beam + drag arrow
            ├── Clevises.tsx        rod-end connectors
            ├── Sting.tsx           vertical sting
            ├── AoABracket.tsx      pitch pivot
            ├── Aircraft.tsx        glider (fuselage + 3 m wing + T-tail), pitches
            ├── OverloadStops.tsx   corner stop blocks
            ├── BenchSetup.tsx      step-2 tableau: cells + bridge + laptop + wiring
            ├── CalibrationRig.tsx  step-9 hanging masses + pulley + force arrows
            ├── Streamlines.tsx     step-10 animated airflow particles
            └── Wire.tsx            tube-geometry cable/string primitive
```

---

## How to tweak it

Everything you'd want to change lives in **two files**, both heavily commented.

### `src/config.ts` — dimensions, colors, layout

- **Coordinate convention** (documented at the top): `+X` downstream (airflow),
  `+Y` up, `+Z` spanwise. The two lift cells are spaced along `X` so the
  *difference* of their readings is the pitching moment.
- `SCENE.cellSpacing` is **`d`** (default `0.30 m`) — the headline number; it sets
  the pitching-moment arm `d/2`.
- `SCENE.frame`, `SCENE.plate`, `SCENE.sting`, `SCENE.glider`, … are all the
  physical dimensions in meters. Scene units **are** meters, so the 3.0 m wing is
  literally 3.0 units and dwarfs the 0.4 m frame — that's physically honest.
- `SCENE.spanScale` only changes how big the glider is **drawn**; the physics
  always uses the true `AIRCRAFT` numbers.
- `EXPLODE` — the direction each part travels in the exploded view.
- `COLORS` — the whole palette.

### `src/physics.ts` — the equations

Baked-in numbers (do not vary by accident):

- Air: `ρ = 1.225 kg/m³`, `μ = 1.81e-5 Pa·s`
- Aircraft: `b = 3.0 m`, `S = 0.744 m²`, `c = 0.248 m`, weight `≈ 45 N`, `AR = 12`, `e = 0.8`

Equations:

```
q  = ½ · ρ · V²                          dynamic pressure
L  = C_L · q · S                          lift
D  = C_D · q · S                          drag
Re = ρ · V · c / μ                        Reynolds number (mean chord)
C_D = 0.025 + C_L² / (π · AR · e)         parabolic drag polar
M  ≈ (F_B − F_A) · d/2                    pitching moment  (= L · e)
```

`C_L` model: `C_L ≈ 0.1·α` (α in degrees), clamped to a `~1.3` plateau at
`13–15°`, then a gentle post-stall drop. Tweak the curve via the `AERO` block in
`config.ts`.

**Expected envelope** (surfaced in the UI): lift up to `~340 N` at 25 m/s
(`~390 N` vertical including the model's `45 N` weight tare), drag only
`~15–23 N`, Reynolds `~170,000` at 10 m/s to `~340,000` at 20 m/s.

> ⚠️ The `C_L(α)` curve and the center-of-pressure model (`copOffset`, which
> drives the F_A/F_B split and the moment) are **deliberately simple teaching
> curves** so the readouts move plausibly. Replace them with measured data for
> real work — the comments mark exactly where.

---

## What each step shows in 3D

1. **Overview** — full assembly, slow auto-rotate.
2. **Bench-test electronics** — just the 3 cells + PhidgetBridge + laptop, wires as glowing tubes.
3. **Build fixed base** — base frame highlighted, rest faded.
4. **Mount lift cells** — two cells highlighted with vertical "axial load only" arrows.
5. **Install moving plate** — the plate animates *lowering* onto the cells.
6. **Install drag cell** — horizontal cell highlighted with an orange "drag / airflow" arrow.
7. **Sting + AoA bracket** — sting/bracket highlighted; an **AoA slider** pitches the aircraft (−5°…+20°).
8. **Overload stops + wiring** — stop blocks highlighted; slack service-loop wires shown.
9. **Calibrate** — hanging masses on the lift axis and over a pulley on the drag axis; green force arrows scale with the **known-mass slider** (`F = m·g`).
10. **Run the test** — animated airflow particles; a **live readout** of L, D, M, q, C_L, C_D, Re updating with the **airspeed (10–25 m/s)** and **AoA** sliders.

Global, on every step: an **Exploded view** toggle and a **Reset camera** button.

---

## Parts list & load-cell build guide

The **Parts & build** button (top bar) opens a two-tab reference, also editable in
[`src/components/ShoppingList.tsx`](./src/components/ShoppingList.tsx):

**Tab 1 — Bill of materials** (specific, buyable models; ~$1000 budget):

| Qty | Part & model | For | Est. price |
| --- | --- | --- | --- |
| 2× | **DYMH-103 S-beam load cell, 50 kg** | vertical lift axis (A + B) | $50–70 ea |
| 1× | **DYMH-103 S-beam load cell, 5 kg** | horizontal drag axis | $40–60 |
| 1× | **PhidgetBridge 4-Input 1046_0B** (USB, 4-ch bridge DAQ) | reads all 3 cells | $95 |
| 1× | **Matek ASPD-4525** (TE **MS4525DO**) + pitot + tubing | tunnel airspeed (I²C) | $38 |
| 1× | **Arduino Nano** | reads the I²C airspeed sensor → USB | $15–25 |
| ~6 m | **2020 T-slot aluminum extrusion** + brackets + T-nuts | base frame | $70–90 |
| 1× | **Aluminum tooling plate 300×300×6 mm** | moving plate | $25–35 |
| 6× | **Rod ends / heim joints** + studs & jam nuts | axial linkages | $25–35 |
| 1 set | **Slotted calibration masses (~10 kg)** | calibration (F = m·g) | $35–50 |
| 1× | **Pulley + braided line** | drag-axis calibration | $15 |
| 1 lot | Shielded cable, hookup wire, ferrules, heat-shrink | wiring | $20 |
| 1 lot | Fasteners, spare T-nuts, brackets, zip ties | assembly | $20 |
| | **Core build total** | | **~$530–700** |

Headroom to $1000: higher-grade S-beams (e.g. **AmCells STB-50**, ~$90 ea), a
spare 50 kg cell, a bench DMM, or a Phidget VINT hub.

**Gotchas:** (1) match the rod-end thread to each load-cell stud — DYMH-103 thread
varies with capacity, so read *your* datasheet; (2) match T-nut size to your
extrusion slot (2020 is 5 mm or 6 mm); (3) the MS4525DO is **I²C, not USB** — it
needs the Arduino to reach the laptop, while the PhidgetBridge is USB.

**Tab 2 — Build the load cells** (step-by-step): identify the 4 bridge wires
(red = Ex+, black = Ex−, green = Sig+, white = Sig−; or ohm them out — the
higher-resistance pair is excitation) → fit rod ends for axial load → wire each
cell to a PhidgetBridge channel (Ex pair → 5V/G, Sig pair → +/−) → configure
(Phidget Control Panel, gain ×128) → zero & check direction → shield &
strain-relieve → add the airspeed channel → calibrate.

**Tab 3 — Image credits** lists every reference photo with its author, license,
and source link.

> Prices are typical street prices (USD, mid-2020s) — verify at purchase.

### Real photos (LEGO-style)

Every step has a **"You'll need"** panel that calls out the parts and tools with
**real photos** (and a "view real photo ↗" link to the exact branded part's
vendor page). The component/tool photos live in [`public/photos/`](./public/photos)
and are openly-licensed images from **Wikimedia Commons** (CC0 / CC-BY / CC-BY-SA),
registered with attribution in [`src/photos.ts`](./src/photos.ts) and surfaced in
the modal's *Image credits* tab. To use your own build photos instead, just
replace the files in `public/photos/` (keep the same names) — no code changes
needed. The assembly itself is the photoreal-ish **3D render**, like a LEGO
instruction panel, driven by the step.

---

## Notes

- Progress (which steps are checked) and the last step you viewed persist in
  `localStorage` under the `wtfb.*` keys. Clear site data to reset.
- Keyboard: **←/→** move between steps (ignored while a slider/input is focused).
- The production JS bundle is ~330 KB gzipped — that's almost entirely Three.js,
  which is expected for a real-time 3D app.
