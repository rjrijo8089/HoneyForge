'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-hf-primary hover:bg-hf-primary-hover text-white border border-hf-primary',
  secondary: 'bg-hf-surface-2 hover:bg-hf-surface-3 text-hf-text border border-hf-border',
  ghost:     'bg-transparent hover:bg-hf-surface-2 text-hf-muted hover:text-hf-text border border-transparent',
  danger:    'bg-hf-danger/10 hover:bg-hf-danger/20 text-hf-danger border border-hf-danger/30',
  outline:   'bg-transparent hover:bg-hf-surface-2 text-hf-text border border-hf-border',
}

const SIZES: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-2.5 text-base rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    {...props}
  >
    {isLoading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
))
Button.displayName = 'Button'
