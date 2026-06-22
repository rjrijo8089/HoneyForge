export type ReportCategory = 'executive' | 'technical' | 'threat' | 'compliance'
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'manual'
export type ReportFormat    = 'pdf' | 'csv' | 'json'
export type ReportDelivery  = 'email' | 'slack' | 'webhook'
export type ReportStatus    = 'active' | 'paused' | 'draft'
export type RunStatus       = 'ready' | 'generating' | 'failed'

export interface ReportSchedule {
  frequency:    ReportFrequency
  dayOfWeek?:   number     // 0=Sun … 6=Sat (weekly only)
  dayOfMonth?:  number     // 1-31 (monthly only)
  hour:         number     // UTC hour
  recipients:   string[]
  format:       ReportFormat
  delivery:     ReportDelivery[]
  webhookUrl?:  string
  slackChannel?: string
}

export interface ReportRunSummary {
  runId:     string
  status:    RunStatus
  at:        string
  fileSize?: number
}

export interface ReportMetric {
  label:   string
  value:   string
  change?: string
  trend:   'up' | 'down' | 'neutral'
  accent:  'blue' | 'green' | 'red' | 'yellow' | 'cyan'
}

export interface TrendPoint {
  label: string
  value: number
  secondary?: number
}

export interface RankedItem {
  name:    string
  code?:   string   // country code
  count:   number
  percent: number
}

export interface FindingItem {
  severity:    'critical' | 'high' | 'medium' | 'low'
  title:       string
  description: string
}

export interface ReportPreviewData {
  metrics:            ReportMetric[]
  trendData:          TrendPoint[]
  trendLabel:         string
  topAttackTypes:     RankedItem[]
  topCountries:       RankedItem[]
  criticalFindings:   FindingItem[]
  recommendedActions: string[]
  executiveSummary:   string
}

export interface ReportTemplate {
  id:          string
  name:        string
  slug:        string        // maps to icon in component
  category:    ReportCategory
  description: string
  status:      ReportStatus
  schedule:    ReportSchedule
  lastRun?:    ReportRunSummary
  owner:       string
  createdAt:   string
  preview:     ReportPreviewData
}

// ── Legacy compat ──
export type ReportType = 'executive' | 'technical' | 'threat_summary' | 'compliance' | 'custom'
export interface Report {
  id: string; name: string; type: ReportType; status: RunStatus
  format: ReportFormat
  period: { start: string; end: string }
  fileSize?: number; generatedAt?: string; scheduledAt?: string
  downloadUrl?: string; createdBy: string
}
