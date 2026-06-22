'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface SeverityItem {
  name: string
  value: number
  color: string
}

interface SeverityDonutProps {
  data: SeverityItem[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="glass-card rounded-lg px-3 py-2 border border-hf-border/60 text-xs">
      <span className="font-semibold text-hf-text">{d.name}:</span>{' '}
      <span className="font-mono text-hf-muted">{d.value}</span>
    </div>
  )
}

export function SeverityDonut({ data }: SeverityDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50 flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-hf-text">Severity Distribution</h3>
        <p className="text-xs text-hf-muted mt-0.5">Today — {total.toLocaleString()} total events</p>
      </div>

      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={200}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-hf-text tabular-nums">{total.toLocaleString()}</p>
          <p className="text-[10px] text-hf-dim uppercase tracking-wider mt-0.5">Events</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
          return (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-hf-muted flex-1 truncate">{item.name}</span>
              <span className="text-xs font-mono font-semibold text-hf-text">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
