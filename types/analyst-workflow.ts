import type { ThreatSeverity } from './threat'

export type IncidentStatus =
  | 'new' | 'assigned' | 'investigating'
  | 'confirmed-attack' | 'benign' | 'unauthorized-activity'
  | 'escalated' | 'closed'

export type DetectionSource = 'SNARE' | 'TANNER' | 'Cowrie' | 'Dionaea' | 'Suricata' | 'Vector'

export type AttackCategory =
  | 'injection' | 'auth' | 'recon' | 'malware' | 'c2'
  | 'lateral-movement' | 'exfil' | 'dos' | 'web' | 'crypto'

export type ActivityAction =
  | 'created' | 'assigned' | 'reassigned' | 'status-changed' | 'comment-added'
  | 'escalated' | 'exported' | 'sent-to-siem' | 'sent-to-misp' | 'slack-notified'
  | 'rule-created' | 'note-added'

export interface IncidentActivity {
  id: string
  actorId: string
  actorName: string
  action: ActivityAction
  detail?: string
  previousValue?: string
  newValue?: string
  timestamp: string
}

export interface IncidentComment {
  id: string
  authorId: string
  authorName: string
  text: string
  timestamp: string
  isSystem: boolean
  isPinned: boolean
}

export interface RelatedEvent {
  id: string
  title: string
  sourceIp: string
  timestamp: string
  severity: ThreatSeverity
  attackType: string
  sameSource: boolean
  sameDecoy: boolean
}

export interface Analyst {
  id: string
  name: string
  initials: string
  role: string
  online: boolean
}

export interface AnalystIncident {
  id: string
  title: string
  status: IncidentStatus
  severity: ThreatSeverity
  confidence: number

  // Source
  sourceIp: string
  sourcePort?: number
  sourceCountry?: string
  sourceCountryCode?: string
  sourceAsn?: string
  sourceOrg?: string

  // Target
  targetDecoyId: string
  targetDecoyName: string
  targetPort?: number
  targetProtocol?: string

  // Detection
  detectionSource: DetectionSource
  attackType: string
  attackCategory: AttackCategory

  // MITRE
  mitreTechniques: string[]
  mitreTactics: string[]

  // Payload
  payload?: string
  payloadEncoding?: 'raw' | 'base64' | 'hex'
  requestMethod?: string
  requestPath?: string
  requestHeaders?: Record<string, string>
  responseCode?: number

  // Meta
  timestamp: string
  firstSeen: string
  lastSeen: string
  eventCount: number  // grouped similar events

  // Assignment
  assignedTo?: string
  assignedToName?: string
  assignedAt?: string

  // Campaign / IOC links
  relatedEvents: RelatedEvent[]
  iocIds: string[]
  campaignId?: string
  campaignName?: string
  malwareFamily?: string

  // Actions state
  sentToSIEM: boolean
  sentToMISP: boolean
  slackNotified: boolean
  exportedAt?: string

  // Comments + history
  comments: IncidentComment[]
  activity: IncidentActivity[]

  // Tags
  tags: string[]
  notes?: string
}

export interface BulkAction {
  type: 'assign' | 'mark-attack' | 'mark-benign' | 'mark-unauthorized' | 'export' | 'send-siem' | 'escalate' | 'close'
  label: string
}

export const BULK_ACTIONS: BulkAction[] = [
  { type: 'assign',            label: 'Assign Analyst'     },
  { type: 'mark-attack',       label: 'Mark as Attack'     },
  { type: 'mark-benign',       label: 'Mark as Benign'     },
  { type: 'mark-unauthorized', label: 'Unauthorized Activity' },
  { type: 'export',            label: 'Export'             },
  { type: 'send-siem',         label: 'Send to SIEM'       },
  { type: 'close',             label: 'Close'              },
]

export interface IncidentFiltersState {
  search: string
  statuses: IncidentStatus[]
  severities: ThreatSeverity[]
  assignedTo: string[]
  detectionSources: DetectionSource[]
  attackCategories: AttackCategory[]
  dateRange: 'all' | '1h' | '24h' | '7d' | '30d'
  unassignedOnly: boolean
}
