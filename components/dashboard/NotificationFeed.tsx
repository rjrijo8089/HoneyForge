'use client'
import { useEffect } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useNotificationStore } from '@/store/notificationStore'

const SEED_NOTIFICATIONS = [
  { type: 'alert' as const,   title: 'Critical: SQL Injection on Web Lure',  message: '185.220.101.45 triggered rule T1190 — auto-confirmed.', severity: 'critical' as const },
  { type: 'alert' as const,   title: 'SSH Brute Force spike detected',        message: '47 failed auth attempts from CN in 30 seconds.',        severity: 'high' as const    },
  { type: 'warning' as const, title: 'TANNER CPU at 67%',                    message: 'TANNER service approaching resource threshold.',         severity: 'medium' as const  },
  { type: 'warning' as const, title: 'OpenSearch disk at 84%',               message: 'Consider pruning indices older than 90 days.',           severity: 'medium' as const  },
  { type: 'info' as const,    title: 'Report generated: Weekly W24',         message: 'Weekly Threat Summary PDF is ready for download.',       severity: 'low' as const     },
  { type: 'success' as const, title: 'Decoy RDP-Workstation-Fake deployed',  message: 'New RDP honeypot is live at 10.0.1.104:3389.',           severity: 'low' as const     },
]

const TYPE_META = {
  alert:   { icon: AlertTriangle, color: 'text-hf-danger',  ring: 'ring-hf-danger/20'  },
  warning: { icon: Zap,           color: 'text-hf-warning', ring: 'ring-hf-warning/20' },
  info:    { icon: Info,          color: 'text-hf-info',    ring: 'ring-hf-info/20'    },
  success: { icon: CheckCircle,   color: 'text-hf-success', ring: 'ring-hf-success/20' },
}

export function NotificationFeed() {
  const { notifications, addNotification, unreadCount } = useNotificationStore()

  useEffect(() => {
    if (notifications.length === 0) {
      SEED_NOTIFICATIONS.forEach((n, i) =>
        setTimeout(() => addNotification(n), i * 80)
      )
    }
  }, [addNotification, notifications.length])

  const recent = notifications.slice(0, 7)

  return (
    <div className="glass-card glass-card-hover rounded-2xl border border-hf-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-hf-border/40">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-hf-muted" />
          <h3 className="text-sm font-semibold text-hf-text">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-hf-danger/20 text-hf-danger border border-hf-danger/30 rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-hf-border/20 max-h-[360px] overflow-y-auto">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-hf-dim">
            <Bell className="w-6 h-6 mb-2 opacity-40" />
            <p className="text-xs">No notifications</p>
          </div>
        ) : recent.map((notif) => {
          const meta = TYPE_META[notif.type]
          const Icon = meta.icon
          return (
            <div
              key={notif.id}
              className={cn(
                'flex gap-3 px-4 py-3 hover:bg-hf-surface-2/40 transition-colors',
                !notif.isRead && 'bg-hf-primary/[0.03]'
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ring-1',
                meta.color, meta.ring,
                'bg-hf-surface-2'
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className={cn('text-xs font-medium leading-tight', notif.isRead ? 'text-hf-muted' : 'text-hf-text')}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-hf-primary shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-[10px] text-hf-dim mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-hf-dim/60 mt-0.5">{formatDate(notif.timestamp, 'relative')}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
