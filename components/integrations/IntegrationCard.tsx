'use client'
import {
  Search, BarChart3, Cloud, Shield, ScrollText,
  Share2, Hexagon, Hash, Mail, Globe, CheckSquare,
  Workflow, HardDrive, AlertTriangle, Clock, Send,
  Zap, Settings, RefreshCw, Activity,
} from 'lucide-react'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import type { Integration, IntegrationHealth } from '@/types/integration'

/* ── Vendor metadata: icon + color palette ── */
interface VendorMeta {
  Icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconText: string
  accentBorder: string
}

const VENDOR_META: Record<string, VendorMeta> = {
  opensearch:  { Icon: Search,      iconBg: 'bg-emerald-500/15', iconText: 'text-emerald-400', accentBorder: 'border-emerald-500/20' },
  splunk:      { Icon: BarChart3,   iconBg: 'bg-green-500/15',   iconText: 'text-green-400',   accentBorder: 'border-green-500/20'   },
  sentinel:    { Icon: Cloud,       iconBg: 'bg-blue-500/15',    iconText: 'text-blue-400',    accentBorder: 'border-blue-500/20'    },
  qradar:      { Icon: Shield,      iconBg: 'bg-blue-700/15',    iconText: 'text-blue-300',    accentBorder: 'border-blue-700/20'    },
  chronicle:   { Icon: ScrollText,  iconBg: 'bg-purple-500/15',  iconText: 'text-purple-400',  accentBorder: 'border-purple-500/20'  },
  misp:        { Icon: Share2,      iconBg: 'bg-orange-500/15',  iconText: 'text-orange-400',  accentBorder: 'border-orange-500/20'  },
  thehive:     { Icon: Hexagon,     iconBg: 'bg-yellow-500/15',  iconText: 'text-yellow-400',  accentBorder: 'border-yellow-500/20'  },
  slack:       { Icon: Hash,        iconBg: 'bg-purple-600/15',  iconText: 'text-purple-300',  accentBorder: 'border-purple-600/20'  },
  email:       { Icon: Mail,        iconBg: 'bg-sky-500/15',     iconText: 'text-sky-400',     accentBorder: 'border-sky-500/20'     },
  webhook:     { Icon: Globe,       iconBg: 'bg-hf-dim/20',      iconText: 'text-hf-muted',    accentBorder: 'border-hf-border'      },
  jira:        { Icon: CheckSquare, iconBg: 'bg-blue-500/15',    iconText: 'text-blue-400',    accentBorder: 'border-blue-500/20'    },
  servicenow:  { Icon: Workflow,    iconBg: 'bg-teal-500/15',    iconText: 'text-teal-400',    accentBorder: 'border-teal-500/20'    },
  s3:          { Icon: HardDrive,   iconBg: 'bg-amber-500/15',   iconText: 'text-amber-400',   accentBorder: 'border-amber-500/20'   },
}

const FALLBACK_VENDOR: VendorMeta = {
  Icon: Globe, iconBg: 'bg-hf-dim/20', iconText: 'text-hf-muted', accentBorder: 'border-hf-border',
}

/* ── Health indicator ── */
const HEALTH_META: Record<IntegrationHealth, { dot: string; label: string; text: string }> = {
  healthy:  { dot: 'bg-hf-success',  label: 'Healthy',    text: 'text-hf-success'  },
  degraded: { dot: 'bg-hf-warning',  label: 'Degraded',   text: 'text-hf-warning'  },
  error:    { dot: 'bg-hf-danger',   label: 'Error',      text: 'text-hf-danger'   },
  unknown:  { dot: 'bg-hf-dim',      label: 'Not tested', text: 'text-hf-dim'      },
}

/* ── Category badge ── */
const CATEGORY_LABELS: Record<string, string> = {
  'siem':             'SIEM',
  'threat-intel':     'Threat Intel',
  'alerting':         'Alerting',
  'case-management':  'Case Mgmt',
  'storage':          'Storage',
  'email':            'Email',
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className={cn(
        'relative w-9 h-5 rounded-full border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hf-primary',
        checked
          ? 'bg-hf-success/20 border-hf-success/50'
          : 'bg-hf-surface-3 border-hf-border',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200',
        checked ? 'translate-x-4 bg-hf-success' : 'translate-x-0 bg-hf-dim'
      )} />
    </button>
  )
}

/* ── Stat cell ── */
function Stat({ icon: Icon, value, label, danger }: { icon: React.ComponentType<{className?: string}>; value: string; label: string; danger?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={cn('flex items-center gap-1 text-xs font-bold tabular-nums', danger && parseInt(value) > 0 ? 'text-hf-danger' : 'text-hf-text')}>
        <Icon className="w-3 h-3" /> {value}
      </div>
      <span className="text-[9px] text-hf-dim">{label}</span>
    </div>
  )
}

