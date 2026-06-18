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
    <header className="z-20 flex flex-col gap-2 border-b border-ink-600 bg-ink-800/80 px-3 py-2 backdrop-blur md:flex-row md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <button className="btn px-2 md:hidden" onClick={onToggleSidebar} aria-label="Toggle steps">
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="text-accent">◆</span>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-white">Wind-Tunnel Force Balance</h1>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              3-axis lift / drag / pitch · FMS 3000mm Fox
            </p>
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="flex flex-1 items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-600">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent transition-[width] duration-500"
            style={{ width: `${percent}%` }}
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
