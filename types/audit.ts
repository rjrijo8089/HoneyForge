export type AuditOutcome   = 'success' | 'failed' | 'warning'
export type AuditRiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type AuditAction =
  | 'login' | 'logout'
  | 'decoy_created' | 'decoy_paused' | 'decoy_deleted' | 'decoy_updated'
  | 'clone_studio_changed'
  | 'event_marked_attack' | 'event_marked_benign'
  | 'ioc_exported'
  | 'integration_configured' | 'integration_removed'
  | 'rule_enabled' | 'rule_disabled' | 'rule_created' | 'rule_updated'
  | 'report_generated'
  | 'settings_changed'
  | 'user_created' | 'user_deleted' | 'role_changed'
  | 'threat_assigned' | 'threat_resolved'

export interface AuditLog {
  id:           string
  userId:       string
  userEmail:    string
  userRole:     'admin' | 'analyst' | 'viewer'
  action:       AuditAction
  resourceType: string
  resourceId?:  string
  resourceName?: string
  details:      Record<string, unknown>
  ipAddress:    string
  userAgent:    string
  timestamp:    string
  outcome:      AuditOutcome
  riskLevel:    AuditRiskLevel
  sessionId?:   string
}

export interface AuditFilters {
  search:        string
  actors:        string[]
  actions:       string[]
  outcomes:      AuditOutcome[]
  resourceTypes: string[]
  riskLevels:    AuditRiskLevel[]
  dateFrom:      string
  dateTo:        string
}

export const DEFAULT_AUDIT_FILTERS: AuditFilters = {
  search: '', actors: [], actions: [], outcomes: [],
  resourceTypes: [], riskLevels: [], dateFrom: '', dateTo: '',
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  login:                  'User Login',
  logout:                 'User Logout',
  decoy_created:          'Decoy Created',
  decoy_paused:           'Decoy Paused',
  decoy_deleted:          'Decoy Deleted',
  decoy_updated:          'Decoy Updated',
  clone_studio_changed:   'Clone Studio Changed',
  event_marked_attack:    'Event: Marked Attack',
  event_marked_benign:    'Event: Marked Benign',
  ioc_exported:           'IOC Exported',
  integration_configured: 'Integration Configured',
  integration_removed:    'Integration Removed',
  rule_enabled:           'Rule Enabled',
  rule_disabled:          'Rule Disabled',
  rule_created:           'Rule Created',
  rule_updated:           'Rule Updated',
  report_generated:       'Report Generated',
  settings_changed:       'Settings Changed',
  user_created:           'User Created',
  user_deleted:           'User Deleted',
  role_changed:           'Role Changed',
  threat_assigned:        'Threat Assigned',
  threat_resolved:        'Threat Resolved',
}

export const AUDIT_RESOURCE_TYPES = [
  'session', 'decoy', 'clone-studio', 'event', 'ioc',
  'integration', 'rule', 'report', 'settings', 'user',
] as const