interface Props {
  integration: Integration
  onToggle:    (id: string, enabled: boolean) => void
  onConfigure: (integration: Integration) => void
  onTest:      (integration: Integration) => void
}

export function IntegrationCard({ integration: i, onToggle, onConfigure, onTest }: Props) {
  const vendor  = VENDOR_META[i.vendorKey] ?? FALLBACK_VENDOR
  const health  = HEALTH_META[i.health]
  const { Icon } = vendor

  return (
    <div className={cn(
      'glass-card glass-card-hover rounded-2xl border flex flex-col overflow-hidden transition-all',
      i.health === 'error' ? 'border-hf-danger/25' : i.health === 'degraded' ? 'border-hf-warning/25' : 'border-hf-border/40',
      !i.enabled && 'opacity-60'
    )}>

      {/* ── Header ── */}
      <div className="flex items-start gap-3 p-4 pb-3">
        {/* Vendor icon */}
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', vendor.iconBg, vendor.accentBorder)}>
          <Icon className={cn('w-5 h-5', vendor.iconText)} />
        </div>

        {/* Name + category */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-hf-text leading-tight truncate">{i.name}</p>
          <span className="text-[9px] font-mono font-bold text-hf-dim bg-hf-surface-3 border border-hf-border/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
            {CATEGORY_LABELS[i.category] ?? i.category}
          </span>
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Toggle checked={i.enabled} onChange={(v) => onToggle(i.id, v)} />
          <span className={cn('text-[9px] font-semibold', i.enabled ? 'text-hf-success' : 'text-hf-dim')}>
            {i.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* ── Health bar ── */}
      <div className={cn(
        'mx-4 mb-3 flex items-center gap-2 rounded-lg px-2.5 py-1.5 border',
        i.health === 'error'    ? 'bg-hf-danger/8 border-hf-danger/20'    :
        i.health === 'degraded' ? 'bg-hf-warning/8 border-hf-warning/20'  :
        i.health === 'healthy'  ? 'bg-hf-success/5 border-hf-success/15'  :
                                  'bg-hf-surface-2 border-hf-border/30'
      )}>
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', health.dot,
          i.health === 'healthy' && 'animate-pulse'
        )} />
        <span className={cn('text-[10px] font-semibold', health.text)}>{health.label}</span>
        {i.healthMessage && (
          <span className="text-[9px] text-hf-dim truncate ml-0.5">— {i.healthMessage}</span>
        )}
        {i.health === 'error' && i.errorCount > 0 && (
          <span className="ml-auto text-[9px] font-mono font-bold text-hf-danger shrink-0">
            {i.errorCount} err
          </span>
        )}
      </div>

      {/* ── Description ── */}
      <p className="text-[11px] text-hf-muted leading-relaxed px-4 pb-3 line-clamp-2 flex-1">{i.description}</p>

      {/* ── Stats ── */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-hf-border/30 bg-hf-surface/30">
        <Stat icon={Send}          value={formatNumber(i.eventsTotal)}  label="Total sent"     />
        <div className="w-px h-6 bg-hf-border/30" />
        <Stat icon={Activity}      value={formatNumber(i.eventsToday)}  label="Today"          />
        <div className="w-px h-6 bg-hf-border/30" />
        <Stat icon={AlertTriangle} value={String(i.errorCount)}         label="Errors"  danger />
      </div>

      {/* ── Last sync ── */}
      {i.lastSyncAt && (
        <div className="flex items-center gap-1.5 px-4 py-2 border-t border-hf-border/20 bg-hf-surface/20">
          <Clock className="w-3 h-3 text-hf-dim shrink-0" />
          <span className="text-[9px] text-hf-dim">Last sync {formatDate(i.lastSyncAt, 'relative')}</span>
          {i.testedAt && (
            <>
              <span className="text-[9px] text-hf-dim">·</span>
              <Zap className="w-3 h-3 text-hf-dim shrink-0" />
              <span className="text-[9px] text-hf-dim">Tested {formatDate(i.testedAt, 'relative')}</span>
            </>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-2 px-4 py-3 border-t border-hf-border/30">
        <button
          onClick={() => onConfigure(i)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-border text-hf-muted hover:bg-hf-surface-3 hover:text-hf-text transition-all"
        >
          <Settings className="w-3 h-3" /> Configure
        </button>
        <button
          onClick={() => onTest(i)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-primary/30 text-hf-primary bg-hf-primary/5 hover:bg-hf-primary/10 transition-all"
        >
          <RefreshCw className="w-3 h-3" /> Test
        </button>
      </div>
    </div>
  )
}
