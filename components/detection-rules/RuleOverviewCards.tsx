import { Shield, CheckCircle2, FileEdit, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'
import type { DetectionRule } from '@/types/rule'

interface StatCard {
  label: string
  value: number | string
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
  borderClass: string
}

interface Props { rules: DetectionRule[] }

export function RuleOverviewCards({ rules }: Props) {
  const active      = rules.filter((r) => r.status === 'active').length
  const draft       = rules.filter((r) => r.status === 'draft').length
  const needsReview = rules.filter((r) => r.status === 'needs-review').length
  const disabled    = rules.filter((r) => r.status === 'disabled').length
  const totalHits   = rules.reduce((sum, r) => sum + r.hitCount, 0)

  const cards: StatCard[] = [
    { label: 'Total Rules',   value: rules.length, sub: `${disabled} disabled`, icon: Shield,        iconClass: 'bg-hf-primary/15 text-hf-primary',  borderClass: 'border-hf-primary/20'  },
    { label: 'Active',        value: active,        sub: 'running live',          icon: CheckCircle2,  iconClass: 'bg-hf-success/15 text-hf-success',  borderClass: 'border-hf-success/20'  },
    { label: 'Drafts',        value: draft,         sub: 'not deployed',          icon: FileEdit,      iconClass: 'bg-hf-dim/15 text-hf-muted',        borderClass: 'border-hf-border'      },
    { label: 'Needs Review',  value: needsReview,   sub: 'analyst action needed', icon: AlertTriangle, iconClass: 'bg-hf-warning/15 text-hf-warning',  borderClass: 'border-hf-warning/20'  },
    { label: 'Total Hits',    value: formatNumber(totalHits), sub: 'all-time triggers', icon: Zap,    iconClass: 'bg-hf-accent/15 text-hf-accent',    borderClass: 'border-hf-accent/20'   },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, iconClass, borderClass }) => (
        <div key={label} className={cn(
          'glass-card rounded-xl border p-4 transition-colors hover:bg-hf-surface-2',
          borderClass
        )}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-hf-muted">{label}</p>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconClass)}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-hf-text tabular-nums">{value}</p>
          {sub && <p className="text-[10px] text-hf-dim mt-1">{sub}</p>}
        </div>
      ))}
    </div>
  )
}
