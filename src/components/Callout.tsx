import type { Callout as CalloutT } from '../types'

/** Warning / note box shown beside a step. */
export function Callout({ c }: { c: CalloutT }) {
  const warn = c.kind === 'warning'
  return (
    <div
      className={
        'rounded-lg border p-3 text-sm leading-relaxed ' +
        (warn
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
          : 'border-accent/40 bg-accent/10 text-cyan-100')
      }
    >
      <div className="mb-1 flex items-center gap-2 font-semibold">
        <span aria-hidden>{warn ? '⚠' : 'ℹ'}</span>
        <span>{c.title}</span>
      </div>
      <div className="text-slate-300/90">{c.body}</div>
    </div>
  )
}
