import { COLORS, SCENE, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'

/**
 * Fixed base frame — a ~0.4 m square of aluminum extrusion (thin boxes,
 * dark gray). Four perimeter rails + a center rail under the lift cells +
 * one upright post on the upstream (-X) side that anchors the drag cell.
 * This is the part that stays bolted to the wind-tunnel floor.
 */
export function BaseFrame({ highlight, faded, explodedAmount = 0 }: PartVisual) {
  const { footprint, railThickness: t, dragPostHeight } = SCENE.frame
  const half = footprint / 2
  const inset = half - t / 2 // rail centerline inside the footprint edge
  const mat = partMaterial(COLORS.extrusion, { highlight, faded }, { metalness: 0.5, roughness: 0.55 })
  const pos = explodePos([0, 0, 0], EXPLODE.baseFrame, explodedAmount)

  return (
    <group position={pos}>
      {/* two rails running along X (front/back edges) */}
      {[-inset, inset].map((z) => (
        <mesh key={`x${z}`} position={[0, t / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[footprint, t, t]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      {/* two rails running along Z (left/right edges) */}
      {[-inset, inset].map((x) => (
        <mesh key={`z${x}`} position={[x, t / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[t, t, footprint - 2 * t]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      {/* center rail along X — both lift cells stand on this */}
      <mesh position={[0, t / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[footprint - 2 * t, t, t]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* upstream upright post — fixed anchor for the drag cell */}
      <mesh position={[-inset, dragPostHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[t, dragPostHeight, t]} />
        <meshStandardMaterial {...mat} />
      </mesh>
    </group>
  )
}
