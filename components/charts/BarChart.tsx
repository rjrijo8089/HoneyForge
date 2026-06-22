'use client'
import {
  BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface BarSeries {
  key: string
  label: string
  color: string
}

interface BarChartProps {
  data: Record<string, string | number>[]
  series: BarSeries[]
  xKey: string
  height?: number
  stacked?: boolean
  showLegend?: boolean
  radius?: number
}

const TICK_STYLE = { fill: '#8b9cb8', fontSize: 11 }
const GRID_COLOR = '#1e2d45'

export function BarChart({
  data, series, xKey, height = 240, stacked, showLegend, radius = 3,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0f1524', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ color: '#8b9cb8' }}
          cursor={{ fill: 'rgba(30,45,69,0.4)' }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: '#8b9cb8', paddingTop: 8 }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            stackId={stacked ? 'stack' : undefined}
            radius={i === series.length - 1 || !stacked ? [radius, radius, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={40}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  )
}
