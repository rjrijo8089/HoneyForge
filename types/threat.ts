export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ThreatStatus = 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved'

export interface ThreatEvent {
  id: string
  title: string
  severity: ThreatSeverity
  status: ThreatStatus
  sourceIp: string
  sourcePort?: number
  targetDecoyId: string
  targetDecoyName: string
  attackType: string
  ttps: string[]
  payload?: string
  timestamp: string
  countryCode?: string
  countryName?: string
  asn?: string
  isMalicious: boolean
  confidence: number
  assignedTo?: string
  notes?: string
}

export interface ThreatFilters {
  severity?: ThreatSeverity[]
  status?: ThreatStatus[]
  dateRange?: { start: string; end: string }
  search?: string
}

export interface AttackTrend {
  date: string
  critical: number
  high: number
  medium: number
  low: number
  [key: string]: string | number
}
