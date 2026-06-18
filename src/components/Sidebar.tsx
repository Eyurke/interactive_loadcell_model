import { STEPS } from '../steps/steps'

/**
 * Vertical stepper. Click a row to jump to that step; tick the checkbox to mark
 * it done (persisted in localStorage by the parent). The current step is ringed
 * in the accent color; completed steps get a filled check.
 */
export function Sidebar({
  current,
  checked,
  onSelect,
  onToggle,
}: {
  current: number
  checked: boolean[]
  onSelect: (i: number) => void
  onToggle: (i: number) => void
}) {
  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Build steps
      </div>
      {STEPS.map((step, i) => {
        const isCurrent = i === current
        const isDone = checked[i]
        return (
          <button
            key={step.id}
            onClick={() => onSelect(i)}
            className={
              'group flex items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition ' +
              (isCurrent
                ? 'border-accent/60 bg-accent/10 shadow-glow'
                : 'border-transparent hover:border-ink-500 hover:bg-ink-700/60')
            }
          >
            {/* checkbox / status */}
            <span
              role="checkbox"
              aria-checked={isDone}
              onClick={(e) => {
                e.stopPropagation()
                onToggle(i)
              }}
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ' +
                (isDone
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-ink-500 text-slate-500 group-hover:border-slate-400')
              }
            >
              {isDone ? '✓' : i + 1}
            </span>
            <span className="min-w-0">
              <span
                className={
                  'block truncate text-sm font-medium ' +
                  (isCurrent ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-300')
                }
              >
                {step.shortTitle}
              </span>
              <span className="block truncate text-[11px] text-slate-500">Step {step.id}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
