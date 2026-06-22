'use client'
import { Lightbulb, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TechnicalRecommendation, AISummary, RecommendationPriority, RecCategory, Effort, RecStatus } from '@/types/ai-intelligence'

const PRIORITY_STYLE: Record<RecommendationPriority, string> = {
  immediate: 'text-hf-danger border-hf-danger/35 bg-hf-danger/10',
  high:      'text-hf-warning border-hf-warning/35 bg-hf-warning/10',
  medium:    'text-amber-400 border-amber-400/35 bg-amber-400/10',
  low:       'text-hf-dim border-hf-border/40 bg-transparent',
}

const CATEGORY_STYLE: Record<RecCategory, string> = {
  detection:    'text-blue-400 bg-blue-400/10 border-blue-400/25',
  deception:    'text-purple-400 bg-purple-400/10 border-purple-400/25',
  response:     'text-hf-danger bg-hf-danger/10 border-hf-danger/25',
  hardening:    'text-hf-success bg-hf-success/10 border-hf-success/25',
  intelligence: 'text-hf-primary bg-hf-primary/10 border-hf-primary/25',
}

const EFFORT_LABEL: Record<Effort, string> = { low: 'Low effort', medium: 'Medium effort', high: 'High effort' }
const STATUS_META: Record<RecStatus, { label: string; icon: React.ComponentType<{className?: string}>; color: string }> = {
  pending:     { label: 'Pending',     icon: Clock,      color: 'text-hf-dim'     },
  in_progress: { label: 'In Progress', icon: Loader2,    color: 'text-hf-warning' },
  completed:   { label: 'Completed',   icon: CheckCircle2, color: 'text-hf-success' },
}

function RecCard({ r, idx }: { r: TechnicalRecommendation; idx: number }) {
  const statusMeta = STATUS_META[r.status]
  const StatusIcon = statusMeta.icon
  return (
    <div className="flex gap-3 py-3.5 border-b border-hf-border/15 last:border-0">
      {/* Number */}
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5',
        r.priority === 'immediate' ? 'bg-hf-danger/20 text-hf-danger' :
        r.priority === 'high'      ? 'bg-hf-warning/20 text-hf-warning' :
        r.priority === 'medium'    ? 'bg-amber-400/20 text-amber-400' :
        'bg-hf-surface-3 text-hf-dim'
      )}>
        {idx + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="text-xs font-semibold text-hf-text">{r.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wide', PRIORITY_STYLE[r.priority])}>
              {r.priority}
            </span>
            <span className={cn('inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold border', CATEGORY_STYLE[r.category])}>
              {r.category}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-hf-dim leading-relaxed">{r.description}</p>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="text-[10px] text-hf-dim">Owner: <span className="text-hf-muted">{r.owner}</span></span>
          <span className="text-[10px] text-hf-dim">{EFFORT_LABEL[r.effort]}</span>
          <div className={cn('flex items-center gap-1 text-[10px]', statusMeta.color)}>
            <StatusIcon className="w-3 h-3" />
            <span>{statusMeta.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RecommendationsSection({
  recommendations,
  summary,
}: {
  recommendations: TechnicalRecommendation[]
  summary: AISummary
}) {
  const [showAll, setShowAll] = useState(false)
  const priorityOrder: RecommendationPriority[] = ['immediate', 'high', 'medium', 'low']
  const sorted = [...recommendations].sort((a, b) =>
    priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  )
  const visible = showAll ? sorted : sorted.slice(0, 6)
  const immediate = sorted.filter((r) => r.priority === 'immediate').length

  return (
    <div className="space-y-5">
      {/* ── Executive summary ── */}
      <div className="glass-card rounded-2xl border border-hf-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-hf-primary" />
          <h3 className="text-sm font-bold text-hf-text">Executive Summary</h3>
          <span className="text-[10px] text-hf-dim">AI-generated · {summary.model}</span>
        </div>
        <div className="space-y-3">
          {summary.executiveSummary.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-xs text-hf-muted leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* ── Technical recommendations ── */}
      <div className="glass-card rounded-2xl border border-hf-border p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-hf-text">Analyst Recommendations</h3>
            <span className="text-[10px] text-hf-dim">{recommendations.length} total</span>
            {immediate > 0 && (
              <span className="text-[10px] font-bold text-hf-danger border border-hf-danger/30 bg-hf-danger/10 px-2 py-0.5 rounded-full">
                {immediate} immediate
              </span>
            )}
          </div>
        </div>

        <div>
          {visible.map((r, i) => <RecCard key={r.id} r={r} idx={i} />)}
        </div>

        {sorted.length > 6 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="mt-3 text-xs text-hf-primary hover:text-hf-primary/80 font-semibold transition-colors"
          >
            {showAll ? 'Show fewer' : `Show all ${sorted.length} recommendations`}
          </button>
        )}
      </div>
    </div>
  )
}
