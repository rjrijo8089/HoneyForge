'use client'
import { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ value, onChange, placeholder = 'Search…', className, autoFocus }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-hf-dim pointer-events-none" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full bg-hf-surface-2 border border-hf-border rounded-lg',
          'text-sm text-hf-text placeholder:text-hf-dim',
          'pl-9 pr-8 py-2',
          'focus:outline-none focus:border-hf-primary transition-colors'
        )}
      />
      {value && (
        <button
          onClick={() => { onChange(''); ref.current?.focus() }}
          className="absolute right-3 text-hf-dim hover:text-hf-muted transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
