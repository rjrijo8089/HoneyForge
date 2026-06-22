'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Shield, Copy, Crosshair, ClipboardList,
  Activity, Zap, Plug, BarChart2, ScrollText, Settings,
  ChevronLeft, ChevronRight, Hexagon, LogOut, Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'
import type { UserRole } from '@/types'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  live?: boolean
  roles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',       label: 'Dashboard',        href: '/dashboard',        icon: LayoutDashboard },
  { id: 'decoys',          label: 'Decoys',            href: '/decoys',           icon: Shield },
  { id: 'clone-studio',    label: 'Clone Studio',      href: '/clone-studio',     icon: Copy },
  { id: 'threat-intel',             label: 'Threat Intel',    href: '/threat-intel',             icon: Crosshair   },
  { id: 'ai-intelligence-summary', label: 'AI Intelligence', href: '/ai-intelligence-summary',  icon: Bot         },
  { id: 'review-queue',            label: 'Review Queue',    href: '/review-queue',             icon: ClipboardList, badge: 12 },
  { id: 'live-attack-feed',label: 'Live Attack Feed',  href: '/live-attack-feed', icon: Activity, live: true },
  { id: 'detection-rules', label: 'Detection Rules',   href: '/detection-rules',  icon: Zap },
  { id: 'integrations',    label: 'Integrations',      href: '/integrations',     icon: Plug, roles: ['admin'] },
  { id: 'reports',         label: 'Reports',           href: '/reports',          icon: BarChart2 },
  { id: 'audit-logs',      label: 'Audit Logs',        href: '/audit-logs',       icon: ScrollText, roles: ['admin', 'analyst'] },
  { id: 'settings',        label: 'Settings',          href: '/settings',         icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()

  const visible = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  )

  const collapsed = sidebarCollapsed

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-hf-surface border-r border-hf-border',
      'transition-all duration-300 ease-in-out shrink-0 z-30',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-hf-border shrink-0 gap-3',
        collapsed && 'justify-center'
      )}>
        <div className="w-8 h-8 bg-hf-primary rounded-lg flex items-center justify-center shrink-0 glow-primary">
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-hf-text font-bold text-base tracking-tight">HoneyForge</span>
            <p className="text-hf-dim text-[10px] -mt-0.5 font-mono uppercase tracking-widest">SOC Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visible.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.id}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/25'
                  : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2 border border-transparent',
                collapsed && 'justify-center'
              )}
            >
              <div className="relative shrink-0">
                <Icon className={cn('w-[18px] h-[18px]', active && 'text-hf-primary')} />
                {item.live && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-hf-danger rounded-full"
                    style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge != null && (
                    <span className="text-[10px] font-bold bg-hf-primary text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge != null && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-hf-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-hf-border p-2 space-y-1">
        {/* User chip */}
        {user && !collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1">
            <div className="w-7 h-7 rounded-full bg-hf-primary/20 border border-hf-primary/30 flex items-center justify-center text-hf-primary text-xs font-bold shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-hf-text truncate">{user.name}</p>
              <p className="text-[10px] text-hf-dim capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-hf-dim hover:text-hf-muted hover:bg-hf-surface-2 text-sm transition-colors',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>

        <button
          onClick={logout}
          title={collapsed ? 'Log out' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-hf-dim hover:text-hf-danger hover:bg-hf-danger/10 text-sm transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
