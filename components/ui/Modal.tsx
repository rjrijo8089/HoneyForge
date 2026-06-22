'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: Size
  footer?: React.ReactNode
}

const SIZE_CLASSES: Record<Size, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full bg-hf-surface border border-hf-border rounded-2xl shadow-2xl animate-fade-in',
        SIZE_CLASSES[size]
      )}>
        {(title || description) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-hf-border">
            <div>
              {title && <h2 className="text-lg font-semibold text-hf-text">{title}</h2>}
              {description && <p className="text-sm text-hf-muted mt-0.5">{description}</p>}
            </div>
            <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors ml-4 mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 pb-6 pt-2 border-t border-hf-border flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
