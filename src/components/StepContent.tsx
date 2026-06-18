import { AnimatePresence, motion } from 'framer-motion'
import type { Controls, Step } from '../types'
import { Callout } from './Callout'
import { StepControls } from './StepControls'
import { LiveReadout } from './LiveReadout'
import { HeroPhoto, NeedPanel } from './Photos'

/**
 * The text/instruction side of a step. Animates in/out with Framer Motion when
 * the step changes. Hosts the per-step sliders and (on the run step) the live
 * readout panel.
 */
export function StepContent({
  step,
  controls,
  update,
}: {
  step: Step
  controls: Controls
  update: (patch: Partial<Controls>) => void
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="flex flex-col gap-5"
      >
        {/* header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="chip border-accent/40 text-accent">Step {step.id} / 10</span>
            <span className="chip">{step.shortTitle}</span>
          </div>
          <h2 className="text-2xl font-semibold leading-tight text-slate-100">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            <span className="mr-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">Goal</span>
            {step.goal}
          </p>
        </div>

        {/* large reference photo for this step (real, licensed) */}
        {step.heroPhoto && <HeroPhoto photo={step.heroPhoto} />}

        {/* LEGO-style "you'll need" parts + tools, each with a real photo */}
        <NeedPanel parts={step.needParts} tools={step.needTools} />

        {/* per-step interactive controls */}
        <StepControls preset={step.scene} controls={controls} update={update} />

        {/* live readout on the run step */}
        {step.scene === 'run' && <LiveReadout airspeed={controls.airspeed} pitchDeg={controls.pitchDeg} />}

        {/* numbered instructions */}
        <ol className="flex flex-col gap-2.5">
          {step.instructions.map((ins, i) => (
            <li key={i} className="flex gap-3">
              <span className="tnum mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-slate-300">{ins}</span>
            </li>
          ))}
        </ol>

        {/* callouts */}
        {step.callouts.length > 0 && (
          <div className="flex flex-col gap-2">
            {step.callouts.map((c, i) => (
              <Callout key={i} c={c} />
            ))}
          </div>
        )}

        {/* why this matters */}
        <div className="rounded-r-lg border-l-2 border-accent bg-ink-800 px-4 py-3">
          <div className="eyebrow mb-1 text-accent">Why this matters</div>
          <p className="text-sm leading-relaxed text-slate-300">{step.why}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
