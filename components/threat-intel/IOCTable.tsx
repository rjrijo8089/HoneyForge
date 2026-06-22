'use client'
import { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Copy, CheckCheck, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IOCTypeIcon } from './IOCTypeIcon'
import { IOCStatusBadge, StatusDropdown } from './IOCStatusBadge'
import { ConfidenceBar, SeverityPill } from './ConfidenceScore'
import type { IOC, IOCStatus, IOCSortField } from '@/types/threat-intel'

interface IOCTableProps {
  iocs: IOC[]
  onSelect: (ioc: IOC) => void
  onStatusChange: (id: string, status: IOCStatus) => void
  selectedId?: string
}

function TruncatedValue({ value, type }: { value: string; type: string }) {
  const [copied, setCopied] = useState(false)
  const display = value.length > 52 ? value.slice(0, 48) + '…' : value

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex items-center gap-1.5 group/val min-w-0">
      <span className={cn('font-mono text-xs truncate', type === 'ip' ? 'text-hf-primary' : 'text-hf-text')}>
        {display}
      </span>
      <button
        onClick={handleCopy}
        className="text-hf-dim hover:text-hf-muted opacity-0 group-hover/val:opacity-100 transition-all shrink-0"
        title="Copy"
      >
        {copied ? <CheckCheck className="w-3 h-3 text-hf-success" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  )
}

interface SortHeaderProps {
  field: IOCSortField
  current: IOCSortField
  dir: 'asc' | 'desc'
  onSort: (f: IOCSortField) => void
  label: string
  className?: string
}
function SortHeader({ field, current, dir, onSort, label, className }: SortHeaderProps) {
  const active = field === current
  return (
    <button
      onClick={() => onSort(field)}
      className={cn('flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-hf-dim hover:text-hf-muted transition-colors group', className)}
    >
      {label}
      {active
        ? (dir === 'asc' ? <ArrowUp className="w-3 h-3 text-hf-primary" /> : <ArrowDown className="w-3 h-3 text-hf-primary" />)
        : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-60" />
      }
    </button>
  )
}

function StatusCell({ ioc, onStatusChange }: { ioc: IOC; onStatusChange: (id: string, s: IOCStatus) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
      >
        <IOCStatusBadge status={ioc.status} />
        <ChevronDown className="w-2.5 h-2.5 text-hf-dim" />
      </button>
      {open && (
        <StatusDropdown
          current={ioc.status}
          onChange={(s) => { onStatusChange(ioc.id, s); setOpen(false) }}
        />
      )}
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function IOCTable({ iocs, onSelect, onStatusChange, selectedId }: IOCTableProps) {
  const [sortField, setSortField] = useState<IOCSortField>('lastSeen')
  const [sortDir,   setSortDir]   = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 15

  const handleSort = (field: IOCSortField) => {
    if (field === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('desc') }
    setPage(0)
  }

  const sorted = [...iocs].sort((a, b) => {
    let av: string | number, bv: string | number
    switch (sortField) {
      case 'value':      av = a.value;     bv = b.value;     break
      case 'type':       av = a.type;      bv = b.type;      break
      case 'severity':   av = ['critical','high','medium','low','info'].indexOf(a.severity); bv = ['critical','high','medium','low','info'].indexOf(b.severity); break
      case 'confidence': av = a.confidence; bv = b.confidence; break
      case 'hitCount':   av = a.hitCount;  bv = b.hitCount;  break
      case 'firstSeen':  av = a.firstSeen; bv = b.firstSeen; break
      case 'status':     av = a.status;    bv = b.status;    break
      default:           av = a.lastSeen;  bv = b.lastSeen;  break
    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageSlice  = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  if (iocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-hf-muted text-sm">No indicators match your filters.</p>
        <p className="text-hf-dim text-xs mt-1">Try adjusting your search or clearing filters.</p>
      </div>
    )
  }

  const sortProps = { current: sortField, dir: sortDir, onSort: handleSort }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-hf-border/40">
              <th className="text-left py-3 px-3 w-8"><span className="text-[10px] font-bold uppercase tracking-wider text-hf-dim">#</span></th>
              <th className="text-left py-3 px-2 w-8"><span className="text-[10px] font-bold uppercase tracking-wider text-hf-dim">Type</span></th>
              <th className="text-left py-3 px-2"><SortHeader field="value" label="Indicator" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-28"><SortHeader field="status" label="Status" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-24"><SortHeader field="severity" label="Severity" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-28"><SortHeader field="confidence" label="Confidence" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-20"><SortHeader field="hitCount" label="Hits" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-32"><SortHeader field="lastSeen" label="Last Seen" {...sortProps} /></th>
              <th className="text-left py-3 px-2 w-20"><span className="text-[10px] font-bold uppercase tracking-wider text-hf-dim">TLP</span></th>
            </tr>
          </thead>
          <tbody>
            {pageSlice.map((ioc, i) => (
              <tr
                key={ioc.id}
                onClick={() => onSelect(ioc)}
                className={cn(
                  'border-b border-hf-border/20 cursor-pointer transition-colors hover:bg-hf-surface-2/60',
                  selectedId === ioc.id && 'bg-hf-primary/5 border-hf-primary/20',
                  ioc.status === 'false-positive' && 'opacity-50',
                )}
              >
                {/* Row # */}
                <td className="py-2.5 px-3 text-[10px] text-hf-dim tabular-nums">{page * PAGE_SIZE + i + 1}</td>

                {/* Type icon */}
                <td className="py-2.5 px-2">
                  <IOCTypeIcon type={ioc.type} size="sm" />
                </td>

                {/* Value */}
                <td className="py-2.5 px-2 max-w-xs">
                  <TruncatedValue value={ioc.value} type={ioc.type} />
                  {ioc.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {ioc.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                {/* Status — clickable dropdown */}
                <td className="py-2.5 px-2" onClick={(e) => e.stopPropagation()}>
                  <StatusCell ioc={ioc} onStatusChange={onStatusChange} />
                </td>

                {/* Severity */}
                <td className="py-2.5 px-2">
                  <SeverityPill severity={ioc.severity} />
                </td>

                {/* Confidence */}
                <td className="py-2.5 px-2">
                  <ConfidenceBar value={ioc.confidence} />
                </td>

                {/* Hit count */}
                <td className="py-2.5 px-2 font-mono text-xs font-semibold text-hf-text tabular-nums">
                  {ioc.hitCount.toLocaleString()}
                </td>

                {/* Last seen */}
                <td className="py-2.5 px-2 text-[10px] text-hf-muted tabular-nums whitespace-nowrap">
                  {formatDate(ioc.lastSeen)}
                </td>

                {/* TLP */}
                <td className="py-2.5 px-2">
                  <span className={cn(
                    'text-[9px] font-bold uppercase tracking-wider',
                    ioc.tlp === 'red'   && 'text-hf-danger',
                    ioc.tlp === 'amber' && 'text-hf-warning',
                    ioc.tlp === 'green' && 'text-hf-success',
                    ioc.tlp === 'white' && 'text-hf-dim',
                  )}>
                    TLP:{ioc.tlp.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-3 border-t border-hf-border/30 mt-1">
          <span className="text-xs text-hf-dim">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'w-7 h-7 rounded text-xs font-medium transition-colors',
                  i === page
                    ? 'bg-hf-primary text-white'
                    : 'text-hf-dim hover:bg-hf-surface-3 hover:text-hf-muted'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
