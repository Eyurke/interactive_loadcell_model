import { COLORS, SCENE } from '../../config'
import { partMaterial, explodePos, type PartVisual } from '../partMaterial'
import { Label } from '../Label'
import { ForceArrow } from '../ForceArrow'

/**
 * One vertical lift load cell — a 50 kg S-beam, drawn as a slim silver block
 * with mounting bosses top & bottom and two grooves to suggest the S-web.
 * MUST be loaded purely axially (straight down the long axis) via rod ends.
 *
 * Used twice: "Lift A" (upstream) and "Lift B" (downstream), spaced d apart.
 */
export function LiftCell({
  base,
  explodeOffset,
  label,
  labelTone = 'default',
  highlight,
  faded,
  explodedAmount = 0,
  showAxialArrow = false,
  arrowLabel,
}: PartVisual & {
  base: [number, number, number]
  explodeOffset: [number, number, number]
  label: string
  labelTone?: 'default' | 'accent'
  showAxialArrow?: boolean
  arrowLabel?: string
}) {
  const [w, h, d] = SCENE.liftCell.size
  const pos = explodePos(base, explodeOffset, explodedAmount)
  const body = partMaterial(COLORS.cell, { highlight, faded }, { metalness: 0.7, roughness: 0.35 })
  const boss = partMaterial(COLORS.cellAccent, { highlight, faded }, { metalness: 0.7, roughness: 0.4 })

  return (
    <group position={pos}>
      {/* main body */}
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial {...body} />
      </mesh>
      {/* S-beam web grooves (visual hint) */}
      {[h * 0.18, -h * 0.18].map((y) => (
        <mesh key={y} position={[0, y, d / 2 - 0.001]}>
          <boxGeometry args={[w * 0.62, h * 0.16, 0.006]} />
          <meshStandardMaterial {...partMaterial('#7e858f', { faded }, { metalness: 0.5 })} />
        </mesh>
      ))}
      {/* threaded mounting bosses (where rod ends thread in) */}
      {[h / 2, -h / 2].map((y) => (
        <mesh key={`b${y}`} position={[0, y, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[w * 0.32, w * 0.32, 0.016, 16]} />
          <meshStandardMaterial {...boss} />
        </mesh>
      ))}

      <Label position={[0, h / 2 + 0.05, 0]} text={label} tone={labelTone === 'accent' ? 'accent' : 'default'} />

      {showAxialArrow && (
        <ForceArrow
          origin={[0, h / 2 + 0.02, 0]}
          dir={[0, 1, 0]}
          length={0.1}
          color={COLORS.arrowLift}
          label={arrowLabel}
          labelTone="accent"
        />
      )}
    </group>
  )
}
