import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import type { ScenePreset, PartName, Controls } from '../types'
import { POS, COLORS, SCENE } from '../config'

import { BaseFrame } from './parts/BaseFrame'
import { LiftCell } from './parts/LiftCell'
import { MovingPlate } from './parts/MovingPlate'
import { DragCell } from './parts/DragCell'
import { Clevises } from './parts/Clevises'
import { Sting } from './parts/Sting'
import { AoABracket } from './parts/AoABracket'
import { Aircraft } from './parts/Aircraft'
import { OverloadStops } from './parts/OverloadStops'
import { BenchSetup } from './parts/BenchSetup'
import { CalibrationRig } from './parts/CalibrationRig'
import { Streamlines } from './parts/Streamlines'
import { Wire } from './parts/Wire'
import { CameraRig } from './CameraRig'

// ---------------------------------------------------------------------------
// Per-preset behavior table. `active` lists parts shown at full opacity; any
// rig part not in `active` is faded. `highlight` glows. `activeAll` skips fading.
// ---------------------------------------------------------------------------
interface PresetConfig {
  showRig: boolean
  activeAll: boolean
  active: Set<PartName>
  highlight: Set<PartName>
  autoRotate: boolean
  liftArrows: boolean
  dragArrow: boolean
  plateDrop: boolean
  slackWires: boolean
  showBench: boolean
  showCalibration: boolean
  showStreamlines: boolean
  labels: Partial<Record<'plate' | 'sting' | 'bracket' | 'stops' | 'aircraft', boolean>>
}

const S = (...p: PartName[]) => new Set(p)

function presetConfig(preset: ScenePreset): PresetConfig {
  const base: PresetConfig = {
    showRig: true,
    activeAll: false,
    active: S(),
    highlight: S(),
    autoRotate: false,
    liftArrows: false,
    dragArrow: false,
    plateDrop: false,
    slackWires: false,
    showBench: false,
    showCalibration: false,
    showStreamlines: false,
    labels: {},
  }
  switch (preset) {
    case 'overview':
      return { ...base, activeAll: true, autoRotate: true, labels: { aircraft: true } }
    case 'bench':
      return { ...base, showRig: false, showBench: true }
    case 'base':
      return { ...base, active: S('baseFrame'), highlight: S('baseFrame') }
    case 'liftCells':
      return {
        ...base,
        active: S('baseFrame', 'liftA', 'liftB', 'clevises'),
        highlight: S('liftA', 'liftB'),
        liftArrows: true,
      }
    case 'plate':
      return {
        ...base,
        active: S('baseFrame', 'liftA', 'liftB', 'clevises', 'plate'),
        highlight: S('plate'),
        plateDrop: true,
        labels: { plate: true },
      }
    case 'dragCell':
      return {
        ...base,
        active: S('baseFrame', 'liftA', 'liftB', 'clevises', 'plate', 'dragCell'),
        highlight: S('dragCell'),
        dragArrow: true,
      }
    case 'sting':
      return {
        ...base,
        active: S('baseFrame', 'liftA', 'liftB', 'clevises', 'plate', 'dragCell', 'sting', 'bracket', 'aircraft'),
        highlight: S('sting', 'bracket'),
        labels: { sting: true, bracket: true },
      }
    case 'stops':
      return { ...base, activeAll: true, highlight: S('stops'), slackWires: true, labels: { stops: true } }
    case 'calibrate':
      return { ...base, activeAll: true, showCalibration: true }
    case 'run':
      return { ...base, activeAll: true, showStreamlines: true, labels: { aircraft: true } }
  }
}

/** Draped, intentionally-slack signal cables (step 8). */
function SlackWires() {
  const pts: [number, number, number][][] = [
    [
      [0.12, SCENE.plate.y, 0.1],
      [0.16, 0.05, 0.16],
      [0.18, SCENE.frame.railThickness, 0.18],
    ],
    [
      [-0.12, SCENE.plate.y, 0.1],
      [-0.16, 0.04, 0.16],
      [-0.18, SCENE.frame.railThickness, 0.18],
    ],
    [
      [0.0, SCENE.plate.y, -0.1],
      [0.04, 0.05, -0.16],
      [0.06, SCENE.frame.railThickness, -0.18],
    ],
  ]
  return (
    <>
      {pts.map((p, i) => (
        <Wire key={i} points={p} color={i % 2 ? COLORS.wireGreen : COLORS.wireWhite} radius={0.0026} glow />
      ))}
    </>
  )
}

