'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void

  activeModal: string | null
  openModal: (id: string) => void
  closeModal: () => void

  activeDrawer: string | null
  openDrawer: (id: string) => void
  closeDrawer: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      activeModal: null,
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),

      activeDrawer: null,
      openDrawer: (id) => set({ activeDrawer: id }),
      closeDrawer: () => set({ activeDrawer: null }),
    }),
    {
      name: 'hf-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)
