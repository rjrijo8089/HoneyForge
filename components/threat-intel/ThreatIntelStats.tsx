import { ShieldAlert, Activity, Target, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THREAT_INTEL_STATS } from '@/services/mock/data/threatIntel'

const SEV_COLS: { key: string; label: string; color: string; bg: string }[] = [
  { key: 'critical', label: 'Critical', color: 'text-severity-critical', bg: 'bg-severity-critical' },
  { key: 'high',     label: 'High',     color: 'text-severity-high',     bg: 'bg-severity-high'     },
  { key: 'medium',   label: 'Medium',   color: 'text-severity-medium',   bg: 'bg-severity-medium'   },
  { key: 'low',      label: 'Low',      color: 'text-severity-low',      bg: 'bg-severity-low'      },
]

export function ThreatIntelStats() {
  const s = THREAT_INTEL_STATS
  const totalSev = s.bySeverity.critical + s.bySeverity.high + s.bySeverity.medium + s.bySeverity.low

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total IOCs */}
      <div className="glass-card border border-hf-border/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-hf-primary" />
          </div>
          <p className="text-[10px] text-hf-dim uppercase tracking-wider">Total IOCs</p>
        </div>
        <p className="text-3xl font-black text-hf-text">{s.totalIOCs}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-hf-success">{s.byStatus.confirmed} confirmed</span>
          <span className="text-hf-border">·</span>
          <span className="text-[10px] text-hf-warning">{s.byStatus.investigating} investigating</span>
        </div>
        {/* Status mini bar */}
        <div className="flex h-1 gap-px mt-2 rounded-full overflow-hidden">
          {Object.entries(s.byStatus).map(([k, v]) => {
            const c: Record<string, string> = {
              confirmed: 'bg-hf-danger', investigating: 'bg-hf-warning',
              new: 'bg-hf-primary', 'false-positive': 'bg-hf-success', closed: 'bg-hf-dim',
            }
            return v > 0 ? <div key={k} className={c[k]} style={{ flex: v }} /> : null
          })}
        </div>
      </div>

      {/* Total Hits */}
      <div className="glass-card border border-hf-border/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-hf-danger/15 border border-hf-danger/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-hf-danger" />
          </div>
          <p className="text-[10px] text-hf-dim uppercase tracking-wider">Total Hits</p>
        </div>
        <p className="text-3xl font-black text-hf-text">{s.totalHits.toLocaleString()}</p>
        <p className="text-[10px] text-hf-muted mt-2">Avg {Math.round(s.totalHits / s.totalIOCs)} hits / indicator</p>
        {/* Severity breakdown bar */}
        <div className="flex h-1 gap-px mt-2 rounded-full overflow-hidden">
          {SEV_COLS.map(({ key, bg }) => {
            const v = s.bySeverity[key as keyof typeof s.bySeverity]
            return v > 0 ? <div key={key} className={bg} style={{ flex: v }} /> : null
          })}
        </div>
      </div>

      {/* Campaigns */}
      <div className="glass-card border border-hf-border/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-hf-warning/15 border border-hf-warning/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-hf-warning" />
          </div>
          <p className="text-[10px] text-hf-dim uppercase tracking-wider">Campaigns</p>
        </div>
        <p className="text-3xl font-black text-hf-text">{s.activeCampaigns}<span className="text-hf-dim text-lg font-bold"> active</span></p>
        <p className="text-[10px] text-hf-muted mt-2">5 total tracked campaigns</p>
      </div>

      {/* Severity breakdown */}
      <div className="glass-card border border-hf-border/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-hf-accent/15 border border-hf-accent/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-hf-accent" />
          </div>
          <p className="text-[10px] text-hf-dim uppercase tracking-wider">By Severity</p>
        </div>
        <div className="space-y-1.5">
          {SEV_COLS.map(({ key, label, color, bg }) => {
            const v = s.bySeverity[key as keyof typeof s.bySeverity]
            const pct = totalSev > 0 ? (v / totalSev) * 100 : 0
            return (
              <div key={key} className="flex items-center gap-2">
                <span className={cn('text-[9px] font-bold w-12', color)}>{label}</span>
                <div className="flex-1 h-1 bg-hf-surface-3 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', bg)} style={{ width: `${pct}%` }} />
                </div>
                <span className={cn('text-[10px] font-bold tabular-nums w-4', color)}>{v}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
