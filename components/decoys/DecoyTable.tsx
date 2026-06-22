'use client'
import { useState } from 'react'
import {
  Eye, Pause, Play, Trash2, ChevronUp, ChevronDown,
  Globe, Terminal, Bug, Radar, FolderOpen, Database as DbIcon, Monitor,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { RiskScore } from './RiskScore'
import type { Decoy, DecoyStatus, DecoyCategory } from '@/types'

interface DecoyTableProps {
  decoys: Decoy[]
  onView: (decoy: Decoy) => void
  onToggleStatus: (id: string, next: DecoyStatus) => void
  onDelete: (id: string) => void
}

type SortKey = 'name' | 'riskScore' | 'interactionsCount' | 'attacksToday' | 'lastInteractionAt'

const STATUS_META: Record<DecoyStatus, { dot: string; pulse: boolean; label: string; text: string; bg: string; border: string }> = {
  active:    { dot: 'bg-hf-success', pulse: true,  label: 'Active',     text: 'text-hf-success', bg: 'bg-hf-success/10',  border: 'border-hf-success/30'  },
  paused:    { dot: 'bg-hf-warning', pulse: false, label: 'Paused',     text: 'text-hf-warning', bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30'  },
  deploying: { dot: 'bg-hf-accent',  pulse: true,  label: 'Deploying',  text: 'text-hf-accent',  bg: 'bg-hf-accent/10',   border: 'border-hf-accent/30'   },
  error:     { dot: 'bg-hf-danger',  pulse: false, label: 'Error',      text: 'text-hf-danger',  bg: 'bg-hf-danger/10',   border: 'border-hf-danger/30'   },
}

const HEALTH_META: Record<Decoy['healthStatus'], { dot: string; label: string; text: string }> = {
  healthy:  { dot: 'bg-hf-success', label: 'Healthy',  text: 'text-hf-success' },
  degraded: { dot: 'bg-hf-warning', label: 'Degraded', text: 'text-hf-warning' },
  critical: { dot: 'bg-hf-danger',  label: 'Critical', text: 'text-hf-danger'  },
  unknown:  { dot: 'bg-hf-dim',     label: 'Unknown',  text: 'text-hf-dim'     },
}

type IconComponent = React.ComponentType<{className?: string; style?: React.CSSProperties}>

const CATEGORY_META: Record<DecoyCategory, { icon: IconComponent; label: string; color: string }> = {
  'web-clone':       { icon: Globe,     label: 'Web Clone',       color: 'text-hf-accent'   },
  'ssh':             { icon: Terminal,  label: 'SSH',             color: 'text-hf-success'  },
  'malware-capture': { icon: Bug,       label: 'Malware Capture', color: 'text-purple-400'  },
  'ids-sensor':      { icon: Radar,     label: 'IDS Sensor',      color: 'text-hf-primary'  },
  'file-share':      { icon: FolderOpen,label: 'File Share',      color: 'text-hf-warning'  },
  'database':        { icon: DbIcon,    label: 'Database',        color: 'text-hf-info'     },
  'remote-access':   { icon: Monitor,   label: 'Remote Access',   color: 'text-pink-400'    },
}

const ENV_STYLES: Record<string, string> = {
  prod:    'bg-hf-danger/10 text-hf-danger border-hf-danger/30',
  staging: 'bg-hf-warning/10 text-hf-warning border-hf-warning/30',
  dev:     'bg-hf-dim/20 text-hf-muted border-hf-border/50',
}

function Sparkbar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-5 w-12">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max(2, (v / max) * 100)}%`,
            background: i === data.length - 1 ? '#3b82f6' : '#1a2438',
          }}
        />
      ))}
    </div>
  )
}

