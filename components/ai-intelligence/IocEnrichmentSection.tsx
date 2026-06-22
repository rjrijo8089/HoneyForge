'use client'
import { Database, CheckCircle2, XCircle, Clock, HelpCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EnrichedIOC, FeedStatus, FeedName, Disposition } from '@/types/ai-intelligence'

const FEED_ORDER: FeedName[] = ['AbuseIPDB', 'GreyNoise', 'VirusTotal', 'OTX', 'MISP', 'URLhaus', 'CISA_KEV', 'NVD']

const FEED_SHORT: Record<FeedName, string> = {
  AbuseIPDB: 'Abuse', GreyNoise: 'Grey', VirusTotal: 'VT',
  OTX: 'OTX', MISP: 'MISP', URLhaus: 'URL', CISA_KEV: 'CISA', NVD: 'NVD',
}

const STATUS_ICON: Record<FeedStatus, React.ComponentType<{className?: string}>> = {
  hit:         CheckCircle2,
  miss:        XCircle,
  pending:     Clock,
  error:       AlertTriangle,
  not_queried: HelpCircle,
}

const STATUS_COLOR: Record<FeedStatus, string> = {
  hit:         'text-hf-success',
  miss:        'text-hf-surface-3',
  pending:     'text-hf-warning',
  error:       'text-hf-danger',
  not_queried: 'text-hf-border',
}

const DISPOSITION_STYLE: Record<Disposition, string> = {
  malicious:   'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  suspicious:  'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  benign:      'text-hf-success border-hf-success/30 bg-hf-success/10',
  unknown:     'text-hf-dim border-hf-border/40 bg-transparent',
}

const TYPE_COLOR: Record<string, string> = {
  ip: 'text-blue-400', domain: 'text-purple-400', url: 'text-amber-400',
  hash: 'text-hf-primary', email: 'text-hf-muted',
}

function FeedDot({ status, feedName }: { status: FeedStatus; feedName: FeedName }) {
  const Icon = STATUS_ICON[status]
  return (
    <div className="flex flex-col items-center gap-0.5" title={`${feedName}: ${status}`}>
      <Icon className={cn('w-3.5 h-3.5', STATUS_COLOR[status])} />
      <span className="text-[8px] text-hf-dim">{FEED_SHORT[feedName]}</span>
    </div>
  )
}

/* ── Feed legend ── */
function FeedLegend() {
  return (
    <div className="flex items-center gap-4 flex-wrap text-[10px] text-hf-dim">
      {([
        ['hit',         'Hit',         'text-hf-success'],
        ['miss',        'Miss',        'text-hf-surface-3'],
        ['pending',     'Pending',     'text-hf-warning'],
        ['not_queried', 'N/A',         'text-hf-border'],
      ] as const).map(([status, label, color]) => {
        const Icon = STATUS_ICON[status]
        return (
          <span key={status} className="flex items-center gap-1">
            <Icon className={cn('w-3 h-3', color)} /> {label}
          </span>
        )
      })}
    </div>
  )
}

export function IocEnrichmentSection({ iocs }: { iocs: EnrichedIOC[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-hf-primary" />
          <h3 className="text-sm font-bold text-hf-text">IOC Enrichment Centre</h3>
          <span className="text-[10px] text-hf-dim">{iocs.length} indicators enriched</span>
        </div>
        <FeedLegend />
      </div>

      <div className="glass-card rounded-2xl border border-hf-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-hf-border/40">
              <tr>
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">IOC</th>
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">Disposition</th>
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-right">Threat Score</th>
                {FEED_ORDER.map((f) => (
                  <th key={f} className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-2 py-2.5 text-center">{FEED_SHORT[f]}</th>
                ))}
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hf-border/10">
              {iocs.map((ioc) => {
                const feedMap = Object.fromEntries(ioc.feedResults.map((r) => [r.feed, r]))
                return (
                  <tr key={ioc.id} className="hover:bg-hf-surface-2/30 transition-colors">
                    <td className="px-3 py-3 max-w-[180px]">
                      <div>
                        <span className={cn('text-[9px] font-bold uppercase tracking-wider mr-1.5', TYPE_COLOR[ioc.type])}>
                          {ioc.type}
                        </span>
                        <p className="font-mono text-[10px] text-hf-text truncate">{ioc.value}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border', DISPOSITION_STYLE[ioc.disposition])}>
                        {ioc.disposition}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={cn(
                        'text-sm font-bold tabular-nums',
                        ioc.threatScore >= 90 ? 'text-hf-danger' : ioc.threatScore >= 70 ? 'text-hf-warning' : 'text-hf-success'
                      )}>
                        {ioc.threatScore}
                      </span>
                    </td>
                    {FEED_ORDER.map((feedName) => {
                      const r = feedMap[feedName]
                      return (
                        <td key={feedName} className="px-2 py-3">
                          <div className="flex justify-center">
                            {r ? <FeedDot status={r.status} feedName={feedName} /> : <HelpCircle className="w-3.5 h-3.5 text-hf-border" />}
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-3 py-3">
                      <div className="flex gap-1 flex-wrap max-w-[120px]">
                        {ioc.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-hf-surface-3 border border-hf-border/30 text-hf-dim">{t}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
