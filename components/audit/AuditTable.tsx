'use client'
import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { AuditLog, AuditOutcome, AuditRiskLevel, AuditAction } from '@/types/audit'
import { AUDIT_ACTION_LABELS } from '@/types/audit'

/* ── Action category colors ── */
const ACTION_COLOR: Partial<Record<AuditAction, string>> = {
  login: 'text-blue-400', logout: 'text-blue-400/60',
  decoy_created: 'text-cyan-400', decoy_paused: 'text-cyan-400/70', decoy_deleted: 'text-cyan-300/60', decoy_updated: 'text-cyan-400/60',
  clone_studio_changed: 'text-purple-400',
  event_marked_attack: 'text-orange-400', event_marked_benign: 'text-hf-success',
  ioc_exported: 'text-yellow-400',
  integration_configured: 'text-teal-400', integration_removed: 'text-teal-300/60',
  rule_enabled: 'text-hf-primary', rule_disabled: 'text-hf-primary/60', rule_created: 'text-hf-primary', rule_updated: 'text-hf-primary/80',
  report_generated: 'text-hf-muted',
  settings_changed: 'text-red-400',
  user_created: 'text-violet-400', user_deleted: 'text-violet-400/60', role_changed: 'text-violet-300',
  threat_assigned: 'text-hf-accent', threat_resolved: 'text-hf-accent/60',
}

/* ── Outcome badge ── */
const OUTCOME_META: Record<AuditOutcome, { cls: string; dot: string }> = {
  success: { cls: 'text-hf-success bg-hf-success/10 border-hf-success/25', dot: 'bg-hf-success' },
  warning: { cls: 'text-hf-warning bg-hf-warning/10 border-hf-warning/25', dot: 'bg-hf-warning' },
  failed:  { cls: 'text-hf-danger  bg-hf-danger/10  border-hf-danger/25',  dot: 'bg-hf-danger'  },
}
function OutcomeBadge({ outcome }: { outcome: AuditOutcome }) {
  const { cls, dot } = OUTCOME_META[outcome]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize whitespace-nowrap', cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {outcome}
    </span>
  )
}

/* ── Risk badge ── */
const RISK_CLS: Record<AuditRiskLevel, string> = {
  low:      'text-hf-dim border-hf-border',
  medium:   'text-hf-accent border-hf-accent/30',
  high:     'text-hf-warning border-hf-warning/30',
  critical: 'text-hf-danger border-hf-danger/30',
}
function RiskBadge({ level }: { level: AuditRiskLevel }) {
  return (
    <span className={cn('text-[10px] font-bold uppercase border px-1.5 py-0.5 rounded', RISK_CLS[level])}>
      {level}
    </span>
  )
}

/* ── Role badge ── */
const ROLE_CLS: Record<string, string> = {
  admin:   'text-hf-primary bg-hf-primary/10 border-hf-primary/25',
  analyst: 'text-hf-accent  bg-hf-accent/10  border-hf-accent/25',
  viewer:  'text-hf-dim     bg-hf-dim/10     border-hf-border',
}
function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn('text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded capitalize', ROLE_CLS[role] ?? ROLE_CLS.viewer)}>
      {role}
    </span>
  )
}

/* ── Row highlight by risk ── */
const RISK_ROW: Partial<Record<AuditRiskLevel, string>> = {
  critical: 'border-l-2 border-l-hf-danger bg-hf-danger/[0.025]',
  high:     'border-l-2 border-l-hf-warning/60',
}

/* ── Sort types ── */
type SortKey = 'timestamp' | 'userEmail' | 'action' | 'outcome' | 'riskLevel'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-hf-dim/50" />
  return dir === 'asc'
    ? <ChevronUp   className="w-3 h-3 text-hf-primary" />
    : <ChevronDown className="w-3 h-3 text-hf-primary" />
}

