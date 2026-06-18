import { useContext } from 'react'
import { Html } from '@react-three/drei'
import { COLORS } from '../config'
import { LabelsContext } from './LabelsContext'

/**
 * A billboard text label that always faces the camera (drei <Html>).
 * Used to name parts and axes directly in the 3D scene.
 */
export function Label({
  position,
  text,
  tone = 'default',
}: {
  position: [number, number, number]
  text: string
  tone?: 'default' | 'accent' | 'drag' | 'weight'
}) {
  // Hidden when the viewport "labels" toggle is off.
  if (!useContext(LabelsContext)) return null

  const color =
    tone === 'accent'
      ? COLORS.accent
      : tone === 'drag'
        ? COLORS.arrowDrag
        : tone === 'weight'
          ? COLORS.arrowWeight
          : '#cbd5e1'
  const border =
    tone === 'default' ? 'rgba(148,163,184,0.35)' : `${color}88`

  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.2,
          color,
          background: 'rgba(11,15,23,0.82)',
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: '2px 7px',
          whiteSpace: 'nowrap',
          transform: 'translateZ(0)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {text}
      </div>
    </Html>
  )
}
