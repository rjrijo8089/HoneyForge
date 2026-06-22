import type { ThreatSeverity } from './threat'

export type DecoyStatus   = 'active' | 'paused' | 'deploying' | 'error'
export type DecoyCategory = 'web-clone' | 'ssh' | 'malware-capture' | 'ids-sensor' | 'file-share' | 'database' | 'remote-access'
export type DecoyType     =
  | 'ssh' | 'http' | 'https' | 'ftp' | 'smb'
  | 'rdp' | 'telnet' | 'mysql' | 'mssql' | 'smtp' | 'custom'

export type DecoyHealth = 'healthy' | 'degraded' | 'critical' | 'unknown'

export interface Decoy {
  id: string
  name: string
  type: DecoyType
  category: DecoyCategory
  status: DecoyStatus
  ipAddress: string
  port: number
  os?: string
  environment: 'prod' | 'staging' | 'dev'
  description?: string
  tags: string[]
  riskScore: number          // 0–100
  healthStatus: DecoyHealth
  interactionsCount: number  // lifetime total
  attacksToday: number
  lastInteractionAt?: string
  lastAttackSeverity?: ThreatSeverity
  capturedMalware: number
  openAlerts: number
  uptime: number             // % uptime over past 30d
  activityLast7Days: number[] // daily hit counts [d-6 … today]
  createdAt: string
  updatedAt: string
  createdBy: string
  notes?: string
  source?: 'demo' | 'local' | 'database'
}

export interface DecoyFilters {
  status?: DecoyStatus[]
  category?: DecoyCategory[]
  environment?: string[]
  search?: string
}
