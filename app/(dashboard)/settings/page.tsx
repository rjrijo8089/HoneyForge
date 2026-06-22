'use client'
import { useState } from 'react'
import {
  Settings, Lock, Crosshair, Database, Bell,
  Users, Activity, Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GeneralTab }       from '@/components/settings/GeneralTab'
import { SecurityTab }      from '@/components/settings/SecurityTab'
import { DetectionTab }     from '@/components/settings/DetectionTab'
import { DataRetentionTab } from '@/components/settings/DataRetentionTab'
import { NotificationsTab } from '@/components/settings/NotificationsTab'
import { UsersTab }         from '@/components/settings/UsersTab'
import { SystemHealthTab }  from '@/components/settings/SystemHealthTab'
import { DeveloperTab }     from '@/components/settings/DeveloperTab'

type TabId = 'general' | 'security' | 'detection' | 'retention' | 'notifications' | 'users' | 'health' | 'developer'

const TABS: { id: TabId; label: string; icon: React.ComponentType<{className?: string}>; hint: string }[] = [
  { id: 'general',       label: 'General',          icon: Settings,  hint: 'Platform identity & defaults'    },
  { id: 'security',      label: 'Security',          icon: Lock,      hint: 'Auth, MFA, session, safe mode'  },
  { id: 'detection',     label: 'Detection',         icon: Crosshair, hint: 'Thresholds, automation, capture'},
  { id: 'retention',     label: 'Data Retention',    icon: Database,  hint: 'Retention periods & archiving'  },
  { id: 'notifications', label: 'Notifications',     icon: Bell,      hint: 'Slack, email, alert thresholds' },
  { id: 'users',         label: 'Users & RBAC',      icon: Users,     hint: 'User management & permissions'  },
  { id: 'health',        label: 'System Health',     icon: Activity,  hint: 'Service status & heartbeats'    },
  { id: 'developer',     label: 'Developer',         icon: Code2,     hint: 'API, webhooks, seed data'       },
]

export default function SettingsPage() {
  const [active, setActive] = useState<TabId>('general')
  const tab = TABS.find((t) => t.id === active)!

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4 text-hf-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-hf-text">Settings</h2>
          <p className="text-xs text-hf-muted mt-0.5">Manage platform configuration, users, and system preferences</p>
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Sidebar nav ── */}
        <nav className="w-52 shrink-0 space-y-0.5 sticky top-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active === id
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/25 shadow-sm'
                  : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2 border border-transparent'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Tab header */}
          <div className="flex items-center gap-2 mb-3">
            <tab.icon className="w-4 h-4 text-hf-dim" />
            <h3 className="text-sm font-bold text-hf-text">{tab.label}</h3>
            <span className="text-[10px] text-hf-dim">·</span>
            <span className="text-xs text-hf-dim">{tab.hint}</span>
          </div>

          {active === 'general'       && <GeneralTab />}
          {active === 'security'      && <SecurityTab />}
          {active === 'detection'     && <DetectionTab />}
          {active === 'retention'     && <DataRetentionTab />}
          {active === 'notifications' && <NotificationsTab />}
          {active === 'users'         && <UsersTab />}
          {active === 'health'        && <SystemHealthTab />}
          {active === 'developer'     && <DeveloperTab />}
        </div>
      </div>
    </div>
  )
}
