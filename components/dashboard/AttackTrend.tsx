'use client'
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { HourlyTrend } from '@/services/mock/data/dashboard'

interface AttackTrendProps {
  data: HourlyTrend[]
}

interface TooltipPayloadEntry { value?: number; dataKey?: string; color?: string }

const SERIES = [
  { key: 'critical', label: 'Critical', color: '#dc2626', fillOpacity: 0.18 },
  { key: 'high',     label: 'High',     color: '#ea580c', fillOpacity: 0.14 },
  { key: 'medium',   label: 'Medium',   color: '#d97706', fillOpacity: 0.10 },
  { key: 'low',      label: 'Low',      color: '#16a34a', fillOpacity: 0.07 },
]

const TICK = { fill: '#4a5777', fontSize: 10 }
const GRID = '#1a2438'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p) => s + (p.value ?? 0), 0)
  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-hf-border/60 shadow-2xl">
      <p className="text-xs font-semibold text-hf-text mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-hf-muted capitalize">{p.dataKey}</span>
          </span>
          <span className="font-mono font-semibold text-hf-text">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-hf-border/40 mt-2 pt-2 flex justify-between text-xs">
        <span className="text-hf-dim">Total</span>
        <span className="font-mono font-bold text-hf-text">{total}</span>
      </div>
    </div>
  )
}

export function AttackTrend({ data }: AttackTrendProps) {
  const currentHour = `${new Date().getHours().toString().padStart(2, '0')}:00`

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-hf-text">Attack Trend — Last 24h</h3>
          <p className="text-xs text-hf-muted mt-0.5">Hourly severity breakdown across all decoys</p>
        </div>
        <div className="flex items-center gap-3">
          {SERIES.map((s) => (
            <span key={s.key} className="hidden sm:flex items-center gap-1.5 text-[10px] text-hf-dim">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="capitalize">{s.label}</span>
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity={s.fillOpacity * 2} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={TICK} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e2d45', strokeWidth: 1 }} />
          <ReferenceLine x={currentHour} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.5} />
          {SERIES.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={1.5}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 3, fill: s.color, stroke: '#0f1524', strokeWidth: 2 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
