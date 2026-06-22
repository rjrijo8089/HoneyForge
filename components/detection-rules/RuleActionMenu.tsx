'use client'
import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Eye, Pencil, Power, PowerOff, Copy, Download, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DetectionRule, RuleStatus } from '@/types/rule'

interface Props {
  rule: DetectionRule
  onView:      (rule: DetectionRule) => void
  onEdit:      (rule: DetectionRule) => void
  onToggle:    (rule: DetectionRule) => void
  onDuplicate: (rule: DetectionRule) => void
  onExport:    (rule: DetectionRule) => void
  onDelete:    (rule: DetectionRule) => void
}

function Item({
  icon: Icon, label, onClick, danger,
}: { icon: React.ComponentType<{className?: string}>; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
        danger
          ? 'text-hf-danger hover:bg-hf-danger/10'
          : 'text-hf-muted hover:bg-hf-surface-3 hover:text-hf-text'
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </button>
  )
}

const ACTIVE_STATUSES: RuleStatus[] = ['active']

export function RuleActionMenu({ rule, onView, onEdit, onToggle, onDuplicate, onExport, onDelete }: Props) {
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

  const isActive = ACTIVE_STATUSES.includes(rule.status)

  const act = (fn: () => void) => { fn(); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1 rounded text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-50 w-44 bg-hf-surface border border-hf-border/60 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          <Item icon={Eye}      label="View Details" onClick={() => act(() => onView(rule))} />
          <Item icon={Pencil}   label="Edit Rule"    onClick={() => act(() => onEdit(rule))} />
          <div className="border-t border-hf-border/30 my-0.5" />
          <Item
            icon={isActive ? PowerOff : Power}
            label={isActive ? 'Disable' : 'Enable'}
            onClick={() => act(() => onToggle(rule))}
          />
          <Item icon={Copy}     label="Duplicate"    onClick={() => act(() => onDuplicate(rule))} />
          <Item icon={Download} label="Export"       onClick={() => act(() => onExport(rule))} />
          <div className="border-t border-hf-border/30 my-0.5" />
          <Item icon={Trash2}   label="Delete"       onClick={() => act(() => onDelete(rule))} danger />
        </div>
      )}
    </div>
  )
}
