'use client'
import { useState } from 'react'
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuditFilters, AuditOutcome, AuditRiskLevel, AuditAction } from '@/types/audit'
import { AUDIT_ACTION_LABELS, AUDIT_RESOURCE_TYPES } from '@/types/audit'

const OUTCOMES: { value: AuditOutcome; label: string; cls: string }[] = [
  { value: 'success', label: 'Success', cls: 'text-hf-success border-hf-success/30 bg-hf-success/10' },
  { value: 'warning', label: 'Warning', cls: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10' },
  { value: 'failed',  label: 'Failed',  cls: 'text-hf-danger  border-hf-danger/30  bg-hf-danger/10'  },
]

const RISK_LEVELS: { value: AuditRiskLevel; label: string; cls: string }[] = [
  { value: 'low',      label: 'Low',      cls: 'text-hf-dim    border-hf-border' },
  { value: 'medium',   label: 'Medium',   cls: 'text-hf-accent border-hf-accent/30 bg-hf-accent/10' },
  { value: 'high',     label: 'High',     cls: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10' },
  { value: 'critical', label: 'Critical', cls: 'text-hf-danger border-hf-danger/30 bg-hf-danger/10' },
]

const fieldCls = 'w-full bg-hf-bg/60 border border-hf-border/60 rounded-lg px-3 py-1.5 text-xs text-hf-text placeholder-hf-dim/60 focus:outline-none focus:border-hf-primary/60 transition-colors'

interface Props {
  filters:        AuditFilters
  onChange:       (f: AuditFilters) => void
  actorOptions:   string[]
  resultCount:    number
  totalCount:     number
}

export function AuditFiltersBar({ filters, onChange, actorOptions, resultCount, totalCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  const set = <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const toggleChip = <T extends string>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]

  const hasFilters =
    filters.search || filters.actors.length || filters.actions.length ||
    filters.outcomes.length || filters.resourceTypes.length || filters.riskLevels.length ||
    filters.dateFrom || filters.dateTo

  const clearAll = () => onChange({
    search: '', actors: [], actions: [], outcomes: [],
    resourceTypes: [], riskLevels: [], dateFrom: '', dateTo: '',
  })

  const actionEntries = Object.entries(AUDIT_ACTION_LABELS) as [AuditAction, string][]

  return (
    <div className="space-y-2">
      {/* ── Row 1: search + quick chips + expand ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-44 max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search actor, action, resource, IP…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-hf-surface-2 border border-hf-border/50 rounded-xl text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/50"
          />
          {filters.search && (
            <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-hf-dim hover:text-hf-muted">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Outcome chips */}
        <div className="flex gap-1">
          {OUTCOMES.map((o) => (
            <button
              key={o.value}
              onClick={() => set('outcomes', toggleChip(filters.outcomes, o.value))}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all',
                filters.outcomes.includes(o.value) ? o.cls : 'text-hf-dim border-hf-border/50 hover:text-hf-muted hover:bg-hf-surface-3'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Risk chips */}
        <div className="flex gap-1">
          {RISK_LEVELS.map((r) => (
            <button
              key={r.value}
              onClick={() => set('riskLevels', toggleChip(filters.riskLevels, r.value))}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all',
                filters.riskLevels.includes(r.value) ? r.cls : 'text-hf-dim border-hf-border/50 hover:text-hf-muted hover:bg-hf-surface-3'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all',
            expanded ? 'bg-hf-primary/10 border-hf-primary/30 text-hf-primary' : 'border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
          )}
        >
          <SlidersHorizontal className="w-3 h-3" />
          More
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Result count + clear */}
        <div className="ml-auto flex items-center gap-2">
          {resultCount !== totalCount && (
            <span className="text-xs text-hf-dim">{resultCount} of {totalCount}</span>
          )}
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-hf-danger hover:text-hf-danger/80 transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Row 2: expanded filters ── */}
      {expanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-hf-surface-2/50 border border-hf-border/30 rounded-xl">
          {/* Actor */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-hf-dim mb-1 block">Actor</label>
            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {actorOptions.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={filters.actors.includes(a)}
                    onChange={() => set('actors', toggleChip(filters.actors, a))}
                    className="w-3 h-3 accent-hf-primary rounded"
                  />
                  <span className="text-[10px] text-hf-muted truncate">{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Resource type */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-hf-dim mb-1 block">Resource Type</label>
            <div className="flex flex-wrap gap-1">
              {AUDIT_RESOURCE_TYPES.map((rt) => (
                <button
                  key={rt}
                  onClick={() => set('resourceTypes', toggleChip(filters.resourceTypes, rt))}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium border capitalize transition-all',
                    filters.resourceTypes.includes(rt)
                      ? 'bg-hf-primary/10 border-hf-primary/30 text-hf-primary'
                      : 'border-hf-border/50 text-hf-dim hover:text-hf-muted'
                  )}
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-hf-dim mb-1 block">Action</label>
            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {actionEntries.map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={filters.actions.includes(key)}
                    onChange={() => set('actions', toggleChip(filters.actions, key))}
                    className="w-3 h-3 accent-hf-primary rounded"
                  />
                  <span className="text-[10px] text-hf-muted">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-hf-dim mb-1 block">Date Range</label>
            <div className="space-y-1.5">
              <div>
                <span className="text-[9px] text-hf-dim block mb-0.5">From</span>
                <input type="date" value={filters.dateFrom} onChange={(e) => set('dateFrom', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <span className="text-[9px] text-hf-dim block mb-0.5">To</span>
                <input type="date" value={filters.dateTo}   onChange={(e) => set('dateTo',   e.target.value)} className={fieldCls} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
