export type RuleType = 'sigma' | 'yara' | 'suricata' | 'opensearch' | 'siem'
export type RuleStatus = 'active' | 'draft' | 'disabled' | 'needs-review' | 'inactive'
export type RuleSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RuleDetectionSource = 'SNARE' | 'TANNER' | 'Cowrie' | 'Dionaea' | 'Suricata'

export interface RuleVersionEntry {
  version: string
  changedAt: string
  changedBy: string
  summary: string
}

export interface DetectionRule {
  id: string
  name: string
  type: RuleType
  status: RuleStatus
  severity: RuleSeverity
  description: string
  content: string
  detectionSources: RuleDetectionSource[]
  tags: string[]
  mitreTechniques: string[]
  mitreTactics: string[]
  confidence: number
  hitCount: number
  lastHitAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  owner: string
  relatedIOCIds: string[]
  falsePositiveNotes?: string
  tuningNotes?: string
  versionHistory: RuleVersionEntry[]
}

export interface RuleFilters {
  search: string
  types: RuleType[]
  statuses: RuleStatus[]
  severities: RuleSeverity[]
  detectionSources: RuleDetectionSource[]
  mitreTactic: string
}
