'use client'
import { useState, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, Zap, Clock, User } from 'lucide-react'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { RuleStatusBadge } from './RuleStatusBadge'
import { RuleTypeBadge } from './RuleTypeBadge'
import { RuleActionMenu } from './RuleActionMenu'
import type { DetectionRule } from '@/types/rule'

type SortField = 'name' | 'severity' | 'type' | 'status' | 'hitCount' | 'lastHitAt' | 'confidence' | 'updatedAt'
type SortDir   = 'asc' | 'desc'

const SEV_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function sortRules(rules: DetectionRule[], field: SortField, dir: SortDir): DetectionRule[] {
  return [...rules].sort((a, b) => {
    let diff = 0
    switch (field) {
      case 'name':      diff = a.name.localeCompare(b.name); break
      case 'severity':  diff = (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9); break
      case 'type':      diff = a.type.localeCompare(b.type); break
      case 'status':    diff = a.status.localeCompare(b.status); break
      case 'hitCount':  diff = a.hitCount - b.hitCount; break
      case 'confidence':diff = a.confidence - b.confidence; break
      case 'lastHitAt': diff = (a.lastHitAt ?? '').localeCompare(b.lastHitAt ?? ''); break
      case 'updatedAt': diff = a.updatedAt.localeCompare(b.updatedAt); break
    }
    return dir === 'asc' ? diff : -diff
  })
}

interface SortHeaderProps {
  label: string; field: SortField
  current: SortField; dir: SortDir
  onSort: (f: SortField) => void
  align?: 'left' | 'right'
}

function SortHeader({ label, field, current, dir, onSort, align = 'left' }: SortHeaderProps) {
  const active = current === field
  const Icon = active ? (dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <th
      onClick={() => onSort(field)}
      className={cn(
        'px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-hf-dim cursor-pointer select-none whitespace-nowrap',
        'hover:text-hf-muted transition-colors',
        align === 'right' && 'text-right'
      )}
    >
      <span className="inline-flex items-center gap-1">
        {align === 'right' && <Icon className={cn('w-3 h-3', active && 'text-hf-primary')} />}
        {label}
        {align !== 'right' && <Icon className={cn('w-3 h-3', active && 'text-hf-primary')} />}
      </span>
    </th>
  )
}

function ConfidenceDot({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-hf-success' : value >= 70 ? 'bg-hf-warning' : 'bg-hf-danger'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-hf-surface rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] text-hf-dim tabular-nums w-7">{value}%</span>
    </div>
  )
}

interface Props {
  rules: DetectionRule[]
  selectedId: string | null
  onSelect:    (rule: DetectionRule) => void
  onEdit:      (rule: DetectionRule) => void
  onToggle:    (rule: DetectionRule) => void
  onDuplicate: (rule: DetectionRule) => void
  onExport:    (rule: DetectionRule) => void
  onDelete:    (rule: DetectionRule) => void
}

export function RuleTable({ rules, selectedId, onSelect, onEdit, onToggle, onDuplicate, onExport, onDelete }: Props) {
  const [sortField, setSortField] = useState<SortField>('severity')
  const [sortDir,   setSortDir]   = useState<SortDir>('asc')

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) { setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); return field }
      setSortDir('asc'); return field
    })
  }, [])

  const sorted = sortRules(rules, sortField, sortDir)

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-hf-dim gap-2">
        <Zap className="w-8 h-8 opacity-30" />
        <p className="text-sm">No rules match the current filters</p>
      </div>
    )
  }

  const shProps = { current: sortField, dir: sortDir, onSort: handleSort }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px]">
        <thead>
          <tr className="border-b border-hf-border/40 bg-hf-surface/40">
            <SortHeader label="Rule Name"   field="name"       {...shProps} />
            <SortHeader label="Type"        field="type"       {...shProps} />
            <SortHeader label="Severity"    field="severity"   {...shProps} />
            <SortHeader label="Status"      field="status"     {...shProps} />
            <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-hf-dim text-left">Sources</th>
            <SortHeader label="Confidence"  field="confidence" {...shProps} />
            <SortHeader label="Hits"        field="hitCount"   {...shProps} align="right" />
            <SortHeader label="Last Hit"    field="lastHitAt"  {...shProps} align="right" />
            <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-hf-dim text-left">Owner</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-hf-border/20">
          {sorted.map((rule) => {
            const isSelected = rule.id === selectedId
            return (
              <tr
                key={rule.id}
                onClick={() => onSelect(rule)}
                className={cn(
                  'cursor-pointer transition-colors group',
                  isSelected
                    ? 'bg-hf-primary/8 border-l-2 border-hf-primary'
                    : 'hover:bg-hf-surface/60 border-l-2 border-transparent'
                )}
              >
                {/* Name + description */}
                <td className="px-3 py-3 min-w-[200px]">
                  <p className="text-xs font-semibold text-hf-text leading-tight">{rule.name}</p>
                  <p className="text-[10px] text-hf-dim mt-0.5 line-clamp-1">{rule.description}</p>
                  {rule.mitreTechniques.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.mitreTechniques.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] font-mono text-hf-warning bg-hf-warning/8 border border-hf-warning/20 px-1 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {rule.mitreTechniques.length > 3 && (
                        <span className="text-[9px] text-hf-dim">+{rule.mitreTechniques.length - 3}</span>
                      )}
                    </div>
                  )}
                </td>

                {/* Type */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <RuleTypeBadge type={rule.type} />
                </td>

                {/* Severity */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <SeverityBadge severity={rule.severity} />
                </td>

                {/* Status */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <RuleStatusBadge status={rule.status} />
                </td>

                {/* Detection sources */}
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {rule.detectionSources.map((src) => (
                      <span key={src} className="text-[9px] font-mono text-hf-muted border border-hf-border/40 px-1.5 py-0.5 rounded">
                        {src}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Confidence */}
                <td className="px-3 py-3 min-w-[120px]">
                  <ConfidenceDot value={rule.confidence} />
                </td>

                {/* Hits */}
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <span className="text-xs font-semibold text-hf-text tabular-nums flex items-center justify-end gap-1">
                    <Zap className="w-3 h-3 text-hf-accent" />
                    {formatNumber(rule.hitCount)}
                  </span>
                </td>

                {/* Last hit */}
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  {rule.lastHitAt ? (
                    <span className="flex items-center justify-end gap-1 text-[10px] text-hf-muted">
                      <Clock className="w-3 h-3" />
                      {formatDate(rule.lastHitAt, 'relative')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-hf-dim">—</span>
                  )}
                </td>

                {/* Owner */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-1.5 text-[10px] text-hf-muted">
                    <User className="w-3 h-3" />
                    {rule.owner.split('@')[0]}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <RuleActionMenu
                    rule={rule}
                    onView={onSelect}
                    onEdit={onEdit}
                    onToggle={onToggle}
                    onDuplicate={onDuplicate}
                    onExport={onExport}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
