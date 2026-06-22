export type CloneStatus = 'active' | 'paused' | 'error' | 'building'

export interface CloneInstance {
  id: string
  name: string
  sourceUrl: string
  category: string
  status: CloneStatus
  uptime: number           // % last 30d
  eventsToday: number
  totalEvents: number
  lastEventAt?: string
  lastEventType?: string
  lastEventSeverity?: 'critical' | 'high' | 'medium' | 'low'
  deployedAt: string
  snarePort: number
  ipAddress: string
  department: string
  businessOwner: string
  capturedMalware: number
  detections: { sql: number; xss: number; lfi: number; cred: number }
  activityLast7Days: number[]
}

export const MOCK_CLONES: CloneInstance[] = [
  {
    id: 'cl_001',
    name: 'Finance-Portal-Lure',
    sourceUrl: 'https://finance.internal.corp',
    category: 'Customer Portal',
    status: 'active',
    uptime: 99.8,
    eventsToday: 47,
    totalEvents: 1204,
    lastEventAt: '2026-06-18T16:01:00Z',
    lastEventType: 'SQL Injection',
    lastEventSeverity: 'critical',
    deployedAt: '2026-01-15T00:00:00Z',
    snarePort: 8081,
    ipAddress: '10.0.2.101',
    department: 'Finance',
    businessOwner: 'sarah.jones@corp.io',
    capturedMalware: 7,
    detections: { sql: 412, xss: 87, lfi: 34, cred: 201 },
    activityLast7Days: [88, 104, 96, 112, 137, 168, 47],
  },
  {
    id: 'cl_002',
    name: 'IT-Admin-Panel-Fake',
    sourceUrl: 'https://admin.internal.corp',
    category: 'Admin Panel',
    status: 'active',
    uptime: 99.4,
    eventsToday: 18,
    totalEvents: 342,
    lastEventAt: '2026-06-18T15:22:00Z',
    lastEventType: 'Credential Stuffing',
    lastEventSeverity: 'high',
    deployedAt: '2026-02-10T00:00:00Z',
    snarePort: 8082,
    ipAddress: '10.0.2.102',
    department: 'IT',
    businessOwner: 'mike.admin@corp.io',
    capturedMalware: 2,
    detections: { sql: 88, xss: 44, lfi: 12, cred: 198 },
    activityLast7Days: [24, 31, 29, 38, 44, 52, 18],
  },
  {
    id: 'cl_003',
    name: 'HR-Employee-Portal',
    sourceUrl: 'https://hr.internal.corp',
    category: 'Login Portal',
    status: 'paused',
    uptime: 97.2,
    eventsToday: 0,
    totalEvents: 67,
    lastEventAt: '2026-06-12T10:15:00Z',
    lastEventType: 'Directory Traversal',
    lastEventSeverity: 'medium',
    deployedAt: '2026-03-20T00:00:00Z',
    snarePort: 8083,
    ipAddress: '10.0.2.103',
    department: 'HR',
    businessOwner: 'lisa.hr@corp.io',
    capturedMalware: 0,
    detections: { sql: 21, xss: 8, lfi: 15, cred: 23 },
    activityLast7Days: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'cl_004',
    name: 'Dev-API-Canary',
    sourceUrl: 'https://api.dev.internal.corp',
    category: 'API Endpoint',
    status: 'error',
    uptime: 78.3,
    eventsToday: 0,
    totalEvents: 23,
    lastEventAt: '2026-06-10T07:44:00Z',
    lastEventType: 'Command Injection',
    lastEventSeverity: 'high',
    deployedAt: '2026-05-01T00:00:00Z',
    snarePort: 8084,
    ipAddress: '10.0.2.104',
    department: 'Engineering',
    businessOwner: 'dev-team@corp.io',
    capturedMalware: 1,
    detections: { sql: 4, xss: 2, lfi: 1, cred: 16 },
    activityLast7Days: [0, 3, 0, 0, 0, 0, 0],
  },
  {
    id: 'cl_005',
    name: 'Supply-Chain-ERP-Fake',
    sourceUrl: 'https://erp.ops.internal.corp',
    category: 'Web Application',
    status: 'building',
    uptime: 0,
    eventsToday: 0,
    totalEvents: 0,
    deployedAt: '2026-06-18T09:00:00Z',
    snarePort: 8085,
    ipAddress: '10.0.2.105',
    department: 'Operations',
    businessOwner: 'ops@corp.io',
    capturedMalware: 0,
    detections: { sql: 0, xss: 0, lfi: 0, cred: 0 },
    activityLast7Days: [0, 0, 0, 0, 0, 0, 0],
  },
]
