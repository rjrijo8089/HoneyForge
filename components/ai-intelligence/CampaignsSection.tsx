'use client'
import { useState } from 'react'
import { Users, Globe, Crosshair, ChevronDown, ChevronUp, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttackerCampaign, Severity } from '@/types/ai-intelligence'

const SEV_STYLE: Record<Severity, string> = {
  critical: 'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  high:     'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  medium:   'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low:      'text-hf-success border-hf-success/30 bg-hf-success/10',
}

const STATUS_STYLE: Record<string, string> = {
  active:     'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  monitoring: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  resolved:   'text-hf-success border-hf-success/30 bg-hf-success/10',
}

function CampaignCard({ c }: { c: AttackerCampaign }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn(
      'glass-card rounded-2xl border p-5 space-y-4 transition-all',
      c.severity === 'critical' ? 'border-hf-danger/30' : 'border-hf-border'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide', SEV_STYLE[c.severity])}>
              <Circle className="w-2 h-2 fill-current" /> {c.severity}
            </span>
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border', STATUS_STYLE[c.status])}>
              {c.status}
            </span>
            <span className="text-[10px] font-mono text-hf-dim">{Math.round(c.confidence)}% confidence</span>
          </div>
          <h3 className="text-sm font-bold text-hf-text">{c.name}</h3>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-right">
          <div>
            <p className="text-xl font-bold text-hf-text tabular-nums leading-none">{c.eventCount.toLocaleString()}</p>
            <p className="text-[10px] text-hf-dim">events</p>
          </div>
          <button onClick={() => setExpanded((p) => !p)} className="p-1.5 rounded-lg text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Source IPs',    value: c.uniqueIps      },
          { label: 'Decoys Hit',    value: c.decoysHit.length },
          { label: 'Techniques',   value: c.mitreTechniques.length },
          { label: 'IOCs',         value: c.iocCount        },
        ].map(({ label, value }) => (
          <div key={label} className="text-center bg-hf-surface-2 rounded-xl px-2 py-2.5">
            <p className="text-base font-bold text-hf-text tabular-nums">{value}</p>
            <p className="text-[10px] text-hf-dim">{label}</p>
          </div>
        ))}
      </div>

      {/* Countries + analyst */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Globe className="w-3.5 h-3.5 text-hf-dim" />
          {c.countries.map((co) => (
            <span key={co} className="text-[10px] px-2 py-0.5 rounded-full border border-hf-border/50 text-hf-dim">{co}</span>
          ))}
        </div>
        {c.analyst ? (
          <span className="text-[10px] text-hf-dim">Owner: <span className="text-hf-muted">{c.analyst}</span></span>
        ) : (
          <span className="text-[10px] text-hf-dim italic">Unassigned</span>
        )}
      </div>

      {/* MITRE tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Crosshair className="w-3.5 h-3.5 text-hf-dim shrink-0" />
        {c.mitreTechniques.map((t) => (
          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded border border-hf-primary/25 text-hf-primary bg-hf-primary/10">{t}</span>
        ))}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="pt-2 border-t border-hf-border/30 space-y-3">
          <p className="text-xs text-hf-muted leading-relaxed">{c.description}</p>
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-wider mb-1.5">Known Source IPs</p>
            <div className="flex flex-wrap gap-1.5">
              {c.sourceIps.map((ip) => (
                <span key={ip} className="text-[10px] font-mono px-2 py-0.5 rounded bg-hf-surface-3 border border-hf-border/40 text-hf-muted">{ip}</span>
              ))}
              {c.uniqueIps > c.sourceIps.length && (
                <span className="text-[10px] text-hf-dim px-2 py-0.5">+{c.uniqueIps - c.sourceIps.length} more</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-wider mb-1.5">Decoys Hit</p>
            <div className="flex flex-wrap gap-1.5">
              {c.decoysHit.map((d) => (
                <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-hf-surface-3 border border-hf-border/40 text-hf-muted">{d}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function CampaignsSection({ campaigns }: { campaigns: AttackerCampaign[] }) {
  const active    = campaigns.filter((c) => c.status === 'active')
  const others    = campaigns.filter((c) => c.status !== 'active')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-hf-danger" />
        <h3 className="text-sm font-bold text-hf-text">Active Campaigns</h3>
        <span className="text-[10px] text-hf-dim">{active.length} active · {others.length} monitoring</span>
      </div>

      {active.length > 0 && (
        <div className="space-y-3">
          {active.map((c) => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}

      {others.length > 0 && (
        <>
          <p className="text-xs font-medium text-hf-dim pt-2">Monitoring / Resolved</p>
          <div className="space-y-3">
            {others.map((c) => <CampaignCard key={c.id} c={c} />)}
          </div>
        </>
      )}
    </div>
  )
}
