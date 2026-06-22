import { cn } from '@/lib/utils'

type Status =
  | 'active' | 'inactive' | 'deploying' | 'error' | 'pending'
  | 'connected' | 'disconnected'
  | 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved'
  | 'generating' | 'ready' | 'failed' | 'scheduled'
  | 'draft'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const STATUS_STYLES: Record<Status, string> = {
  active:        'bg-hf-success/15 text-hf-success border border-hf-success/30',
  connected:     'bg-hf-success/15 text-hf-success border border-hf-success/30',
  ready:         'bg-hf-success/15 text-hf-success border border-hf-success/30',
  inactive:      'bg-hf-dim/15 text-hf-muted border border-hf-border',
  disconnected:  'bg-hf-dim/15 text-hf-muted border border-hf-border',
  draft:         'bg-hf-dim/15 text-hf-muted border border-hf-border',
  deploying:     'bg-hf-accent/15 text-hf-accent border border-hf-accent/30',
  investigating: 'bg-hf-accent/15 text-hf-accent border border-hf-accent/30',
  generating:    'bg-hf-accent/15 text-hf-accent border border-hf-accent/30',
  pending:       'bg-hf-warning/15 text-hf-warning border border-hf-warning/30',
  new:           'bg-hf-warning/15 text-hf-warning border border-hf-warning/30',
  scheduled:     'bg-hf-warning/15 text-hf-warning border border-hf-warning/30',
  error:         'bg-hf-danger/15 text-hf-danger border border-hf-danger/30',
  failed:        'bg-hf-danger/15 text-hf-danger border border-hf-danger/30',
  confirmed:     'bg-hf-primary/15 text-hf-primary border border-hf-primary/30',
  false_positive:'bg-hf-dim/15 text-hf-muted border border-hf-border',
  resolved:      'bg-hf-success/15 text-hf-success border border-hf-success/30',
}

const STATUS_DOTS: Record<Status, string> = {
  active: 'bg-hf-success', connected: 'bg-hf-success', ready: 'bg-hf-success', resolved: 'bg-hf-success',
  deploying: 'bg-hf-accent', investigating: 'bg-hf-accent', generating: 'bg-hf-accent',
  pending: 'bg-hf-warning', new: 'bg-hf-warning', scheduled: 'bg-hf-warning',
  error: 'bg-hf-danger', failed: 'bg-hf-danger',
  confirmed: 'bg-hf-primary',
  inactive: 'bg-hf-dim', disconnected: 'bg-hf-dim', draft: 'bg-hf-dim', false_positive: 'bg-hf-dim',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ')
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize',
      STATUS_STYLES[status] ?? 'bg-hf-dim/15 text-hf-muted border border-hf-border',
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOTS[status] ?? 'bg-hf-dim')} />
      {label}
    </span>
  )
}
