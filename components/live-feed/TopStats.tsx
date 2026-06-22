'use client'
import { useMemo } from 'react'
import { Globe, Server, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LiveFeedEvent } from '@/types/live-feed'

const SEV_DOT: Record<string, string> = {
  critical: 'bg-severity-critical', high: 'bg-severity-high',
  medium: 'bg-severity-medium',     low:  'bg-severity-low',
}

/* Rank a map of key→count, return top N */
function topN<K extends string>(map: Map<K, number>, n: number): Array<{ key: K; count: number }> {
  return [...map.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([key, count]) => ({ key, count }))
}

function MiniBar({ count, max, color }: { count: number; max: number; color: string }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="h-1.5 bg-hf-surface-2 rounded-full overflow-hidden flex-1">
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  )
}

interface Props {
  events: LiveFeedEvent[]
}

export function TopStats({ events }: Props) {
  const { topIPs, topDecoys, topPaths, sevSummary } = useMemo(() => {
    const ipMap     = new Map<string, { count: number; country: string; code: string; severity: string }>()
    const decoyMap  = new Map<string, { count: number; id: string }>()
    const pathMap   = new Map<string, number>()
    let critical = 0, high = 0, medium = 0, low = 0

    for (const ev of events) {
      /* Top IPs */
      const ip = ipMap.get(ev.sourceIp)
      if (ip) ip.count++
      else ipMap.set(ev.sourceIp, { count: 1, country: ev.sourceCountry, code: ev.sourceCountryCode, severity: ev.severity })

      /* Top Decoys */
      const dec = decoyMap.get(ev.targetDecoyName)
      if (dec) dec.count++
      else decoyMap.set(ev.targetDecoyName, { count: 1, id: ev.targetDecoyId })

      /* Attack paths */
      const path = `${ev.sourceIp} → ${ev.targetDecoyName}`
      pathMap.set(path, (pathMap.get(path) ?? 0) + 1)

      /* Severity counts */
      if (ev.severity === 'critical') critical++
      else if (ev.severity === 'high') high++
      else if (ev.severity === 'medium') medium++
      else if (ev.severity === 'low') low++
    }

    const topIPs    = topN(new Map([...ipMap.entries()].map(([k, v]) => [k, v.count])), 8)
      .map(({ key, count }) => {
        const v = ipMap.get(key)!
        return { ip: key, count, country: v.country, code: v.code, severity: v.severity }
      })
    const topDecoys = topN(new Map([...decoyMap.entries()].map(([k, v]) => [k, v.count])), 6)
      .map(({ key, count }) => ({ name: key, count }))
    const topPaths  = topN(pathMap as Map<string, number>, 8)

    return { topIPs, topDecoys, topPaths, sevSummary: { critical, high, medium, low } }
  }, [events])

  const maxIp    = topIPs[0]?.count    ?? 1
  const maxDecoy = topDecoys[0]?.count ?? 1

  return (
    <div className="space-y-3">
      {/* Severity summary */}
      <div className="glass-card border border-hf-border/50 rounded-xl p-3">
        <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2">Live Severity</p>
        <div className="grid grid-cols-2 gap-2">
          {(['critical', 'high', 'medium', 'low'] as const).map((sev) => (
            <div key={sev} className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full shrink-0', SEV_DOT[sev])} />
              <span className="text-[10px] text-hf-dim capitalize flex-1">{sev}</span>
              <span className={cn(
                'text-xs font-bold',
                sev === 'critical' ? 'text-severity-critical' :
                sev === 'high'     ? 'text-severity-high'     :
                sev === 'medium'   ? 'text-severity-medium'   : 'text-severity-low'
              )}>
                {sevSummary[sev]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top source IPs */}
      <div className="glass-card border border-hf-border/50 rounded-xl p-3">
        <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <Globe className="w-3 h-3" /> Top Source IPs
        </p>
        <div className="space-y-1.5">
          {topIPs.map(({ ip, count, code, severity }) => (
            <div key={ip} className="flex items-center gap-2">
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', SEV_DOT[severity])} />
              <span className="font-mono text-[10px] text-hf-accent w-28 shrink-0 truncate">{ip}</span>
              <MiniBar count={count} max={maxIp} color={
                severity === 'critical' ? 'bg-severity-critical' :
                severity === 'high'     ? 'bg-severity-high'     :
                severity === 'medium'   ? 'bg-severity-medium'   : 'bg-severity-low'
              } />
              <span className="text-[10px] text-hf-dim w-6 text-right shrink-0">{count}</span>
              <span className="text-[9px] text-hf-dim w-5 shrink-0">{code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top targeted decoys */}
      <div className="glass-card border border-hf-border/50 rounded-xl p-3">
        <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <Server className="w-3 h-3" /> Top Attacked Decoys
        </p>
        <div className="space-y-1.5">
          {topDecoys.map(({ name, count }) => (
            <div key={name} className="flex items-center gap-2">
              <span className="text-[10px] text-hf-muted flex-1 truncate" title={name}>{name}</span>
              <MiniBar count={count} max={maxDecoy} color="bg-hf-primary" />
              <span className="text-[10px] text-hf-dim w-6 text-right shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top attack paths */}
      <div className="glass-card border border-hf-border/50 rounded-xl p-3">
        <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3" /> Top Attack Paths
        </p>
        <div className="space-y-1.5">
          {topPaths.map(({ key, count }) => {
            const [src, tgt] = key.split(' → ')
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-hf-accent truncate max-w-[80px]" title={src}>{src}</span>
                <ArrowRight className="w-2.5 h-2.5 text-hf-dim shrink-0" />
                <span className="text-[9px] text-hf-muted truncate flex-1" title={tgt}>{tgt}</span>
                <span className="text-[10px] font-bold text-hf-dim shrink-0">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
