import { Shield, Loader2, AlertTriangle, Zap, Bug } from 'lucide-react'
import type { Decoy } from '@/types'

interface DecoyOverviewProps {
  decoys: Decoy[]
}

export function DecoyOverview({ decoys }: DecoyOverviewProps) {
  const active    = decoys.filter((d) => d.status === 'active').length
  const paused    = decoys.filter((d) => d.status === 'paused').length
  const deploying = decoys.filter((d) => d.status === 'deploying').length
  const error     = decoys.filter((d) => d.status === 'error').length
  const totalHits = decoys.reduce((s, d) => s + d.interactionsCount, 0)
  const todayHits = decoys.reduce((s, d) => s + d.attacksToday, 0)
  const malware   = decoys.reduce((s, d) => s + d.capturedMalware, 0)
  const alerts    = decoys.reduce((s, d) => s + d.openAlerts, 0)

  const cards = [
    {
      label: 'Active Decoys',
      value: active,
      sub: `${decoys.length} total deployed`,
      icon: Shield,
      iconColor: 'text-hf-success',
      iconBg: 'bg-hf-success/15',
      border: 'border-hf-success/20',
      topBar: 'from-hf-success/50 to-transparent',
      pulse: true,
    },
    {
      label: 'Paused / Error',
      value: paused + error,
      sub: `${paused} paused · ${error} error`,
      icon: AlertTriangle,
      iconColor: error > 0 ? 'text-hf-danger' : 'text-hf-warning',
      iconBg: error > 0 ? 'bg-hf-danger/15' : 'bg-hf-warning/15',
      border: error > 0 ? 'border-hf-danger/20' : 'border-hf-warning/20',
      topBar: error > 0 ? 'from-hf-danger/50 to-transparent' : 'from-hf-warning/50 to-transparent',
      pulse: false,
    },
    {
      label: 'Attacks Today',
      value: todayHits.toLocaleString(),
      sub: `${totalHits.toLocaleString()} lifetime`,
      icon: Zap,
      iconColor: 'text-hf-primary',
      iconBg: 'bg-hf-primary/15',
      border: 'border-hf-primary/20',
      topBar: 'from-hf-primary/50 to-transparent',
      pulse: false,
    },
    {
      label: 'Malware Captured',
      value: malware,
      sub: `${alerts} open alert${alerts !== 1 ? 's' : ''}`,
      icon: Bug,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      border: 'border-purple-500/20',
      topBar: 'from-purple-500/50 to-transparent',
      pulse: false,
    },
    {
      label: 'Deploying',
      value: deploying,
      sub: 'provisioning now',
      icon: Loader2,
      iconColor: 'text-hf-accent',
      iconBg: 'bg-hf-accent/15',
      border: 'border-hf-accent/20',
      topBar: 'from-hf-accent/50 to-transparent',
      spin: deploying > 0,
      pulse: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`relative rounded-2xl overflow-hidden glass-card border ${card.border} transition-all duration-300 hover:scale-[1.01]`}
          >
            <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${card.topBar}`} />
            <div className="relative z-10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className={`w-4 h-4 ${card.iconColor} ${'spin' in card && card.spin ? 'animate-spin' : ''}`} />
                </div>
                {card.pulse && (
                  <span className="relative w-2 h-2 mt-1">
                    <span className="absolute inset-0 bg-hf-success rounded-full" />
                    <span className="absolute inset-0 bg-hf-success rounded-full animate-ping opacity-60" />
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-hf-text tabular-nums">{card.value}</p>
              <p className="text-xs font-medium text-hf-muted mt-0.5">{card.label}</p>
              <p className="text-[10px] text-hf-dim mt-0.5">{card.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
