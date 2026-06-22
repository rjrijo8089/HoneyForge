import { cn } from '@/lib/utils'
import type { ThreatSeverity, RuleSeverity } from '@/types'

type Severity = ThreatSeverity | RuleSeverity

interface SeverityBadgeProps {
  severity: Severity
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

const STYLES: Record<Severity, string> = {
  critical: 'bg-severity-critical/15 text-severity-critical border border-severity-critical/40',
  high:     'bg-severity-high/15 text-severity-high border border-severity-high/40',
  medium:   'bg-severity-medium/15 text-severity-medium border border-severity-medium/40',
  low:      'bg-severity-low/15 text-severity-low border border-severity-low/40',
  info:     'bg-severity-info/15 text-severity-info border border-severity-info/40',
}

const ICONS: Record<Severity, string> = {
  critical: '●●●●', high: '●●●○', medium: '●●○○', low: '●○○○', info: '○○○○',
}

export function SeverityBadge({ severity, size = 'sm', showIcon, className }: SeverityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded font-semibold capitalize',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      STYLES[severity],
      className
    )}>
      {showIcon && <span className="font-mono text-[8px] tracking-widest">{ICONS[severity]}</span>}
      {severity}
    </span>
  )
}
