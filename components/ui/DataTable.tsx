'use client'
import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TableSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: keyof T | string
  header: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelectionChange?: (rows: T[]) => void
  pageSize?: number
  className?: string
}

export function DataTable<T extends { id: string }>({
  data, columns, isLoading, emptyTitle = 'No results', emptyDescription,
  emptyIcon, onRowClick, selectable, onSelectionChange, pageSize = 20, className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)

  if (isLoading) return <TableSkeleton rows={pageSize > 10 ? 8 : pageSize} cols={columns.length} />

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey]
        const bv = (b as Record<string, unknown>)[sortKey]
        if (av == null) return 1
        if (bv == null) return -1
        return (av < bv ? -1 : av > bv ? 1 : 0) * (sortDir === 'asc' ? 1 : -1)
      })
    : data

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const toggleSelectAll = () => {
    const allIds = paged.map((r) => r.id)
    const allSelected = allIds.every((id) => selectedIds.has(id))
    const next = new Set(selectedIds)
    if (allSelected) allIds.forEach((id) => next.delete(id))
    else allIds.forEach((id) => next.add(id))
    setSelectedIds(next)
    onSelectionChange?.(data.filter((r) => next.has(r.id)))
  }

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedIds(next)
    onSelectionChange?.(data.filter((r) => next.has(r.id)))
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-x-auto rounded-xl border border-hf-border">
        <table className="w-full text-sm min-w-full">
          <thead>
            <tr className="border-b border-hf-border bg-hf-surface-2">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && paged.every((r) => selectedIds.has(r.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-hf-border accent-hf-primary cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  className={cn(
                    'px-4 py-3 font-medium text-hf-muted whitespace-nowrap text-xs uppercase tracking-wider',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer select-none hover:text-hf-text transition-colors'
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === String(col.key)
                        ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        : <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : paged.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-hf-border/50 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-hf-surface-2',
                  selectedIds.has(row.id) && 'bg-hf-primary/5'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="rounded border-hf-border accent-hf-primary cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3 text-hf-text',
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                    )}
                  >
                    {col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-hf-muted px-1">
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-hf-border hover:bg-hf-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
            >
              Previous
            </button>
            <span className="text-hf-text text-xs">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-hf-border hover:bg-hf-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
