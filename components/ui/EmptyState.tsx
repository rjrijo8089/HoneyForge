import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-8',
      className
    )}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-hf-surface-2 border border-hf-border flex items-center justify-center text-hf-dim mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-hf-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-hf-muted max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}
