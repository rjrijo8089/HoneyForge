import { cn } from '@/lib/utils'

type Trend = 'up' | 'down' | 'neutral'
type Accent = 'blue' | 'green' | 'yellow' | 'red' | 'cyan'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: Trend
  trendValue?: string
  icon?: React.ReactNode
  accent?: Accent
  isLoading?: boolean
  className?: string
}

const ACCENT_STYLES: Record<Accent, { icon: string; border: string; badge: string }> = {
  blue:   { icon: 'bg-hf-primary/15 text-hf-primary',  border: 'border-hf-primary/20',  badge: 'text-hf-primary' },
  green:  { icon: 'bg-hf-success/15 text-hf-success',  border: 'border-hf-success/20',  badge: 'text-hf-success' },
  yellow: { icon: 'bg-hf-warning/15 text-hf-warning',  border: 'border-hf-warning/20',  badge: 'text-hf-warning' },
  red:    { icon: 'bg-hf-danger/15 text-hf-danger',    border: 'border-hf-danger/20',   badge: 'text-hf-danger' },
  cyan:   { icon: 'bg-hf-accent/15 text-hf-accent',    border: 'border-hf-accent/20',   badge: 'text-hf-accent' },
}

const TREND_COLORS: Record<Trend, string> = {
  up:      'text-hf-success',
  down:    'text-hf-danger',
  neutral: 'text-hf-muted',
}

const TREND_ARROWS: Record<Trend, string> = {
  up: '↑', down: '↓', neutral: '→',
}

export function MetricCard({
  title, value, subtitle, trend, trendValue, icon, accent = 'blue', isLoading, className,
}: MetricCardProps) {
  const styles = ACCENT_STYLES[accent]

  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-hf-border bg-hf-surface p-5', className)}>
        <div className="animate-shimmer h-4 w-24 rounded mb-3" />
        <div className="animate-shimmer h-8 w-16 rounded mb-2" />
        <div className="animate-shimmer h-3 w-32 rounded" />
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-xl border bg-hf-surface p-5 transition-colors hover:bg-hf-surface-2',
      styles.border,
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-hf-muted">{title}</p>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', styles.icon)}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-hf-text tabular-nums">{value}</p>
      {(subtitle || trendValue) && (
        <div className="mt-2 flex items-center gap-2">
          {trend && trendValue && (
            <span className={cn('text-xs font-medium', TREND_COLORS[trend])}>
              {TREND_ARROWS[trend]} {trendValue}
            </span>
          )}
          {subtitle && <span className="text-xs text-hf-dim">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
