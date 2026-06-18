/**
 * Top bar: title, a progress bar (percent of steps checked off), and the global
 * controls available on every step — Exploded view, Reset camera, Shopping list.
 */
export function TopBar({
  percent,
  doneCount,
  total,
  exploded,
  onToggleExploded,
  onResetCamera,
  onOpenShopping,
  onToggleSidebar,
}: {
  percent: number
  doneCount: number
  total: number
  exploded: boolean
  onToggleExploded: () => void
  onResetCamera: () => void
  onOpenShopping: () => void
  onToggleSidebar: () => void
}) {
  return (
    <header className="z-20 flex flex-col gap-2 border-b border-ink-600 bg-ink-900/85 px-3 py-2 backdrop-blur md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <button className="btn px-2 md:hidden" onClick={onToggleSidebar} aria-label="Toggle steps">
          ☰
        </button>
        <div className="flex items-center gap-2.5">
          {/* instrument reticle mark */}
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded border border-accent/40 text-[12px] text-accent"
          >
            ⊕
          </span>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-slate-100">Wind-Tunnel Force Balance</h1>
            <p className="eyebrow hidden sm:block">3-axis · lift / drag / pitch · FMS 3000mm Fox</p>
          </div>
        </div>
      </div>

      {/* progress — read as a measurement scale with one tick per step */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full border border-ink-600 bg-ink-700">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-dim to-accent transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), rgba(15,23,42,0.16) calc(10% - 1px) 10%)',
            }}
          />
        </div>
        <span className="tnum w-24 shrink-0 text-right font-mono text-xs text-slate-400">
          {doneCount}/{total} · {percent}%
        </span>
      </div>

      {/* global controls */}
      <div className="flex items-center gap-2">
        <button
          className={'btn ' + (exploded ? 'btn-accent' : '')}
          onClick={onToggleExploded}
          aria-pressed={exploded}
          title="Spread parts apart to see how they assemble"
        >
          <span aria-hidden>⤢</span> Exploded
        </button>
        <button className="btn" onClick={onResetCamera} title="Re-frame the camera for this step">
          <span aria-hidden>⟲</span> <span className="hidden sm:inline">Reset camera</span>
        </button>
        <button className="btn btn-accent" onClick={onOpenShopping} title="Exact parts list + load-cell build guide">
          <span aria-hidden>🔧</span> <span className="hidden sm:inline">Parts &amp; build</span>
        </button>
      </div>
    </header>
  )
}
