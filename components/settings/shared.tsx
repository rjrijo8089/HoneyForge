'use client'
import { useState, useCallback } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

/* ── Toggle switch ── */
export function Toggle({
  checked, onChange, disabled,
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full border transition-all shrink-0',
        checked ? 'bg-hf-primary border-hf-primary' : 'bg-hf-surface-3 border-hf-border',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      <span className={cn(
        'absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
        checked && 'translate-x-4'
      )} />
    </button>
  )
}

/* ── Setting row: label + hint + right-side control ── */
export function SettingRow({
  label, hint, children, badge, className,
}: {
  label: string; hint?: string; children: React.ReactNode
  badge?: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-6 py-3.5 border-b border-hf-border/20 last:border-0', className)}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-hf-text">{label}</p>
          {badge}
        </div>
        {hint && <p className="text-xs text-hf-dim mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className="shrink-0 mt-0.5">{children}</div>
    </div>
  )
}

/* ── Section separator with title ── */
export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pt-2 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-hf-dim">{title}</p>
      {description && <p className="text-xs text-hf-dim mt-0.5">{description}</p>}
    </div>
  )
}

/* ── Button group (pill tabs) ── */
export function BtnGroup<T extends string>({
  options, value, onChange, disabled,
}: {
  options: { value: T; label: string; danger?: boolean }[]
  value: T
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => !disabled && onChange(o.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
            value === o.value
              ? o.danger
                ? 'bg-hf-danger/15 border-hf-danger/40 text-hf-danger'
                : 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
              : 'border-hf-border/50 text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ── Styled select ── */
export function SelectField({
  label, hint, value, onChange, options, className,
}: {
  label?: string; hint?: string; value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  const iid = label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label htmlFor={iid} className="text-sm font-medium text-hf-muted">{label}</label>}
      <div className="relative">
        <select
          id={iid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text appearance-none focus:outline-none focus:border-hf-primary transition-colors pr-8"
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {hint && <p className="text-xs text-hf-dim">{hint}</p>}
    </div>
  )
}

/* ── Save bar ── */
export function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="pt-5 mt-2 border-t border-hf-border/30 flex items-center justify-end gap-3">
      {saved && (
        <span className="flex items-center gap-1.5 text-xs text-hf-success">
          <Check className="w-3.5 h-3.5" /> Changes saved
        </span>
      )}
      <Button variant="primary" size="sm" isLoading={saving} onClick={onSave}>
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </div>
  )
}

/* ── useSave hook ── */
export function useSave() {
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const save = useCallback(async (fn?: () => void) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    fn?.()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [])
  return { saving, saved, save }
}

/* ── Tab-level card wrapper ── */
export function TabCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-hf-surface border border-hf-border/50 rounded-xl p-6 space-y-1">
      {children}
    </div>
  )
}

/* ── Inline field row (for compact grids) ── */
export const labelCls  = 'text-sm font-medium text-hf-muted'
export const inputCls  = 'w-full bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text placeholder:text-hf-dim focus:outline-none focus:border-hf-primary transition-colors'
export const numberCls = 'w-24 bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text focus:outline-none focus:border-hf-primary text-right tabular-nums transition-colors'
