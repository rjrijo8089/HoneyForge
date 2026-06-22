'use client'
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface PieDataItem {
  name: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieDataItem[]
  height?: number
  innerRadius?: number
  showLegend?: boolean
}

export function PieChart({ data, height = 240, innerRadius = 60, showLegend }: PieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 40}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} opacity={0.9} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#0f1524', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
          formatter={(value, name) => [
            `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
            String(name),
          ]}
          itemStyle={{ color: '#e2e8f0' }}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: '#8b9cb8', paddingTop: 8 }}
          />
        )}
      </RechartsPie>
    </ResponsiveContainer>
  )
}
