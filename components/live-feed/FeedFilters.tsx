'use client'
import { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DETECTION_SOURCE_META, ATTACK_CATEGORY_META,
  DEFAULT_LIVE_FILTERS,
} from '@/types/live-feed'
import type {
  LiveFeedFilters, ThreatSeverity, DetectionSourceType, LiveAttackCategory,
} from '@/types/live-feed'
import type { LiveFeedEvent } from '@/types/live-feed'

const SEVERITIES: { id: ThreatSeverity; dot: string; label: string }[] = [
  { id: 'critical', dot: 'bg-severity-critical', label: 'Critical' },
  { id: 'high',     dot: 'bg-severity-high',     label: 'High'     },
  { id: 'medium',   dot: 'bg-severity-medium',   label: 'Medium'   },
  { id: 'low',      dot: 'bg-severity-low',       label: 'Low'      },
]

const DETECTION_SOURCES: DetectionSourceType[] = ['SNARE','TANNER','Cowrie','Dionaea','Suricata']
const ATTACK_CATS: LiveAttackCategory[]         = ['web','ssh','malware','recon','c2','auth','db','ftp']

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

interface Props {
  filters: LiveFeedFilters
  onChange: (f: LiveFeedFilters) => void
  events: LiveFeedEvent[]
  filteredCount: number
}

export function FeedFilters({ filters, onChange, events, filteredCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  /* Unique countries and decoys from all events */
  const countries = Array.from(new Set(events.map((e) => e.sourceCountryCode).filter(Boolean))).sort() as string[]
  const decoys    = Array.from(new Map(events.map((e) => [e.targetDecoyId, e.targetDecoyName])).entries())

  const activeCount = [
    filters.severities.length > 0,
    filters.attackCategories.length > 0,
    filters.detectionSources.length > 0,
    filters.countryCode !== '',
    filters.decoyId !== '',
  ].filter(Boolean).length

  return (
    <div className="glass-card border border-hf-border/50 rounded-xl">
      {/* Main row */}
      <div className="flex items-center gap-2 p-2.5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search IPs, attacks, decoys…"
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
                onClick={() => onChange({ ...filters, severities: toggle(filters.severities, id) as ThreatSeverity[] })}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all',
                  active
                    ? 'bg-hf-surface border-hf-border-2 text-hf-text'
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

        {/* Source filter */}
        {DETECTION_SOURCES.map((src) => {
          const m = DETECTION_SOURCE_META[src]
          const active = filters.detectionSources.includes(src)
          return (
            <button
              key={src}
              onClick={() => onChange({ ...filters, detectionSources: toggle(filters.detectionSources, src) as DetectionSourceType[] })}
              className={cn(
                'px-2 py-1 rounded text-[10px] font-mono font-bold border transition-all',
                active ? `${m.color} ${m.bg} ${m.border}` : 'text-hf-dim border-transparent hover:border-hf-border opacity-60 hover:opacity-100'
              )}
            >
              {src}
            </button>
          )
        })}

        <div className="w-px h-5 bg-hf-border/40" />

        {/* Expand toggle */}
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
          {activeCount > 0 && <span className="w-3.5 h-3.5 rounded-full bg-hf-primary text-white text-[8px] flex items-center justify-center">{activeCount}</span>}
          <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
        </button>

        {/* Clear */}
        {activeCount > 0 && (
          <button onClick={() => onChange(DEFAULT_LIVE_FILTERS)} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Count */}
        <span className="text-[10px] text-hf-dim whitespace-nowrap ml-auto font-mono">
          {filteredCount} events
        </span>
      </div>

      {/* Expanded row */}
      {expanded && (
        <div className="border-t border-hf-border/30 p-3 flex items-start gap-6">
          {/* Attack category */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Category</p>
            <div className="flex flex-wrap gap-1">
              {ATTACK_CATS.map((cat) => {
                const m = ATTACK_CATEGORY_META[cat]
                const active = filters.attackCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => onChange({ ...filters, attackCategories: toggle(filters.attackCategories, cat) as LiveAttackCategory[] })}
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-semibold border transition-all capitalize',
                      active ? `${m.color} border-current/30 bg-current/10` : 'text-hf-dim border-hf-border/30 hover:text-hf-muted'
                    )}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Country */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Country</p>
            <select
              value={filters.countryCode}
              onChange={(e) => onChange({ ...filters, countryCode: e.target.value })}
              className="bg-hf-bg border border-hf-border/50 rounded-lg px-2 py-1 text-xs text-hf-muted focus:outline-none focus:border-hf-primary/60"
            >
              <option value="">All countries</option>
              {countries.map((cc) => (
                <option key={cc} value={cc}>{cc}</option>
              ))}
            </select>
          </div>

          {/* Decoy */}
          <div>
            <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Target Decoy</p>
            <select
              value={filters.decoyId}
              onChange={(e) => onChange({ ...filters, decoyId: e.target.value })}
              className="bg-hf-bg border border-hf-border/50 rounded-lg px-2 py-1 text-xs text-hf-muted focus:outline-none focus:border-hf-primary/60"
            >
              <option value="">All decoys</option>
              {decoys.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
