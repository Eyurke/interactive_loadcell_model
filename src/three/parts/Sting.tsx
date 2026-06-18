import { COLORS, SCENE, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'

/**
 * Sting — the vertical rod that rises from the center of the moving plate and
 * carries the AoA bracket + aircraft. Everything above the plate (sting,
 * bracket, model) loads the plate, which loads the cells.
 */
export function Sting({
  highlight,
  faded,
  explodedAmount = 0,
  showLabel = false,
}: PartVisual & { showLabel?: boolean }) {
  const { radius, bottomY, height } = SCENE.sting
  const centerY = bottomY + height / 2
  const pos = explodePos([0, centerY, 0], EXPLODE.sting, explodedAmount)
  const mat = partMaterial(COLORS.sting, { highlight, faded }, { metalness: 0.75, roughness: 0.3 })

  return (
    <group position={pos}>
      {/* base flange clamping the sting to the plate */}
      <mesh position={[0, -height / 2 + 0.006, 0]}>
        <cylinderGeometry args={[radius * 2.4, radius * 2.4, 0.012, 18]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* the rod */}
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, height, 18]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {showLabel && <Label position={[radius + 0.05, 0, 0]} text="Sting" tone="accent" />}
    </group>
  )
}
