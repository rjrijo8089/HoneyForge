'use client'
import { Globe, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { IncidentStatusBadge } from './IncidentStatusBadge'
import type { AnalystIncident } from '@/types/analyst-workflow'

type SortField = 'timestamp' | 'severity' | 'confidence' | 'eventCount'
type SortDir   = 'asc' | 'desc'

const SEV_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }

interface Props {
  incidents: AnalystIncident[]
  selectedId: string | null
  selectedIds: Set<string>
  onSelect: (inc: AnalystIncident) => void
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  sort: { field: SortField; dir: SortDir }
  onSort: (f: SortField) => void
}

function SortIcon({ field, sort }: { field: SortField; sort: { field: SortField; dir: SortDir } }) {
  if (sort.field !== field) return <ChevronsUpDown className="w-3 h-3 text-hf-dim opacity-0 group-hover:opacity-60" />
  return sort.dir === 'asc'
    ? <ChevronUp   className="w-3 h-3 text-hf-primary" />
    : <ChevronDown className="w-3 h-3 text-hf-primary" />
}

export function IncidentListPanel({
  incidents, selectedId, selectedIds,
  onSelect, onToggleSelect, onSelectAll, onClearAll,
  sort, onSort,
}: Props) {
  const allSelected = incidents.length > 0 && incidents.every((i) => selectedIds.has(i.id))
  const someSelected = incidents.some((i) => selectedIds.has(i.id))

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-hf-border/40 shrink-0">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
          onChange={allSelected ? onClearAll : onSelectAll}
          className="w-3.5 h-3.5 rounded border-hf-border text-hf-primary focus:ring-0"
        />
        <button
          onClick={() => onSort('severity')}
          className="group flex items-center gap-1 text-[10px] font-bold text-hf-dim uppercase tracking-wider hover:text-hf-muted"
        >
          SEV <SortIcon field="severity" sort={sort} />
        </button>
        <span className="flex-1 text-[10px] font-bold text-hf-dim uppercase tracking-wider">Incident</span>
        <button
          onClick={() => onSort('timestamp')}
          className="group flex items-center gap-1 text-[10px] font-bold text-hf-dim uppercase tracking-wider hover:text-hf-muted"
        >
          Time <SortIcon field="timestamp" sort={sort} />
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {incidents.length === 0 && (
          <div className="text-center py-12 text-hf-dim text-xs">No incidents match the current filters</div>
        )}
        {incidents.map((inc) => {
          const isSelected = selectedId === inc.id
          const isChecked  = selectedIds.has(inc.id)
          return (
            <div
              key={inc.id}
              onClick={() => onSelect(inc)}
              className={cn(
                'flex items-start gap-2.5 px-3 py-3 border-b border-hf-border/20 cursor-pointer transition-colors group',
                isSelected
                  ? 'bg-hf-primary/8 border-l-2 border-l-hf-primary'
                  : 'hover:bg-hf-surface/60 border-l-2 border-l-transparent'
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => { e.stopPropagation(); onToggleSelect(inc.id) }}
                onClick={(e) => e.stopPropagation()}
                className="w-3.5 h-3.5 rounded border-hf-border text-hf-primary focus:ring-0 mt-0.5 shrink-0"
              />

              <SeverityBadge severity={inc.severity} size="sm" />

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs font-semibold leading-tight truncate',
                  isSelected ? 'text-hf-text' : 'text-hf-muted group-hover:text-hf-text'
                )}>
                  {inc.title}
                </p>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-mono text-[10px] text-hf-dim">{inc.sourceIp}</span>
                  {inc.sourceCountryCode && inc.sourceCountryCode !== 'Internal' && (
                    <span className="flex items-center gap-0.5 text-[10px] text-hf-dim">
                      <Globe className="w-2.5 h-2.5" />{inc.sourceCountryCode}
                    </span>
                  )}
                  <span className="text-[10px] text-hf-dim">→ {inc.targetDecoyName}</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  <IncidentStatusBadge status={inc.status} size="sm" />
                  <span className="text-[10px] text-hf-dim font-mono bg-hf-surface/60 px-1.5 py-0.5 rounded border border-hf-border/30">
                    {inc.detectionSource}
                  </span>
                  {inc.eventCount > 1 && (
                    <span className="text-[10px] text-hf-warning font-semibold">{inc.eventCount.toLocaleString()} events</span>
                  )}
                </div>

                {inc.assignedToName && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-hf-primary/20 text-hf-primary text-[7px] font-black flex items-center justify-center">
                      {inc.assignedToName.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <span className="text-[10px] text-hf-dim">{inc.assignedToName}</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-hf-dim shrink-0 whitespace-nowrap mt-0.5">
                {formatDate(inc.timestamp, 'relative')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { type SortField, type SortDir }
export function sortIncidents(
  incidents: AnalystIncident[],
  field: SortField,
  dir: SortDir,
): AnalystIncident[] {
  return [...incidents].sort((a, b) => {
    let cmp = 0
    if (field === 'timestamp')   cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    if (field === 'severity')    cmp = (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9)
    if (field === 'confidence')  cmp = a.confidence - b.confidence
    if (field === 'eventCount')  cmp = a.eventCount - b.eventCount
    return dir === 'asc' ? cmp : -cmp
  })
}
