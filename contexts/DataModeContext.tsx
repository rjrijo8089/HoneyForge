'use client'
import { createContext, useContext, useCallback, useSyncExternalStore } from 'react'
import { DEMO_STORAGE_KEY } from '@/lib/dataMode'

const CHANGE_EVENT = 'honeyforge:demo-mode'

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function getSnapshot() {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY)
  return stored !== null ? stored === 'true' : process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
}

function getServerSnapshot() {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
}

interface DataModeCtx {
  isDemoMode: boolean
  setDemoMode: (v: boolean) => void
}

const DataModeContext = createContext<DataModeCtx>({
  isDemoMode: true,
  setDemoMode: () => {},
})

export function useDataMode() {
  return useContext(DataModeContext)
}

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const isDemoMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setDemoMode = useCallback((v: boolean) => {
    localStorage.setItem(DEMO_STORAGE_KEY, String(v))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  }, [])

  return (
    <DataModeContext.Provider value={{ isDemoMode, setDemoMode }}>
      {children}
    </DataModeContext.Provider>
  )
}
