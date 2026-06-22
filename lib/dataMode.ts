/**
 * Data mode utilities — read NEXT_PUBLIC_ENABLE_DEMO_MODE from env,
 * overridable at runtime via localStorage (set by Developer tab).
 *
 * Server components read the env directly. Client components use the
 * DataModeContext (contexts/DataModeContext.tsx) which wraps the layout.
 */

/** Server-side check: never touches localStorage. */
export function serverIsDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
}

/** One-shot client check: reads localStorage override first, then env. */
export function isDemoMode(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hf_demo_mode')
    if (stored !== null) return stored === 'true'
  }
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
}

export const DEMO_STORAGE_KEY = 'hf_demo_mode'
