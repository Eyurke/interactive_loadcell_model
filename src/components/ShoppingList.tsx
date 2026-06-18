import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IMAGE_CREDITS } from '../photos'

/* ===========================================================================
   PARTS & BUILD reference modal.
   Two tabs:
     1. Bill of materials — specific, buyable models within a ~$1000 budget.
     2. Build the load cells — how to wire & assemble the sensing chain.
   Prices are typical street prices (USD, mid-2020s) — verify at purchase.
   =========================================================================== */

interface Item {
  qty: string
  model: string
  spec: string
  vendor: string
  price: string
}

// Concrete, real, buyable parts. Models are chosen to come in well under $1000
// so there's headroom for spares / upgrades (see the note below the table).
const BOM: Item[] = [
  {
    qty: '2×',
    model: 'DYMH-103 S-beam load cell — 50 kg',
    spec: 'Vertical lift axis (Lift A + Lift B). Stainless S-type, 1.0–1.5 mV/V, IP67.',
    vendor: 'DAYSENSOR / ATO / Amazon',
    price: '$50–70 ea',
  },
  {
    qty: '1×',
    model: 'DYMH-103 S-beam load cell — 5 kg',
    spec: 'Horizontal drag axis. Same family — small range so it resolves the tiny drag force.',
    vendor: 'DAYSENSOR / ATO / Amazon',
    price: '$40–60',
  },
  {
    qty: '1×',
    model: 'PhidgetBridge 4-Input — 1046_0B',
    spec: '4-channel Wheatstone-bridge DAQ, USB (Mini-USB). Reads all three cells; gain + rate set in software.',
    vendor: 'Phidgets',
    price: '$95',
  },
  {
    qty: '1×',
    model: 'Matek ASPD-4525 (TE MS4525DO)',
    spec: 'Digital airspeed sensor + pitot tube + silicone tubing. I²C, ±0.25% span, 1 PSI range.',
    vendor: 'getFPV / Amazon',
    price: '$38',
  },
  {
    qty: '1×',
    model: 'Arduino Nano (or clone)',
    spec: 'Reads the MS4525DO over I²C and streams airspeed to the laptop over USB (the sensor is not USB).',
    vendor: 'Amazon',
    price: '$15–25',
  },
  {
    qty: '~6 m',
    model: '2020 T-slot aluminum extrusion + brackets + T-nuts',
    spec: 'Fixed base frame (0.4 m square) + drag-cell post. Get a kit with corner brackets and T-nuts.',
    vendor: 'ZYLtech / 80/20 / Amazon',
    price: '$70–90',
  },
  {
    qty: '1×',
    model: 'Aluminum tooling plate — 300 × 300 × 6 mm',
    spec: 'The moving plate. Flat 6061; drill to suit the rod ends and sting clamp.',
    vendor: 'Misumi / Amazon',
    price: '$25–35',
  },
  {
    qty: '6×',
    model: 'Rod ends / heim joints + studs & jam nuts',
    spec: 'One pair per cell to load it AXIALLY. Thread must match each cell stud (see gotcha #1).',
    vendor: 'McMaster / Amazon',
    price: '$25–35',
  },
  {
    qty: '1 set',
    model: 'Slotted calibration mass set (~10 kg total)',
    spec: 'Known masses for in-situ calibration (F = m·g). Certified hooks help.',
    vendor: 'Amazon / lab supply',
    price: '$35–50',
  },
  {
    qty: '1×',
    model: 'Pulley + braided line',
    spec: 'Turns a hanging mass into a known horizontal load on the drag axis during calibration.',
    vendor: 'Amazon',
    price: '$15',
  },
  {
    qty: '1 lot',
    model: 'Shielded signal cable, hookup wire, ferrules, heat-shrink',
    spec: 'Clean, shielded runs from each cell to the bridge; service loops for slack.',
    vendor: 'Amazon',
    price: '$20',
  },
  {
    qty: '1 lot',
    model: 'Fasteners, spare T-nuts, brackets, zip ties',
    spec: 'Assembly hardware + cable management.',
    vendor: 'Amazon',
    price: '$20',
  },
]

