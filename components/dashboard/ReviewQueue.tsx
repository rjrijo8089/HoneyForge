import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { formatDate } from '@/lib/utils'
import type { ThreatEvent } from '@/types'

interface ReviewQueueProps {
  events: ThreatEvent[]
}

export function ReviewQueue({ events }: ReviewQueueProps) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-hf-border/40">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-hf-muted" />
          <h3 className="text-sm font-semibold text-hf-text">Review Queue</h3>
          <span className="text-[10px] font-bold bg-hf-warning/20 text-hf-warning border border-hf-warning/30 rounded-full px-1.5 py-0.5">
            {events.length}
          </span>
        </div>
        <Link href="/review-queue" className="text-xs text-hf-primary hover:underline">Review →</Link>
      </div>

      <div className="divide-y divide-hf-border/20 max-h-[280px] overflow-y-auto">
        {events.slice(0, 6).map((event) => (
          <div key={event.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hf-surface-2/50 transition-colors">
            <SeverityBadge severity={event.severity} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-hf-text truncate">{event.title}</p>
              <p className="text-[10px] text-hf-dim mt-0.5 font-mono">{event.sourceIp}</p>
            </div>
            <span className="text-[10px] text-hf-dim shrink-0">{formatDate(event.timestamp, 'relative')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
