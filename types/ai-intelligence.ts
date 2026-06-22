export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low'
export type CorrelationType = 'ip_cluster' | 'asn' | 'user_agent' | 'payload' | 'technique_chain' | 'country_cluster'
export type CampaignStatus = 'active' | 'monitoring' | 'resolved'
export type FeedStatus = 'hit' | 'miss' | 'pending' | 'error' | 'not_queried'
export type FeedName = 'MISP' | 'AbuseIPDB' | 'VirusTotal' | 'OTX' | 'GreyNoise' | 'URLhaus' | 'CISA_KEV' | 'NVD'
export type RecommendationPriority = 'immediate' | 'high' | 'medium' | 'low'
export type AIProvider = 'openai' | 'anthropic' | 'ollama' | 'azure_openai'
export type IOCType = 'ip' | 'domain' | 'url' | 'hash' | 'email'
export type Disposition = 'malicious' | 'suspicious' | 'benign' | 'unknown'
export type MitreTactic = 'Reconnaissance' | 'Initial Access' | 'Execution' | 'Persistence' | 'Privilege Escalation' | 'Defense Evasion' | 'Credential Access' | 'Discovery' | 'Lateral Movement' | 'Collection' | 'Command and Control' | 'Exfiltration' | 'Impact'
export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type BusinessImpact = 'critical' | 'high' | 'medium' | 'low'
export type Effort = 'low' | 'medium' | 'high'
export type RecCategory = 'detection' | 'deception' | 'response' | 'hardening' | 'intelligence'
export type RecStatus = 'pending' | 'in_progress' | 'completed'

export interface CorrelatedEventSummary {
  id: string
  timestamp: string
  sourceIp: string
  decoyName: string
  technique: string
  severity: Severity
}

export interface CorrelationGroup {
  id: string
  type: CorrelationType
  matchValue: string
  eventCount: number
  decoyCount: number
  riskScore: number
  events: CorrelatedEventSummary[]
  firstSeen: string
  lastSeen: string
  countries: string[]
}

export interface AttackerCampaign {
  id: string
  name: string
  status: CampaignStatus
  severity: Severity
  confidence: number
  description: string
  firstSeen: string
  lastSeen: string
  eventCount: number
  uniqueIps: number
  decoysHit: string[]
  countries: string[]
  sourceIps: string[]
  mitreTechniques: string[]
  iocCount: number
  analyst: string | null
}

export interface DecoyRiskScore {
  decoyId: string
  decoyName: string
  decoyType: string
  riskScore: number
  rank: number
  criticalEvents: number
  highEvents: number
  malwareAttempts: number
  credentialAttempts: number
  recentActivityWeight: number
  businessCriticalityWeight: number
  exposureWeight: number
  lastEvent: string
  businessImpact: BusinessImpact
}

export interface FeedResult {
  feed: FeedName
  status: FeedStatus
  hits: number
  confidence: number | null
  detail: string | null
  lastChecked: string
}

export interface EnrichedIOC {
  id: string
  value: string
  type: IOCType
  firstSeen: string
  lastSeen: string
  severity: Severity
  threatScore: number
  disposition: Disposition
  feedResults: FeedResult[]
  tags: string[]
  campaigns: string[]
}

export interface MitreTechniqueEntry {
  id: string
  name: string
  tactic: MitreTactic
  tacticId: string
  eventCount: number
  decoys: string[]
  firstSeen: string
  lastSeen: string
  severity: Severity
  description: string
}

export interface TechnicalRecommendation {
  id: string
  priority: RecommendationPriority
  category: RecCategory
  title: string
  description: string
  owner: string
  effort: Effort
  impact: Effort
  status: RecStatus
}

export interface AISummary {
  analysisId: string
  generatedAt: string
  dataWindowStart: string
  dataWindowEnd: string
  eventsAnalyzed: number
  provider: AIProvider
  model: string
  threatLevel: ThreatLevel
  correlatedEventGroups: number
  activeCampaigns: number
  activeThreats: number
  decoysAtRisk: number
  totalIOCs: number
  mitreTechniques: number
  executiveSummary: string
  keyFindings: string[]
}

export interface AIConfiguration {
  provider: AIProvider
  model: string
  endpoint: string
  privacyMode: boolean
  maxTokens: number
  temperature: number
  enableAutoAnalysis: boolean
  analysisIntervalMinutes: number
}

export interface AIIntelligenceData {
  summary: AISummary
  correlationGroups: CorrelationGroup[]
  campaigns: AttackerCampaign[]
  decoyRiskScores: DecoyRiskScore[]
  enrichedIOCs: EnrichedIOC[]
  mitreTechniques: MitreTechniqueEntry[]
  recommendations: TechnicalRecommendation[]
  configuration: AIConfiguration
}
