'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MITRE_TACTICS } from '@/services/mock/data/threatIntel'
import type { MitreTechnique } from '@/types/threat-intel'
import type { ThreatSeverity } from '@/types'

const SEV_COLOR: Record<ThreatSeverity, string> = {
  critical: 'bg-severity-critical/80',
  high:     'bg-severity-high/70',
  medium:   'bg-severity-medium/60',
  low:      'bg-severity-low/50',
  info:     'bg-severity-info/50',
}

const SEV_TEXT: Record<ThreatSeverity, string> = {
  critical: 'text-severity-critical',
  high:     'text-severity-high',
  medium:   'text-severity-medium',
  low:      'text-severity-low',
  info:     'text-severity-info',
}

interface TechniqueCardProps {
  tech: MitreTechnique
  active: boolean
  onClick: () => void
}

function TechniqueCard({ tech, active, onClick }: TechniqueCardProps) {
  const intensity = Math.min(tech.hitCount / 600, 1)
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-lg border text-left transition-all group overflow-hidden',
        active
          ? 'border-hf-primary/60 bg-hf-primary/10'
          : 'border-hf-border/40 hover:border-hf-border-2 hover:bg-hf-surface-2/60'
      )}
    >
      {/* Heat fill */}
      {!active && (
        <div
          className={cn('absolute inset-0 rounded-lg opacity-20 transition-opacity', SEV_COLOR[tech.severity])}
          style={{ opacity: intensity * 0.35 }}
        />
      )}
      <p className="text-[9px] font-mono text-hf-dim relative z-10">{tech.id}</p>
      <p className={cn('text-[10px] font-semibold truncate relative z-10 mt-0.5', active ? 'text-hf-primary' : 'text-hf-text')}>{tech.name}</p>
      <div className="flex items-center gap-1.5 mt-1.5 relative z-10">
        <div className="flex-1 h-0.5 bg-hf-surface-3 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', SEV_COLOR[tech.severity])} style={{ width: `${Math.min(tech.hitCount / 15, 100)}%` }} />
        </div>
        <span className={cn('text-[9px] font-bold tabular-nums', SEV_TEXT[tech.severity])}>{tech.hitCount}</span>
      </div>
    </button>
  )
}

export function MitrePanel() {
  const [selected, setSelected] = useState<MitreTechnique | null>(null)

  const allTechs = MITRE_TACTICS.flatMap((t) => t.techniques)
  const totalHits = allTechs.reduce((s, t) => s + t.hitCount, 0)
  const topTech = [...allTechs].sort((a, b) => b.hitCount - a.hitCount)[0]

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tactics Observed',    value: MITRE_TACTICS.length },
          { label: 'Techniques Observed', value: allTechs.length },
          { label: 'Total Technique Hits',value: totalHits.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card border border-hf-border/40 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-hf-text tabular-nums">{value}</p>
            <p className="text-[10px] text-hf-dim mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Top technique callout */}
      {topTech && (
        <div className="flex items-center gap-3 rounded-xl border border-hf-danger/30 bg-hf-danger/5 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-hf-danger/20 border border-hf-danger/30 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-black text-hf-danger">{topTech.id}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-hf-text">Most Active: {topTech.name}</p>
            <p className="text-[10px] text-hf-dim">{topTech.hitCount} hits across {topTech.iocIds.length} indicators</p>
          </div>
          <span className={cn('shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border', SEV_TEXT[topTech.severity], SEV_COLOR[topTech.severity].replace('bg-', 'bg-').replace('/80', '/10') + ' border-severity-' + topTech.severity + '/30')}>
            {topTech.severity.toUpperCase()}
          </span>
        </div>
      )}

      {/* Tactic columns */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {MITRE_TACTICS.map((tactic) => (
          <div key={tactic.id} className="glass-card border border-hf-border/40 rounded-2xl overflow-hidden">
            {/* Tactic header */}
            <div className="px-3 py-2 border-b border-hf-border/30" style={{ background: `${tactic.color}15` }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: tactic.color }} />
                <p className="text-[10px] font-bold text-hf-text">{tactic.name}</p>
              </div>
              <p className="text-[9px] font-mono text-hf-dim mt-0.5">{tactic.id}</p>
            </div>

            {/* Techniques */}
            <div className="p-2 space-y-1">
              {tactic.techniques.map((tech) => (
                <TechniqueCard
                  key={tech.id}
                  tech={tech}
                  active={selected?.id === tech.id}
                  onClick={() => setSelected(selected?.id === tech.id ? null : tech)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected technique detail */}
      {selected && (
        <div className="glass-card border border-hf-border/40 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-hf-primary font-bold">{selected.id}</span>
                <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border', SEV_TEXT[selected.severity])}>
                  {selected.severity.toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-hf-text mt-1">{selected.name}</h3>
              <p className="text-xs text-hf-muted mt-0.5">{selected.tactic}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-black text-hf-text tabular-nums">{selected.hitCount}</p>
              <p className="text-[10px] text-hf-dim">total hits</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-hf-border/30">
            <p className="text-[10px] text-hf-dim mb-2 uppercase tracking-wider">Linked IOCs ({selected.iocIds.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.iocIds.map((id) => (
                <span key={id} className="text-[10px] font-mono text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-0.5 rounded">
                  {id}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
