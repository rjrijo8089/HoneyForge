'use client'
import { Globe, Layout, Braces, LogIn, Users, FolderOpen, Tag, Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import type { WizardStep2, WizardDecoyCategory } from './types'

interface StepDecoyConfigProps {
  data: WizardStep2
  onChange: (data: WizardStep2) => void
  suggestedName?: string
}

type CatIcon = React.ComponentType<{className?: string; style?: React.CSSProperties}>
const CATEGORIES: { value: WizardDecoyCategory; icon: CatIcon; label: string; desc: string; color: string }[] = [
  { value: 'web-app',         icon: Globe,      label: 'Web Application',  desc: 'General purpose web app or SaaS platform',       color: '#06b6d4' },
  { value: 'admin-panel',     icon: Layout,     label: 'Admin Panel',      desc: 'Admin dashboard or management console lure',     color: '#ef4444' },
  { value: 'api-endpoint',    icon: Braces,     label: 'API Endpoint',     desc: 'REST/GraphQL API canary for dev/staging access', color: '#8b5cf6' },
  { value: 'login-portal',    icon: LogIn,      label: 'Login Portal',     desc: 'Standalone login page to capture credentials',   color: '#f59e0b' },
  { value: 'customer-portal', icon: Users,      label: 'Customer Portal',  desc: 'Customer-facing self-service or account portal', color: '#10b981' },
  { value: 'file-server',     icon: FolderOpen, label: 'File Server',      desc: 'Document store or file management lure',         color: '#3b82f6' },
]

const DEPARTMENTS = [
  'Finance', 'IT', 'Engineering', 'HR', 'Operations',
  'Legal', 'Marketing', 'Sales', 'Executive', 'Security',
]


export function StepDecoyConfig({ data, onChange, suggestedName = '' }: StepDecoyConfigProps) {
  const update = (patch: Partial<WizardStep2>) => onChange({ ...data, ...patch })

  return (
    <div className="space-y-6">

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-hf-muted uppercase tracking-wider">Decoy Category</label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon   = cat.icon
            const active = data.category === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => update({ category: cat.value })}
                className={cn(
                  'flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all group',
                  active
                    ? 'border-opacity-60 bg-opacity-10'
                    : 'bg-hf-surface-2/40 border-hf-border/40 hover:bg-hf-surface-2'
                )}
                style={active ? { borderColor: `${cat.color}60`, background: `${cat.color}10` } : {}}
              >
                <Icon
                  className="w-4 h-4 mt-0.5 shrink-0 transition-colors"
                  style={{ color: active ? cat.color : '#4a5777' }}
                />
                <div>
                  <p className="text-xs font-semibold text-hf-text">{cat.label}</p>
                  <p className="text-[10px] text-hf-dim mt-0.5 leading-snug">{cat.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name + Description */}
      <div className="space-y-4">
        <Input
          label="Honeypot Name *"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder={suggestedName || 'e.g. Finance-Portal-Lure'}
          hint="Use a clear naming convention. Shown in dashboards, alerts, and reports."
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-hf-muted">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief description of this decoy's purpose, placement, and expected threat actors…"
            rows={3}
            className="w-full bg-hf-surface-2 border border-hf-border rounded-lg text-sm text-hf-text placeholder:text-hf-dim px-3 py-2 transition-colors focus:border-hf-primary focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-hf-muted flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Tags
        </label>
        <Input
          value={data.tags}
          onChange={(e) => update({ tags: e.target.value })}
          placeholder="finance, web, critical-zone, sql-target (comma separated)"
        />
        {data.tags && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {data.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="text-[10px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Department + Business Owner */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-hf-muted flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Department
          </label>
          <select
            value={data.department}
            onChange={(e) => update({ department: e.target.value })}
            className="w-full bg-hf-surface-2 border border-hf-border rounded-lg text-sm text-hf-text px-3 py-2 transition-colors focus:border-hf-primary focus:outline-none"
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <Input
          label="Business Owner"
          value={data.businessOwner}
          onChange={(e) => update({ businessOwner: e.target.value })}
          placeholder="owner@company.com"
          leftIcon={<User className="w-4 h-4" />}
          hint="Primary contact for alerts and incidents"
        />
      </div>

    </div>
  )
}
