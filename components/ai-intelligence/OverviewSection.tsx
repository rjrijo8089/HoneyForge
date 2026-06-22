'use client'
import { Bot, Zap, Users, Shield, Database, Crosshair, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AISummary } from '@/types/ai-intelligence'

const LEVEL_META = {
  critical: { label: 'CRITICAL', color: 'text-hf-danger',  border: 'border-hf-danger/40',  bg: 'bg-hf-danger/[0.08]',  dot: 'bg-hf-danger'  },
  high:     { label: 'HIGH',     color: 'text-hf-warning', border: 'border-hf-warning/40', bg: 'bg-hf-warning/[0.08]', dot: 'bg-hf-warning' },
  medium:   { label: 'MEDIUM',   color: 'text-amber-400',  border: 'border-amber-400/40',  bg: 'bg-amber-400/[0.08]',  dot: 'bg-amber-400'  },
  low:      { label: 'LOW',      color: 'text-hf-success', border: 'border-hf-success/40', bg: 'bg-hf-success/[0.08]', dot: 'bg-hf-success' },
}

interface StatCard { label: string; value: number | string; icon: React.ComponentType<{className?: string}>; accent: string; sub?: string }

function MetricCard({ label, value, icon: Icon, accent, sub }: StatCard) {
  return (
    <div className={cn('glass-card rounded-2xl px-4 py-4 border', accent)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-hf-dim font-medium uppercase tracking-wider">{label}</p>
        <Icon className={cn('w-4 h-4 opacity-60', accent.includes('danger') ? 'text-hf-danger' : accent.includes('warning') ? 'text-hf-warning' : 'text-hf-primary')} />
      </div>
      <p className="text-3xl font-bold text-hf-text tabular-nums leading-none">{value}</p>
      {sub && <p className="text-[10px] text-hf-dim mt-1.5">{sub}</p>}
    </div>
  )
}

export function OverviewSection({ summary }: { summary: AISummary }) {
  const meta = LEVEL_META[summary.threatLevel]

  return (
    <div className="space-y-5">
      {/* ── Threat level banner ── */}
      <div className={cn('flex items-center gap-4 px-5 py-4 rounded-2xl border', meta.border, meta.bg)}>
        <div className="relative shrink-0">
          <div className={cn('w-4 h-4 rounded-full', meta.dot)} />
          <div className={cn('absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-50', meta.dot)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-black uppercase tracking-[0.15em]', meta.color)}>
              {meta.label} THREAT LEVEL
            </span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', meta.color, meta.border)}>
              Platform-wide
            </span>
          </div>
          <p className="text-xs text-hf-muted mt-1">
            {summary.activeCampaigns} active campaigns · {summary.activeThreats} active threats · {summary.correlatedEventGroups} correlation groups detected
          </p>
        </div>
        <AlertTriangle className={cn('w-5 h-5 shrink-0', meta.color)} />
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard label="Correlated Groups" value={summary.correlatedEventGroups} icon={Zap}       accent="border-hf-border bg-hf-surface/60"  />
        <MetricCard label="Active Campaigns"  value={summary.activeCampaigns}       icon={Users}     accent="border-hf-danger/20 bg-hf-surface/60" sub={`${summary.activeCampaigns > 0 ? '2 critical' : 'none'}`} />
        <MetricCard label="Attacker IOCs"     value={summary.totalIOCs}             icon={Database}  accent="border-hf-border bg-hf-surface/60"  />
        <MetricCard label="Decoys at Risk"    value={summary.decoysAtRisk}          icon={Shield}    accent="border-hf-warning/20 bg-hf-surface/60" />
        <MetricCard label="MITRE Techniques"  value={summary.mitreTechniques}       icon={Crosshair} accent="border-hf-border bg-hf-surface/60"  />
        <MetricCard label="Active Threats"    value={summary.activeThreats}         icon={AlertTriangle} accent="border-hf-danger/20 bg-hf-surface/60" />
      </div>

      {/* ── Key findings ── */}
      <div className="glass-card rounded-2xl border border-hf-border p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-hf-primary" />
          <h3 className="text-sm font-bold text-hf-text">Key Findings</h3>
          <span className="text-[10px] text-hf-dim font-mono">AI-generated</span>
        </div>
        <div className="space-y-2">
          {summary.keyFindings.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-hf-primary/15 border border-hf-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-hf-primary">{i + 1}</span>
              </div>
              <p className="text-xs text-hf-muted leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Telemetry ── */}
      <div className="glass-card rounded-2xl border border-hf-border px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-hf-text tabular-nums">{summary.eventsAnalyzed.toLocaleString()}</p>
            <p className="text-[10px] text-hf-dim">Events Analysed</p>
          </div>
          <div>
            <p className="text-lg font-bold text-hf-text font-mono text-xs leading-tight mt-1">{summary.model}</p>
            <p className="text-[10px] text-hf-dim">AI Model</p>
          </div>
          <div>
            <p className="text-xs font-mono text-hf-text">Jun 11 – Jun 18</p>
            <p className="text-[10px] text-hf-dim">Data Window</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-hf-success" />
            <div>
              <p className="text-xs font-medium text-hf-success">Analysis complete</p>
              <p className="text-[10px] text-hf-dim flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3" /> 14:23 UTC today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