const GOTCHAS: { title: string; body: string }[] = [
  {
    title: 'Match the rod-end thread to the load-cell stud',
    body:
      'DYMH-103 stud threads change with capacity (≈M5 on small caps up to M12×1.25 on big ones). Read the datasheet for YOUR exact cell and buy rod ends to match — this is the #1 mistake.',
  },
  {
    title: 'Match the T-nut size to your extrusion',
    body:
      '2020 profiles come in 5 mm and 6 mm slots (M4/M5 vs M6 hardware). Order T-nuts and brackets together with the extrusion so the slot fits.',
  },
  {
    title: 'The airspeed sensor is I²C, not USB',
    body:
      'The MS4525DO needs the Arduino (or a USB-I²C adapter) to reach the laptop. The PhidgetBridge handles the three load cells over USB directly.',
  },
]

// Step-by-step for building the load-cell sensing chain.
const BUILD_STEPS: { title: string; body: string }[] = [
  {
    title: 'Identify the four wires',
    body:
      'Standard load-cell colors: red = Excitation+, black = Excitation−, green = Signal+, white = Signal−. If unmarked, ohm them out: the pair with the HIGHER resistance is excitation (input), the other pair is signal (output).',
  },
  {
    title: 'Fit rod ends so the cell is loaded axially',
    body:
      'Thread a matching rod end onto each stud. The fixed end anchors to the frame, the live end to the moving plate. A rod end transmits pure tension/compression — never let the cell take a side load.',
  },
  {
    title: 'Wire each cell into one PhidgetBridge channel',
    body:
      'Per channel: excitation pair → the 5V and G terminals, signal pair → the + and − terminals. (6-wire cell? tie each sense wire to its excitation at the connector.) Plug the bridge into the laptop via Mini-USB.',
  },
  {
    title: 'Configure in software',
    body:
      'Open the Phidget Control Panel (Phidget22). Enable each BridgeInput channel, start with Gain ×128, and pick a data rate. You should see a live raw value per channel.',
  },
  {
    title: 'Zero and check direction',
    body:
      'With no load, note the baseline. Press each cell by hand: the reading must move the expected way and return cleanly to zero (no drift/hysteresis). If a channel reads backwards, swap its Signal+ / Signal−.',
  },
  {
    title: 'Shield and strain-relieve',
    body:
      'Run signal wires as slack service loops, ground the cable shield at the bridge end only, and keep cabling away from motors and mains. A taut or noisy wire is an uncalibrated load path.',
  },
  {
    title: 'Add the airspeed channel',
    body:
      'Wire the MS4525DO over I²C (SDA, SCL, 3V3, GND) to the Arduino and flash a sketch that prints airspeed in m/s over USB serial. Point the pitot’s total port straight upstream.',
  },
  {
    title: 'Calibrate (continues in Step 9)',
    body:
      'On the fully assembled rig, hang known masses (F = m·g), log raw counts vs. force, and compute the slope (N/count). Check linearity and hysteresis up and down.',
  },
]

type Tab = 'bom' | 'build' | 'credits'

