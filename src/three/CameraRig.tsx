import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { ScenePreset } from '../types'

/**
 * Per-step camera framing. On a step (or reset) change we set a target camera
 * position + look-at and smoothly fly there; while the user is actively
 * dragging the orbit controls we hand control back and stop animating.
 */
export interface Framing {
  pos: [number, number, number]
  target: [number, number, number]
}

// Camera framing tuned per preset. Balance-focused steps sit close; overview
// and run pull back to take in the ~3 m wing.
export const FRAMINGS: Record<ScenePreset, Framing> = {
  overview: { pos: [1.7, 1.0, 2.1], target: [0, 0.35, 0] },
  bench: { pos: [0.0, 0.7, 1.15], target: [0, 0.08, -0.05] },
  base: { pos: [0.55, 0.45, 0.7], target: [0, 0.06, 0] },
  liftCells: { pos: [0.6, 0.4, 0.75], target: [0, 0.12, 0] },
  plate: { pos: [0.6, 0.45, 0.8], target: [0, 0.17, 0] },
  dragCell: { pos: [-0.35, 0.4, 0.8], target: [-0.12, 0.14, 0] },
  sting: { pos: [0.8, 0.6, 0.95], target: [0, 0.3, 0] },
  stops: { pos: [0.6, 0.55, 0.8], target: [0, 0.2, 0] },
  calibrate: { pos: [1.0, 0.7, 1.1], target: [0.1, 0.15, 0.15] },
  run: { pos: [1.9, 0.9, 2.0], target: [0, 0.45, 0] },
}

export function CameraRig({ preset, resetNonce }: { preset: ScenePreset; resetNonce: number }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null

  const target = useRef(new THREE.Vector3())
  const desiredPos = useRef(new THREE.Vector3())
  const animating = useRef(false)
  const userInteracting = useRef(false)

  // Pause the fly-to whenever the user grabs the orbit controls.
  useEffect(() => {
    if (!controls) return
    const onStart = () => {
      userInteracting.current = true
      animating.current = false
    }
    const onEnd = () => {
      userInteracting.current = false
    }
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)
    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
    }
  }, [controls])

  // Kick off a fresh fly-to on step change or "reset camera".
  useEffect(() => {
    const f = FRAMINGS[preset]
    desiredPos.current.set(...f.pos)
    target.current.set(...f.target)
    animating.current = true
  }, [preset, resetNonce])

  useFrame((_, dt) => {
    if (!animating.current || userInteracting.current) return
    const lambda = 3.5
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPos.current.x, lambda, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPos.current.y, lambda, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPos.current.z, lambda, dt)
    if (controls) {
      controls.target.x = THREE.MathUtils.damp(controls.target.x, target.current.x, lambda, dt)
      controls.target.y = THREE.MathUtils.damp(controls.target.y, target.current.y, lambda, dt)
      controls.target.z = THREE.MathUtils.damp(controls.target.z, target.current.z, lambda, dt)
      controls.update()
    }
    // settle: stop animating once we're basically there
    if (camera.position.distanceTo(desiredPos.current) < 0.01) animating.current = false
  })

  return null
}
