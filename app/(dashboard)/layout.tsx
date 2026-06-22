'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Hexagon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DataModeProvider } from '@/contexts/DataModeContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hf-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-hf-primary/20 rounded-2xl flex items-center justify-center">
            <Hexagon className="w-7 h-7 text-hf-primary animate-pulse" />
          </div>
          <p className="text-sm text-hf-muted">Loading HoneyForge…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DataModeProvider>
      <div className="flex h-screen bg-hf-bg overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </DataModeProvider>
  )
}
