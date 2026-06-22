'use client'
import { Network, MapPin, Monitor, FileCode, Crosshair, Globe, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CorrelationGroup, CorrelationType } from '@/types/ai-intelligence'

const TYPE_META: Record<CorrelationType, { icon: React.ComponentType<{className?: string}>; label: string; color: string }> = {
  ip_cluster:       { icon: Network,   label: 'IP Cluster',       color: 'text-blue-400   border-blue-400/30   bg-blue-400/10'   },
  asn:              { icon: Globe,     label: 'ASN Cluster',       color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  user_agent:       { icon: Monitor,   label: 'User-Agent',        color: 'text-amber-400  border-amber-400/30  bg-amber-400/10'  },
  payload:          { icon: FileCode,  label: 'Payload Pattern',   color: 'text-hf-danger  border-hf-danger/30  bg-hf-danger/10'  },
  technique_chain:  { icon: Crosshair, label: 'Technique Chain',   color: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10' },
  country_cluster:  { icon: MapPin,    label: 'Country Cluster',   color: 'text-hf-primary border-hf-primary/30 bg-hf-primary/10' },
}

const SEV_DOT: Record<string, string> = {
  critical: 'bg-hf-danger',
  high:     'bg-hf-warning',
  medium:   'bg-amber-400',
  low:      'bg-hf-success',
}

function RiskBar({ score }: { score: number }) {
  const pct   = Math.min(100, (score / 900) * 100)
  const color = score >= 700 ? '#ef4444' : score >= 500 ? '#f59e0b' : '#3b82f6'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

export function CorrelationSection({ groups }: { groups: CorrelationGroup[] }) {
  const sorted = [...groups].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-hf-primary" />
        <h3 className="text-sm font-bold text-hf-text">Cross-Decoy Correlation Groups</h3>
        <span className="text-[10px] text-hf-dim">{groups.length} groups detected</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {sorted.map((g) => {
          const meta = TYPE_META[g.type]
          const Icon = meta.icon
          return (
            <div key={g.id} className="glass-card rounded-2xl border border-hf-border p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0', meta.color)}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                  <span className="text-xs font-mono text-hf-text truncate">{g.matchValue}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-hf-text tabular-nums">{g.eventCount}</p>
                  <p className="text-[9px] text-hf-dim">events</p>
                </div>
              </div>

              {/* Risk bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-hf-dim">Risk Score</p>
                  <p className="text-[10px] text-hf-dim">{g.decoyCount} decoy{g.decoyCount !== 1 ? 's' : ''}</p>
                </div>
                <RiskBar score={g.riskScore} />
              </div>

              {/* Countries */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Globe className="w-3 h-3 text-hf-dim" />
                {g.countries.map((c) => (
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded border border-hf-border/40 text-hf-dim">{c}</span>
                ))}
                <span className="text-[10px] text-hf-dim ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {g.lastSeen.slice(5, 16).replace('T', ' ')} UTC
                </span>
              </div>

              {/* Event list */}
              <div className="space-y-1 border-t border-hf-border/20 pt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-hf-dim mb-1.5">Sample Events</p>
                {g.events.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="flex items-center gap-2 text-[10px] py-0.5">
                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', SEV_DOT[ev.severity] ?? 'bg-hf-dim')} />
                    <span className="text-hf-muted font-mono w-24 shrink-0 truncate">{ev.sourceIp}</span>
                    <span className="text-hf-dim truncate flex-1">{ev.decoyName}</span>
                    <span className="text-hf-primary font-mono shrink-0">{ev.technique}</span>
                  </div>
                ))}
                {g.events.length > 4 && (
                  <p className="text-[10px] text-hf-dim pl-3.5">+{g.events.length - 4} more events</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
