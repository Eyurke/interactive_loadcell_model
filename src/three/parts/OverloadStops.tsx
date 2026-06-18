import { COLORS, SCENE, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'

/**
 * Overload stops — small hard blocks fixed to the frame just clear of the plate
 * corners (a few mm gap). In normal running the plate floats free and never
 * touches them; on an overload (a hard knock, a gust, mishandling the model)
 * they catch the plate before the delicate S-beam cells are bent.
 */
export function OverloadStops({
  highlight,
  faded,
  explodedAmount = 0,
  showLabel = false,
}: PartVisual & { showLabel?: boolean }) {
  const [sw, sh, sd] = SCENE.stops.size
  const [pw, , pd] = SCENE.plate.size
  const gap = SCENE.stops.gap
  const hx = pw / 2 + gap + sw / 2
  const hz = pd / 2 + gap + sd / 2
  const corners: [number, number, number][] = [
    [hx, SCENE.plate.y, hz],
    [-hx, SCENE.plate.y, hz],
    [hx, SCENE.plate.y, -hz],
    [-hx, SCENE.plate.y, -hz],
  ]
  const mat = partMaterial(COLORS.extrusion, { highlight, faded }, { metalness: 0.4, roughness: 0.6 })

  // Each stop is bolted to the FIXED frame, so it needs a post running down from
  // the catch block (at plate height) to the frame top rail — without it the
  // blocks look like they float beside the plate corners.
  const railTop = SCENE.frame.railThickness // top of the base-frame rails
  const blockBottom = SCENE.plate.y - sh / 2
  const postH = blockBottom - railTop
  const postY = railTop + postH / 2
  const postW = Math.min(sw, sd) * 0.5

  return (
    <group position={explodePos([0, 0, 0], EXPLODE.stops, explodedAmount)}>
      {corners.map((c, i) => (
        <group key={i}>
          {/* catch block, just clear of the plate corner */}
          <mesh position={c} castShadow>
            <boxGeometry args={[sw, sh, sd]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* support post down to the frame rail */}
          <mesh position={[c[0], postY, c[2]]} castShadow>
            <boxGeometry args={[postW, postH, postW]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </group>
      ))}
      {showLabel && <Label position={[hx + 0.04, SCENE.plate.y + 0.04, hz]} text="Overload stops (~4 mm gap)" tone="accent" />}
    </group>
  )
}
