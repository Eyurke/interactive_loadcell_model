/**
 * config.ts — SINGLE SOURCE OF TRUTH for every tweakable number.
 * ----------------------------------------------------------------
 * Change a dimension here and the whole 3D scene + readouts follow.
 *
 * COORDINATE CONVENTION (right-handed, Y-up):
 *   +X = downstream  (air flows from -X toward +X)
 *   +Y = up
 *   +Z = spanwise    (toward the right wingtip)
 *
 * The two lift cells are spaced along X (the flow direction) so the
 * difference in their readings gives the PITCHING moment about the
 * lateral (spanwise, Z) axis — see physics.ts.
 *
 * UNITS: everything is SI. Scene units == meters. So the 3.0 m wing is
 * literally 3.0 units wide and dwarfs the 0.4 m balance frame — that is
 * physically honest. The camera simply frames whatever the step needs.
 */

// ---------------------------------------------------------------------------
// AIR PROPERTIES (sea-level standard) — used by the live aerodynamics readout
// ---------------------------------------------------------------------------
export const AIR = {
  rho: 1.225, // air density [kg/m^3]
  mu: 1.81e-5, // dynamic viscosity [Pa·s]
} as const

// ---------------------------------------------------------------------------
// AIRCRAFT — FMS 3000mm Fox RC glider (the model under test)
// These feed the REAL physics. They are independent of how big we *draw* the
// glider (see SPAN_SCALE under SCENE), so you can shrink the drawing without
// changing any computed force.
// ---------------------------------------------------------------------------
export const AIRCRAFT = {
  span: 3.0, // wingspan b [m]
  wingArea: 0.744, // reference wing area S [m^2]
  chord: 0.248, // mean aerodynamic chord c [m]
  massKg: 4.6, // flying mass [kg]
  weightN: 45, // flying weight ≈ 4.6 kg * 9.81 ≈ 45 N (tare on the lift cells)
  aspectRatio: 12, // AR ≈ b^2 / S ≈ 12
  oswald: 0.8, // span efficiency factor e (for the induced-drag term)
} as const

// ---------------------------------------------------------------------------
// LOAD CELLS — the sensors
// ---------------------------------------------------------------------------
export const CELLS = {
  liftRatingKg: 50, // each vertical S-beam cell: 50 kg
  liftCount: 2,
  dragRatingKg: 5, // the single horizontal S-beam cell: 5 kg
  dragCount: 1,
} as const

// ---------------------------------------------------------------------------
// TEST ENVELOPE — numbers we surface in the UI as "what to expect"
// ---------------------------------------------------------------------------
export const ENVELOPE = {
  airspeedMin: 10, // m/s — Run-the-test slider lower bound
  airspeedMax: 25, // m/s — Run-the-test slider upper bound
  aoaMin: -5, // deg — angle-of-attack slider lower bound
  aoaMax: 20, // deg — angle-of-attack slider upper bound
  peakLiftN: 340, // ~340 N lift at 25 m/s near stall
  dragRangeN: [15, 23] as [number, number], // drag stays small: ~15–23 N
  peakVerticalN: 390, // lift + 45 N model weight ≈ ~390 N total on the lift axis
  reAt10: 170_000, // Reynolds number at 10 m/s
  reAt20: 340_000, // Reynolds number at 20 m/s
} as const

// ---------------------------------------------------------------------------
// AERO MODEL COEFFICIENTS — the deliberately-simple demo curves
// (real wings need a wind-tunnel sweep; these just move plausibly)
// ---------------------------------------------------------------------------
export const AERO = {
  clPerDeg: 0.1, // lift-curve slope: C_L ≈ 0.1 * alpha (deg)
  clStallStart: 13, // deg — linear region ends here (C_L ≈ 1.3)
  clPlateauEnd: 15, // deg — flat peak between stallStart..plateauEnd
  clMax: 1.3, // peak C_L
  clPostStallSlope: 0.04, // C_L drops 0.04 per deg past the plateau (gentle stall)
  cd0: 0.025, // zero-lift (parasite) drag coefficient
  // induced drag denominator = pi * AR * e  (computed in physics.ts)
} as const

