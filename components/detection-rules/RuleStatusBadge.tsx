import { cn } from '@/lib/utils'
import type { RuleStatus } from '@/types/rule'

const META: Record<RuleStatus, { label: string; dot: string; pill: string }> = {
  active:        { label: 'Active',       dot: 'bg-hf-success', pill: 'bg-hf-success/15 text-hf-success border-hf-success/30'   },
  draft:         { label: 'Draft',        dot: 'bg-hf-dim',     pill: 'bg-hf-dim/15 text-hf-muted border-hf-border'             },
  disabled:      { label: 'Disabled',     dot: 'bg-hf-dim',     pill: 'bg-hf-dim/15 text-hf-dim border-hf-border'               },
  'needs-review':{ label: 'Needs Review', dot: 'bg-hf-warning', pill: 'bg-hf-warning/15 text-hf-warning border-hf-warning/30'  },
  inactive:      { label: 'Inactive',     dot: 'bg-hf-dim',     pill: 'bg-hf-dim/15 text-hf-muted border-hf-border'             },
}

export const ALL_RULE_STATUSES: RuleStatus[] = ['active', 'draft', 'disabled', 'needs-review']

export function RuleStatusBadge({ status, className }: { status: RuleStatus; className?: string }) {
  const m = META[status] ?? META.inactive
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
      m.pill, className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', m.dot)} />
      {m.label}
    </span>
  )
}
