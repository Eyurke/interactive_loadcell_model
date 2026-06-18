import { COLORS, SCENE, POS } from '../../config'
import { partMaterial } from '../partMaterial'
import { ForceArrow } from '../ForceArrow'
import { Wire } from './Wire'
import { Label } from '../Label'

const G = 9.81

/**
 * Calibration rig (step 9) — overlaid on the assembled balance. Known masses
 * apply known forces so the raw cell counts can be turned into newtons (F = mg):
 *
 *   LIFT axis  — a mass hangs from a calibration outrigger clamped to the plate;
 *                it pulls straight DOWN through the lift cells.
 *   DRAG axis  — a string runs from the plate, over a pulley at plate height,
 *                down to a hanging mass; it pulls the plate HORIZONTALLY.
 *
 * The green force arrows scale with the "known mass" slider (calMass, kg).
 */
export function CalibrationRig({ calMass }: { calMass: number }) {
  const F = calMass * G // N
  const maxF = 5 * G // slider max ~5 kg
  const arrowLen = (f: number) => 0.05 + (f / maxF) * 0.18
  const weightH = (m: number) => 0.03 + (m / 5) * 0.06 // visual height of the weight

  const plateY = SCENE.plate.y
  const metal = partMaterial('#7e858f', { highlight: false }, { metalness: 0.7, roughness: 0.35 })
  const weightMat = partMaterial('#566072', { highlight: false }, { metalness: 0.6, roughness: 0.5 })

  // ---- LIFT calibration (outrigger off the +Z edge so the mass clears ground) ----
  const outriggerTip: [number, number, number] = [0, plateY, 0.5]
  const liftWeightTop = plateY - 0.02
  const liftWeightY = liftWeightTop - weightH(calMass) / 2 - 0.16

  // ---- DRAG calibration (pulley at plate height on the +X side) ----
  const plateEdge: [number, number, number] = [SCENE.plate.size[0] / 2, plateY, 0]
  const pulley: [number, number, number] = [0.4, plateY, 0]
  const dragWeightY = plateY - 0.16 - weightH(calMass) / 2

  return (
    <group>
      {/* ===== LIFT axis ===== */}
      {/* outrigger arm clamped to the plate, reaching out past the frame */}
      <mesh position={[0, plateY, (POS.plateCenter[2] + outriggerTip[2]) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, outriggerTip[2] - 0.0, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* string + hanging mass */}
      <Wire
        points={[outriggerTip, [0, liftWeightTop, 0.5], [0, liftWeightY + weightH(calMass) / 2, 0.5]]}
        color="#e5e7eb"
        radius={0.0022}
      />
      <mesh position={[0, liftWeightY, 0.5]}>
        <cylinderGeometry args={[0.035, 0.035, weightH(calMass), 20]} />
        <meshStandardMaterial {...weightMat} />
      </mesh>
      {/* downward calibration force on the lift axis */}
      <ForceArrow
        origin={outriggerTip}
        dir={[0, -1, 0]}
        length={arrowLen(F)}
        color={COLORS.arrowWeight}
        label={`lift cal: ${F.toFixed(1)} N`}
        labelTone="weight"
      />
      <Label position={[0, liftWeightY - 0.05, 0.5]} text={`${calMass.toFixed(1)} kg`} tone="weight" />

      {/* ===== DRAG axis ===== */}
      {/* pulley post + pulley wheel at plate height */}
      <mesh position={[pulley[0], plateY / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, plateY, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={pulley} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.022, 0.006, 12, 24]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* string: plate → over pulley → down to mass */}
      <Wire
        points={[
          plateEdge,
          [pulley[0] - 0.022, plateY, 0],
          [pulley[0] + 0.022, plateY - 0.01, 0],
          [pulley[0] + 0.022, dragWeightY + weightH(calMass) / 2, 0],
        ]}
        color="#e5e7eb"
        radius={0.0022}
      />
      <mesh position={[pulley[0] + 0.022, dragWeightY, 0]}>
        <cylinderGeometry args={[0.032, 0.032, weightH(calMass), 20]} />
        <meshStandardMaterial {...weightMat} />
      </mesh>
      {/* horizontal calibration force on the drag axis (pulls plate toward +X) */}
      <ForceArrow
        origin={plateEdge}
        dir={[1, 0, 0]}
        length={arrowLen(F)}
        color={COLORS.arrowWeight}
        label={`drag cal: ${F.toFixed(1)} N`}
        labelTone="weight"
      />
    </group>
  )
}
