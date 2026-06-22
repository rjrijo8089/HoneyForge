export type NotificationType = 'alert' | 'info' | 'success' | 'warning'
export type NotificationSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  severity?: NotificationSeverity
  timestamp: string
  isRead: boolean
  link?: string
}
