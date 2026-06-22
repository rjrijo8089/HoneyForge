'use client'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { ToggleSwitch } from './ToggleSwitch'
import type { WizardStep4 } from './types'

interface StepIntegrationsProps {
  data: WizardStep4
  onChange: (data: WizardStep4) => void
}

type IntKey = keyof WizardStep4

const INTEGRATIONS: {
  key: IntKey
  label: string
  vendor: string
  type: string
  color: string
  icon: string
  desc: string
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
}[] = [
  {
    key: 'opensearch', label: 'OpenSearch', vendor: 'OpenSearch', type: 'SIEM',
    color: '#3b82f6', icon: 'OS',
    desc: 'Forward events to an OpenSearch cluster. Used by Cowrie and other HoneyForge sensors.',
    fields: [
      { key: 'host', label: 'Host', placeholder: 'localhost or 10.0.0.50' },
      { key: 'port', label: 'Port', placeholder: '9200' },
    ],
  },
  {
    key: 'splunk', label: 'Splunk', vendor: 'Splunk Inc.', type: 'SIEM',
    color: '#f97316', icon: 'SP',
    desc: 'Stream events via Splunk HEC (HTTP Event Collector).',
    fields: [
      { key: 'hecUrl', label: 'HEC URL', placeholder: 'https://splunk:8088/services/collector' },
      { key: 'token',  label: 'HEC Token', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', secret: true },
    ],
  },
  {
    key: 'sentinel', label: 'Microsoft Sentinel', vendor: 'Microsoft', type: 'SIEM',
    color: '#0078d4', icon: 'MS',
    desc: 'Push events to Azure Sentinel via the Log Analytics Data Collector API.',
    fields: [
      { key: 'workspaceId', label: 'Workspace ID',  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'sharedKey',   label: 'Primary Key',   placeholder: 'Your Workspace Primary Key', secret: true },
    ],
  },
  {
    key: 'qradar', label: 'IBM QRadar', vendor: 'IBM', type: 'SIEM',
    color: '#0f62fe', icon: 'QR',
    desc: 'Send syslog events to a QRadar SIEM instance.',
    fields: [
      { key: 'host', label: 'QRadar Host', placeholder: '10.0.0.60' },
      { key: 'port', label: 'Syslog Port', placeholder: '514'       },
    ],
  },
  {
    key: 'misp', label: 'MISP', vendor: 'CIRCL', type: 'Threat Intel',
    color: '#16a34a', icon: 'MI',
    desc: 'Automatically create threat events and IOCs in your MISP instance.',
    fields: [
      { key: 'url',    label: 'MISP URL',   placeholder: 'https://misp.internal.corp' },
      { key: 'apiKey', label: 'API Key',    placeholder: 'Your MISP automation key', secret: true },
    ],
  },
  {
    key: 'slack', label: 'Slack', vendor: 'Slack Technologies', type: 'Alerting',
    color: '#4a154b', icon: 'SL',
    desc: 'Send critical attack notifications to a Slack channel via webhook.',
    fields: [
      { key: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/services/…' },
    ],
  },
  {
    key: 'email', label: 'Email / SMTP', vendor: 'SMTP', type: 'Alerting',
    color: '#dc2626', icon: '✉',
    desc: 'Receive email alerts for critical events and daily summary reports.',
    fields: [
      { key: 'address', label: 'Alert Address', placeholder: 'soc-team@company.com' },
    ],
  },
  {
    key: 'webhook', label: 'Generic Webhook', vendor: 'Custom', type: 'Integration',
    color: '#8b5cf6', icon: '{}',
    desc: 'POST JSON event payloads to any endpoint — for custom SOAR or ticketing systems.',
    fields: [
      { key: 'url', label: 'Endpoint URL', placeholder: 'https://soar.internal.corp/api/ingest' },
    ],
  },
]

export function StepIntegrations({ data, onChange }: StepIntegrationsProps) {
  const enabledCount = Object.values(data).filter((v) => v.enabled).length

  const toggleIntegration = (key: IntKey, enabled: boolean) => {
    onChange({ ...data, [key]: { ...data[key], enabled } })
  }

  const updateField = (key: IntKey, field: string, value: string) => {
    onChange({ ...data, [key]: { ...data[key], [field]: value } })
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="glass-card rounded-xl border border-hf-border/40 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-hf-text">{enabledCount} integration{enabledCount !== 1 ? 's' : ''} enabled</p>
          <p className="text-xs text-hf-muted mt-0.5">Events will be forwarded to all enabled endpoints in real-time</p>
        </div>
        {enabledCount > 0 && (
          <div className="flex gap-1.5">
            {INTEGRATIONS.filter((i) => data[i.key].enabled).map((i) => (
              <span
                key={i.key}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                style={{ color: i.color, borderColor: `${i.color}40`, background: `${i.color}10` }}
              >
                {i.icon}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Integration cards */}
      <div className="space-y-3">
        {INTEGRATIONS.map((integ) => {
          const entry   = data[integ.key]
          const enabled = entry.enabled
          const entryAsRecord = entry as Record<string, string | boolean>

          return (
            <div
              key={integ.key}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all',
                enabled ? 'border-opacity-40' : 'glass-card border-hf-border/40'
              )}
              style={enabled ? { borderColor: `${integ.color}40`, background: `${integ.color}08` } : {}}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => toggleIntegration(integ.key, !enabled)}
              >
                {/* Logo */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                  style={{
                    background: `${integ.color}20`,
                    border: `1px solid ${integ.color}40`,
                    color: integ.color,
                  }}
                >
                  {integ.icon}
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-hf-text">{integ.label}</p>
                    <span className="text-[9px] text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1.5 py-0.5 rounded">
                      {integ.type}
                    </span>
                  </div>
                  <p className="text-xs text-hf-muted mt-0.5 truncate">{integ.desc}</p>
                </div>

                {/* Toggle */}
                <div onClick={(e) => e.stopPropagation()}>
                  <ToggleSwitch
                    checked={enabled}
                    onChange={(v) => toggleIntegration(integ.key, v)}
                  />
                </div>
              </div>

              {/* Config fields (slide in when enabled) */}
              {enabled && integ.fields.length > 0 && (
                <div className="px-4 pb-4 pt-0 space-y-3 border-t border-hf-border/20">
                  <div className={cn(
                    'grid gap-3',
                    integ.fields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                  )}>
                    {integ.fields.map((field) => (
                      <Input
                        key={field.key}
                        label={field.label}
                        type={field.secret ? 'password' : 'text'}
                        value={(entryAsRecord[field.key] as string) ?? ''}
                        onChange={(e) => updateField(integ.key, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        autoComplete={field.secret ? 'new-password' : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
