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
      <div className="eyebrow px-2 pb-2">Build sequence</div>
      {STEPS.map((step, i) => {
        const isCurrent = i === current
        const isDone = checked[i]
        const isLast = i === STEPS.length - 1
        return (
          <button
            key={step.id}
            onClick={() => onSelect(i)}
            className={
              'group relative flex items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition ' +
              (isCurrent
                ? 'border-accent/50 bg-accent/[0.07] shadow-glow'
                : 'border-transparent hover:border-ink-600 hover:bg-ink-800')
            }
          >
            {/* stepper spine — a hairline connecting the sequence */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[1.31rem] top-[2.35rem] h-[calc(100%-1.35rem)] w-px bg-ink-500"
              />
            )}
            {/* checkbox / status */}
            <span
              role="checkbox"
              aria-checked={isDone}
              onClick={(e) => {
                e.stopPropagation()
                onToggle(i)
              }}
              className={
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold transition ' +
                (isDone
                  ? 'border-accent bg-accent/15 text-accent'
                  : isCurrent
                    ? 'border-accent bg-ink-900 text-accent'
                    : 'border-ink-500 bg-ink-900 text-slate-500 group-hover:border-slate-400')
              }
            >
              {isDone ? '✓' : i + 1}
            </span>
            <span className="min-w-0">
              <span
                className={
                  'block truncate text-sm font-medium ' +
                  (isCurrent ? 'text-slate-100' : isDone ? 'text-slate-400' : 'text-slate-300')
                }
              >
                {step.shortTitle}
              </span>
              <span className="eyebrow block truncate normal-case tracking-[0.1em]">Step {step.id} / {STEPS.length}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
