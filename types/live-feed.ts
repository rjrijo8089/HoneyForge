import type { ThreatSeverity } from './threat'
export type { ThreatSeverity }

export type DetectionSourceType = 'SNARE' | 'TANNER' | 'Cowrie' | 'Dionaea' | 'Suricata'
export type LiveAttackCategory  = 'web' | 'ssh' | 'malware' | 'recon' | 'c2' | 'auth' | 'db' | 'ftp'
export type LiveEventStatus     = 'new' | 'acknowledged'

export interface LiveFeedEvent {
  id: string
  timestamp: string
  severity: ThreatSeverity
  status: LiveEventStatus

  // Source
  sourceIp: string
  sourcePort: number
  sourceCountry: string
  sourceCountryCode: string
  sourceAsn: string
  sourceOrg: string

  // Target
  targetDecoyId: string
  targetDecoyName: string
  targetPort: number
  targetProtocol: string

  // Detection
  detectionSource: DetectionSourceType
  attackType: string
  attackCategory: LiveAttackCategory
  title: string

  // Payload
  payload?: string
  requestMethod?: string
  requestPath?: string
  requestHeaders?: Record<string, string>
  responseCode?: number

  // MITRE
  mitreTechniques: string[]
  mitreTactics: string[]

  // Meta
  confidence: number
  isKnownBad: boolean
}

export interface LiveFeedFilters {
  severities: ThreatSeverity[]
  attackCategories: LiveAttackCategory[]
  detectionSources: DetectionSourceType[]
  countryCode: string
  decoyId: string
  search: string
}

export const DEFAULT_LIVE_FILTERS: LiveFeedFilters = {
  severities: [],
  attackCategories: [],
  detectionSources: [],
  countryCode: '',
  decoyId: '',
  search: '',
}

export const DETECTION_SOURCE_META: Record<DetectionSourceType, { color: string; bg: string; border: string }> = {
  SNARE:    { color: 'text-hf-primary',   bg: 'bg-hf-primary/10',   border: 'border-hf-primary/30'   },
  TANNER:   { color: 'text-hf-accent',    bg: 'bg-hf-accent/10',    border: 'border-hf-accent/30'    },
  Cowrie:   { color: 'text-orange-400',   bg: 'bg-orange-400/10',   border: 'border-orange-400/30'   },
  Dionaea:  { color: 'text-purple-400',   bg: 'bg-purple-400/10',   border: 'border-purple-400/30'   },
  Suricata: { color: 'text-hf-warning',   bg: 'bg-hf-warning/10',   border: 'border-hf-warning/30'   },
}

export const ATTACK_CATEGORY_META: Record<LiveAttackCategory, { label: string; color: string }> = {
  web:     { label: 'Web',           color: 'text-hf-primary'  },
  ssh:     { label: 'SSH',           color: 'text-orange-400'  },
  malware: { label: 'Malware',       color: 'text-hf-danger'   },
  recon:   { label: 'Recon',         color: 'text-hf-muted'    },
  c2:      { label: 'C2',            color: 'text-purple-400'  },
  auth:    { label: 'Auth',          color: 'text-hf-warning'  },
  db:      { label: 'Database',      color: 'text-hf-accent'   },
  ftp:     { label: 'FTP',           color: 'text-green-400'   },
}
