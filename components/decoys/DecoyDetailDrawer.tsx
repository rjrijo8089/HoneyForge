'use client'
import {
  Shield, Pause, Play, Trash2, Edit3, Terminal, Globe, Bug, Radar,
  FolderOpen, Database as DbIcon, Monitor, Activity,
  Tag, AlertTriangle,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { RiskScore, riskLevel } from './RiskScore'
import type { Decoy, DecoyStatus, DecoyCategory } from '@/types'

type IconComponent = React.ComponentType<{className?: string; style?: React.CSSProperties}>

const CATEGORY_ICONS: Record<DecoyCategory, IconComponent> = {
  'web-clone': Globe, 'ssh': Terminal, 'malware-capture': Bug,
  'ids-sensor': Radar, 'file-share': FolderOpen, 'database': DbIcon, 'remote-access': Monitor,
}
const CATEGORY_LABELS: Record<DecoyCategory, string> = {
  'web-clone': 'Web Clone', 'ssh': 'SSH Honeypot', 'malware-capture': 'Malware Capture',
  'ids-sensor': 'IDS Sensor', 'file-share': 'File Share', 'database': 'Database',
  'remote-access': 'Remote Access',
}
const CATEGORY_COLORS: Record<DecoyCategory, string> = {
  'web-clone': '#06b6d4', 'ssh': '#10b981', 'malware-capture': '#a78bfa',
  'ids-sensor': '#3b82f6', 'file-share': '#f59e0b', 'database': '#0ea5e9', 'remote-access': '#ec4899',
}

const STATUS_META: Record<DecoyStatus, { dot: string; label: string; text: string; bg: string; border: string }> = {
  active:    { dot: 'bg-hf-success', label: 'Active',    text: 'text-hf-success', bg: 'bg-hf-success/10',  border: 'border-hf-success/30'  },
  paused:    { dot: 'bg-hf-warning', label: 'Paused',    text: 'text-hf-warning', bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30'  },
  deploying: { dot: 'bg-hf-accent',  label: 'Deploying', text: 'text-hf-accent',  bg: 'bg-hf-accent/10',   border: 'border-hf-accent/30'   },
  error:     { dot: 'bg-hf-danger',  label: 'Error',     text: 'text-hf-danger',  bg: 'bg-hf-danger/10',   border: 'border-hf-danger/30'   },
}

const HEALTH_COLORS: Record<Decoy['healthStatus'], string> = {
  healthy: '#10b981', degraded: '#f59e0b', critical: '#ef4444', unknown: '#4a5777',
}

function ActivityBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  return (
    <div className="space-y-1.5">
      <div className="flex items-end gap-1.5 h-16">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm transition-all"
              style={{
                height: `${Math.max(4, (val / max) * 56)}px`,
                background: i === data.length - 1
                  ? 'linear-gradient(to top, #3b82f6, #60a5fa)'
                  : 'linear-gradient(to top, #1a2438, #26394f)',
                boxShadow: i === data.length - 1 ? '0 0 8px rgba(59,130,246,0.4)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {data.map((val, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[9px] text-hf-dim">{days[i]}</p>
            <p className="text-[9px] text-hf-muted font-mono">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfigRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-hf-border/20 last:border-0">
      <span className="text-xs text-hf-dim w-28 shrink-0">{label}</span>
      <span className={cn('text-xs text-right flex-1', mono ? 'font-mono text-hf-muted' : 'text-hf-text')}>
        {value}
      </span>
    </div>
  )
}

interface DecoyDetailDrawerProps {
  decoy: Decoy | null
  open: boolean
  onClose: () => void
  onToggleStatus: (id: string, next: DecoyStatus) => void
  onDelete: (id: string) => void
}

export function DecoyDetailDrawer({ decoy, open, onClose, onToggleStatus, onDelete }: DecoyDetailDrawerProps) {
  if (!decoy) return null

  const sm        = STATUS_META[decoy.status]
  const CatIcon   = CATEGORY_ICONS[decoy.category]
  const catLabel  = CATEGORY_LABELS[decoy.category]
  const catColor  = CATEGORY_COLORS[decoy.category]
  const nextStatus: DecoyStatus = decoy.status === 'active' ? 'paused' : 'active'
  const riskLvl   = riskLevel(decoy.riskScore)

  const footer = (
    <>
      {(decoy.status === 'active' || decoy.status === 'paused') && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={decoy.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          onClick={() => onToggleStatus(decoy.id, nextStatus)}
        >
          {decoy.status === 'active' ? 'Pause' : 'Resume'}
        </Button>
      )}
      <Button variant="ghost" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />} className="ml-auto">
        Edit Config
      </Button>
      <Button
        variant="danger"
        size="sm"
        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        onClick={() => { onDelete(decoy.id); onClose() }}
      >
        Delete
      </Button>
    </>
  )

  return (
    <Drawer open={open} onClose={onClose} width="lg" footer={footer}>
      <div className="space-y-5">

        {/* ── Hero header ── */}
        <div className="space-y-3 pb-4 border-b border-hf-border/40">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${catColor}20`, border: `1px solid ${catColor}40` }}
            >
              <CatIcon className="w-5 h-5" style={{ color: catColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-hf-text">{decoy.name}</h3>
              <p className="text-xs text-hf-muted mt-0.5">{catLabel} · {decoy.ipAddress}{decoy.port > 0 ? `:${decoy.port}` : ''}</p>
            </div>
            <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold shrink-0', sm.bg, sm.border, sm.text)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', sm.dot)} />
              {sm.label}
            </div>
          </div>

          {decoy.description && (
            <p className="text-xs text-hf-muted leading-relaxed bg-hf-surface-2/60 rounded-lg p-3 border border-hf-border/30">
              {decoy.description}
            </p>
          )}
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Attacks',      value: decoy.interactionsCount.toLocaleString(), icon: Activity,  color: 'text-hf-primary' },
            { label: 'Attacks Today',      value: decoy.attacksToday,                       icon: Shield,    color: decoy.attacksToday > 0 ? 'text-hf-danger' : 'text-hf-dim' },
            { label: 'Malware Captured',   value: decoy.capturedMalware,                    icon: Bug,       color: 'text-purple-400'  },
            { label: 'Open Alerts',        value: decoy.openAlerts,                         icon: AlertTriangle, color: decoy.openAlerts > 0 ? 'text-hf-warning' : 'text-hf-dim' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-hf-surface-2/60 rounded-xl p-3 border border-hf-border/30">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('w-3.5 h-3.5', color)} />
                <span className="text-[10px] text-hf-dim uppercase tracking-wider">{label}</span>
              </div>
              <p className={cn('text-xl font-bold tabular-nums', color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Risk + health ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-hf-surface-2/60 rounded-xl p-3 border border-hf-border/30">
            <p className="text-[10px] text-hf-dim uppercase tracking-wider mb-2">Risk Score</p>
            <RiskScore score={decoy.riskScore} showBar size="md" />
            <p className={cn('text-[10px] mt-1 capitalize', decoy.riskScore > 60 ? 'text-hf-warning' : 'text-hf-dim')}>
              {riskLvl === 'none' ? 'No data yet' : `${riskLvl} risk`}
            </p>
          </div>
          <div className="bg-hf-surface-2/60 rounded-xl p-3 border border-hf-border/30">
            <p className="text-[10px] text-hf-dim uppercase tracking-wider mb-2">Health / Uptime</p>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: HEALTH_COLORS[decoy.healthStatus] }}
              />
              <span className="text-sm font-semibold text-hf-text capitalize">{decoy.healthStatus}</span>
            </div>
            {decoy.uptime > 0 && (
              <p className="text-[10px] text-hf-dim mt-1">{decoy.uptime}% uptime (30d)</p>
            )}
          </div>
        </div>

        {/* ── Last attack ── */}
        {decoy.lastInteractionAt && (
          <div className="flex items-center gap-3 bg-hf-surface-2/60 rounded-xl p-3 border border-hf-border/30">
            <Shield className="w-4 h-4 text-hf-muted shrink-0" />
            <div>
              <p className="text-xs font-medium text-hf-text">Last Attack</p>
              <p className="text-[10px] text-hf-muted">{formatDate(decoy.lastInteractionAt, 'long')}</p>
            </div>
            {decoy.lastAttackSeverity && (
              <div className="ml-auto">
                <SeverityBadge severity={decoy.lastAttackSeverity} />
              </div>
            )}
          </div>
        )}

        {/* ── Activity ── */}
        <div>
          <p className="text-xs font-semibold text-hf-text mb-3">7-Day Activity</p>
          <ActivityBar data={decoy.activityLast7Days} />
        </div>

        {/* ── Configuration ── */}
        <div>
          <p className="text-xs font-semibold text-hf-text mb-2">Configuration</p>
          <div className="bg-hf-surface-2/40 rounded-xl border border-hf-border/30 px-4 py-1">
            <ConfigRow label="IP Address"   value={decoy.ipAddress} mono />
            {decoy.port > 0 && <ConfigRow label="Port"    value={decoy.port} mono />}
            <ConfigRow label="Protocol"  value={<span className="uppercase font-mono text-hf-accent">{decoy.type}</span>} />
            {decoy.os && <ConfigRow label="OS"       value={decoy.os} mono />}
            <ConfigRow label="Environment" value={
              <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border',
                decoy.environment === 'prod' ? 'text-hf-danger bg-hf-danger/10 border-hf-danger/30' :
                decoy.environment === 'staging' ? 'text-hf-warning bg-hf-warning/10 border-hf-warning/30' :
                'text-hf-muted bg-hf-surface-3 border-hf-border/50'
              )}>
                {decoy.environment}
              </span>
            } />
            <ConfigRow label="Created"     value={formatDate(decoy.createdAt, 'long')} />
            <ConfigRow label="Updated"     value={formatDate(decoy.updatedAt, 'relative')} />
            <ConfigRow label="Owner"       value={decoy.createdBy} mono />
          </div>
        </div>

        {/* ── Tags ── */}
        {decoy.tags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-hf-text mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {decoy.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-[10px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-1 rounded-full">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        {decoy.notes && (
          <div className="bg-hf-warning/5 border border-hf-warning/20 rounded-xl p-3">
            <p className="text-[10px] text-hf-warning uppercase tracking-wider mb-1 font-bold">Notes</p>
            <p className="text-xs text-hf-muted leading-relaxed">{decoy.notes}</p>
          </div>
        )}

      </div>
    </Drawer>
  )
}
