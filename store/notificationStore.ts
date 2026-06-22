'use client'
import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

let _idCounter = 0

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) => {
    const notification: Notification = {
      ...n,
      id: `notif_${++_idCounter}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    }
    set((s) => ({
      notifications: [notification, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }))
  },

  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id && !n.isRead ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - (s.notifications.find((n) => n.id === id && !n.isRead) ? 1 : 0)),
    })),

  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((s) => {
      const target = s.notifications.find((n) => n.id === id)
      return {
        notifications: s.notifications.filter((n) => n.id !== id),
        unreadCount: target && !target.isRead ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
      }
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
