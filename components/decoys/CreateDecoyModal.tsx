'use client'
import { useState } from 'react'
import {
  Globe, Terminal, Bug, Radar, Database as DbIcon,
  Monitor, Zap,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { DecoyCategory, DecoyType } from '@/types'

interface CreateDecoyModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: CreateDecoyData) => void
}

export interface CreateDecoyData {
  name: string
  category: DecoyCategory
  type: DecoyType
  ipAddress: string
  port: number
  environment: 'prod' | 'staging' | 'dev'
  os: string
  tags: string
  description: string
}

type IconComponent = React.ComponentType<{className?: string; style?: React.CSSProperties}>

const TEMPLATES: { category: DecoyCategory; label: string; icon: IconComponent; defaultType: DecoyType; defaultPort: number; defaultOS: string; color: string; desc: string }[] = [
  {
    category: 'ssh', label: 'SSH Honeypot', icon: Terminal,
    defaultType: 'ssh', defaultPort: 22, defaultOS: 'Ubuntu 22.04 LTS',
    color: '#10b981', desc: 'Captures credential brute-force and key exhaustion.',
  },
  {
    category: 'web-clone', label: 'Web Clone', icon: Globe,
    defaultType: 'http', defaultPort: 80, defaultOS: 'Debian 11',
    color: '#06b6d4', desc: 'Mimics a web app to lure SQLi, XSS, and scrapers.',
  },
  {
    category: 'malware-capture', label: 'Malware Capture', icon: Bug,
    defaultType: 'smtp', defaultPort: 25, defaultOS: 'Ubuntu 22.04 LTS',
    color: '#a78bfa', desc: 'Open relay / file server to capture malware samples.',
  },
  {
    category: 'ids-sensor', label: 'IDS Sensor', icon: Radar,
    defaultType: 'custom', defaultPort: 0, defaultOS: 'Alpine Linux 3.18',
    color: '#3b82f6', desc: 'Passive Suricata-based sensor for traffic anomalies.',
  },
  {
    category: 'database', label: 'DB Canary', icon: DbIcon,
    defaultType: 'mysql', defaultPort: 3306, defaultOS: 'Ubuntu 20.04 LTS',
    color: '#0ea5e9', desc: 'Fake DB canary to detect internal recon and exfil.',
  },
  {
    category: 'remote-access', label: 'RDP / VNC', icon: Monitor,
    defaultType: 'rdp', defaultPort: 3389, defaultOS: 'Windows 11 Pro',
    color: '#ec4899', desc: 'Windows workstation lure for RDP spray attacks.',
  },
]

const ENV_OPTIONS = ['prod', 'staging', 'dev'] as const
const OS_OPTIONS = [
  'Ubuntu 22.04 LTS', 'Ubuntu 20.04 LTS', 'Debian 11', 'Debian 12',
  'CentOS 7', 'Rocky Linux 9', 'Alpine Linux 3.18',
  'Windows Server 2019', 'Windows Server 2022', 'Windows 11 Pro',
]

const DEFAULT_FORM: CreateDecoyData = {
  name: '', category: 'ssh', type: 'ssh', ipAddress: '10.0.1.',
  port: 22, environment: 'prod', os: 'Ubuntu 22.04 LTS', tags: '', description: '',
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-medium text-hf-muted block mb-1.5">
      {children} {required && <span className="text-hf-danger">*</span>}
    </label>
  )
}

function Select({ value, onChange, children, className }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full bg-hf-surface-2 border border-hf-border rounded-lg text-sm text-hf-text',
        'px-3 py-2 transition-colors focus:border-hf-primary focus:outline-none',
        className
      )}
    >
      {children}
    </select>
  )
}

export function CreateDecoyModal({ open, onClose, onCreate }: CreateDecoyModalProps) {
  const [form, setForm] = useState<CreateDecoyData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  const applyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setForm((f) => ({
      ...f,
      category:    tmpl.category,
      type:        tmpl.defaultType,
      port:        tmpl.defaultPort,
      os:          tmpl.defaultOS,
    }))
  }

  const set = (field: keyof CreateDecoyData) => (
    (v: string | number) => setForm((f) => ({ ...f, [field]: v }))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800)) // simulate deploy latency
    onCreate(form)
    setForm(DEFAULT_FORM)
    setLoading(false)
  }

  const footer = (
    <>
      <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button
        variant="primary"
        size="sm"
        type="submit"
        form="create-decoy-form"
        isLoading={loading}
        leftIcon={<Zap className="w-3.5 h-3.5" />}
      >
        Deploy Decoy
      </Button>
    </>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Deploy New Decoy"
      description="Configure and provision a new honeypot instance."
      size="xl"
      footer={footer}
    >
      <div className="space-y-5">
        {/* Templates */}
        <div>
          <FieldLabel>Quick Template</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => {
              const Icon = t.icon
              const active = form.category === t.category
              return (
                <button
                  key={t.category}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all',
                    active
                      ? 'border-opacity-60 bg-opacity-10'
                      : 'border-hf-border/50 bg-hf-surface-2/40 hover:bg-hf-surface-2 hover:border-hf-border-2'
                  )}
                  style={active ? {
                    borderColor: `${t.color}60`,
                    background: `${t.color}10`,
                  } : {}}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                    <span className="text-xs font-semibold text-hf-text">{t.label}</span>
                  </div>
                  <p className="text-[10px] text-hf-dim leading-snug">{t.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-hf-border/30" />

        {/* Form */}
        <form id="create-decoy-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name */}
          <div>
            <FieldLabel required>Decoy Name</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              placeholder="e.g. SSH-Honeypot-03"
              required
            />
          </div>

          {/* Row 2: IP + Port */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>IP Address</FieldLabel>
              <Input
                value={form.ipAddress}
                onChange={(e) => set('ipAddress')(e.target.value)}
                placeholder="10.0.1.xxx"
                required
              />
            </div>
            <div>
              <FieldLabel>Port</FieldLabel>
              <Input
                type="number"
                value={form.port === 0 ? '' : form.port}
                onChange={(e) => set('port')(parseInt(e.target.value) || 0)}
                placeholder="22"
                min={0}
                max={65535}
              />
            </div>
          </div>

          {/* Row 3: Env + OS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Environment</FieldLabel>
              <Select value={form.environment} onChange={(v) => set('environment')(v)}>
                {ENV_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Operating System</FieldLabel>
              <Select value={form.os} onChange={(v) => set('os')(v)}>
                {OS_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Row 4: Tags */}
          <div>
            <FieldLabel>Tags</FieldLabel>
            <Input
              value={form.tags}
              onChange={(e) => set('tags')(e.target.value)}
              placeholder="linux, perimeter, critical-zone (comma separated)"
            />
          </div>

          {/* Row 5: Description */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description}
              onChange={(e) => set('description')(e.target.value)}
              placeholder="Optional notes about this decoy's purpose and placement…"
              rows={3}
              className="w-full bg-hf-surface-2 border border-hf-border rounded-lg text-sm text-hf-text placeholder:text-hf-dim px-3 py-2 transition-colors focus:border-hf-primary focus:outline-none resize-none"
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}
