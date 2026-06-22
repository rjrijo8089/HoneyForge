'use client'
import { useState, useCallback, useId } from 'react'
import {
  X, Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle,
  RefreshCw, Lock, Shield, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { INTEGRATION_EVENT_TYPES } from '@/types/integration'
import type { Integration, IntegrationConfig, IntegrationSeverityThreshold, IntegrationEmailFrequency } from '@/types/integration'

/* ─── Field primitives ─── */
interface LabelProps { children: React.ReactNode; htmlFor?: string; hint?: string }
function Label({ children, htmlFor, hint }: LabelProps) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-widest text-hf-dim">
        {children}
      </label>
      {hint && <span className="ml-2 text-[9px] text-hf-dim/70 normal-case">{hint}</span>}
    </div>
  )
}

const fieldCls = 'w-full bg-hf-bg/60 border border-hf-border/60 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim/60 focus:outline-none focus:border-hf-primary/60 transition-colors'

interface SecretInputProps {
  id: string; value: string; onChange: (v: string) => void
  placeholder?: string; autoComplete?: string
}
function SecretInput({ id, value, onChange, placeholder, autoComplete = 'off' }: SecretInputProps) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id} type={show ? 'text' : 'password'} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(fieldCls, 'pr-9 font-mono')}
      />
      <button
        type="button" onClick={() => setShow((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hf-dim hover:text-hf-muted transition-colors"
      >
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

/* ─── Test connection result ─── */
type TestStatus = 'idle' | 'running' | 'success' | 'error'
interface TestResult { status: TestStatus; message: string; latencyMs?: number }

/* ─── Severity options ─── */
const SEVERITIES: { value: IntegrationSeverityThreshold; label: string }[] = [
  { value: 'all',      label: 'All Events'          },
  { value: 'low',      label: 'Low and above'        },
  { value: 'medium',   label: 'Medium and above'     },
  { value: 'high',     label: 'High and above'       },
  { value: 'critical', label: 'Critical only'        },
]

/* ─── Category-specific destination label ─── */
const DEST_LABEL: Record<string, string> = {
  siem:             'Index / Data Stream',
  'threat-intel':   'Organization / Feed Name',
  alerting:         'Channel / Topic',
  'case-management':'Project Key / Table Name',
  storage:          'Bucket Name',
  email:            'Primary Recipient (optional)',
}

const DEST_PLACEHOLDER: Record<string, string> = {
  siem:             'e.g. honeypot-events',
  'threat-intel':   'e.g. HoneyForge-Org',
  alerting:         'e.g. #soc-alerts',
  'case-management':'e.g. SOC or incident',
  storage:          'e.g. honeypot-events-prod',
  email:            'e.g. soc@corp.com',
}

interface Props {
  integration: Integration
  onClose: () => void
  onSave:  (id: string, config: IntegrationConfig) => void
}

export function IntegrationConfigModal({ integration, onClose, onSave }: Props) {
  const uid = useId()
  const [cfg, setCfg] = useState<IntegrationConfig>({ ...integration.config })
  const [test, setTest] = useState<TestResult>({ status: 'idle', message: '' })
  const [saving, setSaving] = useState(false)

  const set = useCallback(<K extends keyof IntegrationConfig>(key: K, value: IntegrationConfig[K]) => {
    setCfg((prev) => ({ ...prev, [key]: value }))
    setTest({ status: 'idle', message: '' }) // clear test result on any change
  }, [])

  const toggleEventType = useCallback((id: string) => {
    setCfg((prev) => {
      const types = prev.eventTypes.includes(id)
        ? prev.eventTypes.filter((t) => t !== id)
        : [...prev.eventTypes, id]
      return { ...prev, eventTypes: types }
    })
  }, [])

  const handleTest = useCallback(async () => {
    setTest({ status: 'running', message: 'Connecting…' })
    await new Promise((r) => setTimeout(r, 1600))
    if (integration.mockTestOutcome === 'success') {
      setTest({
        status: 'success',
        message: `Connected successfully. Endpoint reachable and authenticated.`,
        latencyMs: integration.mockTestLatencyMs,
      })
    } else {
      setTest({
        status: 'error',
        message: integration.mockTestError ?? 'Connection failed — check endpoint and credentials.',
      })
    }
  }, [integration])

  const handleSave = useCallback(async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    onSave(integration.id, cfg)
    setSaving(false)
    onClose()
  }, [cfg, integration.id, onSave, onClose])

  const cat = integration.category

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col bg-hf-surface border border-hf-border/60 rounded-2xl shadow-2xl animate-fade-in">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hf-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-hf-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-hf-text">{integration.name}</h2>
              <p className="text-[10px] text-hf-dim capitalize">{cat.replace('-', ' ')} integration</p>
            </div>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Security warning ── */}
          <div className="flex gap-3 rounded-xl border border-hf-warning/30 bg-hf-warning/5 px-4 py-3">
            <Lock className="w-4 h-4 text-hf-warning shrink-0 mt-0.5" />
            <div className="text-[11px] text-hf-muted leading-relaxed">
              <span className="font-bold text-hf-warning">Secrets are server-side only.</span>{' '}
              API keys and credentials entered here are transmitted over TLS to the HoneyForge backend
              and stored encrypted at rest. They are <span className="font-semibold">never</span> persisted
              in browser storage, logged, or exposed to client-side code.
              Pre-configured keys are shown redacted — leave the field blank to keep the existing value.
            </div>
          </div>

          {/* ── Connection section ── */}
          <fieldset className="glass-card border border-hf-border/30 rounded-xl p-4 space-y-4">
            <legend className="text-[9px] font-bold text-hf-dim uppercase tracking-widest px-1">Connection</legend>

            <div>
              <Label htmlFor={`${uid}-url`} hint={cat === 'alerting' && integration.vendorKey === 'slack' ? '(Slack Incoming Webhook URL)' : undefined}>
                {cat === 'storage' ? 'Endpoint URL' : cat === 'email' ? 'SMTP / API URL' : 'API URL'}
              </Label>
              <input
                id={`${uid}-url`} type="url" value={cfg.apiUrl} onChange={(e) => set('apiUrl', e.target.value)}
                placeholder={
                  cat === 'storage'  ? 'https://s3.amazonaws.com' :
                  cat === 'alerting' && integration.vendorKey === 'slack' ? 'https://hooks.slack.com/services/…' :
                  cat === 'alerting' ? 'https://your-webhook-endpoint.com' :
                  'https://your-platform.example.com'
                }
                className={fieldCls}
              />
            </div>

            {/* API key — not shown for Slack (webhook URL is the secret) */}
            {!(cat === 'alerting' && integration.vendorKey === 'slack') && (
              <div>
                <Label htmlFor={`${uid}-key`} hint="Leave blank to keep existing key">
                  {cat === 'storage' ? 'Access Key ID' : cat === 'email' ? 'API Key / Token' : 'API Key / Bearer Token'}
                </Label>
                <SecretInput
                  id={`${uid}-key`} value={cfg.apiKey} onChange={(v) => set('apiKey', v)}
                  placeholder={cfg.apiKey || 'Paste key or token…'}
                />
              </div>
            )}

            {/* S3 secret key */}
            {cat === 'storage' && (
              <div>
                <Label htmlFor={`${uid}-sec`} hint="Leave blank to keep existing secret">
                  Secret Access Key
                </Label>
                <SecretInput
                  id={`${uid}-sec`} value={cfg.secondaryKey ?? ''} onChange={(v) => set('secondaryKey', v)}
                  placeholder={cfg.secondaryKey || 'Paste secret access key…'}
                />
              </div>
            )}

            {/* S3 region */}
            {cat === 'storage' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`${uid}-region`}>Region</Label>
                  <input
                    id={`${uid}-region`} value={cfg.region ?? ''} onChange={(e) => set('region', e.target.value)}
                    placeholder="e.g. us-east-1"
                    className={fieldCls}
                  />
                </div>
                <div>
                  <Label htmlFor={`${uid}-prefix`}>Path Prefix</Label>
                  <input
                    id={`${uid}-prefix`} value={cfg.pathPrefix ?? ''} onChange={(e) => set('pathPrefix', e.target.value)}
                    placeholder="e.g. events/v1"
                    className={fieldCls}
                  />
                </div>
              </div>
            )}

            {/* Verify SSL toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={cn(
                'relative w-9 h-5 rounded-full border transition-all duration-200',
                cfg.verifySSL ? 'bg-hf-success/20 border-hf-success/50' : 'bg-hf-surface-3 border-hf-border'
              )} onClick={() => set('verifySSL', !cfg.verifySSL)}>
                <span className={cn(
                  'absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200',
                  cfg.verifySSL ? 'translate-x-4 bg-hf-success' : 'translate-x-0 bg-hf-dim'
                )} />
              </div>
              <span className="text-xs text-hf-muted group-hover:text-hf-text transition-colors">Verify TLS/SSL certificate</span>
              {!cfg.verifySSL && (
                <span className="text-[9px] text-hf-warning flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Insecure — only disable for self-signed certs in trusted networks
                </span>
              )}
            </label>
          </fieldset>

          {/* ── Destination ── */}
          <fieldset className="glass-card border border-hf-border/30 rounded-xl p-4 space-y-4">
            <legend className="text-[9px] font-bold text-hf-dim uppercase tracking-widest px-1">Destination</legend>

            <div>
              <Label htmlFor={`${uid}-dest`}>
                {DEST_LABEL[cat] ?? 'Destination'}
              </Label>
              <input
                id={`${uid}-dest`} value={cfg.destination} onChange={(e) => set('destination', e.target.value)}
                placeholder={DEST_PLACEHOLDER[cat] ?? ''}
                className={fieldCls}
              />
            </div>

            {/* MISP distribution level */}
            {cat === 'threat-intel' && (
              <div>
                <Label htmlFor={`${uid}-dist`}>Sharing Distribution</Label>
                <div className="relative">
                  <select
                    id={`${uid}-dist`} value={cfg.distributeLevel ?? 'This community only'}
                    onChange={(e) => set('distributeLevel', e.target.value)}
                    className={cn(fieldCls, 'appearance-none pr-8')}
                  >
                    {['Your organisation only','This community only','Connected communities','All communities'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
                </div>
              </div>
            )}

            {/* Email fields */}
            {cat === 'email' && (
              <>
                <div>
                  <Label htmlFor={`${uid}-rcpt`}>Recipient List</Label>
                  <input
                    id={`${uid}-rcpt`} value={cfg.recipientList ?? ''} onChange={(e) => set('recipientList', e.target.value)}
                    placeholder="soc@corp.com, ciso@corp.com"
                    className={fieldCls}
                  />
                  <p className="mt-1 text-[9px] text-hf-dim">Comma-separated list of recipient addresses.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`${uid}-from`}>From Address</Label>
                    <input
                      id={`${uid}-from`} value={cfg.fromAddress ?? ''} onChange={(e) => set('fromAddress', e.target.value)}
                      placeholder="honeyforge@corp.com"
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${uid}-freq`}>Send Frequency</Label>
                    <div className="relative">
                      <select
                        id={`${uid}-freq`} value={cfg.emailFrequency ?? 'hourly'}
                        onChange={(e) => set('emailFrequency', e.target.value as IntegrationEmailFrequency)}
                        className={cn(fieldCls, 'appearance-none pr-8')}
                      >
                        <option value="realtime">Real-time (per event)</option>
                        <option value="hourly">Hourly digest</option>
                        <option value="daily">Daily digest</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Slack options */}
            {cat === 'alerting' && integration.vendorKey === 'slack' && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={cn(
                  'relative w-9 h-5 rounded-full border transition-all duration-200',
                  cfg.mentionOnCritical ? 'bg-hf-success/20 border-hf-success/50' : 'bg-hf-surface-3 border-hf-border'
                )} onClick={() => set('mentionOnCritical', !cfg.mentionOnCritical)}>
                  <span className={cn(
                    'absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200',
                    cfg.mentionOnCritical ? 'translate-x-4 bg-hf-success' : 'translate-x-0 bg-hf-dim'
                  )} />
                </div>
                <span className="text-xs text-hf-muted">@channel mention on Critical severity events</span>
              </label>
            )}

            {/* Case management auto-create */}
            {cat === 'case-management' && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={cn(
                  'relative w-9 h-5 rounded-full border transition-all duration-200',
                  cfg.autoCreateCase ? 'bg-hf-success/20 border-hf-success/50' : 'bg-hf-surface-3 border-hf-border'
                )} onClick={() => set('autoCreateCase', !cfg.autoCreateCase)}>
                  <span className={cn(
                    'absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200',
                    cfg.autoCreateCase ? 'translate-x-4 bg-hf-success' : 'translate-x-0 bg-hf-dim'
                  )} />
                </div>
                <span className="text-xs text-hf-muted">Automatically create cases for events above threshold</span>
              </label>
            )}
          </fieldset>

          {/* ── Filtering ── */}
          <fieldset className="glass-card border border-hf-border/30 rounded-xl p-4 space-y-4">
            <legend className="text-[9px] font-bold text-hf-dim uppercase tracking-widest px-1">Event Filtering</legend>

            {/* Severity threshold */}
            <div>
              <Label htmlFor={`${uid}-sev`}>Minimum Severity</Label>
              <div className="relative">
                <select
                  id={`${uid}-sev`} value={cfg.severityThreshold}
                  onChange={(e) => set('severityThreshold', e.target.value as IntegrationSeverityThreshold)}
                  className={cn(fieldCls, 'appearance-none pr-8')}
                >
                  {SEVERITIES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
              </div>
            </div>

            {/* Event types */}
            <div>
              <Label hint="— empty = all types forwarded">Event Types</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1.5">
                {INTEGRATION_EVENT_TYPES.map(({ id, label }) => {
                  const checked = cfg.eventTypes.includes(id)
                  return (
                    <label key={id} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleEventType(id)}
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                          checked
                            ? 'bg-hf-primary border-hf-primary'
                            : 'border-hf-border group-hover:border-hf-primary/50'
                        )}
                      >
                        {checked && <span className="text-white text-[10px] leading-none font-bold">✓</span>}
                      </div>
                      <span className="text-xs text-hf-muted group-hover:text-hf-text transition-colors">{label}</span>
                    </label>
                  )
                })}
              </div>
              <button
                onClick={() => set('eventTypes', cfg.eventTypes.length === INTEGRATION_EVENT_TYPES.length ? [] : INTEGRATION_EVENT_TYPES.map((e) => e.id))}
                className="mt-2 text-[10px] text-hf-primary hover:underline"
              >
                {cfg.eventTypes.length === INTEGRATION_EVENT_TYPES.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
          </fieldset>

          {/* ── Test connection ── */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              isLoading={test.status === 'running'}
              disabled={test.status === 'running'}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {test.status === 'running' ? 'Testing connection…' : 'Test Connection'}
            </Button>

            {test.status !== 'idle' && test.status !== 'running' && (
              <div className={cn(
                'flex items-start gap-2.5 rounded-xl border px-3 py-2.5 animate-fade-in',
                test.status === 'success'
                  ? 'border-hf-success/30 bg-hf-success/8'
                  : 'border-hf-danger/30 bg-hf-danger/8'
              )}>
                {test.status === 'success'
                  ? <CheckCircle2 className="w-4 h-4 text-hf-success shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-hf-danger shrink-0 mt-0.5" />
                }
                <div>
                  <p className={cn('text-xs font-semibold', test.status === 'success' ? 'text-hf-success' : 'text-hf-danger')}>
                    {test.status === 'success' ? 'Connection successful' : 'Connection failed'}
                    {test.latencyMs != null && (
                      <span className="ml-2 font-mono font-normal text-hf-dim">{test.latencyMs}ms</span>
                    )}
                  </p>
                  <p className="text-[11px] text-hf-muted mt-0.5">{test.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-hf-border/40 shrink-0">
          <p className="text-[9px] text-hf-dim flex items-center gap-1">
            <Lock className="w-3 h-3" /> Changes apply on next sync cycle
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={saving} onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
