import { cn } from '@/lib/utils'

interface RiskScoreProps {
  score: number
  showBar?: boolean
  size?: 'sm' | 'md'
}

export function riskLevel(score: number): 'none' | 'low' | 'medium' | 'high' | 'critical' {
  if (score === 0)   return 'none'
  if (score <= 30)   return 'low'
  if (score <= 60)   return 'medium'
  if (score <= 80)   return 'high'
  return 'critical'
}

const LEVEL_STYLES = {
  none:     { text: 'text-hf-dim',           bg: 'bg-hf-surface-3',           bar: 'bg-hf-dim',           label: '—',        border: 'border-hf-border/30' },
  low:      { text: 'text-hf-success',       bg: 'bg-hf-success/15',          bar: 'bg-hf-success',       label: 'Low',      border: 'border-hf-success/30' },
  medium:   { text: 'text-severity-medium',  bg: 'bg-severity-medium/15',     bar: 'bg-severity-medium',  label: 'Medium',   border: 'border-severity-medium/30' },
  high:     { text: 'text-severity-high',    bg: 'bg-severity-high/15',       bar: 'bg-severity-high',    label: 'High',     border: 'border-severity-high/30' },
  critical: { text: 'text-severity-critical',bg: 'bg-severity-critical/15',   bar: 'bg-severity-critical',label: 'Critical', border: 'border-severity-critical/30' },
}

export function RiskScore({ score, showBar = true, size = 'md' }: RiskScoreProps) {
  const level  = riskLevel(score)
  const styles = LEVEL_STYLES[level]

  if (score === 0) {
    return <span className="text-xs text-hf-dim">—</span>
  }

  return (
    <div className={cn('flex items-center gap-2', size === 'sm' && 'gap-1.5')}>
      <span className={cn(
        'font-mono font-bold tabular-nums border rounded',
        styles.text, styles.bg, styles.border,
        size === 'sm' ? 'text-[10px] px-1 py-0.5' : 'text-xs px-1.5 py-0.5'
      )}>
        {score}
      </span>
      {showBar && (
        <div className="w-12 h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', styles.bar)}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  )
}
