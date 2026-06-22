'use client'
import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  key: string
  label: string
  options: FilterOption[]
  multi?: boolean
}

interface FilterPanelProps {
  groups: FilterGroup[]
  values: Record<string, string[]>
  onChange: (key: string, values: string[]) => void
  onReset: () => void
  activeCount?: number
}

export function FilterPanel({ groups, values, onChange, onReset, activeCount = 0 }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.key, true]))
  )

  const toggle = (key: string, value: string, multi: boolean) => {
    const current = values[key] ?? []
    if (multi) {
      onChange(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
    } else {
      onChange(key, current.includes(value) ? [] : [value])
    }
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<SlidersHorizontal className="w-4 h-4" />}
        onClick={() => setOpen((o) => !o)}
        className={cn(activeCount > 0 && 'border-hf-primary text-hf-primary')}
      >
        Filters
        {activeCount > 0 && (
          <span className="ml-1 bg-hf-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-30 w-64 bg-hf-surface border border-hf-border rounded-xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-hf-border">
              <span className="text-sm font-medium text-hf-text">Filters</span>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button onClick={onReset} className="text-xs text-hf-muted hover:text-hf-danger transition-colors">
                    Reset
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-hf-dim hover:text-hf-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              {groups.map((group) => (
                <div key={group.key} className="px-2">
                  <button
                    onClick={() => setExpanded((e) => ({ ...e, [group.key]: !e[group.key] }))}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-hf-muted uppercase tracking-wider hover:text-hf-text transition-colors"
                  >
                    {group.label}
                    <ChevronDown className={cn('w-3 h-3 transition-transform', expanded[group.key] && 'rotate-180')} />
                  </button>
                  {expanded[group.key] && (
                    <div className="mb-2 space-y-0.5">
                      {group.options.map((opt) => {
                        const selected = (values[group.key] ?? []).includes(opt.value)
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggle(group.key, opt.value, group.multi ?? true)}
                            className={cn(
                              'w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors',
                              selected
                                ? 'bg-hf-primary/15 text-hf-primary'
                                : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2'
                            )}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
