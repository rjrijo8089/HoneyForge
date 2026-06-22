'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-hf-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hf-dim pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-hf-surface-2 border rounded-lg text-sm text-hf-text placeholder:text-hf-dim',
            'transition-colors px-3 py-2',
            'border-hf-border focus:border-hf-primary focus:outline-none',
            error && 'border-hf-danger focus:border-hf-danger',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-hf-dim pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-hf-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-hf-dim">{hint}</p>}
    </div>
  )
})
Input.displayName = 'Input'
