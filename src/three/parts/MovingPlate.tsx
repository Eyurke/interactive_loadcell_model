import { COLORS, SCENE, POS, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'

/**
 * Moving plate — the floating platform that rides on top of the two lift cells
 * and carries the sting + aircraft. Drawn as a light-blue, semi-transparent
 * aluminum slab. It must touch ONLY the cells; everything else is clearance.
 *
 * `dropOffset` raises the plate (animated 0.16→0 in step 5 as it "lowers on").
 */
export function MovingPlate({
  highlight,
  faded,
  explodedAmount = 0,
  showLabel = false,
}: PartVisual & { showLabel?: boolean }) {
  const [w, t, d] = SCENE.plate.size
  const pos = explodePos(POS.plateCenter, EXPLODE.plate, explodedAmount)
  const mat = partMaterial(COLORS.plate, { highlight, faded }, {
    metalness: 0.4,
    roughness: 0.25,
    baseOpacity: 0.6, // semi-transparent so you can see the cells beneath
    transparent: true,
  })

  return (
    <group position={pos}>
      <mesh castShadow>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* a thin solid rim makes the transparent plate read as a real edge */}
      <mesh>
        <boxGeometry args={[w + 0.002, t * 0.5, d + 0.002]} />
        <meshStandardMaterial
          {...partMaterial(COLORS.plate, { highlight, faded }, { metalness: 0.5, roughness: 0.3, baseOpacity: 0.9, transparent: true })}
          wireframe
        />
      </mesh>
      {showLabel && <Label position={[w / 2 + 0.04, 0.02, 0]} text="Moving plate" tone="accent" />}
    </group>
  )
}
