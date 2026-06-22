import type { UserRole } from '@/types'

export type Permission =
  | 'decoys:read' | 'decoys:write' | 'decoys:delete'
  | 'threats:read' | 'threats:write' | 'threats:delete'
  | 'rules:read' | 'rules:write' | 'rules:delete'
  | 'integrations:read' | 'integrations:write'
  | 'reports:read' | 'reports:generate'
  | 'audit:read'
  | 'settings:read' | 'settings:write'
  | 'users:read' | 'users:write'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'decoys:read', 'decoys:write', 'decoys:delete',
    'threats:read', 'threats:write', 'threats:delete',
    'rules:read', 'rules:write', 'rules:delete',
    'integrations:read', 'integrations:write',
    'reports:read', 'reports:generate',
    'audit:read',
    'settings:read', 'settings:write',
    'users:read', 'users:write',
  ],
  analyst: [
    'decoys:read', 'decoys:write',
    'threats:read', 'threats:write',
    'rules:read', 'rules:write',
    'integrations:read',
    'reports:read', 'reports:generate',
    'audit:read',
    'settings:read',
  ],
  viewer: [
    'decoys:read',
    'threats:read',
    'rules:read',
    'integrations:read',
    'reports:read',
    'settings:read',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function canAccess(role: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(role)
}
