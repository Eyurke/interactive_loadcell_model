/**
 * physics.ts — the real aerodynamics behind the live readout (step 10) and the
 * calibration arrows (step 9). Every formula is the one named in the brief.
 *
 * IMPORTANT: these use the TRUE aircraft numbers from config.ts (AIRCRAFT),
 * never the drawn/scaled geometry. Tweak coefficients in AERO, not here.
 */
import { AIR, AIRCRAFT, AERO, MOMENT_ARM } from './config'

/** Dynamic pressure  q = ½ ρ V²   [Pa] */
export function dynamicPressure(V: number): number {
  return 0.5 * AIR.rho * V * V
}

/** Reynolds number  Re = ρ V c / μ   (based on mean chord) */
export function reynolds(V: number): number {
  return (AIR.rho * V * AIRCRAFT.chord) / AIR.mu
}

/**
 * Lift coefficient as a function of angle of attack (degrees).
 * Linear C_L ≈ 0.1·α up to ~13°, a short plateau at C_L≈1.3 (13–15°), then a
 * gentle drop to suggest stall. Deliberately simple — a teaching curve.
 */
export function liftCoefficient(alphaDeg: number): number {
  const { clPerDeg, clStallStart, clPlateauEnd, clMax, clPostStallSlope } = AERO
  if (alphaDeg <= clStallStart) {
    // linear region (also handles negative alpha → negative C_L)
    return clPerDeg * alphaDeg
  }
  if (alphaDeg <= clPlateauEnd) {
    // flat peak near max lift
    return clMax
  }
  // post-stall: ease back down so the readout visibly "drops"
  return clMax - clPostStallSlope * (alphaDeg - clPlateauEnd)
}

/**
 * Parabolic drag polar:  C_D = C_D0 + C_L² / (π · AR · e)
 * AR = 12, e = 0.8 baked into AIRCRAFT.
 */
export function dragCoefficient(cl: number): number {
  const induced = (cl * cl) / (Math.PI * AIRCRAFT.aspectRatio * AIRCRAFT.oswald)
  return AERO.cd0 + induced
}

/** Lift force  L = C_L · q · S   [N] */
export function liftForce(cl: number, q: number): number {
  return cl * q * AIRCRAFT.wingArea
}

/** Drag force  D = C_D · q · S   [N] */
export function dragForce(cd: number, q: number): number {
  return cd * q * AIRCRAFT.wingArea
}

/**
 * Center-of-pressure offset e from the balance center, along the flow axis [m].
 * DEMO MODEL ONLY: a cambered wing's CoP sits aft at low α and creeps forward
 * as α grows. We map that to a few-centimeter offset so the moment readout and
 * the F_A/F_B split move plausibly. Replace with measured data for real work.
 */
export function copOffset(alphaDeg: number): number {
  // ~0.25c aft at α=0, marching forward ~0.012c per degree.
  const frac = 0.25 - 0.012 * alphaDeg
  return AIRCRAFT.chord * frac
}

/**
 * Split the total lift between the upstream (A) and downstream (B) lift cells.
 * Statics for a load L applied at offset e on supports ±d/2 apart:
 *   F_A = L/2 − L·e/d ,  F_B = L/2 + L·e/d
 * The 45 N model weight is an equal tare on both cells (CoG ≈ center).
 */
export function liftSplit(L: number, alphaDeg: number): { FA: number; FB: number } {
  const e = copOffset(alphaDeg)
  const d = MOMENT_ARM * 2 // = SCENE.cellSpacing
  const half = L / 2
  const delta = (L * e) / d
  const tarePerCell = AIRCRAFT.weightN / 2
  return {
    FA: half - delta + tarePerCell, // upstream cell total reading
    FB: half + delta + tarePerCell, // downstream cell total reading
  }
}

/**
 * Pitching moment about the balance center:
 *   M ≈ (F_B − F_A) · d/2
 * Equivalent to L·e. Returned in N·m. (Tare cancels in the difference.)
 */
export function pitchMoment(FA: number, FB: number): number {
  return (FB - FA) * MOMENT_ARM
}

/** Total vertical load carried by the lift axis = lift + model weight [N]. */
export function verticalLoad(L: number): number {
  return L + AIRCRAFT.weightN
}

export interface AeroState {
  V: number // airspeed [m/s]
  alpha: number // angle of attack [deg]
  q: number // dynamic pressure [Pa]
  cl: number // lift coefficient
  cd: number // drag coefficient
  L: number // lift [N]
  D: number // drag [N]
  Re: number // Reynolds number
  M: number // pitching moment [N·m]
  FA: number // upstream lift-cell reading [N]
  FB: number // downstream lift-cell reading [N]
  vertical: number // total vertical load incl. weight [N]
}

/** One call computes the entire live state for the readout panel. */
export function computeAero(V: number, alphaDeg: number): AeroState {
  const q = dynamicPressure(V)
  const cl = liftCoefficient(alphaDeg)
  const cd = dragCoefficient(cl)
  const L = liftForce(cl, q)
  const D = dragForce(cd, q)
  const Re = reynolds(V)
  const { FA, FB } = liftSplit(L, alphaDeg)
  const M = pitchMoment(FA, FB)
  return { V, alpha: alphaDeg, q, cl, cd, L, D, Re, M, FA, FB, vertical: verticalLoad(L) }
}
