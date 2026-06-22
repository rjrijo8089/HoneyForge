'use client'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { LiveFeedEvent } from '@/types/live-feed'

const BUCKETS = 15   // minutes of history
const BUCKET_MS = 60_000

const SEV_COLORS: Record<string, { fill: string; label: string }> = {
  critical: { fill: '#dc2626', label: 'Critical' },
  high:     { fill: '#ea580c', label: 'High'     },
  medium:   { fill: '#d97706', label: 'Medium'   },
  low:      { fill: '#16a34a', label: 'Low'       },
}

function padTime(n: number): string { return String(n).padStart(2, '0') }

function bucketLabel(bucketIdx: number, nowMs: number): string {
  const ms = nowMs - (BUCKETS - 1 - bucketIdx) * BUCKET_MS
  const d  = new Date(ms)
  return `${padTime(d.getHours())}:${padTime(d.getMinutes())}`
}

interface Props {
  events: LiveFeedEvent[]
  className?: string
}

export function AttackTimeline({ events, className }: Props) {
  const now = Date.now()

  const { buckets, maxCount } = useMemo(() => {
    /* Build BUCKETS x severity matrix */
    const data: Record<string, Record<string, number>> = {}
    for (let i = 0; i < BUCKETS; i++) data[i] = { critical: 0, high: 0, medium: 0, low: 0 }

    for (const ev of events) {
      const msAgo = now - new Date(ev.timestamp).getTime()
      const bucket = BUCKETS - 1 - Math.floor(msAgo / BUCKET_MS)
      if (bucket < 0 || bucket >= BUCKETS) continue
      if (ev.severity in data[bucket]) data[bucket][ev.severity]++
    }

    const maxCount = Math.max(1, ...Object.values(data).map((b) => Object.values(b).reduce((a, x) => a + x, 0)))
    return { buckets: data, maxCount }
  }, [events, now])

  const barW  = 100 / BUCKETS  // percent width per bucket
  const svgH  = 64             // px height of bars area
  const SEVS  = ['critical', 'high', 'medium', 'low'] as const

  return (
    <div className={cn('glass-card border border-hf-border/50 rounded-xl p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-hf-text">Attack Timeline</p>
        <div className="flex items-center gap-3">
          {SEVS.map((sev) => (
            <span key={sev} className="flex items-center gap-1 text-[10px] text-hf-dim">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: SEV_COLORS[sev].fill }} />
              {SEV_COLORS[sev].label}
            </span>
          ))}
          <span className="text-[10px] text-hf-dim">Last 15 min</span>
        </div>
      </div>

      {/* SVG bars */}
      <svg width="100%" height={svgH + 18} className="overflow-visible">
        {Array.from({ length: BUCKETS }, (_, i) => {
          const bucket = buckets[i]
          const total  = Object.values(bucket).reduce((a, x) => a + x, 0)
          const x      = i * barW
          let yOffset  = svgH

          return (
            <g key={i}>
              {SEVS.map((sev) => {
                const count = bucket[sev] ?? 0
                if (count === 0) return null
                const barH = (count / maxCount) * svgH
                yOffset -= barH
                return (
                  <rect
                    key={sev}
                    x={`${x + 0.3}%`}
                    y={yOffset}
                    width={`${barW - 0.6}%`}
                    height={barH}
                    fill={SEV_COLORS[sev].fill}
                    fillOpacity={0.85}
                    rx={1}
                  />
                )
              })}
              {/* hover total */}
              {total > 0 && (
                <title>{bucketLabel(i, now)}: {total} events</title>
              )}
            </g>
          )
        })}

        {/* Baseline */}
        <line x1="0" y1={svgH} x2="100%" y2={svgH} stroke="var(--color-hf-border)" strokeWidth={1} strokeOpacity={0.5} />

        {/* Time labels — show every 3rd */}
        {Array.from({ length: BUCKETS }, (_, i) => {
          if (i % 3 !== 0 && i !== BUCKETS - 1) return null
          const x = i * barW + barW / 2
          return (
            <text
              key={i}
              x={`${x}%`}
              y={svgH + 14}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-hf-dim)"
              fontFamily="var(--font-mono, monospace)"
            >
              {bucketLabel(i, now)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
