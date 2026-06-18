import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, SCENE, POS, ENVELOPE } from '../../config'

/**
 * Animated airflow over the model (step 10). Faint streamline paths show the
 * flow rising over the wing (upwash); bright particles ride those paths and
 * speed up with the airspeed slider. Particles are one InstancedMesh for cheap
 * per-frame updates.
 */
export function Streamlines({ airspeed }: { airspeed: number }) {
  const wingY = POS.bracketPivot[1] + SCENE.glider.mountClearance + SCENE.glider.fuselageRadius

  const { curves, linePoints } = useMemo(() => {
    const zs = [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2]
    const curves: THREE.CatmullRomCurve3[] = []
    const linePoints: [number, number, number][][] = []
    zs.forEach((z, i) => {
      const yBase = wingY + (i - (zs.length - 1) / 2) * 0.012
      const pts: THREE.Vector3[] = []
      for (let s = 0; s <= 48; s++) {
        const x = -2.2 + (4.4 * s) / 48
        const bump = 0.05 * Math.exp(-((x / 0.5) ** 2)) // rise over the wing
        pts.push(new THREE.Vector3(x, yBase + bump, z))
      }
      curves.push(new THREE.CatmullRomCurve3(pts))
      linePoints.push(pts.map((p) => [p.x, p.y, p.z] as [number, number, number]))
    })
    return { curves, linePoints }
  }, [wingY])

  const perLine = 10
  const instances = useMemo(() => {
    const arr: { curve: number; offset: number }[] = []
    for (let c = 0; c < curves.length; c++) for (let j = 0; j < perLine; j++) arr.push({ curve: c, offset: j / perLine })
    return arr
  }, [curves])

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const phase = useRef(0)

  useFrame((_, dt) => {
    const t = (airspeed - ENVELOPE.airspeedMin) / (ENVELOPE.airspeedMax - ENVELOPE.airspeedMin)
    const speed = 0.12 + t * 0.32 // particle laps per second
    phase.current = (phase.current + dt * speed) % 1
    const mesh = meshRef.current
    if (!mesh) return
    for (let i = 0; i < instances.length; i++) {
      const { curve, offset } = instances[i]
      const u = (offset + phase.current) % 1
      const p = curves[curve].getPoint(u)
      dummy.position.copy(p)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {linePoints.map((pts, i) => (
        <Line key={i} points={pts} color={COLORS.streamline} lineWidth={1} transparent opacity={0.2} />
      ))}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, instances.length]}>
        <sphereGeometry args={[0.013, 10, 10]} />
        <meshBasicMaterial color={COLORS.streamline} />
      </instancedMesh>
    </group>
  )
}
