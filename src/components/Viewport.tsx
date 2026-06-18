import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from '../three/Scene'
import { FRAMINGS } from '../three/CameraRig'
import { COLORS } from '../config'
import type { ScenePreset, Controls } from '../types'

/**
 * 3D viewport: the R3F <Canvas> hosting the shared scene, plus a small
 * "drag to orbit / scroll to zoom" hint overlay.
 */
export function Viewport({
  preset,
  controls,
  onToggleLabels,
}: {
  preset: ScenePreset
  controls: Controls
  onToggleLabels: () => void
}) {
  return (
    <div className="relative h-full w-full bg-ink-900">
      {/* drafting crop marks at the corners — frames the model like a plate */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-slate-500/45" />
        <span className="absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-slate-500/45" />
        <span className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b border-l border-slate-500/45" />
        <span className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b border-r border-slate-500/45" />
      </div>

      {/* viewport plate label (datasheet voice) */}
      <span className="eyebrow pointer-events-none absolute left-3 top-3 z-10">Fig. — assembly view</span>

      {/* labels toggle — declutters the 3D view */}
      <button
        onClick={onToggleLabels}
        aria-pressed={!controls.showLabels}
        title={controls.showLabels ? 'Hide the in-scene text labels' : 'Show the in-scene text labels'}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-ink-600 bg-ink-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur transition hover:border-accent/60 hover:text-slate-100"
      >
        <span aria-hidden>{controls.showLabels ? '🙈' : '👁'}</span>
        {controls.showLabels ? 'Hide labels' : 'Show labels'}
      </button>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: FRAMINGS.overview.pos, fov: 45, near: 0.03, far: 100 }}
      >
        <color attach="background" args={[COLORS.sceneBg]} />
        <fog attach="fog" args={[COLORS.sceneBg, 7, 16]} />
        <Suspense fallback={null}>
          <Scene preset={preset} controls={controls} />
        </Suspense>
      </Canvas>

      {/* orbit hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-ink-600 bg-ink-900/80 px-2.5 py-1 font-mono text-[11px] text-slate-400 backdrop-blur">
        <span className="text-accent">⟳</span> drag to orbit
        <span className="text-slate-500">·</span> scroll to zoom
      </div>
    </div>
  )
}
