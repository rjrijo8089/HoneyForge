import Link from 'next/link'
import { Plug, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IntegrationHealth } from '@/services/mock/data/dashboard'

interface IntegrationStatusProps {
  integrations: IntegrationHealth[]
}

const STATUS_STYLES = {
  connected:    { dot: 'bg-hf-success', text: 'text-hf-success',  badge: 'bg-hf-success/15 text-hf-success border-hf-success/30'  },
  error:        { dot: 'bg-hf-danger',  text: 'text-hf-danger',   badge: 'bg-hf-danger/15 text-hf-danger border-hf-danger/30'    },
  pending:      { dot: 'bg-hf-warning', text: 'text-hf-warning',  badge: 'bg-hf-warning/15 text-hf-warning border-hf-warning/30'  },
  disconnected: { dot: 'bg-hf-dim',     text: 'text-hf-muted',    badge: 'bg-hf-surface-3 text-hf-muted border-hf-border'         },
}

export function IntegrationStatus({ integrations }: IntegrationStatusProps) {
  const connected = integrations.filter((i) => i.status === 'connected').length

  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-hf-border/40">
        <div className="flex items-center gap-2">
          <Plug className="w-4 h-4 text-hf-muted" />
          <h3 className="text-sm font-semibold text-hf-text">Integrations</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-hf-success" />
          <span className="text-xs text-hf-muted">{connected}/{integrations.length} connected</span>
          <Link href="/integrations" className="text-[10px] text-hf-primary hover:underline ml-1">Manage →</Link>
        </div>
      </div>

      <div className="divide-y divide-hf-border/20">
        {integrations.map((integ) => {
          const meta = STATUS_STYLES[integ.status]
          return (
            <div key={integ.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hf-surface-2/40 transition-colors">
              {/* Status dot */}
              <span className={cn('w-2 h-2 rounded-full shrink-0', meta.dot)} />

              {/* Name + type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hf-text">{integ.name}</span>
                  <span className="text-[9px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1 rounded">
                    {integ.type}
                  </span>
                </div>
                <p className="text-[10px] text-hf-dim mt-0.5">
                  {integ.status === 'connected' && integ.lastSync ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {integ.lastSync}
                    </span>
                  ) : integ.status === 'error' ? (
                    <span className="flex items-center gap-1 text-hf-danger">
                      <AlertTriangle className="w-2.5 h-2.5" /> Connection failed
                    </span>
                  ) : integ.status === 'pending' ? 'Configuring…' : 'Disconnected'
                  }
                </p>
              </div>

              {/* Events/hour */}
              {integ.eventsHour > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-semibold text-hf-text">{integ.eventsHour.toLocaleString()}</p>
                  <p className="text-[9px] text-hf-dim">ev/h</p>
                </div>
              )}

              {/* Latency */}
              {integ.latencyMs != null && (
                <div className="text-right shrink-0">
                  <p className={cn('text-xs font-mono', integ.latencyMs > 200 ? 'text-hf-warning' : 'text-hf-success')}>
                    {integ.latencyMs}ms
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
