import type { ReactNode } from 'react'
import type { Step } from '../types'

/** Inline monospace span for equations / numbers / part names. */
function M({ children }: { children: ReactNode }) {
  return <code className="rounded bg-ink-700 px-1 py-0.5 font-mono text-[0.85em] text-accent-glow">{children}</code>
}

export const STEPS: Step[] = [
  // ---------------------------------------------------------------- 1
  {
    id: 1,
    shortTitle: 'Overview',
    title: 'Overview — what you are building',
    goal: 'Understand the 3-axis balance and how it isolates lift, drag, and pitch.',
    scene: 'overview',
    instructions: [
      <>This is an <strong>external 3-axis force balance</strong>: the model rides a sting on a moving plate, and the plate floats on load cells that read force in three axes.</>,
      <>Two vertical S-beam cells — <strong>Lift&nbsp;A</strong> (upstream) and <strong>Lift&nbsp;B</strong> (downstream) — carry vertical load. Their <em>sum</em> is lift + weight; their <em>difference</em> gives the pitching moment.</>,
      <>One horizontal S-beam cell reads <strong>drag</strong> (the streamwise force).</>,
      <>The balance stays bolted to the tunnel; only the aircraft pitches (on the AoA bracket) so the cells always read true tunnel-axis lift and drag.</>,
      <>Open <strong>Parts &amp; build</strong> (top bar) for the exact parts list (with models) and a load-cell wiring guide — core build <M>~$530–700</M>, budget <M>$1000</M>. Order everything before cutting metal.</>,
      <>Orbit the model (drag / scroll). Toggle <strong>Exploded view</strong> to see how the parts stack.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Build order matters',
        body: <>Do <strong>not</strong> cut any metal until you have bench-tested all three load-cell channels (next step). A dead channel discovered after assembly costs days.</>,
      },
    ],
    why: <>A tunnel balance is only trustworthy if each axis reads one thing. This geometry isolates lift, drag, and pitch so your data maps directly to <M>C_L</M>, <M>C_D</M>, and <M>C_m</M>.</>,
  },

  // ---------------------------------------------------------------- 2
  {
    id: 2,
    shortTitle: 'Bench-test',
    title: 'Bench-test the electronics',
    goal: 'Prove all three load-cell channels read correctly before building anything.',
    scene: 'bench',
    instructions: [
      <>Wire each S-beam into the <strong>PhidgetBridge 1046</strong>: <M>red = E+</M>, <M>black = E−</M>, <M>green = S+</M>, <M>white = S−</M> (standard 4-wire bridge).</>,
      <>Open the Phidget Control Panel on the laptop and confirm all three bridge inputs report a stable value.</>,
      <>Press lightly on each cell by hand: the reading should move the expected direction and return to zero (no drift or hysteresis).</>,
      <>Set the bridge gain and data rate; note the no-load raw counts — this is your baseline for the wind-off tare later.</>,
      <>Label every cable at both ends: <strong>Lift A</strong>, <strong>Lift B</strong>, <strong>Drag</strong>.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Bench-test FIRST — never fabricate the frame before the electronics work',
        body: <>Catching a miswired bridge, dead cell, or noisy channel now is free. Catching it after everything is bolted together is not.</>,
      },
    ],
    why: <>The whole rest of the build assumes the sensors work. Five minutes on the bench here saves a teardown later.</>,
  },

  // ---------------------------------------------------------------- 3
  {
    id: 3,
    shortTitle: 'Base frame',
    title: 'Build the fixed base frame',
    goal: 'Assemble the rigid aluminum-extrusion frame that bolts to the tunnel floor.',
    scene: 'base',
    instructions: [
      <>Cut extrusion to a <M>0.4 m</M> square footprint; build the perimeter ring plus a center rail under the lift-cell stations.</>,
      <>Add one upright post on the <strong>upstream</strong> side to anchor the fixed end of the drag cell.</>,
      <>Keep everything square and stiff — check the diagonals. Any frame flex shows up directly as measurement error.</>,
      <>Locate and drill the tunnel mounting holes; the frame must not move relative to the tunnel.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Match T-nut size to your extrusion',
        body: <>2020, 2040, etc. all take different T-nuts. Order T-nuts <strong>with</strong> the extrusion so the slot size matches — see the Shopping-list gotchas.</>,
      },
    ],
    why: <>The frame is the datum. Everything the cells measure is referenced to it, so it must be stiff and stay put.</>,
  },

  // ---------------------------------------------------------------- 4
  {
    id: 4,
    shortTitle: 'Lift cells',
    title: 'Mount the vertical lift cells',
    goal: 'Stand the two 50 kg S-beam cells on the frame, spaced d = 0.30 m along the flow.',
    scene: 'liftCells',
    instructions: [
      <>Bolt <strong>Lift A</strong> (upstream) and <strong>Lift B</strong> (downstream) vertically to the center rail with centerline spacing <M>d = 0.30 m</M>.</>,
      <>Connect through <strong>rod ends</strong> so each cell is loaded purely <strong>axially</strong> — straight down its long axis.</>,
      <>Check both cells are plumb and at equal height so the plate will sit level.</>,
      <>The spacing sets the pitching-moment arm <M>d/2 = 0.15 m</M>: <M>M ≈ (F_B − F_A)·d/2</M>.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Axial load only — side loads destroy S-beam cells',
        body: <>Never let a cell take bending or shear. Rod ends exist precisely to keep the load on the cell axis.</>,
      },
    ],
    why: <>Two vertical cells at a known spacing are what let you separate <em>total lift</em> from <em>pitching moment</em> with two simple readings.</>,
  },

  // ---------------------------------------------------------------- 5
  {
    id: 5,
    shortTitle: 'Moving plate',
    title: 'Install the moving plate',
    goal: 'Drop the floating plate onto the two lift cells.',
    scene: 'plate',
    instructions: [
      <>Lower the plate onto the rod ends atop both cells; fasten it <strong>only</strong> to the cells.</>,
      <>Confirm the plate floats free — it must touch nothing but the cells (no rubbing on the frame, wires, or stops).</>,
      <>Check it sits level; shim cell heights if needed.</>,
      <>Press gently down: both cells should load together and return to zero on release.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'The plate must float free',
        body: <>Any contact between plate and frame creates a parallel load path — that contact, not your cells, then carries part of the load and corrupts every reading.</>,
      },
      {
        kind: 'warning',
        title: 'Handle without side-loading',
        body: <>Support the plate as you set it down; don’t let its weight yank a cell sideways.</>,
      },
    ],
    why: <>The plate is the single rigid body all loads pass through. Its job is to touch the cells and nothing else.</>,
  },

  // ---------------------------------------------------------------- 6
  {
    id: 6,
    shortTitle: 'Drag cell',
    title: 'Install the drag cell',
    goal: 'Couple the plate to the frame with the horizontal 5 kg cell to read streamwise drag.',
    scene: 'dragCell',
    instructions: [
      <>Mount the <M>5 kg</M> S-beam horizontally along the flow axis, between the upstream frame post and the plate.</>,
      <>Use rod ends at both ends so it reads pure axial (drag) load and tolerates the plate’s tiny vertical motion.</>,
      <>Align it exactly with the flow direction; misalignment mixes lift into the drag channel.</>,
      <>This cell is the only streamwise restraint — it sets the plate’s fore-aft position.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Alignment is everything for drag',
        body: <>Drag here is small (<M>~15–23 N</M>) next to lift (<M>up to ~340 N</M>). A few degrees off-axis leaks big lift into your tiny drag signal.</>,
      },
      {
        kind: 'warning',
        title: 'Axial only',
        body: <>Like the lift cells, the drag cell takes <strong>no</strong> side load — rod ends both ends.</>,
      },
    ],
    why: <>Isolating a small force next to a large one is the hard part of any balance. Clean alignment is what makes the drag number believable.</>,
  },

  // ---------------------------------------------------------------- 7
  {
    id: 7,
    shortTitle: 'Sting + AoA',
    title: 'Add the sting and AoA bracket',
    goal: 'Erect the sting and pitch pivot, then mount the model.',
    scene: 'sting',
    instructions: [
      <>Clamp the sting vertically to the plate center and mount the <strong>AoA bracket</strong> on top.</>,
      <>Mount the FMS Fox on the bracket near its CG; the bracket pin is the <strong>pitch (lateral) axis</strong>.</>,
      <>Set angle of attack by pitching the <strong>aircraft only</strong> — never the balance. Use the slider to preview <M>−5°</M> to <M>+20°</M>.</>,
      <>Lock the chosen AoA with the bracket clamp before running.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Set the overload stops before handling the mounted aircraft',
        body: <>The 3 m wing is a long lever. Fit the stops (next step) before you mount or move the model.</>,
      },
    ],
    why: <>Pitching only the model keeps the balance axes aligned with the tunnel, so the cells read true tunnel-axis lift and drag at every AoA.</>,
  },

  // ---------------------------------------------------------------- 8
  {
    id: 8,
    shortTitle: 'Stops + wiring',
    title: 'Overload stops and wiring',
    goal: 'Protect the cells and route wiring so it never carries load.',
    scene: 'stops',
    instructions: [
      <>Fit hard stops near each plate corner with a small gap (<M>~4 mm</M>) — clear in normal running, catching on overload.</>,
      <>Set the gap with feeler gauges; verify the plate still floats freely afterward.</>,
      <>Route all signal wires in slack service loops from plate to frame; strain-relieve on the <strong>frame</strong> side.</>,
      <>Double-check nothing — wire, tie, or tape — bridges the plate to the frame.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Stops before handling',
        body: <>A knock on the 3 m wing can overload a 50 kg cell. Stops save expensive cells from gusts and mishandling.</>,
      },
      {
        kind: 'warning',
        title: 'Keep wires slack',
        body: <>A taut wire is an extra, uncalibrated load path that quietly biases your readings. Always leave a service loop.</>,
      },
    ],
    why: <>Stops protect the hardware; slack wiring protects the data. Both keep the load path clean.</>,
  },

  // ---------------------------------------------------------------- 9
  {
    id: 9,
    shortTitle: 'Calibrate',
    title: 'Calibrate with known masses',
    goal: 'Turn raw counts into newtons using F = m·g on the fully assembled rig.',
    scene: 'calibrate',
    instructions: [
      <>With the rig <strong>fully assembled</strong>, hang known masses to load the <strong>lift</strong> axis straight down; record counts vs. force.</>,
      <>Run a string over a pulley to apply known <strong>horizontal</strong> loads to the <strong>drag</strong> axis; record counts vs. force.</>,
      <>Apply several masses up and down to get the slope (N/count) and check linearity + hysteresis.</>,
      <>Use the slider to see each known mass become a force: <M>F = m·g</M>.</>,
      <>Record the model’s wind-off weight as the lift-axis tare (<M>≈ 45 N</M>).</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Calibrate the assembled rig — not a cell on the bench',
        body: <>In-situ calibration captures friction, wire pull, and alignment in the real load path. A bare-cell calibration misses all of it.</>,
      },
    ],
    why: <>Calibration is the bridge from electrical counts to physical newtons. Do it in place so it includes every real-world load path.</>,
  },

  // ---------------------------------------------------------------- 10
  {
    id: 10,
    shortTitle: 'Run the test',
    title: 'Run the test',
    goal: 'Tare wind-off, run wind-on, and read live lift, drag, and pitch.',
    scene: 'run',
    instructions: [
      <>Zero (tare) every channel with the tunnel <strong>off</strong> — this subtracts model weight and rig preload.</>,
      <>Bring the tunnel to the set airspeed, let the readings settle, then log the raw counts.</>,
      <>Convert with your calibration and subtract the wind-off tare to get aerodynamic lift, drag, and moment.</>,
      <>Sweep AoA and airspeed; log <strong>raw + processed</strong> data at every point.</>,
      <>Explore with the sliders: <M>q = ½ρV²</M>, <M>L = C_L·q·S</M>, <M>D = C_D·q·S</M>, <M>Re = ρVc/μ</M>.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Tare wind-off, then subtract from wind-on',
        body: <>Skip this and the model’s 45 N weight pollutes every lift number.</>,
      },
      {
        kind: 'warning',
        title: 'Mind the envelope',
        body: <>Lift reaches <M>~340 N</M> near stall at 25 m/s (<M>~390 N</M> vertical with weight). Make sure cells and frame have margin.</>,
      },
    ],
    why: <>Good tunnel data is disciplined bookkeeping — tare, run, convert, log raw + processed. The physics is the easy part.</>,
  },
]

export const TOTAL_STEPS = STEPS.length
