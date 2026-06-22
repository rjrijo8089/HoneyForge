'use client'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  size?: 'sm' | 'md'
  disabled?: boolean
  id?: string
}

export function ToggleSwitch({ checked, onChange, size = 'md', disabled, id }: ToggleSwitchProps) {
  const track = size === 'sm' ? 'w-8 h-4'   : 'w-11 h-6'
  const thumb = size === 'sm' ? 'w-3 h-3'   : 'w-4 h-4'
  const shift = size === 'sm' ? 'translate-x-4' : 'translate-x-5'
  const pad   = size === 'sm' ? 'top-0.5 left-0.5' : 'top-1 left-1'

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative rounded-full border transition-all duration-200 shrink-0',
        track,
        checked
          ? 'bg-hf-primary border-hf-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          : 'bg-hf-surface-3 border-hf-border/50',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'absolute rounded-full bg-white shadow transition-transform duration-200',
          thumb, pad,
          checked ? shift : 'translate-x-0'
        )}
      />
    </button>
  )
}
