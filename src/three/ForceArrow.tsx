import { useMemo } from 'react'
import * as THREE from 'three'
import { Label } from './Label'

/**
 * A labeled 3D force arrow: cylinder shaft + cone head, oriented along an
 * arbitrary direction. `length` is in meters and can be animated (e.g. scaled
 * with a force magnitude). Geometry is authored along +Y, then rotated to `dir`.
 */
export function ForceArrow({
  origin,
  dir,
  length,
  color,
  thickness = 0.006,
  label,
  labelTone = 'accent',
}: {
  origin: [number, number, number]
  dir: [number, number, number]
  length: number
  color: string
  thickness?: number
  label?: string
  labelTone?: 'default' | 'accent' | 'drag' | 'weight'
}) {
  // Rotate local +Y onto the requested direction.
  const quaternion = useMemo(() => {
    const d = new THREE.Vector3(...dir).normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d)
    return [q.x, q.y, q.z, q.w] as [number, number, number, number]
  }, [dir])

  const len = Math.max(length, 0.0001)
  const headLen = Math.min(0.05, len * 0.32)
  const shaftLen = Math.max(len - headLen, 0.0001)

  return (
    <group position={origin} quaternion={quaternion}>
      {/* shaft */}
      <mesh position={[0, shaftLen / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness, shaftLen, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      {/* head */}
      <mesh position={[0, shaftLen + headLen / 2, 0]}>
        <coneGeometry args={[thickness * 2.6, headLen, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      {label && <Label position={[0, len + 0.04, 0]} text={label} tone={labelTone} />}
    </group>
  )
}
