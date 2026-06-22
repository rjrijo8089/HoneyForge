'use client'
import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { IOCTypeBadge } from './IOCTypeIcon'
import { IOCStatusBadge, ALL_IOC_STATUSES } from './IOCStatusBadge'
import type { IOCFilters, IOCType, TLPLevel } from '@/types/threat-intel'
import type { ThreatSeverity } from '@/types'
import { MOCK_CAMPAIGNS } from '@/services/mock/data/threatIntel'

const ALL_TYPES: IOCType[]     = ['ip','domain','url','file-hash','user-agent','payload','cve','email']
const ALL_SEVERITIES: ThreatSeverity[] = ['critical','high','medium','low','info']
const ALL_TLP: TLPLevel[]      = ['red','amber','green','white']
const TLP_COLORS: Record<TLPLevel, string> = { red: 'text-hf-danger', amber: 'text-hf-warning', green: 'text-hf-success', white: 'text-hf-muted' }

export const DEFAULT_FILTERS: IOCFilters = {
  search: '',
  types: [],
  statuses: [],
  severities: [],
  campaigns: [],
  tlp: [],
  confidenceMin: 0,
  confidenceMax: 100,
  dateRange: null,
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

function ActiveCount(filters: IOCFilters): number {
  let n = 0
  if (filters.types.length > 0)      n++
  if (filters.statuses.length > 0)   n++
  if (filters.severities.length > 0) n++
  if (filters.campaigns.length > 0)  n++
  if (filters.tlp.length > 0)        n++
  if (filters.confidenceMin > 0 || filters.confidenceMax < 100) n++
  if (filters.dateRange)             n++
  return n
}

interface IOCFiltersProps {
  filters: IOCFilters
  onChange: (f: IOCFilters) => void
  totalCount: number
  filteredCount: number
}

export function IOCFilterPanel({ filters, onChange, totalCount, filteredCount }: IOCFiltersProps) {
  const [open, setOpen] = useState(false)
  const activeCount = ActiveCount(filters)

  const update = (patch: Partial<IOCFilters>) => onChange({ ...filters, ...patch })
  const reset  = () => onChange(DEFAULT_FILTERS)

  return (
    <div>
      {/* Search + toggle row */}
      <div className="flex gap-2">
        <Input
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search IOC value, tag, campaign, description…"
          className="flex-1"
          rightIcon={
            filters.search ? (
              <button onClick={() => update({ search: '' })} className="text-hf-dim hover:text-hf-muted">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : undefined
          }
        />
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
            open || activeCount > 0
              ? 'bg-hf-primary/10 border-hf-primary/40 text-hf-primary'
              : 'bg-hf-surface-2 border-hf-border text-hf-muted hover:text-hf-text hover:border-hf-border-2'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-hf-primary text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {activeCount > 0 && (
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hf-border/40 text-sm text-hf-dim hover:text-hf-muted transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Results summary */}
      {(activeCount > 0 || filters.search) && (
        <p className="text-xs text-hf-muted mt-2">
          Showing <strong className="text-hf-text">{filteredCount}</strong> of <strong className="text-hf-text">{totalCount}</strong> indicators
        </p>
      )}

      {/* Filter panel */}
      {open && (
        <div className="mt-3 glass-card border border-hf-border/50 rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 animate-fade-in">

          {/* IOC Types */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Type</p>
            <div className="flex flex-wrap gap-1">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => update({ types: toggle(filters.types, t) })}
                  className={cn(
                    'transition-opacity',
                    filters.types.includes(t) ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  )}
                >
                  <IOCTypeBadge type={t} />
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Status</p>
            <div className="flex flex-wrap gap-1">
              {ALL_IOC_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ statuses: toggle(filters.statuses, s) })}
                  className={cn('transition-opacity', filters.statuses.includes(s) ? 'opacity-100' : 'opacity-40 hover:opacity-70')}
                >
                  <IOCStatusBadge status={s} />
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Severity</p>
            <div className="flex flex-wrap gap-1">
              {ALL_SEVERITIES.map((sv) => {
                const colors: Record<ThreatSeverity, string> = {
                  critical: 'text-severity-critical border-severity-critical/40 bg-severity-critical/10',
                  high:     'text-severity-high border-severity-high/40 bg-severity-high/10',
                  medium:   'text-severity-medium border-severity-medium/40 bg-severity-medium/10',
                  low:      'text-severity-low border-severity-low/40 bg-severity-low/10',
                  info:     'text-severity-info border-severity-info/40 bg-severity-info/10',
                }
                return (
                  <button
                    key={sv}
                    onClick={() => update({ severities: toggle(filters.severities, sv) })}
                    className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded border transition-opacity',
                      colors[sv],
                      filters.severities.includes(sv) ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    )}
                  >
                    {sv.charAt(0).toUpperCase() + sv.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* TLP */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">TLP Level</p>
            <div className="flex flex-wrap gap-1">
              {ALL_TLP.map((tlp) => (
                <button
                  key={tlp}
                  onClick={() => update({ tlp: toggle(filters.tlp, tlp) })}
                  className={cn(
                    'text-[9px] font-bold px-2 py-0.5 rounded border border-hf-border/40 bg-hf-surface-3 transition-opacity uppercase tracking-wider',
                    TLP_COLORS[tlp],
                    filters.tlp.includes(tlp) ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  )}
                >
                  TLP:{tlp.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence range */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Confidence</p>
            <div className="flex items-center gap-2">
              <input
                type="range" min={0} max={100} step={5}
                value={filters.confidenceMin}
                onChange={(e) => update({ confidenceMin: Number(e.target.value) })}
                className="flex-1 h-1 accent-hf-primary"
              />
              <span className="text-xs text-hf-muted tabular-nums w-8">{filters.confidenceMin}%</span>
              <span className="text-hf-dim">–</span>
              <input
                type="range" min={0} max={100} step={5}
                value={filters.confidenceMax}
                onChange={(e) => update({ confidenceMax: Number(e.target.value) })}
                className="flex-1 h-1 accent-hf-primary"
              />
              <span className="text-xs text-hf-muted tabular-nums w-8">{filters.confidenceMax}%</span>
            </div>
          </div>

          {/* Campaigns */}
          <div className="lg:col-span-3">
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Campaign</p>
            <div className="flex flex-wrap gap-1">
              {MOCK_CAMPAIGNS.map((c) => {
                const active = filters.campaigns.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => update({ campaigns: toggle(filters.campaigns, c.id) })}
                    className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded border transition-all',
                      active
                        ? 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
                        : 'bg-hf-surface-3 border-hf-border/40 text-hf-dim hover:text-hf-muted'
                    )}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