export function DecoyTable({ decoys, onView, onToggleStatus, onDelete }: DecoyTableProps) {
  const [sortKey, setSortKey]   = useState<SortKey>('riskScore')
  const [sortAsc, setSortAsc]   = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const sorted = [...decoys].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortKey === 'riskScore')         cmp = a.riskScore - b.riskScore
    else if (sortKey === 'interactionsCount') cmp = a.interactionsCount - b.interactionsCount
    else if (sortKey === 'attacksToday')      cmp = a.attacksToday - b.attacksToday
    else if (sortKey === 'lastInteractionAt')
      cmp = (a.lastInteractionAt ?? '').localeCompare(b.lastInteractionAt ?? '')
    return sortAsc ? cmp : -cmp
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="w-3 h-3 text-hf-dim/40">⇅</span>
    return sortAsc
      ? <ChevronUp className="w-3 h-3 text-hf-primary" />
      : <ChevronDown className="w-3 h-3 text-hf-primary" />
  }

  return (
    <div className="glass-card rounded-2xl border border-hf-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hf-border/40">
        <p className="text-sm font-semibold text-hf-text">{decoys.length} decoy{decoys.length !== 1 ? 's' : ''}</p>
        <p className="text-xs text-hf-dim">Click a row to view details</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[1000px]">
          <thead>
            <tr className="border-b border-hf-border/30">
              {([
                { key: 'name' as SortKey,              label: 'Name',          sortable: true  },
                { key: null,                           label: 'Status',        sortable: false },
                { key: null,                           label: 'Category',      sortable: false },
                { key: null,                           label: 'IP : Port',     sortable: false },
                { key: 'riskScore' as SortKey,         label: 'Risk',          sortable: true  },
                { key: 'attacksToday' as SortKey,      label: 'Today',         sortable: true  },
                { key: 'interactionsCount' as SortKey, label: 'Lifetime',      sortable: true  },
                { key: 'lastInteractionAt' as SortKey, label: 'Last Attack',   sortable: true  },
                { key: null,                           label: 'Health',        sortable: false },
                { key: null,                           label: '7d Activity',   sortable: false },
                { key: null,                           label: 'Env',           sortable: false },
                { key: null,                           label: '',              sortable: false },
              ] as const).map((col) => (
                <th
                  key={col.label}
                  className={cn(
                    'px-4 py-2.5 text-left font-medium text-hf-dim uppercase tracking-wider whitespace-nowrap select-none',
                    col.sortable && 'cursor-pointer hover:text-hf-muted'
                  )}
                  onClick={() => col.sortable && col.key && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && col.key && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((decoy) => {
              const sm   = STATUS_META[decoy.status]
              const hm   = HEALTH_META[decoy.healthStatus]
              const cm   = CATEGORY_META[decoy.category]
              const CatIcon = cm.icon
              const nextStatus: DecoyStatus = decoy.status === 'active' ? 'paused' : 'active'

              return (
                <tr
                  key={decoy.id}
                  className="border-b border-hf-border/20 hover:bg-hf-surface-2/40 transition-colors group cursor-pointer"
                  onClick={() => onView(decoy)}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 font-semibold text-hf-text group-hover:text-hf-primary transition-colors">
                        {decoy.name}
                        {decoy.source === 'demo' && <DemoBadge />}
                      </span>
                      {decoy.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-block text-[9px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1 rounded mr-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold', sm.bg, sm.border, sm.text)}>
                      <span className="relative w-1.5 h-1.5">
                        <span className={cn('absolute inset-0 rounded-full', sm.dot)} />
                        {sm.pulse && <span className={cn('absolute inset-0 rounded-full animate-ping opacity-60', sm.dot)} />}
                      </span>
                      {sm.label}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <CatIcon className={cn('w-3.5 h-3.5', cm.color)} />
                      <span className={cn('font-medium', cm.color)}>{cm.label}</span>
                    </div>
                  </td>

                  {/* IP:Port */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-hf-muted">{decoy.ipAddress}</span>
                    {decoy.port > 0 && (
                      <span className="text-hf-dim">:{decoy.port}</span>
                    )}
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <RiskScore score={decoy.riskScore} showBar />
                  </td>

                  {/* Attacks today */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={cn('font-mono font-bold tabular-nums', decoy.attacksToday > 0 ? 'text-hf-primary' : 'text-hf-dim')}>
                      {decoy.attacksToday}
                    </span>
                  </td>

                  {/* Lifetime */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="font-mono text-hf-muted tabular-nums">
                      {decoy.interactionsCount.toLocaleString()}
                    </span>
                  </td>

                  {/* Last attack */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {decoy.lastInteractionAt ? (
                      <div className="flex items-center gap-1.5">
                        {decoy.lastAttackSeverity && <SeverityBadge severity={decoy.lastAttackSeverity} />}
                        <span className="text-hf-dim">{formatDate(decoy.lastInteractionAt, 'relative')}</span>
                      </div>
                    ) : (
                      <span className="text-hf-dim">—</span>
                    )}
                  </td>

                  {/* Health */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-2 h-2 rounded-full', hm.dot)} />
                      <span className={cn('text-[10px] font-medium', hm.text)}>{hm.label}</span>
                    </div>
                  </td>

                  {/* 7d sparkline */}
                  <td className="px-4 py-3">
                    <Sparkbar data={decoy.activityLast7Days} />
                  </td>

                  {/* Env */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border', ENV_STYLES[decoy.environment] ?? 'text-hf-dim')}>
                      {decoy.environment}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    {confirmId === decoy.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-hf-danger text-[10px]">Delete?</span>
                        <button
                          onClick={() => { onDelete(decoy.id); setConfirmId(null) }}
                          className="text-[10px] font-bold text-hf-danger hover:underline"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-[10px] text-hf-muted hover:underline"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(decoy)}
                          title="View details"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-hf-primary/15 hover:text-hf-primary text-hf-dim transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {(decoy.status === 'active' || decoy.status === 'paused') && (
                          <button
                            onClick={() => onToggleStatus(decoy.id, nextStatus)}
                            title={decoy.status === 'active' ? 'Pause' : 'Resume'}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-hf-warning/15 hover:text-hf-warning text-hf-dim transition-colors"
                          >
                            {decoy.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmId(decoy.id)}
                          title="Delete"
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-hf-danger/15 hover:text-hf-danger text-hf-dim transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {decoys.length === 0 && (
        <div className="flex flex-col items-center py-16 text-hf-dim">
          <p className="text-sm font-medium">No decoys match your filters</p>
          <p className="text-xs mt-1">Try adjusting search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
