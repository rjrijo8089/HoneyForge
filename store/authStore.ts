'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@/types'

interface AuthStore {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, session: null, isLoading: false }),
    }),
    {
      name: 'hf-auth',
      partialize: (s) => ({ user: s.user, session: s.session }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false)
      },
    }
  )
)
