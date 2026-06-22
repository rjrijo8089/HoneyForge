'use client'
import { cn } from '@/lib/utils'
import type { LiveFeedEvent } from '@/types/live-feed'

const SEV_COLOR: Record<string, string> = {
  critical: 'text-severity-critical',
  high:     'text-severity-high',
  medium:   'text-severity-medium',
  low:      'text-severity-low',
}

function formatHMS(ts: string): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

interface Props {
  events: LiveFeedEvent[]
  paused: boolean
}

export function FeedTicker({ events, paused }: Props) {
  const notable = events.filter((e) => e.severity === 'critical' || e.severity === 'high').slice(0, 12)
  if (notable.length === 0) return null

  /* Duplicate items for seamless loop */
  const items = [...notable, ...notable]

  return (
    <div className="relative overflow-hidden rounded-xl border border-hf-danger/20 bg-hf-danger/5 h-8 flex items-center">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-hf-bg/90 to-transparent z-10 pointer-events-none" />
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-hf-bg/90 to-transparent z-10 pointer-events-none" />

      {/* Live badge */}
      <div className="absolute left-2 z-20 flex items-center gap-1.5 bg-hf-bg/80 px-2 py-0.5 rounded-md border border-hf-border/40">
        <span className={cn('relative w-1.5 h-1.5 rounded-full bg-hf-danger live-ring', paused && 'opacity-40')} />
        <span className="text-[9px] font-black text-hf-danger tracking-widest">LIVE</span>
      </div>

      <div
        className="flex gap-0 pl-24 whitespace-nowrap animate-ticker"
        style={{ animationDuration: `${Math.max(25, notable.length * 4)}s`, animationPlayState: paused ? 'paused' : 'running' }}
      >
        {items.map((ev, i) => (
          <span key={`${ev.id}_${i}`} className="inline-flex items-center gap-2 pr-8">
            <span className="text-hf-dim text-[10px] font-mono">{formatHMS(ev.timestamp)}</span>
            <span className={cn('text-[10px] font-bold uppercase', SEV_COLOR[ev.severity])}>⚡ {ev.severity}</span>
            <span className="text-hf-muted text-[10px] font-mono">{ev.sourceIp}</span>
            <span className="text-hf-dim text-[10px]">→</span>
            <span className="text-hf-text text-[10px] font-semibold">{ev.targetDecoyName}</span>
            <span className="text-hf-dim text-[10px]">·</span>
            <span className="text-hf-muted text-[10px]">{ev.attackType}</span>
            <span className="text-hf-border/60 text-[10px]">│</span>
          </span>
        ))}
      </div>
    </div>
  )
}
