import { cn } from '@/lib/utils'
import type { AttackTypeItem } from '@/services/mock/data/dashboard'

interface AttackTypeBarProps {
  data: AttackTypeItem[]
}

export function AttackTypeBar({ data }: AttackTypeBarProps) {
  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-hf-text">Attack Types</h3>
        <p className="text-xs text-hf-muted mt-0.5">Top vectors by frequency</p>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.count / max) * 100
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-hf-muted truncate flex-1">{item.name}</span>
                <span
                  className="text-xs font-mono font-semibold tabular-nums shrink-0"
                  style={{ color: item.color }}
                >
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', item.barClass)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
