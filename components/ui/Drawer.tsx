'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Side = 'right' | 'left'
type Width = 'sm' | 'md' | 'lg'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  side?: Side
  width?: Width
  children: React.ReactNode
  footer?: React.ReactNode
}

const WIDTH_CLASSES: Record<Width, string> = {
  sm: 'w-80',
  md: 'w-[420px]',
  lg: 'w-[600px]',
}

export function Drawer({ open, onClose, title, description, side = 'right', width = 'md', children, footer }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative ml-auto flex flex-col bg-hf-surface border-l border-hf-border shadow-2xl h-full',
        'animate-slide-in-right',
        WIDTH_CLASSES[width],
        side === 'left' && 'mr-auto ml-0 border-l-0 border-r border-hf-border'
      )}>
        <div className="flex items-start justify-between px-6 py-5 border-b border-hf-border shrink-0">
          <div>
            {title && <h2 className="text-lg font-semibold text-hf-text">{title}</h2>}
            {description && <p className="text-sm text-hf-muted mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-hf-border flex items-center gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
