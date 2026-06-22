'use client'
import { useUIStore } from '@/store/uiStore'

export function useSidebar() {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore()
  return { collapsed: sidebarCollapsed, toggle: toggleSidebar, setCollapsed: setSidebarCollapsed }
}
