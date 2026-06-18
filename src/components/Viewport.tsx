import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from '../three/Scene'
import { FRAMINGS } from '../three/CameraRig'
import type { ScenePreset, Controls } from '../types'

/**
 * 3D viewport: the R3F <Canvas> hosting the shared scene, plus a small
 * "drag to orbit / scroll to zoom" hint overlay.
 */
export function Viewport({ preset, controls }: { preset: ScenePreset; controls: Controls }) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: FRAMINGS.overview.pos, fov: 45, near: 0.03, far: 100 }}
      >
        <color attach="background" args={['#0b0f17']} />
        <fog attach="fog" args={['#0b0f17', 6, 14]} />
        <Suspense fallback={null}>
          <Scene preset={preset} controls={controls} />
        </Suspense>
      </Canvas>

      {/* orbit hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-ink-600 bg-ink-900/80 px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur">
        <span className="text-accent">⟳</span> drag to orbit
        <span className="text-ink-400">·</span> scroll to zoom
      </div>
    </div>
  )
}
