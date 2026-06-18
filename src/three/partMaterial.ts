import { COLORS } from '../config'

export interface PartVisual {
  /** emissive glow to call attention to this part */
  highlight?: boolean
  /** dim this part because another part is the focus */
  faded?: boolean
  /** 0..1 global exploded-view amount */
  explodedAmount?: number
}

/**
 * Returns meshStandardMaterial props that respond to highlight/fade state.
 * Spread onto <meshStandardMaterial {...partMaterial(color, vis)} />.
 *
 *  - highlight → cyan emissive glow
 *  - faded     → drop opacity so the focus part reads clearly
 */
export function partMaterial(
  color: string,
  vis: PartVisual,
  opts?: { metalness?: number; roughness?: number; baseOpacity?: number; transparent?: boolean },
) {
  const metalness = opts?.metalness ?? 0.55
  const roughness = opts?.roughness ?? 0.45
  const baseOpacity = opts?.baseOpacity ?? 1
  const opacity = vis.faded ? baseOpacity * 0.13 : baseOpacity
  const transparent = (opts?.transparent ?? false) || opacity < 1
  return {
    color,
    metalness,
    roughness,
    transparent,
    opacity,
    emissive: vis.highlight ? COLORS.emissive : '#000000',
    emissiveIntensity: vis.highlight ? 0.5 : 0,
  }
}

/** Apply a per-part explode offset scaled by explodedAmount. */
export function explodePos(
  base: readonly [number, number, number],
  offset: readonly [number, number, number],
  amount = 0,
): [number, number, number] {
  return [base[0] + offset[0] * amount, base[1] + offset[1] * amount, base[2] + offset[2] * amount]
}
