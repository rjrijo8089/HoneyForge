'use client'
import { cn } from '@/lib/utils'
import type { TickerEvent } from '@/services/mock/data/dashboard'

const SEV_STYLES = {
  critical: 'text-severity-critical bg-severity-critical/15 border border-severity-critical/30',
  high:     'text-severity-high     bg-severity-high/15     border border-severity-high/30',
  medium:   'text-severity-medium   bg-severity-medium/15   border border-severity-medium/30',
  low:      'text-severity-low      bg-severity-low/15      border border-severity-low/30',
}

const SEV_DOTS = {
  critical: 'bg-severity-critical',
  high:     'bg-severity-high',
  medium:   'bg-severity-medium',
  low:      'bg-severity-low',
}

interface LiveTickerProps {
  events: TickerEvent[]
}

export function LiveTicker({ events }: LiveTickerProps) {
  const doubled = [...events, ...events]

  return (
    <div className="flex items-center gap-3 overflow-hidden glass-card rounded-xl border-hf-border/40 px-0 py-0">
      {/* LIVE badge */}
      <div className="flex items-center gap-2 shrink-0 px-4 py-2.5 bg-hf-danger/10 border-r border-hf-border/50">
        <span className="relative w-2 h-2 flex items-center justify-center">
          <span className="absolute w-2 h-2 bg-hf-danger rounded-full" />
          <span className="absolute w-2 h-2 bg-hf-danger rounded-full animate-ping opacity-75" />
        </span>
        <span className="text-[10px] font-black text-hf-danger tracking-[0.2em] uppercase">Live</span>
      </div>

      {/* Ticker scroll */}
      <div className="flex-1 overflow-hidden py-2.5">
        <div
          className="flex items-center gap-0 whitespace-nowrap will-change-transform animate-ticker"
          style={{ animationDuration: '55s' }}
        >
          {doubled.map((event, i) => (
            <span key={`${event.id}-${i}`} className="inline-flex items-center gap-2 pr-8 text-xs">
              <span className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0',
                SEV_STYLES[event.severity]
              )}>
                <span className={cn('w-1 h-1 rounded-full shrink-0', SEV_DOTS[event.severity])} />
                {event.severity}
              </span>
              <span className="font-mono text-hf-muted">{event.sourceIp}</span>
              <span className="text-hf-dim text-[10px] border border-hf-border/40 px-1 rounded font-mono">{event.countryCode}</span>
              <span className="text-hf-dim">→</span>
              <span className="text-hf-text font-medium">{event.targetDecoy}</span>
              <span className="text-hf-dim">·</span>
              <span className="text-hf-accent">{event.attackType}</span>
              <span className="text-hf-border-2 mx-3">│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
