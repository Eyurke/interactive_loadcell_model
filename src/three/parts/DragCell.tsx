import { COLORS, SCENE, POS, EXPLODE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'
import { ForceArrow } from '../ForceArrow'

/**
 * Horizontal drag load cell — a smaller 5 kg S-beam laid on its side along the
 * flow axis (X). One end is anchored to the fixed frame post, the other to the
 * moving plate, so it reads the streamwise (drag) reaction only.
 *
 * `showDragArrow` adds the orange "drag / airflow" arrow (step 6).
 */
export function DragCell({
  highlight,
  faded,
  explodedAmount = 0,
  showDragArrow = false,
}: PartVisual & { showDragArrow?: boolean }) {
  const [lx, ly, lz] = SCENE.dragCell.size
  const pos = explodePos(POS.dragCell, EXPLODE.dragCell, explodedAmount)
  const body = partMaterial(COLORS.cell, { highlight, faded }, { metalness: 0.7, roughness: 0.35 })
  const boss = partMaterial(COLORS.cellAccent, { highlight, faded }, { metalness: 0.7, roughness: 0.4 })

  return (
    <group position={pos}>
      {/* body (long axis along X) */}
      <mesh castShadow>
        <boxGeometry args={[lx, ly, lz]} />
        <meshStandardMaterial {...body} />
      </mesh>
      {/* end bosses where the rod ends thread in (along X) */}
      {[lx / 2, -lx / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[ly * 0.35, ly * 0.35, 0.014, 16]} />
          <meshStandardMaterial {...boss} />
        </mesh>
      ))}

      <Label position={[0, ly / 2 + 0.05, 0]} text="Drag · DYMH-103 5 kg" tone={highlight ? 'accent' : 'default'} />

      {showDragArrow && (
        <ForceArrow
          origin={[lx / 2 + 0.02, 0, 0]}
          dir={[1, 0, 0]} // downstream = drag direction
          length={0.16}
          color={COLORS.arrowDrag}
          label="drag / airflow →"
          labelTone="drag"
        />
      )}
    </group>
  )
}
