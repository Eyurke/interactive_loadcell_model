import { COLORS, SCENE, POS, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'

/**
 * Angle-of-attack bracket — the pivoting clevis on top of the sting that sets
 * the model's pitch. Drawn as two side cheeks + a pin along the spanwise (Z)
 * axis; the aircraft rotates about that pin. The PIN axis is the pitch axis.
 */
export function AoABracket({
  highlight,
  faded,
  explodedAmount = 0,
  showLabel = false,
}: PartVisual & { showLabel?: boolean }) {
  const [w, h, d] = SCENE.bracket.size
  const pos = explodePos(POS.bracketPivot, EXPLODE.bracket, explodedAmount)
  const mat = partMaterial(COLORS.bracket, { highlight, faded }, { metalness: 0.7, roughness: 0.35 })
  const pinMat = partMaterial(COLORS.clevis, { highlight, faded }, { metalness: 0.85, roughness: 0.25 })

  return (
    <group position={pos}>
      {/* two cheeks straddling the pitch pin */}
      {[-d / 2, d / 2].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[w, h, d * 0.18]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      {/* pitch pin (spanwise, Z) — the rotation axis */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, d * 1.15, 14]} />
        <meshStandardMaterial {...pinMat} />
      </mesh>
      {showLabel && <Label position={[0, h / 2 + 0.04, 0]} text="AoA bracket (pitch pivot)" tone="accent" />}
    </group>
  )
}
