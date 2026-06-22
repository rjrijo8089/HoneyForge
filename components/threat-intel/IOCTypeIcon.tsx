import { Globe, Network, Link2, Hash, Bot, FileCode2, ShieldAlert, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IOCType } from '@/types/threat-intel'

export const IOC_TYPE_META: Record<IOCType, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bg: string
  border: string
}> = {
  ip:           { icon: Network,     label: 'IP Address',  color: 'text-hf-primary',  bg: 'bg-hf-primary/10',  border: 'border-hf-primary/30'  },
  domain:       { icon: Globe,       label: 'Domain',      color: 'text-hf-accent',   bg: 'bg-hf-accent/10',   border: 'border-hf-accent/30'   },
  url:          { icon: Link2,       label: 'URL',         color: 'text-hf-warning',  bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30'  },
  'file-hash':  { icon: Hash,        label: 'File Hash',   color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/30'  },
  'user-agent': { icon: Bot,         label: 'User-Agent',  color: 'text-hf-muted',    bg: 'bg-hf-surface-3',   border: 'border-hf-border/50'   },
  payload:      { icon: FileCode2,   label: 'Payload',     color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30'  },
  cve:          { icon: ShieldAlert, label: 'CVE',         color: 'text-hf-danger',   bg: 'bg-hf-danger/10',   border: 'border-hf-danger/30'   },
  email:        { icon: Mail,        label: 'Email',       color: 'text-pink-400',    bg: 'bg-pink-400/10',    border: 'border-pink-400/30'    },
}

interface IOCTypeIconProps {
  type: IOCType
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
}

export function IOCTypeIcon({ type, size = 'sm', showLabel = false }: IOCTypeIconProps) {
  const meta = IOC_TYPE_META[type]
  const Icon = meta.icon
  const iconSz = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const boxSz  = size === 'xs' ? 'w-5 h-5' : size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('rounded flex items-center justify-center border shrink-0', boxSz, meta.bg, meta.border)}>
        <Icon className={cn(iconSz, meta.color)} />
      </div>
      {showLabel && <span className={cn('text-xs font-medium', meta.color)}>{meta.label}</span>}
    </div>
  )
}

export function IOCTypeBadge({ type }: { type: IOCType }) {
  const meta = IOC_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border', meta.color, meta.bg, meta.border)}>
      <Icon className="w-2.5 h-2.5" /> {meta.label}
    </span>
  )
}
