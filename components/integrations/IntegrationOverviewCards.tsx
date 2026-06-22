import { Plug, CheckCircle2, Activity, AlertTriangle, Send } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import type { Integration } from '@/types/integration'

interface CardProps {
  title: string
  value: number | string
  sub: string
  icon: React.ReactNode
  accent: string
  border: string
}

function Card({ title, value, sub, icon, accent, border }: CardProps) {
  return (
    <div className={cn('glass-card rounded-xl border p-4 flex items-start gap-3', border)}>
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5', accent)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-hf-dim">{title}</p>
        <p className="text-2xl font-bold text-hf-text tabular-nums leading-tight mt-0.5">{value}</p>
        <p className="text-[10px] text-hf-dim mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  )
}

interface Props { integrations: Integration[] }

export function IntegrationOverviewCards({ integrations }: Props) {
  const total    = integrations.length
  const enabled  = integrations.filter((i) => i.enabled).length
  const healthy  = integrations.filter((i) => i.health === 'healthy').length
  const errors   = integrations.filter((i) => i.health === 'error').length
  const today    = integrations.reduce((s, i) => s + i.eventsToday, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      <Card
        title="Total" value={total} sub={`${enabled} enabled`}
        icon={<Plug className="w-4 h-4" />}
        accent="bg-hf-primary/15 text-hf-primary" border="border-hf-primary/20"
      />
      <Card
        title="Enabled" value={enabled} sub={`${total - enabled} disabled`}
        icon={<CheckCircle2 className="w-4 h-4" />}
        accent="bg-hf-success/15 text-hf-success" border="border-hf-success/20"
      />
      <Card
        title="Healthy" value={healthy} sub={`${enabled - healthy} degraded/error`}
        icon={<Activity className="w-4 h-4" />}
        accent="bg-hf-accent/15 text-hf-accent" border="border-hf-accent/20"
      />
      <Card
        title="Errors" value={errors} sub={errors > 0 ? 'Needs attention' : 'All clear'}
        icon={<AlertTriangle className="w-4 h-4" />}
        accent={errors > 0 ? 'bg-hf-danger/15 text-hf-danger' : 'bg-hf-dim/15 text-hf-dim'}
        border={errors > 0 ? 'border-hf-danger/20' : 'border-hf-border/30'}
      />
      <Card
        title="Events Today" value={formatNumber(today)} sub="across all sinks"
        icon={<Send className="w-4 h-4" />}
        accent="bg-hf-warning/15 text-hf-warning" border="border-hf-warning/20"
      />
    </div>
  )
}
