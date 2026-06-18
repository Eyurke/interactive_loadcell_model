import { PHOTOS, type PhotoKey } from '../photos'
import type { NeedItem } from '../types'

/** A large reference photo for a step, with a visible credit link. */
export function HeroPhoto({ photo, caption }: { photo: PhotoKey; caption?: string }) {
  const p = PHOTOS[photo]
  return (
    <figure className="overflow-hidden rounded-xl border border-ink-600 bg-ink-900">
      <img src={p.src} alt={p.alt} loading="lazy" className="h-44 w-full object-cover" />
      <figcaption className="flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] text-slate-500">
        <span className="truncate">{caption ?? p.alt}</span>
        <a
          href={p.source}
          target="_blank"
          rel="noreferrer noopener"
          className="shrink-0 hover:text-accent"
          title="Image source & license"
        >
          📷 {p.author} · {p.license}
        </a>
      </figcaption>
    </figure>
  )
}

/** One part/tool card with its real reference photo (LEGO part call-out). */
function NeedCard({ item }: { item: NeedItem }) {
  const p = item.photo ? PHOTOS[item.photo] : null
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-600 bg-ink-800/60 p-2">
      <div className="h-12 w-14 shrink-0 overflow-hidden rounded-md border border-ink-600 bg-ink-900">
        {p ? (
          <img
            src={p.src}
            alt={p.alt}
            title={`${p.author} · ${p.license}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-400">▦</div>
        )}
      </div>
      <div className="min-w-0 text-sm leading-tight">
        <div className="text-slate-200">
          {item.qty && <span className="mr-1 font-mono text-accent">{item.qty}</span>}
          {item.name}
        </div>
        {item.note && <div className="mt-0.5 text-[11px] text-slate-500">{item.note}</div>}
        {item.vendor && (
          <a
            href={item.vendor}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[11px] text-accent hover:text-accent-glow"
          >
            view real photo ↗
          </a>
        )}
      </div>
    </div>
  )
}

/** The "You'll need" panel: parts + tools for this step, each with a photo. */
export function NeedPanel({ parts, tools }: { parts?: NeedItem[]; tools?: NeedItem[] }) {
  if (!parts?.length && !tools?.length) return null
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <span aria-hidden>🧰</span> You&rsquo;ll need
      </div>
      {!!parts?.length && (
        <>
          <div className="mb-1.5 text-xs font-medium text-slate-400">Parts</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {parts.map((it, i) => (
              <NeedCard key={i} item={it} />
            ))}
          </div>
        </>
      )}
      {!!tools?.length && (
        <>
          <div className="mb-1.5 mt-3 text-xs font-medium text-slate-400">Tools</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {tools.map((it, i) => (
              <NeedCard key={i} item={it} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
