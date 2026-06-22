'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { DETECTION_SOURCE_META } from '@/types/live-feed'
import type { LiveFeedEvent } from '@/types/live-feed'

/* ── helpers ── */
function hms(ts: string): string {
  const d = new Date(ts)
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
}

const SEV_LEFT: Record<string, string> = {
  critical: 'border-l-severity-critical',
  high:     'border-l-severity-high',
  medium:   'border-l-severity-medium',
  low:      'border-l-severity-low',
  info:     'border-l-hf-dim',
}
const SEV_DOT: Record<string, string> = {
  critical: 'bg-severity-critical',
  high:     'bg-severity-high',
  medium:   'bg-severity-medium',
  low:      'bg-severity-low',
  info:     'bg-hf-dim',
}

const CC_FLAG: Record<string, string> = {
  NL: '🇳🇱', CN: '🇨🇳', RU: '🇷🇺', BG: '🇧🇬', UA: '🇺🇦', DE: '🇩🇪',
  US: '🇺🇸', TW: '🇹🇼', RO: '🇷🇴', SE: '🇸🇪', GB: '🇬🇧', FR: '🇫🇷',
}

const MAX_PAYLOAD_LEN = 72

interface Props {
  events: LiveFeedEvent[]
  autoScroll: boolean
  onSelect: (ev: LiveFeedEvent) => void
  selectedId: string | null
  newIds: Set<string>
}

export function FeedTable({ events, autoScroll, onSelect, selectedId, newIds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  /* Keep scrolled to top (newest) when autoScroll is on */
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [events.length, autoScroll])

  return (
    <>
      {/* Inject flash animation */}
      <style>{`
        @keyframes laf-flash {
          0%   { background-color: rgba(59,130,246,0.12); }
          100% { background-color: transparent; }
        }
        .laf-new { animation: laf-flash 1.2s ease-out; }
      `}</style>

      <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 font-mono text-[11px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-0 bg-hf-surface/90 backdrop-blur-sm border-b border-hf-border/40 px-3 py-1.5">
          <span className="w-16 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Time</span>
          <span className="w-16 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Sev</span>
          <span className="w-16 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Sensor</span>
          <span className="w-32 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Source IP</span>
          <span className="w-5  shrink-0" />
          <span className="w-5  shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">CC</span>
          <span className="w-6  shrink-0 text-hf-dim text-center">→</span>
          <span className="w-40 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Target</span>
          <span className="w-36 shrink-0 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Attack</span>
          <span className="flex-1 text-[9px] font-bold text-hf-dim uppercase tracking-widest">Payload Preview</span>
          <span className="w-10 shrink-0 text-right text-[9px] font-bold text-hf-dim uppercase tracking-widest">Conf</span>
        </div>

        {events.length === 0 && (
          <div className="text-center py-16 text-hf-dim text-xs">No events match the current filters</div>
        )}

        {events.map((ev) => {
          const isNew      = newIds.has(ev.id)
          const isSelected = selectedId === ev.id
          const src_meta   = DETECTION_SOURCE_META[ev.detectionSource]
          const flag       = CC_FLAG[ev.sourceCountryCode] ?? ev.sourceCountryCode
          const payload    = ev.payload ? ev.payload.replace(/\r\n/g, ' ↵ ').replace(/\n/g, ' ↵ ') : null
          const payloadTxt = payload ? (payload.length > MAX_PAYLOAD_LEN ? payload.slice(0, MAX_PAYLOAD_LEN) + '…' : payload) : null

          return (
            <div
              key={ev.id}
              onClick={() => onSelect(ev)}
              className={cn(
                'flex items-center gap-0 px-3 py-2 border-b border-hf-border/15 border-l-2 cursor-pointer transition-colors group',
                SEV_LEFT[ev.severity],
                isSelected ? 'bg-hf-primary/8' : 'hover:bg-hf-surface/50',
                isNew && 'laf-new',
              )}
            >
              {/* Time */}
              <span className="w-16 shrink-0 text-hf-dim">{hms(ev.timestamp)}</span>

              {/* Severity */}
              <span className="w-16 shrink-0 flex items-center gap-1.5">
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', SEV_DOT[ev.severity])} />
                <span className={cn(
                  'text-[9px] font-bold uppercase',
                  ev.severity === 'critical' ? 'text-severity-critical' :
                  ev.severity === 'high'     ? 'text-severity-high'     :
                  ev.severity === 'medium'   ? 'text-severity-medium'   :
                  ev.severity === 'low'      ? 'text-severity-low'      : 'text-hf-dim'
                )}>
                  {ev.severity === 'critical' ? 'CRIT' : ev.severity.toUpperCase()}
                </span>
              </span>

              {/* Sensor */}
              <span className={cn('w-16 shrink-0 text-[9px] font-bold', src_meta.color)}>
                {ev.detectionSource}
              </span>

              {/* Source IP */}
              <span className="w-32 shrink-0 text-hf-accent">{ev.sourceIp}</span>

              {/* Port */}
              <span className="w-5 shrink-0 text-hf-dim text-[9px]">:{String(ev.sourcePort).slice(-4)}</span>

              {/* Country */}
              <span className="w-5 shrink-0 text-center text-[11px]">{flag}</span>

              {/* Arrow */}
              <span className="w-6 shrink-0 text-hf-dim text-center">→</span>

              {/* Target */}
              <span className="w-40 shrink-0 text-hf-muted truncate" title={ev.targetDecoyName}>{ev.targetDecoyName}</span>

              {/* Attack type */}
              <span className="w-36 shrink-0 text-hf-text font-semibold truncate" title={ev.attackType}>{ev.attackType}</span>

              {/* Payload preview */}
              <span className="flex-1 text-hf-dim truncate opacity-70 group-hover:opacity-100 transition-opacity" title={payload ?? ''}>
                {payloadTxt ?? '—'}
              </span>

              {/* Confidence */}
              <span className={cn(
                'w-10 shrink-0 text-right font-bold text-[10px]',
                ev.confidence >= 90 ? 'text-hf-success' : ev.confidence >= 70 ? 'text-hf-warning' : 'text-hf-dim'
              )}>
                {ev.confidence}%
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
