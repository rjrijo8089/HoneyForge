import { Globe, Hash, ExternalLink as UrlIcon, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IOCItem } from '@/services/mock/data/dashboard'

interface IOCFeedProps {
  iocs: IOCItem[]
}

const TYPE_META = {
  ip:     { icon: Wifi,    label: 'IP',   color: 'text-hf-danger' },
  domain: { icon: Globe,   label: 'DOM',  color: 'text-hf-warning' },
  hash:   { icon: Hash,    label: 'HASH', color: 'text-hf-accent' },
  url:    { icon: UrlIcon, label: 'URL',  color: 'text-purple-400' },
}

const SEV_DOT: Record<string, string> = {
  critical: 'bg-severity-critical', high: 'bg-severity-high',
  medium: 'bg-severity-medium', low: 'bg-severity-low',
}

export function IOCFeed({ iocs }: IOCFeedProps) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-hf-border/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-hf-accent rounded-full" />
          <h3 className="text-sm font-semibold text-hf-text">Latest Indicators</h3>
        </div>
        <span className="text-[10px] text-hf-dim">{iocs.length} IOCs</span>
      </div>

      <div className="divide-y divide-hf-border/20 max-h-[260px] overflow-y-auto">
        {iocs.map((ioc) => {
          const meta = TYPE_META[ioc.type]
          const Icon = meta.icon
          return (
            <div key={ioc.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hf-surface-2/50 transition-colors group">
              {/* Severity + type */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className={cn('w-1.5 h-1.5 rounded-full', SEV_DOT[ioc.severity])} />
                <Icon className={cn('w-3 h-3', meta.color)} />
              </div>

              {/* Value */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-hf-text truncate">{ioc.value}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {ioc.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time + source */}
              <div className="text-right shrink-0">
                <p className="text-[10px] text-hf-dim">{ioc.timestamp}</p>
                <p className="text-[9px] text-hf-dim/60">{ioc.source}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
