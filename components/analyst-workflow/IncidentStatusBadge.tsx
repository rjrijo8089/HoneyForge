import { AlertCircle, User, Search, ShieldAlert, CheckCircle2, XCircle, TrendingUp, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IncidentStatus } from '@/types/analyst-workflow'

export const STATUS_META: Record<IncidentStatus, {
  label: string
  color: string
  bg: string
  border: string
  dot: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  'new':                  { label: 'New',                icon: AlertCircle,   color: 'text-hf-primary',   bg: 'bg-hf-primary/10',  border: 'border-hf-primary/30',  dot: 'bg-hf-primary'   },
  'assigned':             { label: 'Assigned',           icon: User,          color: 'text-blue-400',     bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    dot: 'bg-blue-400'     },
  'investigating':        { label: 'Investigating',       icon: Search,        color: 'text-hf-warning',   bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30',  dot: 'bg-hf-warning'   },
  'confirmed-attack':     { label: 'Confirmed Attack',   icon: ShieldAlert,   color: 'text-hf-danger',    bg: 'bg-hf-danger/10',   border: 'border-hf-danger/30',   dot: 'bg-hf-danger'    },
  'benign':               { label: 'Benign',             icon: CheckCircle2,  color: 'text-hf-success',   bg: 'bg-hf-success/10',  border: 'border-hf-success/30',  dot: 'bg-hf-success'   },
  'unauthorized-activity':{ label: 'Unauthorized',       icon: XCircle,       color: 'text-orange-400',   bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  dot: 'bg-orange-400'   },
  'escalated':            { label: 'Escalated',          icon: TrendingUp,    color: 'text-purple-400',   bg: 'bg-purple-400/10',  border: 'border-purple-400/30',  dot: 'bg-purple-400'   },
  'closed':               { label: 'Closed',             icon: Archive,       color: 'text-hf-dim',       bg: 'bg-hf-dim/10',      border: 'border-hf-dim/30',      dot: 'bg-hf-dim'       },
}

export const ALL_INCIDENT_STATUSES: IncidentStatus[] = [
  'new', 'assigned', 'investigating', 'confirmed-attack',
  'benign', 'unauthorized-activity', 'escalated', 'closed',
]

interface Props {
  status: IncidentStatus
  size?: 'sm' | 'md'
  showDot?: boolean
}

export function IncidentStatusBadge({ status, size = 'md', showDot = true }: Props) {
  const m = STATUS_META[status]
  const Icon = m.icon
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full border',
      m.color, m.bg, m.border,
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1',
    )}>
      {showDot
        ? <span className={cn('rounded-full shrink-0', m.dot, size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
        : <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      }
      {m.label}
    </span>
  )
}
