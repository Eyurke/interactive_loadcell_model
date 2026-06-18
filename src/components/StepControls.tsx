import type { Controls, ScenePreset } from '../types'
import { ENVELOPE } from '../config'

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="tnum font-mono text-sm text-accent-glow">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  )
}

/**
 * Interactive controls that appear only on the steps that use them:
 *   - AoA (pitch) slider on the sting step and the run step
 *   - airspeed slider on the run step
 *   - known-mass slider on the calibrate step
 */
export function StepControls({
  preset,
  controls,
  update,
}: {
  preset: ScenePreset
  controls: Controls
  update: (patch: Partial<Controls>) => void
}) {
  const showPitch = preset === 'sting' || preset === 'run'
  const showSpeed = preset === 'run'
  const showMass = preset === 'calibrate'
  if (!showPitch && !showSpeed && !showMass) return null

  return (
    <div className="grid gap-4 rounded-xl border border-ink-600 bg-ink-800/60 p-4 sm:grid-cols-2">
      {showSpeed && (
        <Slider
          label="Airspeed V"
          value={controls.airspeed}
          display={`${controls.airspeed.toFixed(0)} m/s`}
          min={ENVELOPE.airspeedMin}
          max={ENVELOPE.airspeedMax}
          step={1}
          onChange={(v) => update({ airspeed: v })}
        />
      )}
      {showPitch && (
        <Slider
          label="Angle of attack α"
          value={controls.pitchDeg}
          display={`${controls.pitchDeg.toFixed(1)}°`}
          min={ENVELOPE.aoaMin}
          max={ENVELOPE.aoaMax}
          step={0.5}
          onChange={(v) => update({ pitchDeg: v })}
        />
      )}
      {showMass && (
        <Slider
          label="Known mass m"
          value={controls.calMass}
          display={`${controls.calMass.toFixed(1)} kg → ${(controls.calMass * 9.81).toFixed(1)} N`}
          min={0}
          max={5}
          step={0.1}
          onChange={(v) => update({ calMass: v })}
        />
      )}
    </div>
  )
}
