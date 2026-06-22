'use client'
import { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RuleTypeBadge, ALL_RULE_TYPES } from './RuleTypeBadge'
import { RuleStatusBadge, ALL_RULE_STATUSES } from './RuleStatusBadge'
import type { RuleFilters, RuleSeverity, RuleDetectionSource } from '@/types/rule'

export const DEFAULT_RULE_FILTERS: RuleFilters = {
  search: '',
  types: [],
  statuses: [],
  severities: [],
  detectionSources: [],
  mitreTactic: '',
}

const SEVERITIES: { id: RuleSeverity; dot: string; label: string }[] = [
  { id: 'critical', dot: 'bg-severity-critical', label: 'Critical' },
  { id: 'high',     dot: 'bg-severity-high',     label: 'High'     },
  { id: 'medium',   dot: 'bg-severity-medium',   label: 'Medium'   },
  { id: 'low',      dot: 'bg-severity-low',       label: 'Low'      },
]

const SOURCES: RuleDetectionSource[] = ['SNARE', 'TANNER', 'Cowrie', 'Dionaea', 'Suricata']

const SOURCE_META: Record<RuleDetectionSource, string> = {
  SNARE:    'text-hf-primary',
  TANNER:   'text-hf-accent',
  Cowrie:   'text-orange-400',
  Dionaea:  'text-purple-400',
  Suricata: 'text-hf-warning',
}

const MITRE_TACTICS = [
  'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation',
  'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement',
  'Collection', 'Command and Control', 'Exfiltration', 'Impact', 'Reconnaissance',
]

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

interface Props {
  filters: RuleFilters
  onChange: (f: RuleFilters) => void
  totalCount: number
  filteredCount: number
}

export function RuleFilterPanel({ filters, onChange, totalCount, filteredCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  const activeCount = [
    filters.types.length > 0,
    filters.statuses.length > 0,
    filters.severities.length > 0,
    filters.detectionSources.length > 0,
    !!filters.mitreTactic,
  ].filter(Boolean).length

  const isFiltered = activeCount > 0 || !!filters.search

  return (
    <div className="glass-card border border-hf-border/50 rounded-xl">
      {/* Main row */}
      <div className="flex items-center gap-2 p-2.5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search rules, techniques, tags…"
            className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
          />
        </div>

        {/* Quick severity chips */}
        <div className="flex items-center gap-1">
          {SEVERITIES.map(({ id, dot, label }) => {
            const active = filters.severities.includes(id)
            return (
              <button
                key={id}
                onClick={() => onChange({ ...filters, severities: toggle(filters.severities, id) as RuleSeverity[] })}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all',
                  active
                    ? 'bg-hf-surface-2 border-hf-border-2 text-hf-text'
                    : 'bg-transparent border-transparent text-hf-dim hover:text-hf-muted opacity-60 hover:opacity-100'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
                {label}
              </button>
            )
          })}
        </div>

        <div className="w-px h-5 bg-hf-border/40" />

        {/* Status quick chips */}
        {ALL_RULE_STATUSES.map((s) => {
          const active = filters.statuses.includes(s)
          return (
            <button
              key={s}
              onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, s) })}
              className={cn('transition-all', !active && 'opacity-50 hover:opacity-80')}
            >
              <RuleStatusBadge status={s} />
            </button>
          )
        })}

        <div className="w-px h-5 bg-hf-border/40" />

        {/* Expand */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors',
            activeCount > 0
              ? 'border-hf-primary/40 bg-hf-primary/10 text-hf-primary'
              : 'border-hf-border text-hf-dim hover:text-hf-muted'
          )}
        >
          <Filter className="w-3 h-3" />
          More
          {activeCount > 0 && (
            <span className="w-3.5 h-3.5 rounded-full bg-hf-primary text-white text-[8px] flex items-center justify-center">{activeCount}</span>
          )}
          <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
        </button>

        {/* Clear */}
        {isFiltered && (
          <button onClick={() => onChange(DEFAULT_RULE_FILTERS)} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Count */}
        <span className="ml-auto text-[10px] text-hf-dim font-mono whitespace-nowrap">
          {filteredCount !== totalCount ? `${filteredCount} / ${totalCount}` : `${totalCount}`} rules
        </span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-hf-border/30 p-3 flex flex-wrap gap-6">
          {/* Rule Type */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Rule Type</p>
            <div className="flex flex-wrap gap-1">
              {ALL_RULE_TYPES.map((t) => {
                const active = filters.types.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => onChange({ ...filters, types: toggle(filters.types, t) })}
                    className={cn('transition-all', !active && 'opacity-40 hover:opacity-70')}
                  >
                    <RuleTypeBadge type={t} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detection Source */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Detection Source</p>
            <div className="flex flex-wrap gap-1">
              {SOURCES.map((src) => {
                const active = filters.detectionSources.includes(src)
                return (
                  <button
                    key={src}
                    onClick={() => onChange({ ...filters, detectionSources: toggle(filters.detectionSources, src) as RuleDetectionSource[] })}
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all',
                      active
                        ? `${SOURCE_META[src]} border-current/30 bg-current/10`
                        : 'text-hf-dim border-hf-border/30 hover:text-hf-muted opacity-60 hover:opacity-100'
                    )}
                  >
                    {src}
                  </button>
                )
              })}
            </div>
          </div>

          {/* MITRE Tactic */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">MITRE Tactic</p>
            <select
              value={filters.mitreTactic}
              onChange={(e) => onChange({ ...filters, mitreTactic: e.target.value })}
              className="bg-hf-bg border border-hf-border/50 rounded-lg px-2 py-1 text-xs text-hf-muted focus:outline-none focus:border-hf-primary/60"
            >
              <option value="">All tactics</option>
              {MITRE_TACTICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
