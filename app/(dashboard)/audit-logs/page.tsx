'use client'
import { useState, useMemo, useCallback } from 'react'
import { ScrollText, Download, AlertTriangle, TableIcon, GitBranch, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_AUDIT_LOGS } from '@/services/mock/data/audit'
import { useDataMode } from '@/contexts/DataModeContext'
import { AuditOverviewCards }  from '@/components/audit/AuditOverviewCards'
import { AuditFiltersBar }     from '@/components/audit/AuditFilters'
import { AuditTable }          from '@/components/audit/AuditTable'
import { AuditTimeline }       from '@/components/audit/AuditTimeline'
import { AuditDetailDrawer }   from '@/components/audit/AuditDetailDrawer'
import { DEFAULT_AUDIT_FILTERS } from '@/types/audit'
import type { AuditLog, AuditFilters } from '@/types/audit'

type ViewMode = 'table' | 'timeline'

/* ── Filter logic ── */
function applyFilters(logs: AuditLog[], f: AuditFilters): AuditLog[] {
  let list = logs
  if (f.search) {
    const q = f.search.toLowerCase()
    list = list.filter((l) =>
      l.userEmail.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.resourceType.toLowerCase().includes(q) ||
      (l.resourceName ?? '').toLowerCase().includes(q) ||
      l.ipAddress.includes(q) ||
      JSON.stringify(l.details).toLowerCase().includes(q)
    )
  }
  if (f.actors.length)        list = list.filter((l) => f.actors.includes(l.userEmail))
  if (f.actions.length)       list = list.filter((l) => f.actions.includes(l.action))
  if (f.outcomes.length)      list = list.filter((l) => f.outcomes.includes(l.outcome))
  if (f.resourceTypes.length) list = list.filter((l) => f.resourceTypes.includes(l.resourceType))
  if (f.riskLevels.length)    list = list.filter((l) => f.riskLevels.includes(l.riskLevel))
  if (f.dateFrom)             list = list.filter((l) => l.timestamp >= f.dateFrom)
  if (f.dateTo)               list = list.filter((l) => l.timestamp.slice(0, 10) <= f.dateTo)
  return list
}

/* ── CSV export ── */
function exportCSV(logs: AuditLog[]) {
  const cols = ['id','timestamp','userEmail','userRole','action','resourceType','resourceName','ipAddress','outcome','riskLevel'] as const
  const header = cols.join(',')
  const rows   = logs.map((l) =>
    cols.map((c) => {
      const v = l[c] ?? ''
      const s = String(v).replace(/"/g, '""')
      return `"${s}"`
    }).join(',')
  )
  const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url, download: `honeyforge-audit-${new Date().toISOString().slice(0, 10)}.csv`,
  })
  a.click(); URL.revokeObjectURL(url)
}

export default function AuditLogsPage() {
  const { isDemoMode } = useDataMode()
  const logs = useMemo(
    () => (isDemoMode ? MOCK_AUDIT_LOGS as unknown as AuditLog[] : []),
    [isDemoMode]
  )

  const [filters,    setFilters]    = useState<AuditFilters>(DEFAULT_AUDIT_FILTERS)
  const [viewMode,   setViewMode]   = useState<ViewMode>('table')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const actorOptions = useMemo(() => [...new Set(logs.map((l) => l.userEmail))].sort(), [logs])

  const filtered = useMemo(() => applyFilters(logs, filters), [logs, filters])

  const selected = useMemo(() => logs.find((l) => l.id === selectedId) ?? null, [logs, selectedId])

  const handleSelect = useCallback((log: AuditLog) => {
    setSelectedId((prev) => prev === log.id ? null : log.id)
  }, [])

  const handleClose = useCallback(() => setSelectedId(null), [])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Admin-only compliance banner ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.06]">
        <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-300">Admin &amp; Compliance Access Only</p>
          <p className="text-[11px] text-amber-400/80 mt-0.5">
            Audit logs are immutable and tamper-evident. All access to this page is itself recorded.
            Do not share raw logs externally without prior approval from the compliance officer.
          </p>
        </div>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60 shrink-0 mt-0.5" />
      </div>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center shrink-0">
            <ScrollText className="w-4 h-4 text-hf-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-hf-text">Audit Logs</h2>
            <p className="text-xs text-hf-muted mt-0.5">
              Immutable record of all platform actions · {logs.length} events indexed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-1 bg-hf-surface-2 border border-hf-border/40 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all',
                viewMode === 'table'
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/30'
                  : 'text-hf-dim hover:text-hf-muted'
              )}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all',
                viewMode === 'timeline'
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/30'
                  : 'text-hf-dim hover:text-hf-muted'
              )}
            >
              <GitBranch className="w-3.5 h-3.5" /> Timeline
            </button>
          </div>

          {/* Export */}
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-border text-hf-muted hover:text-hf-text hover:bg-hf-surface-3 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Overview cards ── */}
      <AuditOverviewCards logs={logs} />

      {/* ── Filters ── */}
      <AuditFiltersBar
        filters={filters}
        onChange={setFilters}
        actorOptions={actorOptions}
        resultCount={filtered.length}
        totalCount={logs.length}
      />

      {/* ── Content area (shifts when drawer is open) ── */}
      <div className={cn('transition-all duration-300', selected && 'xl:pr-[calc(min(50vw,580px)+1.5rem)]')}>
        {viewMode === 'table' ? (
          <AuditTable
            logs={filtered}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        ) : (
          <AuditTimeline
            logs={filtered}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        )}
      </div>

      {/* ── Detail drawer backdrop ── */}
      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={handleClose}
        />
      )}

      {/* ── Detail drawer ── */}
      {selected && (
        <AuditDetailDrawer
          log={selected}
          allLogs={logs}
          onClose={handleClose}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
