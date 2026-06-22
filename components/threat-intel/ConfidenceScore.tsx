import { cn } from '@/lib/utils'
import type { ThreatSeverity } from '@/types'

/* ── Confidence bar ── */
interface ConfidenceBarProps {
  value: number   // 0–100
  size?: 'sm' | 'md'
  showLabel?: boolean
}

function confidenceColor(v: number) {
  if (v >= 90) return { bar: 'bg-hf-success', text: 'text-hf-success' }
  if (v >= 70) return { bar: 'bg-hf-warning', text: 'text-hf-warning' }
  if (v >= 40) return { bar: 'bg-orange-400', text: 'text-orange-400' }
  return { bar: 'bg-hf-dim', text: 'text-hf-dim' }
}

export function ConfidenceBar({ value, size = 'sm', showLabel = true }: ConfidenceBarProps) {
  const { bar, text } = confidenceColor(value)
  return (
    <div className={cn('flex items-center gap-2', size === 'sm' ? 'w-20' : 'w-28')}>
      <div className={cn('flex-1 bg-hf-surface-3 rounded-full overflow-hidden', size === 'sm' ? 'h-1' : 'h-1.5')}>
        <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${value}%` }} />
      </div>
      {showLabel && <span className={cn('text-[10px] font-semibold tabular-nums shrink-0', text)}>{value}%</span>}
    </div>
  )
}

/* ── Severity pill ── */
const SEV_META: Record<ThreatSeverity, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: 'Critical', color: 'text-severity-critical', bg: 'bg-severity-critical/10', border: 'border-severity-critical/30', dot: 'bg-severity-critical' },
  high:     { label: 'High',     color: 'text-severity-high',     bg: 'bg-severity-high/10',     border: 'border-severity-high/30',     dot: 'bg-severity-high'     },
  medium:   { label: 'Medium',   color: 'text-severity-medium',   bg: 'bg-severity-medium/10',   border: 'border-severity-medium/30',   dot: 'bg-severity-medium'   },
  low:      { label: 'Low',      color: 'text-severity-low',      bg: 'bg-severity-low/10',      border: 'border-severity-low/30',      dot: 'bg-severity-low'      },
  info:     { label: 'Info',     color: 'text-severity-info',     bg: 'bg-severity-info/10',     border: 'border-severity-info/30',     dot: 'bg-severity-info'     },
}

export function SeverityPill({ severity, size = 'sm' }: { severity: ThreatSeverity; size?: 'xs' | 'sm' }) {
  const m = SEV_META[severity]
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-semibold rounded border',
      size === 'xs' ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5',
      m.color, m.bg, m.border,
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  )
}

export { SEV_META }
