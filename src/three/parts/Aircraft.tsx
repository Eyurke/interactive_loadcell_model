import { COLORS, SCENE, AIRCRAFT, POS, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'

/**
 * Simplified FMS 3000mm Fox glider, built from primitives:
 *   - long thin fuselage (cylinder + nose cone)
 *   - high-aspect-ratio straight wing (thin wide box, ~3 m span TO SCALE)
 *   - T-tail (vertical fin with the horizontal stab on top)
 *   - canopy + a strut down to the bracket pin
 *
 * The whole model PITCHES about the bracket pivot: the outer group sits at the
 * pivot, the inner group rotates by the angle of attack. Nose-up = +alpha.
 * Geometry uses SCENE.glider (scaled span); physics never uses these numbers.
 */
export function Aircraft({
  highlight,
  faded,
  explodedAmount = 0,
  pitchDeg = 0,
  showLabel = false,
}: PartVisual & { pitchDeg?: number; showLabel?: boolean }) {
  const g = SCENE.glider
  const span = AIRCRAFT.span * SCENE.spanScale
  const mountOffset = g.mountClearance + g.fuselageRadius // fuselage centerline above the pivot
  // Outer group at the (possibly exploded) pivot; inner group applies pitch.
  const outerPos = explodePos(POS.bracketPivot, EXPLODE.aircraft, explodedAmount)
  // Nose-up for +alpha → negative rotation about +Z (see config coordinate notes).
  const pitchRad = -(pitchDeg * Math.PI) / 180

  const fuse = partMaterial(COLORS.fuselage, { highlight, faded }, { metalness: 0.2, roughness: 0.5 })
  const wing = partMaterial(COLORS.wing, { highlight, faded }, { metalness: 0.2, roughness: 0.55 })
  const tail = partMaterial(COLORS.tail, { highlight, faded }, { metalness: 0.2, roughness: 0.55 })
  const canopy = partMaterial(COLORS.canopy, { highlight, faded }, { metalness: 0.1, roughness: 0.2, baseOpacity: 0.85, transparent: true })
  const strut = partMaterial(COLORS.sting, { highlight, faded }, { metalness: 0.7, roughness: 0.35 })

  // Fuselage spans x ∈ [-0.45, +0.65] → length 1.1, center +0.1. Tail aft, nose fwd.
  const fuseCenterX = 0.1
  const tailX = 0.6
  const wingX = -0.02 // quarter-chord roughly over the pivot

  return (
    <group position={outerPos}>
      <group rotation={[0, 0, pitchRad]}>
        {/* strut from bracket pin up to the fuselage */}
        <mesh position={[wingX, mountOffset / 2, 0]}>
          <cylinderGeometry args={[0.006, 0.006, mountOffset, 12]} />
          <meshStandardMaterial {...strut} />
        </mesh>

        {/* fuselage (cylinder laid along X) */}
        <mesh position={[fuseCenterX, mountOffset, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[g.fuselageRadius, g.fuselageRadius * 0.7, g.fuselageLength, 20]} />
          <meshStandardMaterial {...fuse} />
        </mesh>
        {/* nose cone */}
        <mesh position={[-0.45 - 0.05, mountOffset, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[g.fuselageRadius, 0.1, 20]} />
          <meshStandardMaterial {...fuse} />
        </mesh>

        {/* canopy */}
        <mesh position={[-0.16, mountOffset + g.fuselageRadius * 0.7, 0]} scale={[1, 0.6, 0.8]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshStandardMaterial {...canopy} />
        </mesh>

        {/* main wing — thin wide box, span along Z (TO SCALE) */}
        <mesh position={[wingX, mountOffset, 0]} castShadow>
          <boxGeometry args={[g.wingChord, g.wingThickness, span]} />
          <meshStandardMaterial {...wing} />
        </mesh>
        {/* faint wingtip caps for readability */}
        {[span / 2, -span / 2].map((z) => (
          <mesh key={z} position={[wingX, mountOffset, z]}>
            <boxGeometry args={[g.wingChord * 0.7, g.wingThickness * 1.2, 0.03]} />
            <meshStandardMaterial {...wing} />
          </mesh>
        ))}

        {/* T-tail: vertical fin */}
        <mesh position={[tailX, mountOffset + g.tail.vStabHeight / 2, 0]} castShadow>
          <boxGeometry args={[g.tail.vStabChord, g.tail.vStabHeight, 0.012]} />
          <meshStandardMaterial {...tail} />
        </mesh>
        {/* T-tail: horizontal stab on top of the fin */}
        <mesh position={[tailX, mountOffset + g.tail.vStabHeight, 0]} castShadow>
          <boxGeometry args={[g.tail.hStabChord, 0.012, g.tail.hStabSpan]} />
          <meshStandardMaterial {...tail} />
        </mesh>

        {showLabel && (
          <Label position={[wingX, mountOffset + 0.16, span * 0.18]} text="FMS 3000mm Fox" tone="accent" />
        )}
      </group>
    </group>
  )
}
