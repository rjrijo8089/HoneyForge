'use client'
import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useNotificationStore } from '@/store/notificationStore'
import { NotificationCenter } from './NotificationCenter'
import { UserMenu } from './UserMenu'
import { SearchBar } from '@/components/ui/SearchBar'

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':        'Dashboard',
  '/decoys':           'Decoys',
  '/clone-studio':     'Clone Studio',
  '/threat-intel':     'Threat Intel',
  '/review-queue':     'Review Queue',
  '/live-attack-feed': 'Live Attack Feed',
  '/detection-rules':  'Detection Rules',
  '/integrations':     'Integrations',
  '/reports':          'Reports',
  '/audit-logs':       'Audit Logs',
  '/settings':         'Settings',
}

export function Header() {
  const pathname = usePathname()
  const { toggleSidebar } = useUIStore()
  const { unreadCount } = useNotificationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const pageTitle = ROUTE_LABELS[pathname] ?? 'HoneyForge'

  return (
    <header className="h-16 bg-hf-surface border-b border-hf-border flex items-center px-4 gap-4 shrink-0">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-hf-muted hover:text-hf-text transition-colors p-1"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-hf-text hidden sm:block shrink-0">{pageTitle}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search threats, decoys, rules…"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg transition-colors relative',
              notifOpen
                ? 'bg-hf-surface-2 text-hf-text'
                : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2'
            )}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-hf-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  )
}
