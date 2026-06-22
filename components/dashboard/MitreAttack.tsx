import { cn } from '@/lib/utils'
import type { MitreTechniqueItem } from '@/services/mock/data/dashboard'

interface MitreAttackProps {
  data: MitreTechniqueItem[]
}

export function MitreAttack({ data }: MitreAttackProps) {
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-hf-text">MITRE ATT&CK® Technique Distribution</h3>
          <p className="text-xs text-hf-muted mt-0.5">Top techniques observed across all honeypot events</p>
        </div>
        <a
          href="/detection-rules"
          className="text-xs text-hf-primary hover:underline shrink-0 ml-4"
        >
          View rules →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((tech, i) => {
          const barPct = (tech.count / maxCount) * 100
          return (
            <div
              key={tech.id}
              className={cn(
                'rounded-xl p-4 border border-hf-border/40 bg-hf-surface-2/50 hover:bg-hf-surface-2 transition-colors',
                'group cursor-default'
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Tactic badge */}
              <div className="flex items-start justify-between mb-2">
                <span className={cn('text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider', tech.tacticClass)}>
                  {tech.tactic}
                </span>
                <span className="font-mono text-[10px] text-hf-dim">{tech.id}</span>
              </div>

              {/* Name */}
              <p className="text-xs font-semibold text-hf-text mb-3 leading-snug">{tech.name}</p>

              {/* Count + bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold tabular-nums" style={{ color: tech.color }}>
                    {tech.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-hf-dim">hits</span>
                </div>
                <div className="h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${barPct}%`,
                      background: `linear-gradient(90deg, ${tech.color}, ${tech.color}70)`,
                      boxShadow: `0 0 8px ${tech.color}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