export function ShoppingList({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('bom')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-ink-500 bg-ink-800 shadow-2xl"
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* header + tabs */}
            <div className="flex items-start justify-between border-b border-ink-600 p-5 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Parts &amp; build</h2>
                <p className="text-xs text-slate-500">
                  Exact models within a ~$1000 budget, plus how to wire the load cells.
                </p>
                <div className="mt-3 flex gap-1">
                  {(
                    [
                      ['bom', 'Bill of materials'],
                      ['build', 'Build the load cells'],
                      ['credits', 'Image credits'],
                    ] as [Tab, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={
                        'rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition ' +
                        (tab === key
                          ? 'border-accent text-slate-100'
                          : 'border-transparent text-slate-400 hover:text-slate-200')
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn px-2" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            {/* body */}
            <div className="overflow-y-auto p-5">
              {tab === 'bom' && (
                <>
                  <div className="overflow-hidden rounded-lg border border-ink-600">
                    <table className="w-full text-sm">
                      <thead className="bg-ink-700 text-left text-[11px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-3 py-2 font-medium">Qty</th>
                          <th className="px-3 py-2 font-medium">Part &amp; model</th>
                          <th className="px-3 py-2 text-right font-medium">Est. price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-600">
                        {BOM.map((it, i) => (
                          <tr key={i} className="align-top">
                            <td className="px-3 py-2 font-mono text-slate-400">{it.qty}</td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-slate-100">{it.model}</div>
                              <div className="text-[11px] leading-snug text-slate-500">{it.spec}</div>
                              <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-600">{it.vendor}</div>
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-slate-300">{it.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-ink-500 bg-ink-700/50">
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2 font-semibold text-slate-100">Core build total</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold text-accent-glow">~$530–700</td>
                        </tr>
                        <tr className="bg-ink-700/30">
                          <td className="px-3 py-1.5" />
                          <td className="px-3 py-1.5 text-slate-400">Budget</td>
                          <td className="px-3 py-1.5 text-right font-mono text-slate-400">$1000</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    <span className="text-slate-400">Headroom to ~$1000:</span> upgrade to higher-grade S-beams (e.g.
                    AmCells STB-50, ~$90 ea), add a spare 50 kg cell, a small bench DMM, or a Phidget VINT hub. Prices
                    are typical street prices (USD) — confirm at purchase.
                  </p>

                  <div className="mt-4 space-y-2">
                    {GOTCHAS.map((g, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900"
                      >
                        <span className="font-semibold">⚠ {g.title}.</span>{' '}
                        <span className="text-slate-300/90">{g.body}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === 'build' && (
                <>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    You don’t fabricate the strain gauge — you buy the S-beam cells and build the{' '}
                    <span className="text-slate-200">measurement chain</span> around them: mount each cell for axial
                    load, wire its bridge into the DAQ, then zero and calibrate. Do this on the bench{' '}
                    <span className="text-slate-200">before</span> cutting any frame metal.
                  </p>
                  <ol className="flex flex-col gap-3">
                    {BUILD_STEPS.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="tnum mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs text-accent">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{s.title}</div>
                          <div className="text-sm leading-relaxed text-slate-400">{s.body}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-slate-200">
                    <span className="font-semibold">Why bench-first?</span>{' '}
                    <span className="text-slate-300/90">
                      Finding a miswired bridge, dead cell, or noisy channel now is free. Finding it after everything is
                      bolted together is not.
                    </span>
                  </div>
                </>
              )}

              {tab === 'credits' && (
                <>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    Component &amp; tool photos are real, openly-licensed images from Wikimedia Commons. Attribution and
                    license for each, as required:
                  </p>
                  <ul className="divide-y divide-ink-600 overflow-hidden rounded-lg border border-ink-600">
                    {IMAGE_CREDITS.map((c) => (
                      <li key={c.key} className="flex items-center gap-3 p-2">
                        <img src={c.src} alt={c.alt} loading="lazy" className="h-10 w-12 shrink-0 rounded object-cover" />
                        <div className="min-w-0 text-sm">
                          <div className="truncate text-slate-300">{c.alt}</div>
                          <div className="text-[11px] text-slate-500">
                            {c.author} ·{' '}
                            <a
                              href={c.source}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-accent hover:text-accent-glow"
                            >
                              {c.license} ↗
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    Branded parts (DYMH-103, PhidgetBridge 1046_0B, Matek ASPD-4525) link to their vendor pages for the
                    exact product photos. The 3D scene is built from primitives (no external models).
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