// ===========================================================================
// SCENE GEOMETRY — every dimension of the physical rig, in meters
// ===========================================================================
export const SCENE = {
  /**
   * SPAN_SCALE only affects how large the glider is DRAWN. The physics in
   * physics.ts always uses the true AIRCRAFT numbers. Set to e.g. 0.6 if you
   * want the wing to crowd the viewport less; leave at 1.0 for true scale.
   */
  spanScale: 1.0,

  ground: {
    gridSize: 6, // m — half-extent of the helper grid
    y: 0,
  },

  // --- d: the headline number. Spacing between the two lift cells, along X. ---
  cellSpacing: 0.3, // [m] "d" — drives the pitching-moment arm (d/2)

  // --- Fixed base frame: ~0.4 m square of aluminum extrusion ---
  frame: {
    footprint: 0.4, // [m] outer side length (square)
    railThickness: 0.03, // [m] extrusion cross-section (square profile)
    baseY: 0, // bottom rail sits on the ground
    // a single upright post on the upstream (-X) side anchors the drag cell:
    dragPostHeight: 0.15, // [m]
  },

  // --- Two vertical lift S-beam cells ---
  liftCell: {
    size: [0.035, 0.12, 0.035] as [number, number, number], // w,h,d block
    baseY: 0.03, // sits on top of the bottom rail (= railThickness)
    // X positions are ±cellSpacing/2; both at z = 0 (line support along flow)
  },

  // --- Horizontal drag S-beam cell (smaller) ---
  dragCell: {
    size: [0.09, 0.028, 0.028] as [number, number, number], // long axis along X
    x: -0.185, // upstream side, between frame post and plate edge
    y: 0.12,
    z: 0,
  },

  // --- Moving plate: floats on the two lift cells, touches nothing else ---
  plate: {
    size: [0.34, 0.012, 0.22] as [number, number, number], // w(X), thickness(Y), d(Z)
    y: 0.175, // center height (rests on the clevises atop the lift cells)
  },

  // --- Clevis / rod-end connectors (small cylinders) ---
  clevis: {
    radius: 0.012,
    height: 0.03,
  },

  // --- Sting: vertical rod from plate center up to the AoA bracket ---
  sting: {
    radius: 0.009,
    bottomY: 0.181, // top face of the plate
    height: 0.2,
  },

  // --- Angle-of-attack bracket atop the sting (the pitch pivot) ---
  bracket: {
    size: [0.05, 0.035, 0.05] as [number, number, number],
    // pivot height = sting.bottomY + sting.height + half bracket
  },

  // --- Overload stop blocks near the plate corners (step 8) ---
  stops: {
    size: [0.03, 0.02, 0.03] as [number, number, number],
    gap: 0.004, // intentional clearance so they only catch on overload
  },

  // --- Glider drawing dimensions (scaled by spanScale) ---
  glider: {
    fuselageLength: 1.1, // [m] drawn fuselage length (the real one is longer; trimmed for framing)
    fuselageRadius: 0.028,
    wingChord: 0.248, // matches mean chord
    wingThickness: 0.02,
    // span is AIRCRAFT.span * spanScale (applied in the component)
    tail: {
      hStabSpan: 0.5,
      hStabChord: 0.12,
      vStabHeight: 0.18,
      vStabChord: 0.13,
    },
    // vertical offset of the fuselage centerline above the bracket pivot
    mountClearance: 0.03,
  },
} as const

// ---------------------------------------------------------------------------
// DERIVED POSITIONS — computed once so every component agrees on placement.
// (Kept here, next to the dimensions they depend on.)
// ---------------------------------------------------------------------------
const liftTopY = SCENE.liftCell.baseY + SCENE.liftCell.size[1]
const bracketPivotY = SCENE.sting.bottomY + SCENE.sting.height + SCENE.bracket.size[1] / 2

export const POS = {
  liftA: [-SCENE.cellSpacing / 2, SCENE.liftCell.baseY, 0] as [number, number, number], // upstream
  liftB: [+SCENE.cellSpacing / 2, SCENE.liftCell.baseY, 0] as [number, number, number], // downstream
  liftTopY,
  plateCenter: [0, SCENE.plate.y, 0] as [number, number, number],
  dragCell: [SCENE.dragCell.x, SCENE.dragCell.y, SCENE.dragCell.z] as [number, number, number],
  stingTopY: SCENE.sting.bottomY + SCENE.sting.height,
  bracketPivot: [0, bracketPivotY, 0] as [number, number, number],
} as const

// ---------------------------------------------------------------------------
// EXPLODE OFFSETS — direction each part travels when explodedAmount goes 0→1.
// Multiply by explodedAmount in each component. Tuned so the assembly fans out
// vertically (stack order) with cells splaying along the flow axis.
// ---------------------------------------------------------------------------
export const EXPLODE = {
  baseFrame: [0, 0, 0] as [number, number, number], // anchor — stays put
  liftA: [-0.06, -0.02, 0] as [number, number, number],
  liftB: [0.06, -0.02, 0] as [number, number, number],
  dragCell: [-0.12, 0, 0] as [number, number, number],
  clevis: [0, 0.05, 0] as [number, number, number],
  plate: [0, 0.12, 0] as [number, number, number],
  sting: [0, 0.26, 0] as [number, number, number],
  bracket: [0, 0.4, 0] as [number, number, number],
  aircraft: [0, 0.56, 0] as [number, number, number],
  stops: [0, 0.12, 0] as [number, number, number],
} as const

// ---------------------------------------------------------------------------
// MATERIAL COLORS — central palette so the look is consistent & tweakable
// ---------------------------------------------------------------------------
export const COLORS = {
  extrusion: '#39404d', // dark gray aluminum extrusion
  cell: '#c7ccd3', // silver S-beam body
  cellAccent: '#9aa1ab',
  plate: '#86b6d6', // light blue aluminum plate (rendered semi-transparent)
  clevis: '#8d939c',
  sting: '#9aa1ab',
  bracket: '#b3b9c2',
  fuselage: '#e9ebee',
  wing: '#dde2e8',
  tail: '#dde2e8',
  canopy: '#2b3a4a',
  bridgeBox: '#1f2a3a', // USB bridge / PhidgetBridge box
  laptop: '#2a2f3a',
  laptopScreen: '#0e7490',
  accent: '#22d3ee', // single accent (cyan)
  emissive: '#22d3ee',
  arrowLift: '#22d3ee',
  arrowDrag: '#f97316', // orange for drag/airflow
  arrowWeight: '#a3e635', // lime for calibration weight
  streamline: '#38bdf8',
  // wiring colors (excitation / signal)
  wireRed: '#ef4444',
  wireBlack: '#1f2937',
  wireGreen: '#22c55e',
  wireWhite: '#e5e7eb',
} as const

// Convenience: half the cell spacing = the pitching-moment arm d/2
export const MOMENT_ARM = SCENE.cellSpacing / 2
