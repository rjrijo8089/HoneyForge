'use client'
import { useState, useMemo, useCallback } from 'react'
import { ClipboardList, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDataMode } from '@/contexts/DataModeContext'

import { IncidentFilterPanel, DEFAULT_INCIDENT_FILTERS } from '@/components/analyst-workflow/IncidentFilters'
import { IncidentListPanel, sortIncidents }               from '@/components/analyst-workflow/IncidentListPanel'
import { IncidentDetail }                                 from '@/components/analyst-workflow/IncidentDetail'
import { ActionPanel }                                    from '@/components/analyst-workflow/ActionPanel'
import { CommentThread }                                  from '@/components/analyst-workflow/CommentThread'
import { BulkActionBar }                                  from '@/components/analyst-workflow/BulkActionBar'
import { EscalateModal }                                  from '@/components/analyst-workflow/EscalateModal'
import { CreateRuleModal }                                from '@/components/analyst-workflow/CreateRuleModal'

import { MOCK_INCIDENTS, ANALYSTS } from '@/services/mock/data/analystWorkflow'
import type {
  AnalystIncident, IncidentStatus, IncidentFiltersState,
  IncidentComment, IncidentActivity,
} from '@/types/analyst-workflow'

import type { SortField, SortDir } from '@/components/analyst-workflow/IncidentListPanel'

/* ── Export helpers ── */
function exportIncidents(incidents: AnalystIncident[], format: 'json' | 'csv') {
  let content: string; let filename: string; let type: string
  if (format === 'json') {
    content = JSON.stringify(incidents, null, 2)
    filename = `honeyforge_incidents_${new Date().toISOString().slice(0, 10)}.json`
    type = 'application/json'
  } else {
    const cols = ['id', 'title', 'status', 'severity', 'confidence', 'sourceIp', 'sourceCountry', 'targetDecoyName', 'attackType', 'detectionSource', 'timestamp', 'eventCount', 'assignedToName']
    const rows = incidents.map((i) => cols.map((c) => {
      const v = (i as unknown as Record<string, unknown>)[c]
      return typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v ?? '')
    }).join(','))
    content = cols.join(',') + '\n' + rows.join('\n')
    filename = `honeyforge_incidents_${new Date().toISOString().slice(0, 10)}.csv`
    type = 'text/csv'
  }
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click(); URL.revokeObjectURL(url)
}

/* ── Status summary config ── */
const STATUS_PILL_CFG: Array<{ key: IncidentStatus; label: string; color: string }> = [
  { key: 'new',                   label: 'New',           color: 'bg-hf-primary/20 text-hf-primary border-hf-primary/30'     },
  { key: 'investigating',         label: 'Investigating', color: 'bg-hf-warning/20 text-hf-warning border-hf-warning/30'     },
  { key: 'confirmed-attack',      label: 'Confirmed',     color: 'bg-hf-danger/20 text-hf-danger border-hf-danger/30'        },
  { key: 'escalated',             label: 'Escalated',     color: 'bg-purple-400/20 text-purple-400 border-purple-400/30'     },
  { key: 'unauthorized-activity', label: 'Unauthorized',  color: 'bg-orange-400/20 text-orange-400 border-orange-400/30'     },
]

