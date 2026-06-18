import { useCallback, useEffect, useState } from 'react'

/**
 * Tiny localStorage-backed state hook. Used to persist which steps the user has
 * checked off, plus the last-viewed step. Falls back gracefully if storage is
 * unavailable (e.g. private mode) and survives malformed JSON.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota / unavailable storage */
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initial), [initial])

  return [value, setValue, reset] as const
}
