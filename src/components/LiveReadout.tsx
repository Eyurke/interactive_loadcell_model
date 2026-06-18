import { computeAero } from '../physics'
import { ENVELOPE } from '../config'

function Metric({
  label,
  value,
  unit,
  big = false,
  accent = false,
}: {
  label: string
  value: string
  unit: string
  big?: boolean
  accent?: boolean
}) {
  return (
    <div className={'rounded-lg border bg-ink-900/60 px-3 py-2 ' + (accent ? 'border-accent/40' : 'border-ink-600')}>
      <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="flex items-baseline gap-1">
        <span
          className={
            'tnum font-mono font-semibold ' +
            (big ? 'text-2xl ' : 'text-lg ') +
            (accent ? 'text-accent-glow' : 'text-slate-100')
          }
        >
          {value}
        </span>
        <span className="font-mono text-[11px] text-slate-500">{unit}</span>
      </div>
    </div>
  )
}

/**
 * Live (simulated) aerodynamics readout for the Run step. Everything updates as
 * the airspeed and AoA sliders move, using the real equations in physics.ts.
 */
export function LiveReadout({ airspeed, pitchDeg }: { airspeed: number; pitchDeg: number }) {
  const a = computeAero(airspeed, pitchDeg)
  const re = Math.round(a.Re).toLocaleString('en-US')

  return (
    <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-ink-800 to-ink-900 p-4 shadow-glow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">Live readout</h3>
        <span className="chip">simulated · V {a.V.toFixed(0)} m/s · α {a.alpha.toFixed(1)}°</span>
      </div>

      {/* primary trio */}
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Lift L" value={a.L.toFixed(1)} unit="N" big accent />
        <Metric label="Drag D" value={a.D.toFixed(1)} unit="N" big accent />
        <Metric label="Pitch M" value={a.M.toFixed(2)} unit="N·m" big accent />
      </div>

      {/* coefficients & flow */}
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="q = ½ρV²" value={a.q.toFixed(1)} unit="Pa" />
        <Metric label="C_L" value={a.cl.toFixed(3)} unit="" />
        <Metric label="C_D" value={a.cd.toFixed(3)} unit="" />
        <Metric label="Re" value={re} unit="" />
      </div>

      {/* per-cell split */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Metric label="Lift A (FA)" value={a.FA.toFixed(1)} unit="N" />
        <Metric label="Lift B (FB)" value={a.FB.toFixed(1)} unit="N" />
        <Metric label="Vertical (L+W)" value={a.vertical.toFixed(1)} unit="N" />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Envelope: lift peaks near <span className="font-mono text-slate-400">{ENVELOPE.peakLiftN} N</span> at 25 m/s
        (≈ <span className="font-mono text-slate-400">{ENVELOPE.peakVerticalN} N</span> vertical with weight); drag stays{' '}
        <span className="font-mono text-slate-400">
          {ENVELOPE.dragRangeN[0]}–{ENVELOPE.dragRangeN[1]} N
        </span>
        ; Re ≈ <span className="font-mono text-slate-400">170k–340k</span>. FA/FB include the ~45 N weight tare.
      </p>
    </div>
  )
}