function ReviewQueueContent({ isDemoMode }: { isDemoMode: boolean }) {
  /* ── State ── */
  const [incidents,   setIncidents]   = useState<AnalystIncident[]>(isDemoMode ? MOCK_INCIDENTS : [])
  const [selected,    setSelected]    = useState<AnalystIncident | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filters,     setFilters]     = useState<IncidentFiltersState>(DEFAULT_INCIDENT_FILTERS)
  const [sort,        setSort]        = useState<{ field: SortField; dir: SortDir }>({ field: 'timestamp', dir: 'desc' })
  const [showEscalate,   setShowEscalate]   = useState(false)
  const [showCreateRule, setShowCreateRule] = useState(false)

  /* ── Filter + sort ── */
  const [filterNow] = useState<number>(() => Date.now())

  const filtered = useMemo(() => {
    const result = incidents.filter((inc) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const hay = [inc.title, inc.sourceIp, inc.attackType, inc.targetDecoyName, inc.detectionSource, ...inc.tags, inc.campaignName ?? '', inc.assignedToName ?? ''].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(inc.status)) return false
      if (filters.severities.length > 0 && !filters.severities.includes(inc.severity)) return false
      if (filters.assignedTo.length > 0 && !filters.assignedTo.includes(inc.assignedTo ?? '')) return false
      if (filters.detectionSources.length > 0 && !filters.detectionSources.includes(inc.detectionSource)) return false
      if (filters.attackCategories.length > 0 && !filters.attackCategories.includes(inc.attackCategory)) return false
      if (filters.unassignedOnly && inc.assignedTo) return false
      if (filters.dateRange !== 'all') {
        const cutoff: Record<string, number> = { '1h': 3600_000, '24h': 86400_000, '7d': 604800_000, '30d': 2592000_000 }
        if (filterNow - new Date(inc.timestamp).getTime() > (cutoff[filters.dateRange] ?? 0)) return false
      }
      return true
    })
    return sortIncidents(result, sort.field, sort.dir)
  }, [incidents, filters, sort, filterNow])

  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => ({ field, dir: prev.field === field ? (prev.dir === 'asc' ? 'desc' : 'asc') : 'desc' }))
  }, [])

  /* ── Core mutation helper ── */
  const patchIncident = useCallback((id: string, patch: Partial<AnalystIncident>) => {
    setIncidents((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } : i))
    setSelected((prev) => prev?.id === id ? { ...prev, ...patch } as AnalystIncident : prev)
  }, [])

  /* ── Individual actions ── */
  const handleStatusChange = useCallback((id: string, status: IncidentStatus) => {
    const inc = incidents.find((i) => i.id === id)
    const now = new Date().toISOString()
    patchIncident(id, {
      status,
      activity: [...(inc?.activity ?? []), { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'status-changed', newValue: status, timestamp: now }],
    })
  }, [incidents, patchIncident])

  const handleAssign = useCallback((id: string, analystId: string) => {
    const analyst = ANALYSTS.find((a) => a.id === analystId)
    const inc = incidents.find((i) => i.id === id)
    const now = new Date().toISOString()
    patchIncident(id, {
      assignedTo: analyst?.id, assignedToName: analyst?.name, assignedAt: now,
      status: analystId ? 'assigned' : (inc?.status ?? 'new'),
      activity: [...(inc?.activity ?? []), { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'assigned', newValue: analyst?.name ?? 'Unassigned', timestamp: now }],
    })
  }, [incidents, patchIncident])

  const handleAddComment = useCallback((text: string) => {
    if (!selected) return
    const now = new Date().toISOString()
    const comment: IncidentComment = { id: `cmt_${Date.now()}`, authorId: 'j.chen', authorName: 'Jake Chen', text, timestamp: now, isSystem: false, isPinned: false }
    const act: IncidentActivity    = { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'comment-added', timestamp: now }
    patchIncident(selected.id, { comments: [...selected.comments, comment], activity: [...selected.activity, act] })
  }, [selected, patchIncident])

  const handleEscalate = useCallback((_priority: string, _to: string, _reason: string, _notify: boolean) => {
    if (!selected) return
    const now = new Date().toISOString()
    patchIncident(selected.id, {
      status: 'escalated',
      activity: [...selected.activity, { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'escalated', detail: `${_priority} → ${_to}${_reason ? ` — ${_reason}` : ''}`, timestamp: now }],
    })
  }, [selected, patchIncident])

  const handleCreateRule = useCallback((_name: string, _type: string, _sev: string, _cond: string, _desc: string) => {
    if (!selected) return
    const now = new Date().toISOString()
    patchIncident(selected.id, {
      activity: [...selected.activity, { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'rule-created', detail: `Detection rule "${_name}" created`, timestamp: now }],
    })
  }, [selected, patchIncident])

  const handleExport = useCallback(() => {
    if (selected) exportIncidents([selected], 'json')
  }, [selected])

  const handleSendSIEM = useCallback(() => {
    if (!selected) return
    const now = new Date().toISOString()
    patchIncident(selected.id, { sentToSIEM: true, activity: [...selected.activity, { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'sent-to-siem', detail: 'Forwarded to SIEM', timestamp: now }] })
  }, [selected, patchIncident])

  const handleSendMISP = useCallback(() => {
    if (!selected) return
    const now = new Date().toISOString()
    patchIncident(selected.id, { sentToMISP: true, activity: [...selected.activity, { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'sent-to-misp', detail: 'Shared to MISP TLP:AMBER', timestamp: now }] })
  }, [selected, patchIncident])

  const handleSendSlack = useCallback(() => {
    if (!selected) return
    const now = new Date().toISOString()
    patchIncident(selected.id, { slackNotified: true, activity: [...selected.activity, { id: `act_${Date.now()}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'slack-notified', detail: 'Alert sent to #soc-alerts', timestamp: now }] })
  }, [selected, patchIncident])

  /* ── Bulk actions ── */
  const handleBulkStatus = useCallback((status: IncidentStatus) => {
    const now = new Date().toISOString()
    setIncidents((prev) => prev.map((i) => !selectedIds.has(i.id) ? i : {
      ...i, status,
      activity: [...i.activity, { id: `act_${Date.now()}_${i.id}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'status-changed' as const, newValue: status, timestamp: now }],
    }))
    setSelected((prev) => prev && selectedIds.has(prev.id) ? { ...prev, status } : prev)
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleBulkAssign = useCallback((analystId: string) => {
    const analyst = ANALYSTS.find((a) => a.id === analystId)
    const now = new Date().toISOString()
    setIncidents((prev) => prev.map((i) => !selectedIds.has(i.id) ? i : {
      ...i, assignedTo: analyst?.id, assignedToName: analyst?.name, assignedAt: now, status: 'assigned' as IncidentStatus,
      activity: [...i.activity, { id: `act_${Date.now()}_${i.id}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'assigned' as const, newValue: analyst?.name, timestamp: now }],
    }))
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleBulkExport = useCallback(() => {
    exportIncidents(incidents.filter((i) => selectedIds.has(i.id)), 'csv')
    setSelectedIds(new Set())
  }, [incidents, selectedIds])

  const handleBulkSIEM = useCallback(() => {
    const now = new Date().toISOString()
    setIncidents((prev) => prev.map((i) => !selectedIds.has(i.id) ? i : {
      ...i, sentToSIEM: true,
      activity: [...i.activity, { id: `act_${Date.now()}_${i.id}`, actorId: 'j.chen', actorName: 'Jake Chen', action: 'sent-to-siem' as const, timestamp: now }],
    }))
    setSelectedIds(new Set())
  }, [selectedIds])

  /* ── Selection helpers ── */
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => { const s = new Set(prev); if (s.has(id)) s.delete(id); else s.add(id); return s })
  }, [])
  const selectAll = useCallback(() => setSelectedIds(new Set(filtered.map((i) => i.id))), [filtered])
  const clearAll  = useCallback(() => setSelectedIds(new Set()), [])

  /* ── Header stats ── */
  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(
      STATUS_PILL_CFG.map(({ key }) => [key, incidents.filter((i) => i.status === key).length])
    ) as Record<string, number>
    return { byStatus, critical: incidents.filter((i) => i.severity === 'critical').length }
  }, [incidents])

  return (
    <div className="flex flex-col min-h-0" style={{ height: 'calc(100vh - 5rem)' }}>

      {/* ── Header ── */}
      <div className="shrink-0 flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hf-warning/15 border border-hf-warning/30 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-hf-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-hf-text">Analyst Workflow</h1>
            <p className="text-xs text-hf-muted">SOC incident triage — {incidents.length} total incidents</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {stats.critical > 0 && (
            <button
              onClick={() => setFilters({ ...DEFAULT_INCIDENT_FILTERS, severities: ['critical'] })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-hf-danger/40 bg-hf-danger/10 text-hf-danger hover:bg-hf-danger/20 transition-colors"
            >
              ⚡ {stats.critical} Critical
            </button>
          )}
          {STATUS_PILL_CFG.map(({ key, label, color }) => {
            const count = stats.byStatus[key] ?? 0
            if (count === 0) return null
            return (
              <button
                key={key}
                onClick={() => setFilters({ ...DEFAULT_INCIDENT_FILTERS, statuses: [key as IncidentStatus] })}
                className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors hover:opacity-80', color)}
              >
                {count} {label}
              </button>
            )
          })}
          <button onClick={() => setFilters(DEFAULT_INCIDENT_FILTERS)} className="flex items-center gap-1 text-xs text-hf-dim hover:text-hf-muted transition-colors ml-1">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="shrink-0 mb-3">
        <IncidentFilterPanel
          filters={filters}
          onChange={setFilters}
          analysts={ANALYSTS}
          totalCount={incidents.length}
          filteredCount={filtered.length}
        />
      </div>

      {/* ── Split panel ── */}
      <div className="flex flex-1 min-h-0 gap-4 overflow-hidden">

        {/* Left: list */}
        <div className="w-[380px] shrink-0 glass-card border border-hf-border/50 rounded-2xl overflow-hidden flex flex-col min-h-0">
          <IncidentListPanel
            incidents={filtered}
            selectedId={selected?.id ?? null}
            selectedIds={selectedIds}
            onSelect={setSelected}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onClearAll={clearAll}
            sort={sort}
            onSort={handleSort}
          />
        </div>

        {/* Right: detail */}
        <div className="flex-1 min-w-0 glass-card border border-hf-border/50 rounded-2xl overflow-hidden flex flex-col min-h-0">
          {selected ? (
            <IncidentDetail
              incident={selected}
              onClose={() => setSelected(null)}
              actionPanel={
                <ActionPanel
                  incident={selected}
                  analysts={ANALYSTS}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                  onEscalate={() => setShowEscalate(true)}
                  onCreateRule={() => setShowCreateRule(true)}
                  onExport={handleExport}
                  onSendSIEM={handleSendSIEM}
                  onSendMISP={handleSendMISP}
                  onSendSlack={handleSendSlack}
                />
              }
              activityPanel={
                <CommentThread
                  comments={selected.comments}
                  activity={selected.activity}
                  onAddComment={handleAddComment}
                  incidentId={selected.id}
                />
              }
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-8">
              <div>
                <ClipboardList className="w-12 h-12 mx-auto text-hf-dim/40 mb-4" />
                <p className="text-sm font-semibold text-hf-muted">Select an incident to triage</p>
                <p className="text-xs text-hf-dim mt-1">Click any row in the list to open the investigation panel</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        analysts={ANALYSTS}
        onClearSelection={clearAll}
        onBulkStatus={handleBulkStatus}
        onBulkAssign={handleBulkAssign}
        onBulkExport={handleBulkExport}
        onBulkSIEM={handleBulkSIEM}
      />

      {/* Modals */}
      {showEscalate && selected && (
        <EscalateModal incident={selected} onConfirm={handleEscalate} onClose={() => setShowEscalate(false)} />
      )}
      {showCreateRule && selected && (
        <CreateRuleModal incident={selected} onConfirm={handleCreateRule} onClose={() => setShowCreateRule(false)} />
      )}
    </div>
  )
}

export default function ReviewQueuePage() {
  const { isDemoMode } = useDataMode()
  return <ReviewQueueContent key={String(isDemoMode)} isDemoMode={isDemoMode} />
}
