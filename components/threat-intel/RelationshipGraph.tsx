'use client'
import { useState } from 'react'
import type { IOC } from '@/types/threat-intel'

interface RelationshipGraphProps {
  ioc: IOC
  allIOCs: IOC[]
  onNavigate: (ioc: IOC) => void
}

const TYPE_COLORS: Record<string, string> = {
  ip:           '#3b82f6',
  domain:       '#06b6d4',
  url:          '#f59e0b',
  'file-hash':  '#a78bfa',
  'user-agent': '#8b9cb8',
  payload:      '#fb923c',
  cve:          '#ef4444',
  email:        '#ec4899',
}

export function RelationshipGraph({ ioc, allIOCs, onNavigate }: RelationshipGraphProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const related = ioc.relatedIocs
    .map((id) => allIOCs.find((i) => i.id === id))
    .filter((i): i is IOC => i !== undefined)
    .slice(0, 8)

  const W = 500
  const H = 300
  const CX = W / 2
  const CY = H / 2
  const R_INNER = 42
  const R_OUTER = 105

  const nodes = related.map((rel, idx) => {
    const angle = (idx / related.length) * 2 * Math.PI - Math.PI / 2
    return {
      ioc: rel,
      x: CX + Math.cos(angle) * R_OUTER,
      y: CY + Math.sin(angle) * R_OUTER,
    }
  })

  const truncValue = (v: string) => v.length > 20 ? v.slice(0, 18) + '…' : v

  return (
    <div className="rounded-xl border border-hf-border/40 bg-hf-bg-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hf-border/30 bg-hf-surface-2/30">
        <p className="text-xs font-semibold text-hf-text">IOC Relationship Graph</p>
        <p className="text-[10px] text-hf-dim">{related.length} connected node{related.length !== 1 ? 's' : ''}</p>
      </div>

      {related.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-xs text-hf-dim">
          No related indicators found
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 300 }}>
          {/* Grid dots */}
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 20 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 28} cy={row * 28} r={0.8} fill="#1e2d45" />
            ))
          )}

          {/* Connection lines */}
          {nodes.map(({ ioc: rel, x, y }) => (
            <line
              key={`line-${rel.id}`}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke={hovered === rel.id ? TYPE_COLORS[rel.type] : '#1e2d45'}
              strokeWidth={hovered === rel.id ? 1.5 : 1}
              strokeDasharray={hovered === rel.id ? undefined : '4 3'}
              className="transition-all duration-200"
            />
          ))}

          {/* Outer nodes */}
          {nodes.map(({ ioc: rel, x, y }) => {
            const color = TYPE_COLORS[rel.type] ?? '#8b9cb8'
            const isHov = hovered === rel.id
            return (
              <g
                key={rel.id}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(rel.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onNavigate(rel)}
              >
                {/* Glow ring on hover */}
                {isHov && (
                  <circle cx={x} cy={y} r={20} fill={color} fillOpacity={0.08} />
                )}
                {/* Node circle */}
                <circle
                  cx={x} cy={y} r={14}
                  fill="#141c2e"
                  stroke={color}
                  strokeWidth={isHov ? 2 : 1}
                  className="transition-all duration-150"
                />
                {/* Type initial */}
                <text
                  x={x} y={y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fontWeight="bold" fill={color}
                >
                  {rel.type === 'file-hash' ? '#' : rel.type === 'user-agent' ? 'UA' : rel.type.slice(0, 2).toUpperCase()}
                </text>
                {/* Label below */}
                <text
                  x={x} y={y + 22}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fill={isHov ? '#e2e8f0' : '#4a5777'}
                  className="transition-colors duration-150"
                >
                  {truncValue(rel.value)}
                </text>
                {/* Severity dot */}
                <circle
                  cx={x + 11} cy={y - 11} r={4}
                  fill={rel.severity === 'critical' ? '#dc2626' : rel.severity === 'high' ? '#ea580c' : '#d97706'}
                  stroke="#0b0f1a" strokeWidth={1}
                />
              </g>
            )
          })}

          {/* Center node — the current IOC */}
          <circle cx={CX} cy={CY} r={R_INNER} fill="#0f1524" stroke={TYPE_COLORS[ioc.type] ?? '#3b82f6'} strokeWidth={2} />
          <circle cx={CX} cy={CY} r={R_INNER + 6} fill="none" stroke={TYPE_COLORS[ioc.type] ?? '#3b82f6'} strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={CX} y={CY - 10} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="bold" fill={TYPE_COLORS[ioc.type] ?? '#3b82f6'}>
            {ioc.type.toUpperCase()}
          </text>
          <text x={CX} y={CY + 4} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="#e2e8f0">
            {truncValue(ioc.value)}
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#8b9cb8">
            {ioc.hitCount} hits
          </text>
        </svg>
      )}

      {/* Hover tooltip */}
      {hovered && (() => {
        const h = allIOCs.find((i) => i.id === hovered)
        if (!h) return null
        return (
          <div className="px-4 py-2 border-t border-hf-border/30 bg-hf-surface-2/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-hf-text truncate max-w-xs">{h.value}</p>
              <p className="text-[10px] text-hf-dim">{h.type} · {h.severity} · {h.hitCount} hits</p>
            </div>
            <span className="text-[9px] text-hf-primary">Click to view →</span>
          </div>
        )
      })()}
    </div>
  )
}
