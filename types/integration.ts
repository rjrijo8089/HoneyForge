export type IntegrationCategory =
  | 'siem'
  | 'threat-intel'
  | 'alerting'
  | 'case-management'
  | 'storage'
  | 'email'

export type IntegrationHealth = 'healthy' | 'degraded' | 'error' | 'unknown'

export type IntegrationSeverityThreshold = 'critical' | 'high' | 'medium' | 'low' | 'all'

export type IntegrationEmailFrequency = 'realtime' | 'hourly' | 'daily'

export interface IntegrationConfig {
  apiUrl:            string
  apiKey:            string   // shown as redacted placeholder when pre-configured
  secondaryKey?:     string   // S3 secret key, SMTP password, etc.
  destination:       string   // index, channel, bucket, project key, table, etc.
  severityThreshold: IntegrationSeverityThreshold
  eventTypes:        string[] // empty = all events
  verifySSL:         boolean
  // Category-specific extras
  region?:              string  // S3: AWS region
  pathPrefix?:          string  // S3: object key prefix
  recipientList?:       string  // Email: comma-sep addresses
  fromAddress?:         string  // Email: from address
  emailFrequency?:      IntegrationEmailFrequency
  mentionOnCritical?:   boolean // Slack: @channel on critical
  autoCreateCase?:      boolean // Case management: auto-open cases
  distributeLevel?:     string  // MISP: sharing distribution level
}

export interface Integration {
  id:             string
  name:           string
  vendorKey:      string  // maps to icon/color in component
  category:       IntegrationCategory
  description:    string
  enabled:        boolean
  health:         IntegrationHealth
  healthMessage?: string
  eventsTotal:    number
  eventsToday:    number
  errorCount:     number
  lastSyncAt?:    string
  lastErrorAt?:   string
  testedAt?:      string
  configuredAt:   string
  configuredBy:   string
  config:         IntegrationConfig
  // Mock test-connection simulation (never used for real API calls)
  mockTestOutcome:   'success' | 'error'
  mockTestLatencyMs: number
  mockTestError?:    string
}

// ── Legacy compat (keep old types alive for dashboard widget) ──────────────
export type IntegrationType =
  | 'siem' | 'soar' | 'threat_intel' | 'ticketing' | 'notification' | 'custom'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending'

export const INTEGRATION_EVENT_TYPES: { id: string; label: string }[] = [
  { id: 'auth_failure',     label: 'Auth Failures'          },
  { id: 'port_scan',        label: 'Port Scans'             },
  { id: 'web_attack',       label: 'Web Attacks'            },
  { id: 'exploit_attempt',  label: 'Exploit Attempts'       },
  { id: 'malware',          label: 'Malware Activity'       },
  { id: 'c2_beacon',        label: 'C2 Beacons'             },
  { id: 'lateral_movement', label: 'Lateral Movement'       },
  { id: 'exfiltration',     label: 'Data Exfiltration'      },
]

export const INTEGRATION_CATEGORIES: { id: IntegrationCategory | 'all'; label: string }[] = [
  { id: 'all',              label: 'All'              },
  { id: 'siem',             label: 'SIEM'             },
  { id: 'threat-intel',     label: 'Threat Intel'     },
  { id: 'alerting',         label: 'Alerting'         },
  { id: 'case-management',  label: 'Case Management'  },
  { id: 'storage',          label: 'Storage'          },
  { id: 'email',            label: 'Email'            },
]
