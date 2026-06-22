'use client'
import {
  AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface AreaSeries {
  key: string
  label: string
  color: string
}

interface AreaChartProps {
  data: Record<string, string | number>[]
  series: AreaSeries[]
  xKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

const TICK_STYLE = { fill: '#8b9cb8', fontSize: 11 }
const GRID_COLOR = '#1e2d45'

export function AreaChart({ data, series, xKey, height = 260, showGrid = true, showLegend }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        {showGrid && <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />}
        <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0f1524', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ color: '#8b9cb8' }}
          cursor={{ stroke: '#1e2d45' }}
        />
        {showLegend && (
          <Legend wrapperStyle={{ fontSize: 12, color: '#8b9cb8', paddingTop: 8 }} />
        )}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.08}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: s.color, stroke: '#0f1524', strokeWidth: 2 }}
          />
        ))}
      </RechartsArea>
    </ResponsiveContainer>
  )
}
