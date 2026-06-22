'use client'
import { X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/SearchBar'
import type { DecoyStatus, DecoyCategory } from '@/types'

const STATUSES: { value: DecoyStatus; label: string; dot: string }[] = [
  { value: 'active',    label: 'Active',     dot: 'bg-hf-success' },
  { value: 'paused',    label: 'Paused',     dot: 'bg-hf-warning' },
  { value: 'error',     label: 'Error',      dot: 'bg-hf-danger'  },
  { value: 'deploying', label: 'Deploying',  dot: 'bg-hf-accent'  },
]

const CATEGORIES: { value: DecoyCategory; label: string }[] = [
  { value: 'web-clone',       label: 'Web Clone'       },
  { value: 'ssh',             label: 'SSH'             },
  { value: 'malware-capture', label: 'Malware Capture' },
  { value: 'ids-sensor',      label: 'IDS Sensor'      },
  { value: 'file-share',      label: 'File Share'      },
  { value: 'database',        label: 'Database'        },
  { value: 'remote-access',   label: 'Remote Access'   },
]

const ENVS = ['prod', 'staging', 'dev']

interface DecoyFiltersProps {
  search: string
  onSearch: (v: string) => void
  statuses: DecoyStatus[]
  onStatusToggle: (v: DecoyStatus) => void
  categories: DecoyCategory[]
  onCategoryToggle: (v: DecoyCategory) => void
  environments: string[]
  onEnvToggle: (v: string) => void
  onClear: () => void
  activeCount: number
}

function Chip({ active, dot, label, onClick }: {
  active: boolean; dot?: string; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all',
        active
          ? 'bg-hf-primary/15 border-hf-primary/50 text-hf-primary'
          : 'bg-hf-surface-2 border-hf-border/50 text-hf-muted hover:border-hf-border-2 hover:text-hf-text'
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />}
      {label}
    </button>
  )
}

export function DecoyFilters({
  search, onSearch,
  statuses, onStatusToggle,
  categories, onCategoryToggle,
  environments, onEnvToggle,
  onClear, activeCount,
}: DecoyFiltersProps) {
  const hasFilters = statuses.length > 0 || categories.length > 0 || environments.length > 0 || search !== ''

  return (
    <div className="glass-card rounded-2xl border border-hf-border/50 p-4 space-y-3">
      {/* Row 1: search + clear */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={onSearch}
          placeholder="Search by name, IP, OS, tags…"
          className="flex-1 min-w-[200px] max-w-xs"
        />
        <div className="flex items-center gap-1.5 text-xs text-hf-dim">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{activeCount} results</span>
        </div>
        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-hf-danger hover:text-hf-danger/80 transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Row 2: Status chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-hf-dim uppercase tracking-wider w-14 shrink-0">Status</span>
        {STATUSES.map((s) => (
          <Chip
            key={s.value}
            active={statuses.includes(s.value)}
            dot={s.dot}
            label={s.label}
            onClick={() => onStatusToggle(s.value)}
          />
        ))}
      </div>

      {/* Row 3: Category chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-hf-dim uppercase tracking-wider w-14 shrink-0">Type</span>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.value}
            active={categories.includes(c.value)}
            label={c.label}
            onClick={() => onCategoryToggle(c.value)}
          />
        ))}
        {ENVS.map((e) => (
          <Chip
            key={e}
            active={environments.includes(e)}
            label={e.charAt(0).toUpperCase() + e.slice(1)}
            onClick={() => onEnvToggle(e)}
          />
        ))}
      </div>
    </div>
  )
}
