'use client'
import { Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MitreTechniqueEntry, Severity } from '@/types/ai-intelligence'
import { groupByTactic } from '@/services/ai/mitreMappingService'

const SEV_STYLE: Record<Severity, string> = {
  critical: 'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  high:     'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  medium:   'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low:      'text-hf-success border-hf-success/30 bg-hf-success/10',
}

const TACTIC_ORDER = [
  'Reconnaissance', 'Initial Access', 'Execution', 'Persistence',
  'Credential Access', 'Collection', 'Command and Control', 'Impact',
  'Exfiltration', 'Lateral Movement', 'Defense Evasion', 'Discovery',
]

function TechniqueCard({ t }: { t: MitreTechniqueEntry }) {
  return (
    <div className={cn(
      'rounded-xl border p-3 space-y-2',
      t.severity === 'critical' ? 'border-hf-danger/30 bg-hf-danger/[0.04]' :
      t.severity === 'high'     ? 'border-hf-warning/20 bg-hf-warning/[0.03]' :
      'border-hf-border/60 bg-hf-surface/40'
    )}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold text-hf-primary">{t.id}</span>
        <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase', SEV_STYLE[t.severity])}>
          {t.severity}
        </span>
      </div>
      <p className="text-[11px] font-semibold text-hf-text leading-snug">{t.name}</p>
      <p className="text-[10px] text-hf-dim leading-relaxed line-clamp-2">{t.description}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-hf-muted">
          <span className="font-bold text-hf-text">{t.eventCount}</span> events
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {t.decoys.slice(0, 2).map((d) => (
            <span key={d} className="text-[8px] px-1.5 py-0.5 rounded bg-hf-surface-3 border border-hf-border/30 text-hf-dim">{d}</span>
          ))}
          {t.decoys.length > 2 && <span className="text-[8px] text-hf-dim">+{t.decoys.length - 2}</span>}
        </div>
      </div>
    </div>
  )
}

export function MitreSection({ techniques }: { techniques: MitreTechniqueEntry[] }) {
  const byTactic = groupByTactic(techniques)
  const totalEvents = techniques.reduce((s, t) => s + t.eventCount, 0)

  const tacticsPresent = TACTIC_ORDER.filter((t) => byTactic[t])
  const tacticOthers   = Object.keys(byTactic).filter((t) => !TACTIC_ORDER.includes(t))
  const orderedTactics = [...tacticsPresent, ...tacticOthers]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Crosshair className="w-4 h-4 text-hf-primary" />
        <h3 className="text-sm font-bold text-hf-text">MITRE ATT&CK Coverage</h3>
        <span className="text-[10px] text-hf-dim">{techniques.length} techniques · {totalEvents.toLocaleString()} events</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tactics observed',    value: orderedTactics.length },
          { label: 'Techniques detected', value: techniques.length     },
          { label: 'Total events mapped', value: totalEvents.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card rounded-xl border border-hf-border px-4 py-3 text-center">
            <p className="text-xl font-bold text-hf-text tabular-nums">{value}</p>
            <p className="text-[10px] text-hf-dim">{label}</p>
          </div>
        ))}
      </div>

      {/* Tactic groups */}
      {orderedTactics.map((tactic) => {
        const techs = byTactic[tactic] ?? []
        return (
          <div key={tactic}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-hf-border/30" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-hf-dim px-2">{tactic}</span>
              <span className="text-[9px] text-hf-dim">{techs.length} technique{techs.length !== 1 ? 's' : ''}</span>
              <div className="h-px flex-1 bg-hf-border/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {techs.map((t) => <TechniqueCard key={t.id} t={t} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
