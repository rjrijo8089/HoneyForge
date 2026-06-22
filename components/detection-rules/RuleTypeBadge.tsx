import { cn } from '@/lib/utils'
import type { RuleType } from '@/types/rule'

const META: Record<RuleType, { label: string; color: string; bg: string; border: string }> = {
  sigma:      { label: 'Sigma',      color: 'text-hf-primary',  bg: 'bg-hf-primary/10',  border: 'border-hf-primary/30'  },
  yara:       { label: 'YARA',       color: 'text-hf-accent',   bg: 'bg-hf-accent/10',   border: 'border-hf-accent/30'   },
  suricata:   { label: 'Suricata',   color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30'  },
  opensearch: { label: 'OpenSearch', color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/30'  },
  siem:       { label: 'SIEM',       color: 'text-hf-warning',  bg: 'bg-hf-warning/10',  border: 'border-hf-warning/30'  },
}

export const ALL_RULE_TYPES: RuleType[] = ['sigma', 'yara', 'suricata', 'opensearch', 'siem']

export function RuleTypeBadge({ type, className }: { type: RuleType; className?: string }) {
  const m = META[type]
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider',
      m.color, m.bg, m.border, className
    )}>
      {m.label}
    </span>
  )
}

export function ruleTypeMeta(type: RuleType) { return META[type] }
