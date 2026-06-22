'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const ROLE_COLORS = {
    admin:   'text-hf-danger bg-hf-danger/15 border-hf-danger/30',
    analyst: 'text-hf-warning bg-hf-warning/15 border-hf-warning/30',
    viewer:  'text-hf-muted bg-hf-surface-2 border-hf-border',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border border-transparent',
          open ? 'bg-hf-surface-2 border-hf-border' : 'hover:bg-hf-surface-2 hover:border-hf-border'
        )}
      >
        <div className="w-7 h-7 rounded-full bg-hf-primary/20 border border-hf-primary/40 flex items-center justify-center text-hf-primary text-xs font-bold">
          {getInitials(user.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium text-hf-text leading-tight">{user.name}</p>
          <p className={cn('text-[10px] capitalize px-1 rounded border inline-block', ROLE_COLORS[user.role])}>
            {user.role}
          </p>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-hf-dim transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-hf-surface border border-hf-border rounded-xl shadow-2xl animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-hf-border">
              <p className="text-sm font-medium text-hf-text truncate">{user.name}</p>
              <p className="text-xs text-hf-muted truncate">{user.email}</p>
            </div>
            <div className="py-1">
              {[
                { label: 'Profile', icon: User, onClick: () => { setOpen(false) } },
                { label: 'Settings', icon: Settings, onClick: () => { router.push('/settings'); setOpen(false) } },
                { label: 'Role: ' + user.role, icon: Shield, onClick: () => setOpen(false), muted: true },
              ].map(({ label, icon: Icon, onClick, muted }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                    muted
                      ? 'text-hf-dim cursor-default hover:bg-transparent'
                      : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-hf-border py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-hf-muted hover:text-hf-danger hover:bg-hf-danger/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