export function Scene({ preset, controls }: { preset: ScenePreset; controls: Controls }) {
  const cfg = presetConfig(preset)
  const { explodedAmount, pitchDeg, airspeed, calMass, resetCameraNonce } = controls

  const faded = (p: PartName) => cfg.showRig && !cfg.activeAll && !cfg.active.has(p)
  const hl = (p: PartName) => cfg.highlight.has(p)

  // --- plate "lowering on" animation (step 5) -------------------------------
  const plateDropRef = useRef<Group>(null)
  const presetRef = useRef(preset)
  presetRef.current = preset
  useEffect(() => {
    if (preset === 'plate' && plateDropRef.current) plateDropRef.current.position.y = 0.16
  }, [preset])
  useFrame((_, dt) => {
    const g = plateDropRef.current
    if (!g) return
    const target = 0
    g.position.y = presetRef.current === 'plate' ? THREE.MathUtils.damp(g.position.y, target, 4, dt) : 0
  })

  return (
    <>
      {/* ---- lighting (soft) ---- */}
      <hemisphereLight intensity={0.55} color="#bcd3ff" groundColor="#0b0f17" />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />

      {/* ---- ground grid + soft contact shadow ---- */}
      <Grid
        position={[0, 0.001, 0]}
        args={[12, 12]}
        cellSize={0.1}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={0.5}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={9}
        fadeStrength={1.5}
        infiniteGrid
        followCamera={false}
      />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.5} scale={4} blur={2.2} far={2} resolution={1024} color="#000000" />

      {/* ---- camera + controls ---- */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={cfg.autoRotate}
        autoRotateSpeed={0.6}
        minDistance={0.4}
        maxDistance={8}
        target={[0, 0.25, 0]}
      />
      <CameraRig preset={preset} resetNonce={resetCameraNonce} />

      {/* =====================================================================
          STEP 2 — bench tableau (replaces the rig)
         ===================================================================== */}
      {cfg.showBench && <BenchSetup />}

      {/* =====================================================================
          THE RIG — every structural part, faded/highlighted per step
         ===================================================================== */}
      {cfg.showRig && (
        <group>
          <BaseFrame highlight={hl('baseFrame')} faded={faded('baseFrame')} explodedAmount={explodedAmount} />

          <LiftCell
            base={POS.liftA}
            explodeOffset={[-0.06, -0.02, 0]}
            label="Lift A · DYMH-103 50 kg (upstream)"
            highlight={hl('liftA')}
            faded={faded('liftA')}
            explodedAmount={explodedAmount}
            showAxialArrow={cfg.liftArrows}
            arrowLabel="axial load only"
          />
          <LiftCell
            base={POS.liftB}
            explodeOffset={[0.06, -0.02, 0]}
            label="Lift B · DYMH-103 50 kg (downstream)"
            highlight={hl('liftB')}
            faded={faded('liftB')}
            explodedAmount={explodedAmount}
            showAxialArrow={cfg.liftArrows}
            arrowLabel="axial load only"
          />

          <Clevises highlight={hl('clevises')} faded={faded('clevises')} explodedAmount={explodedAmount} />

          <DragCell
            highlight={hl('dragCell')}
            faded={faded('dragCell')}
            explodedAmount={explodedAmount}
            showDragArrow={cfg.dragArrow}
          />

          {/* plate is wrapped so step 5 can animate it lowering on */}
          <group ref={plateDropRef}>
            <MovingPlate
              highlight={hl('plate')}
              faded={faded('plate')}
              explodedAmount={explodedAmount}
              showLabel={cfg.labels.plate}
            />
          </group>

          <Sting highlight={hl('sting')} faded={faded('sting')} explodedAmount={explodedAmount} showLabel={cfg.labels.sting} />
          <AoABracket
            highlight={hl('bracket')}
            faded={faded('bracket')}
            explodedAmount={explodedAmount}
            showLabel={cfg.labels.bracket}
          />
          <Aircraft
            highlight={hl('aircraft')}
            faded={faded('aircraft')}
            explodedAmount={explodedAmount}
            pitchDeg={pitchDeg}
            showLabel={cfg.labels.aircraft}
          />
          <OverloadStops
            highlight={hl('stops')}
            faded={faded('stops')}
            explodedAmount={explodedAmount}
            showLabel={cfg.labels.stops}
          />

          {cfg.slackWires && <SlackWires />}
          {cfg.showCalibration && <CalibrationRig calMass={calMass} />}
          {cfg.showStreamlines && <Streamlines airspeed={airspeed} />}
        </group>
      )}
    </>
  )
}
