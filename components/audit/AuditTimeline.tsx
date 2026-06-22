import { cn } from '@/lib/utils'
import type { AuditLog, AuditOutcome, AuditRiskLevel, AuditAction } from '@/types/audit'
import { AUDIT_ACTION_LABELS } from '@/types/audit'

const RISK_DOT: Record<AuditRiskLevel, string> = {
  low:      'bg-hf-dim ring-hf-dim/20',
  medium:   'bg-hf-accent ring-hf-accent/20',
  high:     'bg-hf-warning ring-hf-warning/20',
  critical: 'bg-hf-danger ring-hf-danger/20',
}
const OUTCOME_DOT: Record<AuditOutcome, string> = {
  success: 'text-hf-success bg-hf-success/10 border-hf-success/25',
  warning: 'text-hf-warning bg-hf-warning/10 border-hf-warning/25',
  failed:  'text-hf-danger  bg-hf-danger/10  border-hf-danger/25',
}
const ACTION_COLOR: Partial<Record<AuditAction, string>> = {
  login: 'text-blue-400', logout: 'text-blue-400/60',
  decoy_created: 'text-cyan-400', decoy_paused: 'text-cyan-400/70',
  clone_studio_changed: 'text-purple-400',
  event_marked_attack: 'text-orange-400', event_marked_benign: 'text-hf-success',
  ioc_exported: 'text-yellow-400',
  integration_configured: 'text-teal-400', integration_removed: 'text-teal-300/60',
  rule_enabled: 'text-hf-primary', rule_disabled: 'text-hf-primary/60', rule_created: 'text-hf-primary',
  report_generated: 'text-hf-muted',
  settings_changed: 'text-red-400',
  user_created: 'text-violet-400', user_deleted: 'text-violet-400/60', role_changed: 'text-violet-300',
  threat_assigned: 'text-hf-accent', threat_resolved: 'text-hf-accent/60',
}

function groupByDay(logs: AuditLog[]): Array<{ date: string; entries: AuditLog[] }> {
  const map = new Map<string, AuditLog[]>()
  for (const log of logs) {
    const day = log.timestamp.slice(0, 10)
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(log)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, entries]) => ({ date, entries }))
}

function formatDay(date: string): string {
  const d     = new Date(date + 'T00:00:00Z')
  const today = '2026-06-18'
  const yest  = '2026-06-17'
  if (date === today) return 'Today — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  if (date === yest)  return 'Yesterday — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

interface Props {
  logs:       AuditLog[]
  onSelect:   (log: AuditLog) => void
  selectedId: string | null
}

export function AuditTimeline({ logs, onSelect, selectedId }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-hf-dim gap-2">
        <span className="text-3xl opacity-20">⏱</span>
        <p className="text-sm">No events match the current filters</p>
      </div>
    )
  }

  const groups = groupByDay(logs)

  return (
    <div className="space-y-8">
      {groups.map(({ date, entries }) => (
        <div key={date}>
          {/* Day header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-hf-border/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-hf-dim px-3 py-1 rounded-full border border-hf-border/40 bg-hf-surface-2 whitespace-nowrap">
              {formatDay(date)}
            </span>
            <div className="h-px flex-1 bg-hf-border/30" />
            <span className="text-[10px] text-hf-dim shrink-0">{entries.length} event{entries.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Timeline entries */}
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-hf-border/25" />

            <div className="space-y-1.5">
              {entries.map((log) => (
                <div
                  key={log.id}
                  onClick={() => onSelect(log)}
                  className={cn(
                    'relative flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group',
                    selectedId === log.id
                      ? 'border-hf-primary/40 bg-hf-primary/5'
                      : 'border-transparent hover:border-hf-border/30 hover:bg-hf-surface-2/50',
                    log.outcome === 'failed' && selectedId !== log.id && 'hover:border-hf-danger/20 hover:bg-hf-danger/[0.02]',
                    log.riskLevel === 'critical' && selectedId !== log.id && 'hover:border-hf-danger/30'
                  )}
                >
                  {/* Dot */}
                  <div className={cn(
                    'absolute -left-5 top-3 w-4 h-4 rounded-full ring-4 ring-hf-bg flex items-center justify-center shrink-0 z-10',
                    RISK_DOT[log.riskLevel]
                  )} />

                  {/* Time */}
                  <span className="font-mono text-[10px] text-hf-dim mt-0.5 w-16 shrink-0">
                    {log.timestamp.slice(11, 19)} UTC
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-hf-text">{log.userEmail}</span>
                      <span className={cn(
                        'text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded',
                        log.userRole === 'admin' ? 'text-hf-primary border-hf-primary/30' :
                        log.userRole === 'analyst' ? 'text-hf-accent border-hf-accent/30' :
                        'text-hf-dim border-hf-border'
                      )}>{log.userRole}</span>
                      <span className={cn('text-[11px] font-medium', ACTION_COLOR[log.action] ?? 'text-hf-muted')}>
                        {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                      </span>
                      {log.resourceName && (
                        <span className="text-[10px] text-hf-dim truncate">→ {log.resourceName}</span>
                      )}
                    </div>
                    {Object.keys(log.details).length > 0 && (
                      <p className="text-[10px] text-hf-dim/70 mt-0.5 truncate">
                        {Object.entries(log.details).slice(0, 2).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn('text-[10px] font-semibold border px-1.5 py-0.5 rounded-full capitalize', OUTCOME_DOT[log.outcome])}>
                      {log.outcome}
                    </span>
                    {(log.riskLevel === 'high' || log.riskLevel === 'critical') && (
                      <span className={cn(
                        'text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded',
                        log.riskLevel === 'critical' ? 'text-hf-danger border-hf-danger/30' : 'text-hf-warning border-hf-warning/30'
                      )}>{log.riskLevel}</span>
                    )}
                    <span className="font-mono text-[9px] text-hf-dim/50">{log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
