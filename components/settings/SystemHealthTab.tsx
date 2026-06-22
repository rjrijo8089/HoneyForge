import { cn } from '@/lib/utils'
import { TabCard, SectionHeader } from './shared'
import { CheckCircle2, AlertTriangle, XCircle, Activity, RefreshCw } from 'lucide-react'

type ServiceStatus = 'healthy' | 'degraded' | 'error'

interface Service {
  name:      string
  desc:      string
  status:    ServiceStatus
  uptime:    number
  heartbeat: string
  version:   string
  notes:     string | null
}

const SERVICES: Service[] = [
  { name: 'SNARE',      desc: 'Web application honeypot',            status: 'healthy',  uptime: 99.8, heartbeat: '2m ago',  version: 'v2.1.4',  notes: null },
  { name: 'TANNER',     desc: 'SNARE response evaluator',            status: 'healthy',  uptime: 99.9, heartbeat: '1m ago',  version: 'v0.9.3',  notes: null },
  { name: 'Cowrie',     desc: 'SSH / Telnet medium-interaction',     status: 'healthy',  uptime: 100,  heartbeat: '30s ago', version: 'v2.5.1',  notes: null },
  { name: 'Dionaea',    desc: 'Malware capture honeypot',            status: 'healthy',  uptime: 99.7, heartbeat: '3m ago',  version: 'v0.12.0', notes: null },
  { name: 'Suricata',   desc: 'Network IDS / IPS engine',            status: 'degraded', uptime: 98.1, heartbeat: '5m ago',  version: 'v7.0.3',  notes: 'High CPU load: 87% — consider reducing ruleset or scaling the sensor node' },
  { name: 'OpenSearch', desc: 'SIEM log storage & analytics',        status: 'healthy',  uptime: 99.9, heartbeat: '45s ago', version: 'v2.13.0', notes: null },
  { name: 'Vector',     desc: 'Log aggregation & routing pipeline',  status: 'healthy',  uptime: 99.5, heartbeat: '2m ago',  version: 'v0.38.0', notes: null },
  { name: 'Redis',      desc: 'Session cache & event queue',         status: 'healthy',  uptime: 100,  heartbeat: '15s ago', version: 'v7.2.4',  notes: null },
  { name: 'PostgreSQL', desc: 'Primary relational data store',       status: 'healthy',  uptime: 99.9, heartbeat: '1m ago',  version: 'v16.2',   notes: null },
]

const STATUS_META: Record<ServiceStatus, {
  Icon:  React.ComponentType<{className?: string}>
  label: string
  dot:   string
  badge: string
}> = {
  healthy:  { Icon: CheckCircle2,  label: 'Healthy',  dot: 'bg-hf-success', badge: 'text-hf-success border-hf-success/25 bg-hf-success/10'  },
  degraded: { Icon: AlertTriangle, label: 'Degraded', dot: 'bg-hf-warning', badge: 'text-hf-warning border-hf-warning/25 bg-hf-warning/10'  },
  error:    { Icon: XCircle,       label: 'Error',    dot: 'bg-hf-danger',  badge: 'text-hf-danger  border-hf-danger/25  bg-hf-danger/10'   },
}

function UptimeBar({ uptime }: { uptime: number }) {
  const color = uptime >= 99.5 ? '#22c55e' : uptime >= 95 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${uptime}%`, background: color }} />
      </div>
      <span className="text-[10px] font-mono text-hf-dim w-12">{uptime}%</span>
    </div>
  )
}

export function SystemHealthTab() {
  const healthy  = SERVICES.filter((s) => s.status === 'healthy').length
  const degraded = SERVICES.filter((s) => s.status === 'degraded').length
  const errored  = SERVICES.filter((s) => s.status === 'error').length

  return (
    <TabCard>
      {/* ── Summary bar ── */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="flex items-center gap-3 bg-hf-success/[0.06] border border-hf-success/20 rounded-xl px-3 py-2.5">
          <CheckCircle2 className="w-4 h-4 text-hf-success" />
          <div>
            <p className="text-lg font-bold text-hf-success tabular-nums">{healthy}</p>
            <p className="text-[10px] text-hf-dim">Healthy</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-hf-warning/[0.06] border border-hf-warning/20 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-hf-warning" />
          <div>
            <p className="text-lg font-bold text-hf-warning tabular-nums">{degraded}</p>
            <p className="text-[10px] text-hf-dim">Degraded</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-hf-danger/[0.06] border border-hf-danger/20 rounded-xl px-3 py-2.5">
          <XCircle className="w-4 h-4 text-hf-danger" />
          <div>
            <p className="text-lg font-bold text-hf-danger tabular-nums">{errored}</p>
            <p className="text-[10px] text-hf-dim">Error</p>
          </div>
        </div>
      </div>

      <SectionHeader title="Service Status" description="Live heartbeat from all platform components. Auto-refreshes every 30s." />

      <div className="overflow-x-auto -mx-1 mt-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-hf-border/40">
              {['Service', 'Status', 'Uptime', 'Last Heartbeat', 'Version', 'Notes'].map((h) => (
                <th key={h} className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hf-border/15">
            {SERVICES.map((svc) => {
              const meta = STATUS_META[svc.status]
              return (
                <tr key={svc.name} className="hover:bg-hf-surface-2/40 transition-colors">
                  {/* Service name */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('relative flex shrink-0')}>
                        <span className={cn('w-2 h-2 rounded-full', meta.dot)} />
                        {svc.status === 'healthy' && <span className={cn('absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-40', meta.dot)} />}
                      </div>
                      <div>
                        <p className="text-hf-text font-bold">{svc.name}</p>
                        <p className="text-[10px] text-hf-dim">{svc.desc}</p>
                      </div>
                    </div>
                  </td>
                  {/* Status badge */}
                  <td className="px-3 py-3">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', meta.badge)}>
                      <meta.Icon className="w-3 h-3" /> {meta.label}
                    </span>
                  </td>
                  {/* Uptime bar */}
                  <td className="px-3 py-3">
                    <UptimeBar uptime={svc.uptime} />
                  </td>
                  {/* Heartbeat */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-hf-muted">
                      <Activity className="w-3 h-3 text-hf-dim" />
                      {svc.heartbeat}
                    </div>
                  </td>
                  {/* Version */}
                  <td className="px-3 py-3">
                    <span className="font-mono text-[10px] text-hf-dim border border-hf-border/40 px-1.5 py-0.5 rounded">{svc.version}</span>
                  </td>
                  {/* Notes */}
                  <td className="px-3 py-3 max-w-[240px]">
                    {svc.notes
                      ? <span className="text-[10px] text-hf-warning leading-snug">{svc.notes}</span>
                      : <span className="text-[10px] text-hf-dim/40">—</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 pt-3 mt-1 border-t border-hf-border/30">
        <RefreshCw className="w-3.5 h-3.5 text-hf-dim" />
        <p className="text-xs text-hf-dim">Data is mock — real heartbeats require service integration. Last simulated check: just now.</p>
      </div>
    </TabCard>
  )
}
