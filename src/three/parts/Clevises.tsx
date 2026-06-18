import { COLORS, SCENE, POS, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'

/**
 * Rod ends / clevises — the small connector cylinders that couple each load
 * cell to the plate or frame. They are what keep the cells loaded AXIALLY:
 * a rod end transmits pure tension/compression and no side load.
 *  - one on top of each lift cell (cell → plate)
 *  - one at each end of the drag cell (frame post → cell → plate)
 */
export function Clevises({ highlight, faded, explodedAmount = 0 }: PartVisual) {
  const { radius, height } = SCENE.clevis
  const mat = partMaterial(COLORS.clevis, { highlight, faded }, { metalness: 0.8, roughness: 0.3 })
  const [dx] = SCENE.dragCell.size

  const liftClevisY = POS.liftTopY + height / 2

  return (
    <group position={explodePos([0, 0, 0], EXPLODE.clevis, explodedAmount)}>
      {/* vertical rod ends atop each lift cell */}
      {[POS.liftA[0], POS.liftB[0]].map((x) => (
        <mesh key={x} position={[x, liftClevisY, 0]}>
          <cylinderGeometry args={[radius, radius, height, 14]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      {/* horizontal rod ends at the drag-cell ends (along X) */}
      {[SCENE.dragCell.x - dx / 2 - 0.012, SCENE.dragCell.x + dx / 2 + 0.012].map((x) => (
        <mesh key={`d${x}`} position={[x, SCENE.dragCell.y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.8, radius * 0.8, 0.026, 14]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
    </group>
  )
}
