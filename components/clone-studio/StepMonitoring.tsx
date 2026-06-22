'use client'
import { cn } from '@/lib/utils'
import { ToggleSwitch } from './ToggleSwitch'
import type { WizardStep3 } from './types'

interface StepMonitoringProps {
  data: WizardStep3
  onChange: (data: WizardStep3) => void
}

type MonitorKey = keyof WizardStep3

const MONITOR_RULES: {
  key: MonitorKey
  label: string
  desc: string
  badge?: { label: string; color: string }
  tannerPlugin: string
}[] = [
  {
    key: 'sqlInjection',
    label: 'SQL Injection Detection',
    desc: "Detects UNION, SELECT, DROP, and blind SQLi payloads in form fields and query strings.",
    badge: { label: 'Critical', color: 'text-severity-critical border-severity-critical/40 bg-severity-critical/10' },
    tannerPlugin: 'sql_injection',
  },
  {
    key: 'xss',
    label: 'XSS Detection',
    desc: "Captures cross-site scripting payloads — reflected, stored, and DOM-based variants.",
    badge: { label: 'Critical', color: 'text-severity-critical border-severity-critical/40 bg-severity-critical/10' },
    tannerPlugin: 'xss',
  },
  {
    key: 'lfi',
    label: 'LFI Detection',
    desc: "Local File Inclusion — detects path traversal targeting /etc/passwd, /proc/self, etc.",
    badge: { label: 'High', color: 'text-severity-high border-severity-high/40 bg-severity-high/10' },
    tannerPlugin: 'lfi',
  },
  {
    key: 'rfi',
    label: 'RFI Detection',
    desc: "Remote File Inclusion — detects attempts to include externally hosted malicious scripts.",
    badge: { label: 'High', color: 'text-severity-high border-severity-high/40 bg-severity-high/10' },
    tannerPlugin: 'rfi',
  },
  {
    key: 'commandInjection',
    label: 'Command Injection Detection',
    desc: "Detects OS command injection through pipes, backticks, and common shell metacharacters.",
    badge: { label: 'Critical', color: 'text-severity-critical border-severity-critical/40 bg-severity-critical/10' },
    tannerPlugin: 'cmd_injection',
  },
  {
    key: 'credentialLogging',
    label: 'Credential Attempt Logging',
    desc: "Captures all authentication attempts — username/password pairs submitted to any login form.",
    badge: { label: 'Recommended', color: 'text-hf-success border-hf-success/40 bg-hf-success/10' },
    tannerPlugin: 'login_attempt',
  },
  {
    key: 'directoryTraversal',
    label: 'Directory Traversal Detection',
    desc: "Detects path manipulation attacks using ../, %2e%2e, double-encoded sequences.",
    badge: { label: 'High', color: 'text-severity-high border-severity-high/40 bg-severity-high/10' },
    tannerPlugin: 'path_traversal',
  },
  {
    key: 'payloadCapture',
    label: 'Full Payload Capture',
    desc: "Store complete POST body, file uploads, and query params for forensic analysis.",
    badge: { label: 'Recommended', color: 'text-hf-success border-hf-success/40 bg-hf-success/10' },
    tannerPlugin: 'payload_capture',
  },
  {
    key: 'userAgentCapture',
    label: 'User-Agent Capture',
    desc: "Log browser fingerprints and scanner signatures (Nikto, sqlmap, Burp, curl, etc.).",
    badge: { label: 'Recommended', color: 'text-hf-success border-hf-success/40 bg-hf-success/10' },
    tannerPlugin: 'useragent_capture',
  },
  {
    key: 'cookieCapture',
    label: 'Cookie Capture',
    desc: "Capture all cookie values set or sent by attackers — useful for session token analysis.",
    tannerPlugin: 'cookie_capture',
  },
  {
    key: 'headerCapture',
    label: 'Header Capture',
    desc: "Log all HTTP request headers including X-Forwarded-For, Referer, and custom headers.",
    tannerPlugin: 'header_capture',
  },
]

const GROUPS = [
  { label: 'Attack Detection', keys: ['sqlInjection','xss','lfi','rfi','commandInjection','directoryTraversal'] },
  { label: 'Data Collection',  keys: ['credentialLogging','payloadCapture','userAgentCapture','cookieCapture','headerCapture'] },
]

export function StepMonitoring({ data, onChange }: StepMonitoringProps) {
  const update = (key: MonitorKey, val: boolean) => onChange({ ...data, [key]: val })

  const enabledCount = Object.values(data).filter(Boolean).length
  const totalCount   = MONITOR_RULES.length

  const selectAll = () => onChange({
    sqlInjection: true, xss: true, lfi: true, rfi: true, commandInjection: true,
    credentialLogging: true, directoryTraversal: true, payloadCapture: true,
    userAgentCapture: true, cookieCapture: true, headerCapture: true,
  })
  const clearAll = () => onChange({
    sqlInjection: false, xss: false, lfi: false, rfi: false, commandInjection: false,
    credentialLogging: false, directoryTraversal: false, payloadCapture: false,
    userAgentCapture: false, cookieCapture: false, headerCapture: false,
  })

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex items-center justify-between glass-card rounded-xl border border-hf-border/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-hf-text">{enabledCount} / {totalCount} detection rules enabled</p>
          <p className="text-xs text-hf-muted mt-0.5">TANNER will apply these rules to all incoming requests</p>
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-hf-primary hover:underline">Enable all</button>
          <span className="text-hf-border">·</span>
          <button onClick={clearAll}  className="text-xs text-hf-dim hover:text-hf-muted hover:underline">Clear all</button>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => {
        const rules = MONITOR_RULES.filter((r) => group.keys.includes(r.key))
        return (
          <div key={group.label}>
            <h4 className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2 px-1">{group.label}</h4>
            <div className="space-y-2">
              {rules.map((rule) => {
                const active = data[rule.key]
                return (
                  <div
                    key={rule.key}
                    onClick={() => update(rule.key, !active)}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                      active
                        ? 'bg-hf-primary/5 border-hf-primary/30'
                        : 'glass-card border-hf-border/40 hover:border-hf-border-2'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn('text-sm font-semibold', active ? 'text-hf-text' : 'text-hf-muted')}>
                          {rule.label}
                        </p>
                        {rule.badge && (
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border', rule.badge.color)}>
                            {rule.badge.label}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-hf-dim bg-hf-surface-3 border border-hf-border/30 px-1.5 py-0.5 rounded">
                          {rule.tannerPlugin}
                        </span>
                      </div>
                      <p className="text-xs text-hf-muted mt-0.5 leading-relaxed">{rule.desc}</p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0 pt-0.5">
                      <ToggleSwitch checked={active} onChange={(v) => update(rule.key, v)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
