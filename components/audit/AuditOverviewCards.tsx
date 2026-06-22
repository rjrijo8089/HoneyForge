import { Activity, XCircle, ShieldAlert, Plug, ClipboardCheck } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import type { AuditLog } from '@/types/audit'

const TODAY = '2026-06-18'

function isToday(ts: string) { return ts.startsWith(TODAY) }
function isLast7Days(ts: string) { return ts >= '2026-06-12' }

interface Card {
  label:  string
  value:  number
  sub:    string
  icon:   React.ComponentType<{ className?: string }>
  iconCls: string
  border: string
}

interface Props { logs: AuditLog[] }

export function AuditOverviewCards({ logs }: Props) {
  const todayLogs   = logs.filter((l) => isToday(l.timestamp))
  const recentLogs  = logs.filter((l) => isLast7Days(l.timestamp))

  const cards: Card[] = [
    {
      label:   'Total Actions Today',
      value:   todayLogs.length,
      sub:     `${formatNumber(recentLogs.length)} in last 7 days`,
      icon:    Activity,
      iconCls: 'bg-hf-primary/15 text-hf-primary',
      border:  'border-hf-primary/20',
    },
    {
      label:   'Failed Actions',
      value:   todayLogs.filter((l) => l.outcome === 'failed').length,
      sub:     `${recentLogs.filter((l) => l.outcome === 'failed').length} this week`,
      icon:    XCircle,
      iconCls: 'bg-hf-danger/15 text-hf-danger',
      border:  'border-hf-danger/25',
    },
    {
      label:   'Privileged Actions',
      value:   todayLogs.filter((l) => l.riskLevel === 'high' || l.riskLevel === 'critical').length,
      sub:     `${recentLogs.filter((l) => l.riskLevel === 'critical').length} critical this week`,
      icon:    ShieldAlert,
      iconCls: 'bg-hf-warning/15 text-hf-warning',
      border:  'border-hf-warning/20',
    },
    {
      label:   'Integration Changes',
      value:   recentLogs.filter((l) => l.resourceType === 'integration').length,
      sub:     'last 7 days',
      icon:    Plug,
      iconCls: 'bg-cyan-500/15 text-cyan-400',
      border:  'border-cyan-500/20',
    },
    {
      label:   'Review Decisions',
      value:   recentLogs.filter((l) => l.action === 'event_marked_attack' || l.action === 'event_marked_benign').length,
      sub:     `${todayLogs.filter((l) => l.action === 'event_marked_attack' || l.action === 'event_marked_benign').length} today`,
      icon:    ClipboardCheck,
      iconCls: 'bg-hf-success/15 text-hf-success',
      border:  'border-hf-success/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, iconCls, border }) => (
        <div key={label} className={cn(
          'glass-card rounded-xl border p-4 transition-colors hover:bg-hf-surface-2',
          border
        )}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-hf-muted leading-snug">{label}</p>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconCls)}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-hf-text tabular-nums">{formatNumber(value)}</p>
          <p className="text-[10px] text-hf-dim mt-1">{sub}</p>
        </div>
      ))}
    </div>
  )
}
