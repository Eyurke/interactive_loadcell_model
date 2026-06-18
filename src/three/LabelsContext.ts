import { createContext } from 'react'

/**
 * Whether the in-scene billboard text labels are visible. Provided inside the
 * Canvas (by <Scene>) and consumed by every <Label> so the viewport "hide
 * labels" toggle can declutter the 3D view without threading a prop everywhere.
 */
export const LabelsContext = createContext(true)
