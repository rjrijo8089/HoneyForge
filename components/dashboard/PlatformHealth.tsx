import { cn } from '@/lib/utils'
import type { PlatformService } from '@/services/mock/data/dashboard'

interface PlatformHealthProps {
  services: PlatformService[]
}

const STATUS_META = {
  healthy: { dot: 'bg-hf-success', pulse: 'bg-hf-success', label: 'Healthy', text: 'text-hf-success' },
  warning: { dot: 'bg-hf-warning', pulse: 'bg-hf-warning', label: 'Warning', text: 'text-hf-warning' },
  offline: { dot: 'bg-hf-danger',  pulse: 'bg-hf-danger',  label: 'Offline', text: 'text-hf-danger'  },
}

export function PlatformHealth({ services }: PlatformHealthProps) {
  const allHealthy  = services.every((s) => s.status === 'healthy')
  const anyOffline  = services.some((s) => s.status === 'offline')
  const overallStatus = anyOffline ? 'offline' : allHealthy ? 'healthy' : 'warning'
  const overallLabel  = anyOffline ? 'Degraded' : allHealthy ? 'All Systems Go' : 'Warning'

  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-hf-border/40">
        <h3 className="text-sm font-semibold text-hf-text">Platform Health</h3>
        <div className="flex items-center gap-1.5">
          <span className="relative w-2 h-2">
            <span className={cn('absolute inset-0 rounded-full', STATUS_META[overallStatus].dot)} />
            {overallStatus === 'healthy' && (
              <span className={cn('absolute inset-0 rounded-full animate-ping opacity-50', STATUS_META[overallStatus].pulse)} />
            )}
          </span>
          <span className={cn('text-xs font-semibold', STATUS_META[overallStatus].text)}>
            {overallLabel}
          </span>
        </div>
      </div>

      {/* Service list */}
      <div className="divide-y divide-hf-border/20">
        {services.map((svc) => {
          const meta = STATUS_META[svc.status]
          const cpuBarColor = svc.cpu > 80 ? '#ef4444' : svc.cpu > 60 ? '#f59e0b' : '#10b981'
          const memBarColor = svc.memory > 80 ? '#ef4444' : svc.memory > 60 ? '#f59e0b' : '#3b82f6'

          return (
            <div key={svc.name} className="px-4 py-2.5 hover:bg-hf-surface-2/40 transition-colors">
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span className="relative w-2 h-2 shrink-0">
                  <span className={cn('absolute inset-0 rounded-full', meta.dot)} />
                  {svc.status === 'healthy' && (
                    <span className={cn('absolute inset-0 rounded-full animate-ping opacity-40', meta.pulse)} />
                  )}
                </span>

                {/* Name + events */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-hf-text">{svc.name}</span>
                    <span className="text-[10px] font-mono text-hf-dim shrink-0 ml-2">
                      {svc.eventsPerMin.toLocaleString()}/min
                    </span>
                  </div>
                  {/* CPU + Memory bars */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between text-[9px] text-hf-dim">
                        <span>CPU</span><span>{svc.cpu}%</span>
                      </div>
                      <div className="h-1 bg-hf-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${svc.cpu}%`, background: cpuBarColor, boxShadow: `0 0 4px ${cpuBarColor}60` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between text-[9px] text-hf-dim">
                        <span>MEM</span><span>{svc.memory}%</span>
                      </div>
                      <div className="h-1 bg-hf-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${svc.memory}%`, background: memBarColor, boxShadow: `0 0 4px ${memBarColor}60` }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] text-hf-dim shrink-0">{svc.uptime}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
