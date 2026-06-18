import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * A smooth wire/cable/string drawn as a tube through a list of points
 * (Catmull-Rom). Reused for load-cell wiring, slack signal cables, and the
 * calibration strings.
 */
export function Wire({
  points,
  color,
  radius = 0.0035,
  glow = false,
}: {
  points: [number, number, number][]
  color: string
  radius?: number
  glow?: boolean
}) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(curve, Math.max(16, points.length * 8), radius, 8, false)
  }, [points, radius])

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        color={color}
        emissive={glow ? color : '#000000'}
        emissiveIntensity={glow ? 0.55 : 0}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  )
}
