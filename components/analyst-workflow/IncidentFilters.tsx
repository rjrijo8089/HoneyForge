'use client'
import { useState } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IncidentStatusBadge, ALL_INCIDENT_STATUSES } from './IncidentStatusBadge'
import type { IncidentFiltersState, IncidentStatus, DetectionSource, AttackCategory } from '@/types/analyst-workflow'
import type { ThreatSeverity } from '@/types/threat'
import type { Analyst } from '@/types/analyst-workflow'

export const DEFAULT_INCIDENT_FILTERS: IncidentFiltersState = {
  search: '',
  statuses: [],
  severities: [],
  assignedTo: [],
  detectionSources: [],
  attackCategories: [],
  dateRange: 'all',
  unassignedOnly: false,
}

const SEV_META: Record<ThreatSeverity, { label: string; dot: string }> = {
  critical: { label: 'Critical', dot: 'bg-hf-danger'   },
  high:     { label: 'High',     dot: 'bg-orange-400'  },
  medium:   { label: 'Medium',   dot: 'bg-hf-warning'  },
  low:      { label: 'Low',      dot: 'bg-hf-success'  },
  info:     { label: 'Info',     dot: 'bg-hf-muted'    },
}

const DETECTION_SOURCES: DetectionSource[] = ['SNARE','TANNER','Cowrie','Dionaea','Suricata','Vector']
const ATTACK_CATS: { id: AttackCategory; label: string }[] = [
  { id: 'injection',        label: 'Injection'        },
  { id: 'auth',             label: 'Auth/Brute Force' },
  { id: 'recon',            label: 'Recon'            },
  { id: 'malware',          label: 'Malware'          },
  { id: 'c2',               label: 'C2'               },
  { id: 'lateral-movement', label: 'Lateral Movement' },
  { id: 'exfil',            label: 'Exfiltration'     },
  { id: 'web',              label: 'Web Exploit'      },
]
const DATE_RANGES: { id: IncidentFiltersState['dateRange']; label: string }[] = [
  { id: 'all',  label: 'All time' },
  { id: '1h',   label: 'Last 1h' },
  { id: '24h',  label: 'Last 24h' },
  { id: '7d',   label: 'Last 7d' },
  { id: '30d',  label: 'Last 30d' },
]

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

interface Props {
  filters: IncidentFiltersState
  onChange: (f: IncidentFiltersState) => void
  analysts: Analyst[]
  totalCount: number
  filteredCount: number
}

export function IncidentFilterPanel({ filters, onChange, analysts, totalCount, filteredCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  const activeCount = [
    filters.statuses.length > 0,
    filters.severities.length > 0,
    filters.assignedTo.length > 0,
    filters.detectionSources.length > 0,
    filters.attackCategories.length > 0,
    filters.dateRange !== 'all',
    filters.unassignedOnly,
  ].filter(Boolean).length

  const clearAll = () => onChange(DEFAULT_INCIDENT_FILTERS)

  return (
    <div className="glass-card border border-hf-border/50 rounded-xl">
      {/* Search bar + expand toggle */}
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search incidents, IPs, attack types, tags…"
            className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg pl-8 pr-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
          />
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors',
            activeCount > 0
              ? 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
              : 'bg-hf-surface border-hf-border text-hf-muted hover:text-hf-text'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-hf-primary text-white text-[9px] font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {activeCount > 0 && (
          <button onClick={clearAll} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}

        <span className="text-xs text-hf-dim whitespace-nowrap">
          {filteredCount === totalCount ? `${totalCount} events` : `${filteredCount} / ${totalCount}`}
        </span>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="border-t border-hf-border/30 p-4 space-y-4">
          {/* Date range */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Time Range</p>
            <div className="flex gap-1.5 flex-wrap">
              {DATE_RANGES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onChange({ ...filters, dateRange: id })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                    filters.dateRange === id
                      ? 'bg-hf-primary/20 border-hf-primary/50 text-hf-primary'
                      : 'bg-hf-surface border-hf-border text-hf-dim hover:text-hf-muted'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Status</p>
            <div className="flex gap-1.5 flex-wrap">
              {ALL_INCIDENT_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, s) as IncidentStatus[] })}
                  className={cn('transition-opacity', !filters.statuses.includes(s) && filters.statuses.length > 0 && 'opacity-40')}
                >
                  <IncidentStatusBadge status={s} size="sm" showDot />
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Severity</p>
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(SEV_META) as ThreatSeverity[]).map((sev) => {
                const m = SEV_META[sev]
                const active = filters.severities.includes(sev)
                return (
                  <button
                    key={sev}
                    onClick={() => onChange({ ...filters, severities: toggle(filters.severities, sev) as ThreatSeverity[] })}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                      active ? 'bg-hf-surface/80 border-hf-border-2 text-hf-text' : 'bg-hf-surface border-hf-border text-hf-dim opacity-60 hover:opacity-100'
                    )}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', m.dot)} />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detection source + Attack category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Detection Source</p>
              <div className="flex flex-col gap-1">
                {DETECTION_SOURCES.map((ds) => (
                  <label key={ds} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.detectionSources.includes(ds)}
                      onChange={() => onChange({ ...filters, detectionSources: toggle(filters.detectionSources, ds) as DetectionSource[] })}
                      className="rounded border-hf-border text-hf-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-hf-muted font-mono">{ds}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Attack Category</p>
              <div className="flex flex-col gap-1">
                {ATTACK_CATS.map(({ id, label }) => (
                  <label key={id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.attackCategories.includes(id)}
                      onChange={() => onChange({ ...filters, attackCategories: toggle(filters.attackCategories, id) as AttackCategory[] })}
                      className="rounded border-hf-border text-hf-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-hf-muted">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Analyst assignment */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest">Assigned To</p>
              <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.unassignedOnly}
                  onChange={(e) => onChange({ ...filters, unassignedOnly: e.target.checked })}
                  className="rounded border-hf-border text-hf-primary focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[10px] text-hf-dim">Unassigned only</span>
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {analysts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onChange({ ...filters, assignedTo: toggle(filters.assignedTo, a.id) })}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                    filters.assignedTo.includes(a.id)
                      ? 'bg-hf-primary/20 border-hf-primary/50 text-hf-primary'
                      : 'bg-hf-surface border-hf-border text-hf-dim hover:text-hf-muted'
                  )}
                >
                  <span className="w-4 h-4 rounded-full bg-hf-primary/20 text-hf-primary flex items-center justify-center text-[8px] font-black">
                    {a.initials}
                  </span>
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
