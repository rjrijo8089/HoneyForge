import type { ThreatSeverity } from './threat'

export type IOCType =
  | 'ip' | 'domain' | 'url' | 'file-hash'
  | 'user-agent' | 'payload' | 'cve' | 'email'

export type IOCStatus =
  | 'new' | 'investigating' | 'confirmed' | 'false-positive' | 'closed'

export type TLPLevel = 'red' | 'amber' | 'green' | 'white'

export interface IOCTimelineEvent {
  id: string
  timestamp: string
  type: 'first-seen' | 'attack' | 'status-change' | 'analyst-note' | 'correlation' | 'closed'
  title: string
  description: string
  severity?: ThreatSeverity
  actor?: string
}

export interface IOCPayloadDetails {
  size: number
  mimeType: string
  sha256: string
  md5: string
  packerSignature?: string
  ssdeepHash?: string
}

export interface IOCCVEDetails {
  cvss: number
  cvssVector: string
  affected: string[]
  patchAvailable: boolean
  exploitPublic: boolean
  description: string
}

export interface IOC {
  id: string
  type: IOCType
  value: string
  status: IOCStatus
  severity: ThreatSeverity
  confidence: number       // 0–100
  firstSeen: string
  lastSeen: string
  hitCount: number
  tags: string[]
  campaigns: string[]      // Campaign IDs
  mitreTechniques: string[] // e.g. "T1566", "T1190"
  description?: string
  country?: string
  countryCode?: string
  asn?: string
  asOrg?: string
  relatedIocs: string[]    // Other IOC IDs
  reportedBy: string
  source: string
  tlp: TLPLevel
  malwareFamily?: string
  analyst?: string
  notes?: string
  cveDetails?: IOCCVEDetails
  payloadDetails?: IOCPayloadDetails
  timeline: IOCTimelineEvent[]
}

export interface IOCFilters {
  search: string
  types: IOCType[]
  statuses: IOCStatus[]
  severities: ThreatSeverity[]
  campaigns: string[]
  tlp: TLPLevel[]
  confidenceMin: number
  confidenceMax: number
  dateRange: { start: string; end: string } | null
}

export type IOCSortField =
  | 'value' | 'type' | 'severity' | 'confidence'
  | 'hitCount' | 'firstSeen' | 'lastSeen' | 'status'

export interface Campaign {
  id: string
  name: string
  description: string
  status: 'active' | 'dormant' | 'closed'
  firstSeen: string
  lastSeen: string
  iocCount: number
  techniques: string[]
  tactics: string[]
  targets: string[]
  severity: ThreatSeverity
  confidence: number
  threatActor?: string
  malwareFamilies: string[]
  iocTypes: Record<IOCType, number>
  activityLast30Days: number[]
}

export interface MitreTechnique {
  id: string         // e.g. "T1566"
  name: string
  tactic: string
  tacticId: string   // e.g. "TA0001"
  hitCount: number
  iocIds: string[]
  severity: ThreatSeverity
}

export interface MitreTactic {
  id: string
  name: string
  shortName: string
  color: string
  techniques: MitreTechnique[]
}

export type ExportFormat = 'json' | 'csv'
