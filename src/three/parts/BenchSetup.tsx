import { COLORS } from '../../config'
import { partMaterial } from '../partMaterial'
import { Label } from '../Label'
import { Wire } from './Wire'

/**
 * Bench-test tableau (step 2) — a standalone scene used BEFORE any metal is cut:
 * the three load cells laid out on a bench, each wired into the USB bridge
 * (PhidgetBridge 1046), which connects to a laptop. The point is to prove all
 * three channels read sensibly before committing to the build.
 *
 * Each cell shows the standard 4-wire bridge: red/black excitation, green/white
 * signal. Wiring is glowed because this step is all about the wiring.
 */
const EX = COLORS // shorthand

// Standard load-cell 4-wire colors with small lateral offsets so the bundle reads.
const BUNDLE: { color: string; dz: number }[] = [
  { color: EX.wireRed, dz: -0.012 },
  { color: EX.wireBlack, dz: -0.004 },
  { color: EX.wireGreen, dz: 0.004 },
  { color: EX.wireWhite, dz: 0.012 },
]

function CellBundle({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  return (
    <>
      {BUNDLE.map((w, i) => {
        const start: [number, number, number] = [from[0] + w.dz, from[1], from[2]]
        const mid: [number, number, number] = [
          (from[0] + to[0]) / 2 + w.dz,
          Math.max(from[1], to[1]) + 0.06,
          (from[2] + to[2]) / 2,
        ]
        const end: [number, number, number] = [to[0] + w.dz, to[1], to[2] + w.dz]
        return <Wire key={i} points={[start, mid, end]} color={w.color} radius={0.0026} glow />
      })}
    </>
  )
}

export function BenchSetup() {
  // a deliberate dark ESD bench mat — gives the colored wiring contrast and
  // reads as a chosen work surface against the white background.
  const bench = partMaterial('#222b3d', { faded: false }, { metalness: 0.1, roughness: 0.9 })
  const cellMat = partMaterial(COLORS.cell, { highlight: false }, { metalness: 0.7, roughness: 0.35 })
  const boxMat = partMaterial(COLORS.bridgeBox, { highlight: false }, { metalness: 0.4, roughness: 0.5 })
  const lapMat = partMaterial(COLORS.laptop, { highlight: false }, { metalness: 0.5, roughness: 0.4 })

  // bench positions
  const liftA: [number, number, number] = [-0.32, 0.09, 0.22]
  const liftB: [number, number, number] = [-0.04, 0.09, 0.22]
  const drag: [number, number, number] = [0.3, 0.05, 0.22]
  const bridge: [number, number, number] = [-0.05, 0.05, -0.06]
  const laptop: [number, number, number] = [0.0, 0.0, -0.46]

  const bridgeTop: [number, number, number] = [bridge[0], bridge[1] + 0.05, bridge[2] + 0.07]

  return (
    <group>
      {/* bench surface */}
      <mesh position={[0, -0.01, -0.05]} receiveShadow>
        <boxGeometry args={[1.2, 0.02, 0.9]} />
        <meshStandardMaterial {...bench} />
      </mesh>

      {/* two lift cells (vertical) */}
      {[liftA, liftB].map((p, i) => (
        <group key={i} position={p}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.18, 0.06]} />
            <meshStandardMaterial {...cellMat} />
          </mesh>
          <Label position={[0, 0.14, 0]} text={i === 0 ? 'Lift A · DYMH-103 50 kg' : 'Lift B · DYMH-103 50 kg'} />
        </group>
      ))}
      {/* drag cell (horizontal) */}
      <group position={drag}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.05, 0.05]} />
          <meshStandardMaterial {...cellMat} />
        </mesh>
        <Label position={[0, 0.09, 0]} text="Drag · DYMH-103 5 kg" />
      </group>

      {/* USB bridge box */}
      <group position={bridge}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.07, 0.16]} />
          <meshStandardMaterial {...boxMat} />
        </mesh>
        {/* port dots */}
        {[-0.07, -0.024, 0.024, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.0, 0.081]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.004, 12]} />
            <meshStandardMaterial color={COLORS.accent} emissive={COLORS.accent} emissiveIntensity={0.4} />
          </mesh>
        ))}
        <Label position={[0, 0.09, 0]} text="PhidgetBridge 1046_0B (4-input)" tone="accent" />
      </group>

      {/* laptop */}
      <group position={laptop}>
        <mesh position={[0, 0.005, 0]} castShadow>
          <boxGeometry args={[0.3, 0.012, 0.2]} />
          <meshStandardMaterial {...lapMat} />
        </mesh>
        <mesh position={[0, 0.1, -0.095]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.19, 0.01]} />
          <meshStandardMaterial {...lapMat} />
        </mesh>
        <mesh position={[0, 0.1, -0.089]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.27, 0.16, 0.002]} />
          <meshStandardMaterial color={COLORS.laptopScreen} emissive={COLORS.laptopScreen} emissiveIntensity={0.5} />
        </mesh>
        <Label position={[0, 0.24, -0.05]} text="laptop · Phidget Control Panel" />
      </group>

      {/* wiring: each cell → bridge, then bridge → laptop (USB) */}
      <CellBundle from={[liftA[0], liftA[1] + 0.09, liftA[2]]} to={bridgeTop} />
      <CellBundle from={[liftB[0], liftB[1] + 0.09, liftB[2]]} to={bridgeTop} />
      <CellBundle from={[drag[0], drag[1] + 0.03, drag[2]]} to={bridgeTop} />
      <Wire
        points={[
          [bridge[0], bridge[1], bridge[2] - 0.08],
          [bridge[0], bridge[1] + 0.04, -0.28],
          [laptop[0], 0.02, laptop[2] + 0.08],
        ]}
        color="#94a3b8"
        radius={0.004}
        glow
      />
    </group>
  )
}