function Header({ col, label, sortKey, toggleSort, sortDir }: {
  col: SortKey; label: string; sortKey: SortKey
  toggleSort: (k: SortKey) => void; sortDir: SortDir
}) {
  return (
    <th className={cn(TH, 'cursor-pointer select-none hover:text-hf-muted')} onClick={() => toggleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        <SortIcon active={sortKey === col} dir={sortDir} />
      </div>
    </th>
  )
}

const TH = 'text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap'
const TD = 'px-3 py-2.5 align-middle'

interface Props {
  logs:         AuditLog[]
  onSelect:     (log: AuditLog) => void
  selectedId:   string | null
}

export function AuditTable({ logs, onSelect, selectedId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage]       = useState(0)
  const PER_PAGE = 25

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }

  const sorted = [...logs].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'timestamp')  cmp = a.timestamp.localeCompare(b.timestamp)
    if (sortKey === 'userEmail')  cmp = a.userEmail.localeCompare(b.userEmail)
    if (sortKey === 'action')     cmp = a.action.localeCompare(b.action)
    if (sortKey === 'outcome')    cmp = a.outcome.localeCompare(b.outcome)
    if (sortKey === 'riskLevel') {
      const ord = { low: 0, medium: 1, high: 2, critical: 3 }
      cmp = ord[a.riskLevel] - ord[b.riskLevel]
    }
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged      = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-hf-dim gap-2">
        <span className="text-3xl opacity-20">📋</span>
        <p className="text-sm">No audit logs match the current filters</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-xl border border-hf-border/40">
        <table className="w-full text-xs min-w-[960px]">
          <thead className="bg-hf-surface-2/80 border-b border-hf-border/40">
            <tr>
              <Header col="timestamp" label="Timestamp" sortKey={sortKey} toggleSort={toggleSort} sortDir={sortDir} />
              <Header col="userEmail" label="Actor"     sortKey={sortKey} toggleSort={toggleSort} sortDir={sortDir} />
              <th className={TH}>Role</th>
              <Header col="action"   label="Action"    sortKey={sortKey} toggleSort={toggleSort} sortDir={sortDir} />
              <th className={TH}>Resource</th>
              <th className={TH}>Source IP</th>
              <Header col="outcome"   label="Outcome"  sortKey={sortKey} toggleSort={toggleSort} sortDir={sortDir} />
              <Header col="riskLevel" label="Risk"     sortKey={sortKey} toggleSort={toggleSort} sortDir={sortDir} />
              <th className={TH}>Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hf-border/20">
            {paged.map((log) => (
              <tr
                key={log.id}
                onClick={() => onSelect(log)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-hf-surface-2/50',
                  RISK_ROW[log.riskLevel],
                  selectedId === log.id && 'bg-hf-primary/5 !border-l-hf-primary'
                )}
              >
                {/* Timestamp */}
                <td className={TD}>
                  <span className="font-mono text-[10px] text-hf-muted whitespace-nowrap">
                    {formatDate(log.timestamp, 'long')}
                  </span>
                </td>

                {/* Actor */}
                <td className={TD}>
                  <p className="text-hf-text font-medium truncate max-w-[160px]">{log.userEmail}</p>
                </td>

                {/* Role */}
                <td className={TD}>
                  <RoleBadge role={log.userRole} />
                </td>

                {/* Action */}
                <td className={TD}>
                  <span className={cn('font-mono text-[10px]', ACTION_COLOR[log.action] ?? 'text-hf-muted')}>
                    {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </td>

                {/* Resource */}
                <td className={TD}>
                  <p className="text-hf-muted capitalize text-[10px]">{log.resourceType}</p>
                  {log.resourceName && (
                    <p className="text-hf-dim text-[9px] truncate max-w-[140px]">{log.resourceName}</p>
                  )}
                </td>

                {/* IP */}
                <td className={TD}>
                  <span className="font-mono text-[10px] text-hf-muted">{log.ipAddress}</span>
                </td>

                {/* Outcome */}
                <td className={TD}>
                  <OutcomeBadge outcome={log.outcome} />
                </td>

                {/* Risk */}
                <td className={TD}>
                  <RiskBadge level={log.riskLevel} />
                </td>

                {/* Details preview */}
                <td className={TD}>
                  <span className="text-[10px] text-hf-dim truncate max-w-[180px] block">
                    {Object.entries(log.details)
                      .slice(0, 2)
                      .map(([k, v]) => `${k}: ${String(v)}`)
                      .join(' · ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-hf-dim px-1">
          <span>{sorted.length} entries · page {page + 1}/{totalPages}</span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border border-hf-border/50 hover:bg-hf-surface-3 disabled:opacity-30 transition-all"
            >
              ← Prev
            </button>
            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-hf-border/50 hover:bg-hf-surface-3 disabled:opacity-30 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
