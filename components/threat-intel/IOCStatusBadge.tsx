'use client'
import { cn } from '@/lib/utils'
import { AlertCircle, Search, CheckCircle2, XCircle, Archive } from 'lucide-react'
import type { IOCStatus } from '@/types/threat-intel'

const STATUS_META: Record<IOCStatus, {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ComponentType<{ className?: string }>
  dot: string
}> = {
  new:            { label: 'New',           color: 'text-hf-primary',  bg: 'bg-hf-primary/10',  border: 'border-hf-primary/30',  icon: AlertCircle,   dot: 'bg-hf-primary'  },
  investigating:  { label: 'Investigating', color: 'text-hf-warning',  bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30',  icon: Search,        dot: 'bg-hf-warning'  },
  confirmed:      { label: 'Confirmed',     color: 'text-hf-danger',   bg: 'bg-hf-danger/10',   border: 'border-hf-danger/30',   icon: CheckCircle2,  dot: 'bg-hf-danger'   },
  'false-positive':{ label: 'False Positive',color: 'text-hf-success', bg: 'bg-hf-success/10',  border: 'border-hf-success/30',  icon: XCircle,       dot: 'bg-hf-success'  },
  closed:         { label: 'Closed',        color: 'text-hf-dim',      bg: 'bg-hf-surface-3',   border: 'border-hf-border/40',   icon: Archive,       dot: 'bg-hf-dim'      },
}

interface IOCStatusBadgeProps {
  status: IOCStatus
  size?: 'xs' | 'sm'
  showDot?: boolean
}

export function IOCStatusBadge({ status, size = 'sm', showDot = false }: IOCStatusBadgeProps) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-semibold rounded border',
      size === 'xs' ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5',
      meta.color, meta.bg, meta.border,
    )}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />}
      {!showDot && <Icon className="w-2.5 h-2.5" />}
      {meta.label}
    </span>
  )
}

export const ALL_IOC_STATUSES: IOCStatus[] = ['new', 'investigating', 'confirmed', 'false-positive', 'closed']
export { STATUS_META }

interface StatusDropdownProps {
  current: IOCStatus
  onChange: (status: IOCStatus) => void
}

export function StatusDropdown({ current, onChange }: StatusDropdownProps) {
  return (
    <div className="absolute top-full left-0 mt-1 w-40 z-50 bg-hf-surface-2 border border-hf-border rounded-xl shadow-2xl py-1 animate-fade-in">
      {ALL_IOC_STATUSES.map((s) => {
        const meta = STATUS_META[s]
        const Icon = meta.icon
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-hf-surface-3 transition-colors',
              s === current ? meta.color + ' bg-hf-surface-3' : 'text-hf-muted'
            )}
          >
            <Icon className="w-3 h-3" /> {meta.label}
          </button>
        )
      })}
    </div>
  )
}
