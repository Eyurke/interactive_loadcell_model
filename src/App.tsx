import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { StepContent } from './components/StepContent'
import { Viewport } from './components/Viewport'
import { ShoppingList } from './components/ShoppingList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { STEPS, TOTAL_STEPS } from './steps/steps'
import type { Controls } from './types'

export default function App() {
  // --- persisted progress ---------------------------------------------------
  const [storedCurrent, setStoredCurrent] = useLocalStorage<number>('wtfb.current', 0)
  const [storedChecked, setStoredChecked] = useLocalStorage<boolean[]>(
    'wtfb.checked',
    Array(TOTAL_STEPS).fill(false),
  )
  // normalize against the current step count (in case steps were added/removed)
  const checked = storedChecked.length === TOTAL_STEPS ? storedChecked : Array(TOTAL_STEPS).fill(false)
  const current = Math.min(Math.max(storedCurrent, 0), TOTAL_STEPS - 1)
  const step = STEPS[current]

  // --- interactive 3D controls ---------------------------------------------
  const [pitchDeg, setPitchDeg] = useState(6)
  const [airspeed, setAirspeed] = useState(18)
  const [calMass, setCalMass] = useState(2)
  const [resetCameraNonce, setResetNonce] = useState(0)
  const [showLabels, setShowLabels] = useState(true)

  // exploded view: tween a 0..1 amount toward the toggle target for a smooth fan-out
  const [explodedTarget, setExplodedTarget] = useState(0)
  const [explodedAmount, setExplodedAmount] = useState(0)
  const amountRef = useRef(0)
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const cur = amountRef.current
      const next = cur + (explodedTarget - cur) * Math.min(1, dt * 6)
      const done = Math.abs(next - explodedTarget) < 0.001
      amountRef.current = done ? explodedTarget : next
      setExplodedAmount(amountRef.current)
      if (!done) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [explodedTarget])

  const controls: Controls = useMemo(
    () => ({ explodedAmount, pitchDeg, airspeed, calMass, resetCameraNonce, showLabels }),
    [explodedAmount, pitchDeg, airspeed, calMass, resetCameraNonce, showLabels],
  )
  const update = useCallback((patch: Partial<Controls>) => {
    if (patch.pitchDeg !== undefined) setPitchDeg(patch.pitchDeg)
    if (patch.airspeed !== undefined) setAirspeed(patch.airspeed)
    if (patch.calMass !== undefined) setCalMass(patch.calMass)
    if (patch.resetCameraNonce !== undefined) setResetNonce(patch.resetCameraNonce)
  }, [])

  // --- ui state -------------------------------------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shoppingOpen, setShoppingOpen] = useState(false)

  // --- navigation -----------------------------------------------------------
  const goto = useCallback(
    (i: number) => setStoredCurrent(Math.min(Math.max(i, 0), TOTAL_STEPS - 1)),
    [setStoredCurrent],
  )
  const next = useCallback(() => goto(current + 1), [current, goto])
  const prev = useCallback(() => goto(current - 1), [current, goto])

  const toggleChecked = useCallback(
    (i: number) => {
      const arr = (storedChecked.length === TOTAL_STEPS ? storedChecked : Array(TOTAL_STEPS).fill(false)).slice()
      arr[i] = !arr[i]
      setStoredChecked(arr)
    },
    [storedChecked, setStoredChecked],
  )

  // keyboard arrows (ignore when typing / dragging a slider)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const doneCount = checked.filter(Boolean).length
  const percent = Math.round((doneCount / TOTAL_STEPS) * 100)

  return (
    <div className="flex h-full flex-col">
      <TopBar
        percent={percent}
        doneCount={doneCount}
        total={TOTAL_STEPS}
        exploded={explodedTarget > 0.5}
        onToggleExploded={() => setExplodedTarget((t) => (t > 0.5 ? 0 : 1))}
        onResetCamera={() => setResetNonce((n) => n + 1)}
        onOpenShopping={() => setShoppingOpen(true)}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* sidebar — desktop */}
        <aside className="hidden w-60 shrink-0 border-r border-ink-600 bg-ink-800/40 md:block">
          <Sidebar current={current} checked={checked} onSelect={goto} onToggle={toggleChecked} />
        </aside>

        {/* sidebar — mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 border-r border-ink-600 bg-ink-800 shadow-2xl">
              <Sidebar
                current={current}
                checked={checked}
                onSelect={(i) => {
                  goto(i)
                  setSidebarOpen(false)
                }}
                onToggle={toggleChecked}
              />
            </div>
          </div>
        )}

        {/* main: text + 3D (3D stacks on top on narrow screens) */}
        <main className="flex flex-1 flex-col-reverse overflow-hidden md:flex-row">
          {/* text column */}
          <section className="flex w-full flex-col border-t border-ink-600 md:w-[440px] md:shrink-0 md:border-r md:border-t-0">
            <div className="flex-1 overflow-y-auto p-5">
              <StepContent step={step} controls={controls} update={update} />
            </div>
            {/* prev / next */}
            <div className="flex items-center justify-between gap-3 border-t border-ink-600 bg-ink-800/60 px-4 py-3">
              <button className="btn" onClick={prev} disabled={current === 0}>
                ← Prev
              </button>
              <span className="font-mono text-xs text-slate-500">
                use ← / → keys
              </span>
              <button className="btn btn-accent" onClick={next} disabled={current === TOTAL_STEPS - 1}>
                Next →
              </button>
            </div>
          </section>

          {/* 3D viewport */}
          <section className="relative h-[42vh] min-h-[260px] w-full md:h-auto md:flex-1">
            <Viewport
              preset={step.scene}
              controls={controls}
              onToggleLabels={() => setShowLabels((s) => !s)}
            />
          </section>
        </main>
      </div>

      <ShoppingList open={shoppingOpen} onClose={() => setShoppingOpen(false)} />
    </div>
  )
}
