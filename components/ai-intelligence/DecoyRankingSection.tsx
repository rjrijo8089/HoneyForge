'use client'
import { Shield, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { DecoyRiskScore, BusinessImpact } from '@/types/ai-intelligence'

const IMPACT_STYLE: Record<BusinessImpact, string> = {
  critical: 'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  high:     'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  medium:   'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low:      'text-hf-success border-hf-success/30 bg-hf-success/10',
}

function ScoreBar({ score }: { score: number }) {
  const pct   = Math.min(100, (score / 900) * 100)
  const color = score >= 700 ? '#ef4444' : score >= 400 ? '#f59e0b' : '#3b82f6'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-hf-surface-3 rounded-full overflow-hidden shrink-0">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

type SortKey = 'rank' | 'riskScore' | 'criticalEvents' | 'malwareAttempts' | 'credentialAttempts'

function Th({ col, label, sortKey, onSort }: {
  col: SortKey
  label: string
  sortKey: SortKey
  onSort: (key: SortKey) => void
}) {
  return (
    <th
      onClick={() => onSort(col)}
      className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap cursor-pointer hover:text-hf-muted select-none"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn('w-2.5 h-2.5', sortKey === col ? 'text-hf-primary' : 'opacity-30')} />
      </span>
    </th>
  )
}

export function DecoyRankingSection({ scores }: { scores: DecoyRiskScore[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...scores].sort((a, b) => {
    const av = a[sortKey] as number, bv = b[sortKey] as number
    return sortDir === 'asc' ? av - bv : bv - av
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(key === 'rank' ? 'asc' : 'desc') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-hf-warning" />
          <h3 className="text-sm font-bold text-hf-text">Decoy Priority Ranking</h3>
        </div>
        <div className="text-right text-[10px] text-hf-dim max-w-xs">
          <p className="font-mono">Risk = Crit×25 + High×15 + Malware×20 + Cred×10 + Activity + Criticality + Exposure</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-hf-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-hf-border/40">
              <tr>
                <Th col="rank"               label="Rank"        sortKey={sortKey} onSort={toggleSort} />
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">Decoy</th>
                <Th col="riskScore"          label="Risk Score"  sortKey={sortKey} onSort={toggleSort} />
                <Th col="criticalEvents"     label="Critical"    sortKey={sortKey} onSort={toggleSort} />
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap">High</th>
                <Th col="malwareAttempts"    label="Malware"     sortKey={sortKey} onSort={toggleSort} />
                <Th col="credentialAttempts" label="Credentials" sortKey={sortKey} onSort={toggleSort} />
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap">Business Impact</th>
                <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap">Last Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hf-border/10">
              {sorted.map((d) => (
                <tr key={d.decoyId} className={cn(
                  'hover:bg-hf-surface-2/30 transition-colors',
                  d.rank <= 3 ? 'border-l-2 border-l-hf-danger' : ''
                )}>
                  <td className="px-3 py-3">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black',
                      d.rank === 1 ? 'bg-hf-danger/20 text-hf-danger' :
                      d.rank === 2 ? 'bg-hf-warning/20 text-hf-warning' :
                      d.rank === 3 ? 'bg-amber-400/20 text-amber-400' :
                      'bg-hf-surface-3 text-hf-dim'
                    )}>
                      {d.rank}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-hf-text">{d.decoyName}</p>
                    <p className="text-[10px] text-hf-dim">{d.decoyType}</p>
                  </td>
                  <td className="px-3 py-3"><ScoreBar score={d.riskScore} /></td>
                  <td className="px-3 py-3 text-hf-danger font-bold tabular-nums">{d.criticalEvents || '—'}</td>
                  <td className="px-3 py-3 text-hf-warning tabular-nums">{d.highEvents}</td>
                  <td className="px-3 py-3 text-purple-400 tabular-nums">{d.malwareAttempts || '—'}</td>
                  <td className="px-3 py-3 text-blue-400 tabular-nums">{d.credentialAttempts || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border', IMPACT_STYLE[d.businessImpact])}>
                      {d.businessImpact}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-[10px] text-hf-dim">{d.lastEvent.slice(5, 16).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
