'use client'
import { useEffect } from 'react'
import { X, Bell, CheckCheck, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useNotificationStore } from '@/store/notificationStore'
import type { NotificationType } from '@/types'

const TYPE_STYLES: Record<NotificationType, string> = {
  alert:   'bg-hf-danger/15 text-hf-danger border-hf-danger/30',
  warning: 'bg-hf-warning/15 text-hf-warning border-hf-warning/30',
  success: 'bg-hf-success/15 text-hf-success border-hf-success/30',
  info:    'bg-hf-accent/15 text-hf-accent border-hf-accent/30',
}

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { notifications, unreadCount, markAllAsRead, clearAll, removeNotification, markAsRead } =
    useNotificationStore()

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 z-50 w-96 bg-hf-surface border border-hf-border rounded-xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-hf-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-hf-muted" />
            <span className="text-sm font-semibold text-hf-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-hf-danger text-white rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 text-hf-dim hover:text-hf-muted rounded-lg hover:bg-hf-surface-2 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                title="Clear all"
                className="p-1.5 text-hf-dim hover:text-hf-danger rounded-lg hover:bg-hf-danger/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-hf-dim hover:text-hf-muted rounded-lg hover:bg-hf-surface-2 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-hf-dim">
              <Bell className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  'flex gap-3 px-4 py-3 border-b border-hf-border/50 cursor-pointer hover:bg-hf-surface-2 transition-colors',
                  !notif.isRead && 'bg-hf-primary/5'
                )}
              >
                <div className={cn(
                  'mt-0.5 w-2 h-2 rounded-full shrink-0 border',
                  TYPE_STYLES[notif.type]
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium truncate', notif.isRead ? 'text-hf-muted' : 'text-hf-text')}>
                      {notif.title}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(notif.id) }}
                      className="text-hf-dim hover:text-hf-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-hf-dim mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-hf-dim mt-1">{formatDate(notif.timestamp, 'relative')}</p>
                </div>
                {!notif.isRead && (
                  <span className="w-1.5 h-1.5 rounded-full bg-hf-primary shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
