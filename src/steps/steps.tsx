import type { ReactNode } from 'react'
import type { Step } from '../types'
import { VENDORS } from '../photos'

/** Inline monospace span for equations / numbers / part names. */
function M({ children }: { children: ReactNode }) {
  return <code className="rounded bg-ink-700 px-1 py-0.5 font-mono text-[0.85em] text-accent-glow">{children}</code>
}

export const STEPS: Step[] = [
  // ================================================================ 1
  {
    id: 1,
    shortTitle: 'Overview',
    title: 'Overview — what you are building',
    goal: 'Understand the 3-axis balance and lay out your parts & tools, LEGO-style.',
    scene: 'overview',
    heroPhoto: 'load-cell',
    needParts: [
      { qty: '2×', name: 'S-beam load cell, 50 kg', photo: 'load-cell', vendor: VENDORS.dymh103, note: 'DYMH-103 — vertical lift A & B' },
      { qty: '1×', name: 'S-beam load cell, 5 kg', photo: 'load-cell', vendor: VENDORS.dymh103, note: 'DYMH-103 — horizontal drag' },
      { qty: '1×', name: 'PhidgetBridge 1046_0B', vendor: VENDORS.phidget1046, note: '4-input bridge DAQ (USB)' },
      { qty: '1×', name: 'Matek ASPD-4525 + pitot', photo: 'pitot', vendor: VENDORS.matek4525, note: 'MS4525DO airspeed (I²C)' },
      { qty: '~6 m', name: '2020 T-slot extrusion', photo: 'extrusion', note: 'frame + drag post' },
      { qty: '6×', name: 'Rod ends / heim joints', photo: 'rod-end', note: 'axial linkages' },
    ],
    needTools: [
      { name: 'Hex (Allen) keys', photo: 'hex-keys' },
      { name: 'Digital caliper', photo: 'caliper' },
      { name: 'Digital multimeter', photo: 'multimeter' },
      { name: 'Hacksaw or miter saw, file, engineer’s square, drill, feeler gauges' },
    ],
    instructions: [
      <>This is an <strong>external 3-axis force balance</strong>: the model rides a sting on a moving plate, and the plate floats on load cells that read force in three axes.</>,
      <>Two vertical S-beam cells — <strong>Lift&nbsp;A</strong> (upstream) and <strong>Lift&nbsp;B</strong> (downstream) — carry vertical load. Their <em>sum</em> is lift + weight; their <em>difference</em> gives the pitching moment.</>,
      <>One horizontal S-beam cell reads <strong>drag</strong>. The balance stays bolted to the tunnel; only the aircraft pitches (on the AoA bracket).</>,
      <>Open <strong>Parts &amp; build</strong> (top bar) and order everything first — exact models, ~$530–700, budget <M>$1000</M>. Lay the parts out like a LEGO inventory before you start.</>,
      <>Orbit the model (drag / scroll). Toggle <strong>Exploded view</strong> to preview how the parts stack together.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Build order matters',
        body: <>Do <strong>not</strong> cut any metal until you have bench-tested all three load-cell channels (Step 2).</>,
      },
    ],
    why: <>A tunnel balance is only trustworthy if each axis reads one thing. This geometry isolates lift, drag, and pitch so your data maps directly to <M>C_L</M>, <M>C_D</M>, and <M>C_m</M>.</>,
  },

  // ================================================================ 2
  {
    id: 2,
    shortTitle: 'Bench-test',
    title: 'Bench-test the electronics',
    goal: 'Prove all three load-cell channels read correctly before building anything.',
    scene: 'bench',
    heroPhoto: 'load-cell',
    needParts: [
      { qty: '3×', name: 'S-beam load cells', photo: 'load-cell', vendor: VENDORS.dymh103, note: '2× 50 kg + 1× 5 kg' },
      { qty: '1×', name: 'PhidgetBridge 1046_0B', vendor: VENDORS.phidget1046, note: 'USB Mini-USB to laptop' },
      { qty: '1×', name: 'Mini-USB cable', note: 'bridge → laptop' },
    ],
    needTools: [
      { name: 'Digital multimeter', photo: 'multimeter' },
      { name: 'Laptop (Phidget Control Panel)' },
      { name: 'Small flat screwdriver (terminal blocks)' },
    ],
    instructions: [
      <>Lay out the three cells on the bench. On each, find the four wires: <M>red = E+</M>, <M>black = E−</M>, <M>green = S+</M>, <M>white = S−</M> (the FUTEK photo above prints this code on the body).</>,
      <>If a cell is unmarked, ohm out the wires with the multimeter: the pair with the <strong>higher</strong> resistance is excitation (input), the other pair is signal (output).</>,
      <>Wire each cell into its own PhidgetBridge channel: excitation pair → the channel’s <M>5V</M> &amp; <M>G</M>, signal pair → <M>+</M> &amp; <M>−</M>. Tighten the terminal blocks.</>,
      <>Plug the bridge into the laptop (Mini-USB). Open the <strong>Phidget Control Panel</strong> and open all three BridgeInput channels.</>,
      <>Set <strong>Gain ×128</strong> and a sensible data rate; note each channel’s no-load raw value (your wind-off baseline).</>,
      <>Press lightly on each cell by hand: the reading must move the expected way and return to zero (no drift/hysteresis). If a channel reads backwards, swap its <M>S+</M>/<M>S−</M>.</>,
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

  // ================================================================ 3
  {
    id: 3,
    shortTitle: 'Base frame',
    title: 'Build the fixed base frame',
    goal: 'Cut and bolt a rigid 0.4 m square of T-slot extrusion that bolts to the tunnel.',
    scene: 'base',
    heroPhoto: 'extrusion',
    needParts: [
      { qty: '~2 m', name: '2020 T-slot extrusion', photo: 'extrusion', note: 'cut list below' },
      { qty: '8×', name: 'Corner brackets (90°)', note: 'with M5 T-nuts' },
      { qty: '~24×', name: 'M5 button screws + T-nuts', photo: 'screws', note: 'match your slot (6 mm → M5)' },
    ],
    needTools: [
      { name: 'Hacksaw or miter saw' },
      { name: 'Digital caliper', photo: 'caliper' },
      { name: 'Engineer’s square + tape' },
      { name: 'Hex keys + flat file (deburr)', photo: 'hex-keys' },
    ],
    instructions: [
      <><strong>Cut list</strong> (2020): two rails @ <M>400 mm</M> (front/back), two @ <M>360 mm</M> (sides), one @ <M>360 mm</M> (center rail), one @ <M>150 mm</M> (drag-cell post).</>,
      <>Deburr every cut end with the file so faces sit flat and square.</>,
      <>Lay the four perimeter rails into a <M>400 × 400 mm</M> square (the 400 rails capture the 360 rails at each end).</>,
      <>Join each corner with a bracket + two M5 T-nuts/screws. Run all screws finger-tight first.</>,
      <>Drop the <M>360 mm</M> center rail across the middle (this is where the lift cells stand) and bracket both ends.</>,
      <>Stand the <M>150 mm</M> post upright on the <strong>upstream</strong> edge and bracket it — this is the drag cell’s fixed anchor.</>,
      <>Check square: measure both diagonals; adjust until they’re equal, then torque every screw (~5 N·m).</>,
      <>Mark and drill the tunnel-floor mounting holes; bolt the frame down so it cannot move relative to the tunnel.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Match the T-nut size to your extrusion',
        body: <>2020 comes in 5 mm and 6 mm slots (M4/M5 vs M6). Order T-nuts and brackets <strong>with</strong> the extrusion so the slot fits.</>,
      },
    ],
    why: <>The frame is the datum. Everything the cells measure is referenced to it, so it must be stiff and stay put.</>,
  },

  // ================================================================ 4
  {
    id: 4,
    shortTitle: 'Lift cells',
    title: 'Mount the vertical lift cells',
    goal: 'Stand the two 50 kg S-beams on the center rail, spaced d = 0.30 m along the flow.',
    scene: 'liftCells',
    heroPhoto: 'rod-end',
    needParts: [
      { qty: '2×', name: 'S-beam load cell, 50 kg', photo: 'load-cell', vendor: VENDORS.dymh103, note: 'Lift A + Lift B' },
      { qty: '2×', name: 'Rod ends (top studs)', photo: 'rod-end', note: 'thread = the cell stud' },
      { qty: '4×', name: 'M5 screws + T-nuts', photo: 'screws' },
    ],
    needTools: [
      { name: 'Hex keys', photo: 'hex-keys' },
      { name: 'Digital caliper', photo: 'caliper' },
      { name: 'Two spanners (jam-nut the rod ends)' },
    ],
    instructions: [
      <>Thread a rod end onto the <strong>top</strong> stud of each cell and lock it with a jam nut (the bottom stud bolts to the frame).</>,
      <>Bolt <strong>Lift A</strong> (upstream) to the center rail; bolt <strong>Lift B</strong> (downstream) so the two centerlines are <M>d = 300 mm</M> apart (set with the caliper/tape).</>,
      <>Check both cells are vertical (plumb) and at exactly equal height so the plate will sit level — shim if needed.</>,
      <>Confirm each cell’s long axis is vertical: the load must travel straight down the cell, never sideways.</>,
      <>Note: this spacing sets the pitching-moment arm <M>d/2 = 0.15 m</M>, so <M>M ≈ (F_B − F_A)·d/2</M>.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Axial load only — side loads destroy S-beam cells',
        body: <>Never let a cell take bending or shear. The rod ends exist precisely to keep the load on the cell axis.</>,
      },
    ],
    why: <>Two vertical cells at a known spacing are what let you separate <em>total lift</em> from <em>pitching moment</em> with two simple readings.</>,
  },

  // ================================================================ 5
  {
    id: 5,
    shortTitle: 'Moving plate',
    title: 'Install the moving plate',
    goal: 'Drill and lower the floating plate onto the two lift cells — touching nothing else.',
    scene: 'plate',
    needParts: [
      { qty: '1×', name: 'Aluminium plate (6 mm)', note: 'cut from 300×300 stock to suit' },
      { qty: '2×', name: 'Rod-end studs → plate', photo: 'rod-end', note: 'couple plate to each cell top' },
      { qty: '4×', name: 'M5 fasteners', photo: 'screws' },
    ],
    needTools: [
      { name: 'Drill + bits' },
      { name: 'Digital caliper', photo: 'caliper' },
      { name: 'Hex keys + deburr tool', photo: 'hex-keys' },
    ],
    instructions: [
      <>Transfer the two rod-end hole positions from the cell tops onto the plate (caliper off the <M>300 mm</M> spacing).</>,
      <>Drill the two clearance holes; deburr both faces so the plate seats flat.</>,
      <>Lower the plate onto the rod ends and fasten it <strong>only</strong> to the two cells.</>,
      <>Check the plate <strong>floats free</strong>: it must not touch the frame, wires, or anything else — only the cells.</>,
      <>Check it sits level; shim cell heights if it rocks.</>,
      <>Press gently down: both cells should load together and return to zero on release.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'The plate must float free',
        body: <>Any contact between plate and frame creates a parallel load path — that contact, not your cells, then carries part of the load and corrupts every reading.</>,
      },
      { kind: 'warning', title: 'Handle without side-loading', body: <>Support the plate as you set it down; don’t let its weight yank a cell sideways.</> },
    ],
    why: <>The plate is the single rigid body all loads pass through. Its job is to touch the cells and nothing else.</>,
  },

  // ================================================================ 6
  {
    id: 6,
    shortTitle: 'Drag cell',
    title: 'Install the drag cell',
    goal: 'Couple the plate to the frame post with the horizontal 5 kg cell to read drag.',
    scene: 'dragCell',
    heroPhoto: 'rod-end',
    needParts: [
      { qty: '1×', name: 'S-beam load cell, 5 kg', photo: 'load-cell', vendor: VENDORS.dymh103, note: 'horizontal' },
      { qty: '2×', name: 'Rod ends (both ends)', photo: 'rod-end' },
      { qty: '4×', name: 'M5 fasteners', photo: 'screws' },
    ],
    needTools: [
      { name: 'Hex keys', photo: 'hex-keys' },
      { name: 'Two spanners' },
      { name: 'Engineer’s square (align to flow)' },
    ],
    instructions: [
      <>Thread a rod end onto <strong>each</strong> end of the 5 kg cell and jam-nut them.</>,
      <>Mount the cell horizontally along the flow axis between the upstream <strong>frame post</strong> (fixed) and the <strong>plate</strong> (moving).</>,
      <>Square it exactly to the flow direction — any tilt mixes lift into the drag channel.</>,
      <>Confirm the plate can still move its tiny vertical amount freely; the drag cell only restrains fore-aft.</>,
      <>Gently push the plate downstream: only the Drag channel should respond.</>,
    ],
    callouts: [
      {
        kind: 'warning',
        title: 'Alignment is everything for drag',
        body: <>Drag here is small (<M>~15–23 N</M>) next to lift (<M>up to ~340 N</M>). A few degrees off-axis leaks big lift into your tiny drag signal.</>,
      },
      { kind: 'warning', title: 'Axial only', body: <>Rod ends both ends — the drag cell takes <strong>no</strong> side load either.</> },
    ],
    why: <>Isolating a small force next to a large one is the hard part of any balance. Clean alignment is what makes the drag number believable.</>,
  },

  // ================================================================ 7
  {
    id: 7,
    shortTitle: 'Sting + AoA',
    title: 'Add the sting and AoA bracket',
    goal: 'Erect the sting and pitch pivot, then mount the model at its CG.',
    scene: 'sting',
    needParts: [
      { qty: '1×', name: 'Sting rod + plate clamp', note: 'rises from plate center' },
      { qty: '1×', name: 'AoA bracket (clevis + pin)', note: 'the pitch pivot' },
      { qty: '4×', name: 'M5 fasteners', photo: 'screws' },
    ],
    needTools: [
      { name: 'Hex keys', photo: 'hex-keys' },
      { name: 'Digital caliper', photo: 'caliper' },
      { name: 'Drill (sting clamp holes)' },
    ],
    instructions: [
      <>Clamp the sting vertically to the <strong>center</strong> of the plate; check it’s plumb.</>,
      <>Mount the AoA bracket on top — its pin is the <strong>pitch (lateral) axis</strong>.</>,
      <>Mount the FMS Fox on the bracket near its <strong>CG</strong> so it balances roughly level.</>,
      <>Set angle of attack by pitching the <strong>aircraft only</strong>, never the balance. Use the slider below to preview <M>−5°</M> to <M>+20°</M>.</>,
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

  // ================================================================ 8
  {
    id: 8,
    shortTitle: 'Stops + wiring',
    title: 'Overload stops and wiring',
    goal: 'Protect the cells with corner stops and route wiring so it never carries load.',
    scene: 'stops',
    needParts: [
      { qty: '4×', name: 'Hard stop blocks', note: 'fixed to frame, ~4 mm gap' },
      { qty: '1 lot', name: 'Shielded signal cable + ties', note: 'service loops' },
      { qty: '8×', name: 'M5 fasteners', photo: 'screws' },
    ],
    needTools: [
      { name: 'Feeler gauges (set the gap)' },
      { name: 'Hex keys', photo: 'hex-keys' },
      { name: 'Multimeter (shield continuity)', photo: 'multimeter' },
    ],
    instructions: [
      <>Fit a hard stop near each plate corner, fixed to the frame, with a <M>~4 mm</M> gap set by feeler gauges.</>,
      <>Re-check the plate still <strong>floats freely</strong> after fitting the stops (it must not touch them in normal running).</>,
      <>Route every signal wire in a slack <strong>service loop</strong> from plate to frame; strain-relieve on the <strong>frame</strong> side.</>,
      <>Ground each cable shield at the <strong>bridge end only</strong>; keep wiring away from motors and mains.</>,
      <>Final check: nothing — wire, tie, or tape — bridges the plate to the frame.</>,
    ],
    callouts: [
      { kind: 'warning', title: 'Stops before handling', body: <>A knock on the 3 m wing can overload a 50 kg cell. Stops save expensive cells from gusts and mishandling.</> },
      { kind: 'warning', title: 'Keep wires slack', body: <>A taut wire is an extra, uncalibrated load path that quietly biases your readings. Always leave a service loop.</> },
    ],
    why: <>Stops protect the hardware; slack wiring protects the data. Both keep the load path clean.</>,
  },

  // ================================================================ 9
  {
    id: 9,
    shortTitle: 'Calibrate',
    title: 'Calibrate with known masses',
    goal: 'Turn raw counts into newtons using F = m·g on the fully assembled rig.',
    scene: 'calibrate',
    heroPhoto: 'weights',
    needParts: [
      { qty: '1 set', name: 'Known calibration masses', photo: 'weights', note: '~10 kg total, F = m·g' },
      { qty: '1×', name: 'Pulley + braided line', note: 'horizontal load on drag axis' },
      { qty: '1×', name: 'Hook / hanger', note: 'mass → cell' },
    ],
    needTools: [
      { name: 'Laptop (log counts vs. force)' },
      { name: 'Digital caliper', photo: 'caliper' },
    ],
    instructions: [
      <>With the rig <strong>fully assembled</strong>, hang known masses to load the <strong>lift</strong> axis straight down; record raw counts vs. force. Use the slider below to see <M>F = m·g</M>.</>,
      <>Run a string over the pulley to apply known <strong>horizontal</strong> loads to the <strong>drag</strong> axis; record counts vs. force.</>,
      <>Apply several masses up and down to get the slope (<M>N/count</M>) and check linearity + hysteresis.</>,
      <>Fit a line through each axis’ points — that slope and offset is your calibration.</>,
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

  // ================================================================ 10
  {
    id: 10,
    shortTitle: 'Run the test',
    title: 'Run the test',
    goal: 'Tare wind-off, run wind-on, and read live lift, drag, and pitch.',
    scene: 'run',
    heroPhoto: 'pitot',
    needParts: [
      { qty: '1×', name: 'Matek ASPD-4525 + pitot', photo: 'pitot', vendor: VENDORS.matek4525, note: 'MS4525DO airspeed' },
      { qty: '1×', name: 'Arduino Nano', photo: 'arduino', note: 'reads I²C → USB' },
    ],
    needTools: [{ name: 'Laptop (logging)' }, { name: 'USB cables' }],
    instructions: [
      <>Mount the pitot in clean flow with its <strong>total port facing straight upstream</strong>; wire the MS4525DO (I²C) to the Arduino and stream airspeed over USB.</>,
      <>Zero (tare) every channel with the tunnel <strong>off</strong> — this subtracts model weight and rig preload.</>,
      <>Bring the tunnel to the set airspeed, let readings settle, then log the raw counts.</>,
      <>Convert with your calibration and subtract the wind-off tare to get aerodynamic lift, drag, and moment.</>,
      <>Sweep AoA and airspeed; log <strong>raw + processed</strong> data at every point. Explore the sliders below: <M>q = ½ρV²</M>, <M>L = C_L·q·S</M>, <M>D = C_D·q·S</M>, <M>Re = ρVc/μ</M>.</>,
    ],
    callouts: [
      { kind: 'warning', title: 'Tare wind-off, then subtract from wind-on', body: <>Skip this and the model’s 45 N weight pollutes every lift number.</> },
      { kind: 'warning', title: 'Mind the envelope', body: <>Lift reaches <M>~340 N</M> near stall at 25 m/s (<M>~390 N</M> vertical with weight). Make sure cells and frame have margin.</> },
    ],
    why: <>Good tunnel data is disciplined bookkeeping — tare, run, convert, log raw + processed. The physics is the easy part.</>,
  },
]

export const TOTAL_STEPS = STEPS.length
