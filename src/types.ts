import type { ReactNode } from 'react'
import type { PhotoKey } from './photos'

/** Named scene "presets" — one per build step. The 3D <Scene> switches on this. */
export type ScenePreset =
  | 'overview' // 1 — full assembly, slow auto-rotate
  | 'bench' // 2 — 3 cells + bridge box + laptop + wiring
  | 'base' // 3 — base frame only, highlighted
  | 'liftCells' // 4 — base + 2 lift cells + axial-load arrows
  | 'plate' // 5 — plate lowers onto the cells
  | 'dragCell' // 6 — horizontal drag cell + drag arrow
  | 'sting' // 7 — sting + AoA bracket + pitch slider
  | 'stops' // 8 — overload stops + slack wiring
  | 'calibrate' // 9 — hanging weights on lift & drag axes
  | 'run' // 10 — airflow particles + live readouts

/** Every named part of the rig (for highlight / fade / visibility control). */
export type PartName =
  | 'baseFrame'
  | 'liftA'
  | 'liftB'
  | 'dragCell'
  | 'plate'
  | 'clevises'
  | 'sting'
  | 'bracket'
  | 'aircraft'
  | 'stops'

/** Interactive control state shared between the UI sliders and the 3D scene. */
export interface Controls {
  explodedAmount: number // 0..1 global exploded view
  pitchDeg: number // AoA slider (steps 7 & 10)
  airspeed: number // m/s (step 10)
  calMass: number // kg known mass (step 9)
  resetCameraNonce: number // bump to re-trigger a camera fly-to
  showLabels: boolean // in-scene billboard text labels visible
}

/** A single callout (warning / tip / why-this-matters) shown beside a step. */
export interface Callout {
  kind: 'warning' | 'why'
  title: string
  body: ReactNode
}

/** A part or tool needed for a step (LEGO-style "you'll need" callout). */
export interface NeedItem {
  qty?: string // e.g. "2×" (omit for tools)
  name: string
  photo?: PhotoKey // licensed reference photo
  vendor?: string // link to the exact branded part's product page
  note?: string // small clarifier (spec, size…)
}

/** Full definition of one build step. */
export interface Step {
  id: number
  shortTitle: string // sidebar label
  title: string // main heading
  goal: string // one-line goal
  scene: ScenePreset
  heroPhoto?: PhotoKey // large reference photo for the step
  needParts?: NeedItem[] // parts consumed this step
  needTools?: NeedItem[] // tools used this step
  instructions: ReactNode[] // numbered sub-instructions (granular, LEGO-style)
  callouts: Callout[]
  why: ReactNode // "why this matters"
}
