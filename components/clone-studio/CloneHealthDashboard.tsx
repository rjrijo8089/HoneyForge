'use client'
import { useState } from 'react'
import { Activity, RefreshCw, Pause, Play, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CLONES, type CloneInstance, type CloneStatus } from '@/services/mock/data/cloneStudio'

function StatusDot({ status }: { status: CloneStatus }) {
  const cfg: Record<CloneStatus, { color: string; pulse: boolean; label: string }> = {
    active:   { color: 'bg-hf-success',  pulse: true,  label: 'Active'   },
    paused:   { color: 'bg-hf-muted',    pulse: false, label: 'Paused'   },
    error:    { color: 'bg-hf-danger',   pulse: true,  label: 'Error'    },
    building: { color: 'bg-hf-warning',  pulse: true,  label: 'Building' },
  }
  const { color, pulse, label } = cfg[status]
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('w-2 h-2 rounded-full', color, pulse && 'animate-pulse')} />
      <span className={cn(
        'text-[10px] font-semibold uppercase tracking-wider',
        status === 'active'   && 'text-hf-success',
        status === 'paused'   && 'text-hf-muted',
        status === 'error'    && 'text-hf-danger',
        status === 'building' && 'text-hf-warning',
      )}>{label}</span>
    </div>
  )
}

function UptimeBar({ uptime }: { uptime: number }) {
  const color = uptime >= 99 ? 'bg-hf-success' : uptime >= 90 ? 'bg-hf-warning' : 'bg-hf-danger'
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[9px]">
        <span className="text-hf-dim">Uptime</span>
        <span className={cn('font-semibold', uptime >= 99 ? 'text-hf-success' : uptime >= 90 ? 'text-hf-warning' : 'text-hf-danger')}>
          {uptime.toFixed(1)}%
        </span>
      </div>
      <div className="h-1 bg-hf-surface-3 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${uptime}%` }} />
      </div>
    </div>
  )
}

function ActivitySparkbar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-6">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-hf-primary/50 transition-all"
          style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? '2px' : '0' }}
        />
      ))}
    </div>
  )
}

function CloneCard({ clone }: { clone: CloneInstance }) {
  const [toggling, setToggling] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await new Promise((r) => setTimeout(r, 800))
    setToggling(false)
  }

  return (
    <div className={cn(
      'glass-card glass-card-hover rounded-2xl border p-5 transition-all',
      clone.status === 'error' && 'border-hf-danger/30',
      clone.status === 'active' && 'border-hf-border/50',
      clone.status === 'paused' && 'border-hf-border/30 opacity-80',
      clone.status === 'building' && 'border-hf-warning/30',
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-hf-text truncate">{clone.name}</h3>
            {clone.status === 'error' && (
              <AlertTriangle className="w-3.5 h-3.5 text-hf-danger shrink-0" />
            )}
          </div>
          <p className="text-[10px] text-hf-dim truncate font-mono">{clone.sourceUrl}</p>
        </div>
        <StatusDot status={clone.status} />
      </div>

      {/* IP + Port */}
      <div className="flex gap-2 mb-3">
        <span className="text-[10px] font-mono text-hf-muted bg-hf-surface-3 border border-hf-border/30 px-2 py-0.5 rounded">
          {clone.ipAddress}:{clone.snarePort}
        </span>
        <span className="text-[10px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-2 py-0.5 rounded">
          {clone.category}
        </span>
      </div>

      {/* Uptime bar */}
      {clone.status !== 'building' && <div className="mb-3"><UptimeBar uptime={clone.uptime} /></div>}
      {clone.status === 'building' && (
        <div className="flex items-center gap-2 mb-3 text-xs text-hf-warning">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Deploying…</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Today',  value: clone.eventsToday.toLocaleString() },
          { label: 'Total',  value: clone.totalEvents.toLocaleString() },
          { label: 'Malware', value: clone.capturedMalware.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-hf-surface-3/50 rounded-lg p-2 text-center">
            <p className="text-sm font-bold text-hf-text tabular-nums">{value}</p>
            <p className="text-[9px] text-hf-dim">{label}</p>
          </div>
        ))}
      </div>

      {/* Activity sparkbar */}
      {clone.activityLast7Days.some((v) => v > 0) && (
        <div className="mb-3">
          <p className="text-[9px] text-hf-dim mb-1">7-day activity</p>
          <ActivitySparkbar data={clone.activityLast7Days} />
        </div>
      )}

      {/* Last event */}
      {clone.lastEventType && (
        <p className="text-[10px] text-hf-muted mb-3 truncate">
          Last: <span className={cn(
            'font-medium',
            clone.lastEventSeverity === 'critical' && 'text-hf-danger',
            clone.lastEventSeverity === 'high'     && 'text-orange-400',
            clone.lastEventSeverity === 'medium'   && 'text-hf-warning',
            clone.lastEventSeverity === 'low'      && 'text-hf-success',
          )}>{clone.lastEventType}</span>
          <span className="text-hf-dim"> · {clone.department}</span>
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-hf-border/20">
        <button
          onClick={handleToggle}
          disabled={toggling || clone.status === 'building'}
          className="flex items-center gap-1.5 text-[10px] font-medium text-hf-muted hover:text-hf-text transition-colors disabled:opacity-40"
        >
          {toggling
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : clone.status === 'active'
            ? <Pause className="w-3 h-3" />
            : <Play className="w-3 h-3" />
          }
          {clone.status === 'active' ? 'Pause' : 'Resume'}
        </button>
        <button className="ml-auto flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-primary transition-colors">
          <ExternalLink className="w-3 h-3" />
          View logs
        </button>
      </div>
    </div>
  )
}

export function CloneHealthDashboard() {
  const clones = MOCK_CLONES

  const stats = {
    active:   clones.filter((c) => c.status === 'active').length,
    paused:   clones.filter((c) => c.status === 'paused').length,
    error:    clones.filter((c) => c.status === 'error').length,
    building: clones.filter((c) => c.status === 'building').length,
    totalEventsToday: clones.reduce((s, c) => s + c.eventsToday, 0),
    totalEvents:      clones.reduce((s, c) => s + c.totalEvents, 0),
  }

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Clones',    value: stats.active,           color: 'text-hf-success',  bg: 'bg-hf-success/10 border-hf-success/20' },
          { label: 'Events Today',      value: stats.totalEventsToday, color: 'text-hf-primary',  bg: 'bg-hf-primary/10 border-hf-primary/20' },
          { label: 'Total Events',      value: stats.totalEvents,      color: 'text-hf-accent',   bg: 'bg-hf-accent/10 border-hf-accent/20'   },
          { label: 'Errors / Building', value: `${stats.error} / ${stats.building}`, color: stats.error > 0 ? 'text-hf-danger' : 'text-hf-muted', bg: stats.error > 0 ? 'bg-hf-danger/10 border-hf-danger/20' : 'bg-hf-surface-2 border-hf-border/40' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn('rounded-xl border p-3.5 flex items-center gap-3', bg)}>
            <Activity className={cn('w-4 h-4 shrink-0', color)} />
            <div>
              <p className={cn('text-lg font-black tabular-nums', color)}>{value}</p>
              <p className="text-[10px] text-hf-dim">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-hf-text">Active Clone Instances</h3>
          <p className="text-xs text-hf-muted mt-0.5">{clones.length} total — managed by SNARE + TANNER</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-hf-muted hover:text-hf-text transition-colors border border-hf-border/40 bg-hf-surface-2 px-3 py-1.5 rounded-lg">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clones.map((clone) => (
          <CloneCard key={clone.id} clone={clone} />
        ))}
      </div>
    </div>
  )
}
