import { cn } from '@/lib/utils'

type Accent = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'cyan' | 'purple' | 'pink'

interface StatCardProps {
  label: string
  value: number | string
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  accent: Accent
  sublabel?: string
  live?: boolean
  delay?: number
  className?: string
}

const ACCENT: Record<Accent, {
  iconBg: string; border: string; topBar: string; changePill: string; glow: string
}> = {
  red:    { iconBg: 'bg-severity-critical/15 text-severity-critical', border: 'border-severity-critical/20',  topBar: 'from-severity-critical/60 to-transparent',  changePill: 'bg-severity-critical/15 text-severity-critical',  glow: 'hover:shadow-[0_0_24px_rgba(220,38,38,0.12)]'   },
  orange: { iconBg: 'bg-severity-high/15 text-severity-high',         border: 'border-severity-high/20',      topBar: 'from-severity-high/60 to-transparent',      changePill: 'bg-severity-high/15 text-severity-high',          glow: 'hover:shadow-[0_0_24px_rgba(234,88,12,0.12)]'   },
  yellow: { iconBg: 'bg-hf-warning/15 text-hf-warning',               border: 'border-hf-warning/20',         topBar: 'from-hf-warning/60 to-transparent',         changePill: 'bg-hf-warning/15 text-hf-warning',                glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]'  },
  green:  { iconBg: 'bg-hf-success/15 text-hf-success',               border: 'border-hf-success/20',         topBar: 'from-hf-success/60 to-transparent',         changePill: 'bg-hf-success/15 text-hf-success',                glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]'  },
  blue:   { iconBg: 'bg-hf-primary/15 text-hf-primary',               border: 'border-hf-primary/20',         topBar: 'from-hf-primary/60 to-transparent',         changePill: 'bg-hf-primary/15 text-hf-primary',                glow: 'hover:shadow-[0_0_24px_rgba(59,130,246,0.12)]'  },
  cyan:   { iconBg: 'bg-hf-accent/15 text-hf-accent',                 border: 'border-hf-accent/20',          topBar: 'from-hf-accent/60 to-transparent',          changePill: 'bg-hf-accent/15 text-hf-accent',                  glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]'   },
  purple: { iconBg: 'bg-purple-500/15 text-purple-400',               border: 'border-purple-500/20',         topBar: 'from-purple-500/60 to-transparent',         changePill: 'bg-purple-500/15 text-purple-400',                glow: 'hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]'  },
  pink:   { iconBg: 'bg-pink-500/15 text-pink-400',                   border: 'border-pink-500/20',           topBar: 'from-pink-500/60 to-transparent',           changePill: 'bg-pink-500/15 text-pink-400',                    glow: 'hover:shadow-[0_0_24px_rgba(236,72,153,0.12)]'  },
}

const CHANGE_ARROWS = { up: '↑', down: '↓', neutral: '→' }

export function StatCard({
  label, value, change, changeType = 'neutral', icon, accent,
  sublabel, live, delay = 0, className,
}: StatCardProps) {
  const a = ACCENT[accent]
  const numVal = typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden glass-card glass-card-hover cursor-default',
        'transition-all duration-300',
        a.border,
        a.glow,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent bar */}
      <div className={cn('absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r', a.topBar)} />

      {/* Content */}
      <div className="relative z-10 p-4 xl:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', a.iconBg)}>
            {icon}
          </div>
          <div className="flex items-center gap-1.5">
            {live && (
              <span className="relative w-1.5 h-1.5">
                <span className="absolute inset-0 bg-hf-danger rounded-full" />
                <span className="absolute inset-0 bg-hf-danger rounded-full animate-ping opacity-70" />
              </span>
            )}
            {change && (
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', a.changePill)}>
                {changeType !== 'neutral' && CHANGE_ARROWS[changeType]} {change}
              </span>
            )}
          </div>
        </div>

        <p
          className="text-2xl xl:text-3xl font-bold text-hf-text tabular-nums tracking-tight animate-count"
          style={{ animationDelay: `${delay + 100}ms` }}
        >
          {numVal}
        </p>
        <p className="text-xs font-medium text-hf-muted mt-1">{label}</p>
        {sublabel && <p className="text-[10px] text-hf-dim mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
