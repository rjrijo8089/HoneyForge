import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { ThreatEvent } from '@/types'

interface RecentAttacksProps {
  events: ThreatEvent[]
}

export function RecentAttacks({ events }: RecentAttacksProps) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-hf-border/40">
        <div>
          <h3 className="text-sm font-semibold text-hf-text">Recent Attacks</h3>
          <p className="text-xs text-hf-muted mt-0.5">Latest honeypot interactions</p>
        </div>
        <Link
          href="/threat-intel"
          className="flex items-center gap-1 text-xs text-hf-primary hover:underline"
        >
          View all <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-hf-border/30">
              {['Severity', 'Attack', 'Source', 'Target', 'Type', 'Status', 'Time'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-medium text-hf-dim uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-hf-border/20 hover:bg-hf-surface-2/50 transition-colors group"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <SeverityBadge severity={event.severity} />
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <p className="text-hf-text font-medium truncate">{event.title}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-hf-muted">{event.sourceIp}</span>
                    {event.countryCode && (
                      <span className="text-[9px] font-bold text-hf-dim bg-hf-surface-3 border border-hf-border/40 px-1 rounded">
                        {event.countryCode}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-hf-muted">{event.targetDecoyName}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-hf-accent">{event.attackType}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={event.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-hf-dim">{formatDate(event.timestamp, 'relative')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
