'use client'
import {
  X, Download, TrendingUp, TrendingDown, Minus,
  Flag, Lightbulb, FileText, AlertCircle, CheckCircle2,
  AlertTriangle, Info,
} from 'lucide-react'
import { cn, formatBytes, formatDate } from '@/lib/utils'
import type { ReportTemplate, ReportMetric, TrendPoint, RankedItem, FindingItem } from '@/types/report'

/* ── Mini SVG bar chart ── */
function TrendChart({ data, label }: { data: TrendPoint[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const W = 100 / data.length
  return (
    <div>
      <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2">{label}</p>
      <div className="bg-hf-bg/60 border border-hf-border/30 rounded-xl p-3">
        <svg viewBox={`0 0 100 48`} className="w-full h-20" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" y1={44 * (1 - f)} x2="100" y2={44 * (1 - f)}
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}
          {/* Bars */}
          {data.map((d, i) => {
            const h   = (d.value / max) * 40
            const x   = i * W + W * 0.12
            const bw  = W * 0.76
            const y   = 44 - h
            const frac = d.value / max
            return (
              <g key={i}>
                <defs>
                  <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={frac > 0.8 ? '#3b82f6' : frac > 0.5 ? '#06b6d4' : '#1e40af'} stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <rect x={x} y={y} width={bw} height={h} rx="1" fill={`url(#bg${i})`} />
                <text x={x + bw / 2} y="47" textAnchor="middle" fontSize="3.2"
                  fill="rgba(139,156,184,0.8)" fontFamily="monospace">{d.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

/* ── Metric card ── */
const ACCENT_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'bg-hf-primary/10', text: 'text-hf-primary', border: 'border-hf-primary/20'  },
  green:  { bg: 'bg-hf-success/10', text: 'text-hf-success', border: 'border-hf-success/20'  },
  red:    { bg: 'bg-hf-danger/10',  text: 'text-hf-danger',  border: 'border-hf-danger/20'   },
  yellow: { bg: 'bg-hf-warning/10', text: 'text-hf-warning', border: 'border-hf-warning/20'  },
  cyan:   { bg: 'bg-hf-accent/10',  text: 'text-hf-accent',  border: 'border-hf-accent/20'   },
}

function MetricChip({ m }: { m: ReportMetric }) {
  const ac = ACCENT_CLASSES[m.accent] ?? ACCENT_CLASSES.blue
  const TrendIcon = m.trend === 'up' ? TrendingUp : m.trend === 'down' ? TrendingDown : Minus
  const trendColor = m.trend === 'up' ? 'text-hf-danger' : m.trend === 'down' ? 'text-hf-success' : 'text-hf-dim'
  return (
    <div className={cn('rounded-xl border p-3', ac.bg, ac.border)}>
      <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest truncate">{m.label}</p>
      <p className={cn('text-xl font-bold tabular-nums mt-0.5 leading-tight', ac.text)}>{m.value}</p>
      {m.change && (
        <p className={cn('text-[10px] flex items-center gap-0.5 mt-0.5', trendColor)}>
          <TrendIcon className="w-2.5 h-2.5" /> {m.change}
        </p>
      )}
    </div>
  )
}

/* ── Horizontal bar ── */
function HBar({ item, max, accent = '#3b82f6' }: { item: RankedItem; max: number; accent?: string }) {
  const pct = max > 0 ? (item.count / max) * 100 : item.percent
  return (
    <div className="flex items-center gap-2">
      {item.code && (
        <span className="text-[9px] font-mono text-hf-dim w-5 shrink-0 text-right">{item.code}</span>
      )}
      <span className="text-[10px] text-hf-muted flex-1 truncate">{item.name}</span>
      <div className="w-24 h-1.5 bg-hf-surface-3 rounded-full overflow-hidden shrink-0">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <span className="text-[9px] font-mono text-hf-dim w-8 text-right shrink-0">{item.percent}%</span>
    </div>
  )
}

/* ── Finding item ── */
const FINDING_META: Record<string, { cls: string; Icon: React.ComponentType<{className?: string}>; dot: string }> = {
  critical: { cls: 'border-hf-danger/30 bg-hf-danger/5',    Icon: AlertCircle,   dot: 'bg-hf-danger'   },
  high:     { cls: 'border-hf-warning/30 bg-hf-warning/5',  Icon: AlertTriangle, dot: 'bg-hf-warning'  },
  medium:   { cls: 'border-hf-primary/20 bg-hf-primary/5',  Icon: Info,          dot: 'bg-hf-primary'  },
  low:      { cls: 'border-hf-border/30 bg-hf-surface-2',   Icon: CheckCircle2,  dot: 'bg-hf-dim'      },
}

function Finding({ f }: { f: FindingItem }) {
  const meta = FINDING_META[f.severity] ?? FINDING_META.low
  return (
    <div className={cn('rounded-xl border p-3', meta.cls)}>
      <div className="flex items-start gap-2">
        <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', meta.dot)} />
        <div>
          <p className="text-xs font-semibold text-hf-text leading-snug">{f.title}</p>
          <p className="text-[10px] text-hf-muted mt-0.5 leading-relaxed">{f.description}</p>
        </div>
        <span className={cn(
          'text-[8px] font-bold uppercase border px-1.5 py-0.5 rounded shrink-0',
          f.severity === 'critical' ? 'text-hf-danger border-hf-danger/30' :
          f.severity === 'high'     ? 'text-hf-warning border-hf-warning/30' :
          f.severity === 'medium'   ? 'text-hf-primary border-hf-primary/30' :
                                      'text-hf-dim border-hf-border'
        )}>
          {f.severity}
        </span>
      </div>
    </div>
  )
}

/* ── Section header ── */
function SectionHead({ icon: Icon, title }: { icon: React.ComponentType<{className?: string}>; title: string }) {
  return (
    <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2 flex items-center gap-1.5">
      <Icon className="w-3 h-3" /> {title}
    </p>
  )
}

interface Props {
  report: ReportTemplate
  onClose:    () => void
  onDownload: (r: ReportTemplate) => void
}

export function ReportPreviewPanel({ report: r, onClose, onDownload }: Props) {
  const { preview: p } = r
  const attackMax  = Math.max(...p.topAttackTypes.map((i) => i.count), 1)
  const countryMax = Math.max(...p.topCountries.map((i) => i.count), 1)

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col bg-hf-surface border-l border-hf-border shadow-2xl animate-slide-in-right">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-hf-border/40">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-hf-primary mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-hf-text leading-snug">{r.name}</h2>
            <p className="text-[10px] text-hf-dim mt-0.5">
              {r.lastRun ? `Last run ${formatDate(r.lastRun.at, 'long')}` : 'No run yet'}
              {r.lastRun?.fileSize && ` · ${formatBytes(r.lastRun.fileSize)}`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {r.lastRun?.status === 'ready' && (
              <button
                onClick={() => onDownload(r)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-primary/30 text-hf-primary bg-hf-primary/5 hover:bg-hf-primary/10 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            )}
            <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* ── Executive summary ── */}
        <div className="bg-hf-surface-2/60 border border-hf-border/30 rounded-xl px-4 py-3">
          <SectionHead icon={FileText} title="Executive Summary" />
          <p className="text-[11px] text-hf-muted leading-relaxed">{p.executiveSummary}</p>
        </div>

        {/* ── Key metrics ── */}
        <div>
          <SectionHead icon={TrendingUp} title="Key Metrics" />
          <div className="grid grid-cols-3 gap-2">
            {p.metrics.map((m) => <MetricChip key={m.label} m={m} />)}
          </div>
        </div>

        {/* ── Attack trend chart ── */}
        <TrendChart data={p.trendData} label={p.trendLabel} />

        {/* ── Top attack types + countries ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionHead icon={AlertTriangle} title="Top Attack Types" />
            <div className="space-y-2">
              {p.topAttackTypes.map((item) => (
                <HBar key={item.name} item={item} max={attackMax} accent="#3b82f6" />
              ))}
            </div>
          </div>
          <div>
            <SectionHead icon={Flag} title="Top Source Countries" />
            <div className="space-y-2">
              {p.topCountries.map((item) => (
                <HBar key={item.name} item={item} max={countryMax} accent="#ef4444" />
              ))}
            </div>
          </div>
        </div>

        {/* ── Critical findings ── */}
        <div>
          <SectionHead icon={AlertCircle} title="Critical Findings" />
          <div className="space-y-2">
            {p.criticalFindings.map((f, i) => <Finding key={i} f={f} />)}
          </div>
        </div>

        {/* ── Recommended actions ── */}
        <div>
          <SectionHead icon={Lightbulb} title="Recommended Actions" />
          <div className="space-y-1.5">
            {p.recommendedActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-hf-border/15 last:border-0">
                <span className="w-5 h-5 rounded-full bg-hf-primary/15 border border-hf-primary/25 text-[10px] font-bold text-hf-primary flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[11px] text-hf-muted leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
