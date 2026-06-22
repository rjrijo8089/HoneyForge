'use client'
import { useState } from 'react'
import {
  X, User, Globe, Monitor, Calendar, Code2,
  ChevronDown, ChevronRight, Clock, ShieldAlert,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { AuditLog, AuditOutcome, AuditRiskLevel, AuditAction } from '@/types/audit'
import { AUDIT_ACTION_LABELS } from '@/types/audit'

/* ── Palette helpers ── */
const OUTCOME_META: Record<AuditOutcome, { label: string; cls: string; dot: string }> = {
  success: { label: 'Success', cls: 'text-hf-success border-hf-success/30 bg-hf-success/10', dot: 'bg-hf-success' },
  warning: { label: 'Warning', cls: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10', dot: 'bg-hf-warning' },
  failed:  { label: 'Failed',  cls: 'text-hf-danger  border-hf-danger/30  bg-hf-danger/10',  dot: 'bg-hf-danger'  },
}
const RISK_META: Record<AuditRiskLevel, { cls: string; bg: string }> = {
  low:      { cls: 'text-hf-dim     border-hf-border',      bg: 'bg-hf-dim/10'      },
  medium:   { cls: 'text-hf-accent  border-hf-accent/30',   bg: 'bg-hf-accent/10'   },
  high:     { cls: 'text-hf-warning border-hf-warning/30',  bg: 'bg-hf-warning/10'  },
  critical: { cls: 'text-hf-danger  border-hf-danger/30',   bg: 'bg-hf-danger/10'   },
}
const ACTION_COLOR: Partial<Record<AuditAction, string>> = {
  login: 'text-blue-400', logout: 'text-blue-400/60',
  decoy_created: 'text-cyan-400', decoy_paused: 'text-cyan-400/70', decoy_deleted: 'text-cyan-300/60', decoy_updated: 'text-cyan-400/60',
  clone_studio_changed: 'text-purple-400',
  event_marked_attack: 'text-orange-400', event_marked_benign: 'text-hf-success',
  ioc_exported: 'text-yellow-400',
  integration_configured: 'text-teal-400', integration_removed: 'text-teal-300/60',
  rule_enabled: 'text-hf-primary', rule_disabled: 'text-hf-primary/60', rule_created: 'text-hf-primary', rule_updated: 'text-hf-primary/80',
  report_generated: 'text-hf-muted',
  settings_changed: 'text-red-400',
  user_created: 'text-violet-400', user_deleted: 'text-violet-400/60', role_changed: 'text-violet-300',
  threat_assigned: 'text-hf-accent', threat_resolved: 'text-hf-accent/60',
}

/* ── Helper sub-components ── */
function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{className?: string}>; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-hf-dim flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {title}
      </p>
      {children}
    </div>
  )
}

function KV({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] text-hf-dim min-w-[100px] shrink-0 pt-px">{label}</span>
      <span className={cn('text-[11px] text-hf-muted flex-1 break-all', mono && 'font-mono text-[10px]')}>{value}</span>
    </div>
  )
}

/* ── Related events (same actor, ±10 min) ── */
function RelatedEvents({ log, allLogs, onSelect }: { log: AuditLog; allLogs: AuditLog[]; onSelect: (l: AuditLog) => void }) {
  const ts  = new Date(log.timestamp).getTime()
  const win = 10 * 60 * 1000
  const related = allLogs.filter((l) =>
    l.id !== log.id &&
    l.userEmail === log.userEmail &&
    Math.abs(new Date(l.timestamp).getTime() - ts) <= win
  ).slice(0, 8)

  if (related.length === 0) return <p className="text-[10px] text-hf-dim/60 italic">No events within ±10 min for this actor</p>

  return (
    <div className="space-y-1">
      {related.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-hf-surface-3 transition-all text-left group"
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0',
            r.outcome === 'success' ? 'bg-hf-success' : r.outcome === 'warning' ? 'bg-hf-warning' : 'bg-hf-danger'
          )} />
          <span className="font-mono text-[10px] text-hf-dim shrink-0">{r.timestamp.slice(11,19)}</span>
          <span className={cn('text-[10px] font-medium', ACTION_COLOR[r.action] ?? 'text-hf-muted')}>
            {AUDIT_ACTION_LABELS[r.action] ?? r.action}
          </span>
          {r.resourceName && <span className="text-[9px] text-hf-dim truncate">→ {r.resourceName}</span>}
          <ChevronRight className="w-3 h-3 text-hf-dim/30 ml-auto group-hover:text-hf-dim transition-colors" />
        </button>
      ))}
    </div>
  )
}

interface Props {
  log:      AuditLog
  allLogs:  AuditLog[]
  onClose:  () => void
  onSelect: (l: AuditLog) => void
}

export function AuditDetailDrawer({ log, allLogs, onClose, onSelect }: Props) {
  const [showRaw, setShowRaw] = useState(false)

  const outcome = OUTCOME_META[log.outcome]
  const risk    = RISK_META[log.riskLevel]
  const initials = log.userEmail.slice(0, 2).toUpperCase()

  const detailEntries = Object.entries(log.details)

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl flex flex-col bg-hf-surface border-l border-hf-border shadow-2xl animate-slide-in-right">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 pt-4 pb-4 border-b border-hf-border/40">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-hf-dim mb-1">Audit Event Detail</p>
            <p className={cn('text-base font-bold', ACTION_COLOR[log.action] ?? 'text-hf-text')}>
              {AUDIT_ACTION_LABELS[log.action] ?? log.action}
            </p>
            <p className="text-[10px] font-mono text-hf-dim mt-0.5">{log.id}</p>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Outcome */}
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize', outcome.cls)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', outcome.dot)} />
            {outcome.label}
          </span>
          {/* Risk */}
          <span className={cn('text-xs font-bold uppercase border px-2 py-0.5 rounded', risk.cls)}>
            {log.riskLevel} risk
          </span>
          {/* Timestamp */}
          <span className="text-[10px] font-mono text-hf-dim flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDate(log.timestamp, 'long')}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* ── Actor ── */}
        <Section title="Actor" icon={User}>
          <div className="flex items-center gap-3 bg-hf-surface-2/50 border border-hf-border/30 rounded-xl p-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
              log.userRole === 'admin' ? 'bg-hf-primary/20 text-hf-primary' :
              log.userRole === 'analyst' ? 'bg-hf-accent/20 text-hf-accent' : 'bg-hf-dim/20 text-hf-muted'
            )}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-hf-text">{log.userEmail}</p>
              <p className="text-[10px] text-hf-dim capitalize">{log.userRole}</p>
              {log.sessionId && <p className="text-[9px] font-mono text-hf-dim/60 mt-0.5">{log.sessionId}</p>}
            </div>
          </div>
          <div className="space-y-1.5 bg-hf-bg/30 rounded-xl border border-hf-border/20 px-3 py-2.5">
            <KV label="User ID"    value={log.userId}      mono />
            <KV label="IP Address" value={<>
              <span className="font-mono">{log.ipAddress}</span>
              {(log.ipAddress.startsWith('203.') || log.ipAddress.startsWith('185.')) && (
                <span className="ml-2 text-[9px] text-hf-danger border border-hf-danger/30 px-1.5 py-0.5 rounded">External</span>
              )}
            </>} />
          </div>
        </Section>

        {/* ── Technical ── */}
        <Section title="Technical Info" icon={Monitor}>
          <div className="space-y-1.5 bg-hf-bg/30 rounded-xl border border-hf-border/20 px-3 py-2.5">
            <KV label="User Agent" value={log.userAgent} mono />
            {log.sessionId && <KV label="Session ID" value={log.sessionId} mono />}
          </div>
        </Section>

        {/* ── Resource ── */}
        {(log.resourceType || log.resourceName || log.resourceId) && (
          <Section title="Resource" icon={Globe}>
            <div className="space-y-1.5 bg-hf-bg/30 rounded-xl border border-hf-border/20 px-3 py-2.5">
              <KV label="Type" value={<span className="capitalize">{log.resourceType}</span>} />
              {log.resourceName && <KV label="Name"  value={log.resourceName} />}
              {log.resourceId   && <KV label="ID"    value={log.resourceId} mono />}
            </div>
          </Section>
        )}

        {/* ── Details ── */}
        {detailEntries.length > 0 && (
          <Section title="Event Details" icon={Calendar}>
            <div className="space-y-1.5 bg-hf-bg/30 rounded-xl border border-hf-border/20 px-3 py-2.5">
              {detailEntries.map(([k, v]) => (
                <KV key={k}
                  label={k.replace(/_/g, ' ')}
                  value={Array.isArray(v)
                    ? <div className="space-y-0.5">{(v as string[]).map((s, i) => <div key={i} className="font-mono text-[10px]">{s}</div>)}</div>
                    : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)
                  }
                />
              ))}
            </div>
            {/* Raw JSON toggle */}
            <button
              onClick={() => setShowRaw((p) => !p)}
              className="flex items-center gap-1.5 text-[10px] text-hf-dim hover:text-hf-muted transition-colors"
            >
              <Code2 className="w-3 h-3" />
              {showRaw ? 'Hide' : 'Show'} raw JSON
              {showRaw ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {showRaw && (
              <pre className="text-[10px] font-mono text-hf-muted bg-hf-bg border border-hf-border/30 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify({ id: log.id, action: log.action, outcome: log.outcome, riskLevel: log.riskLevel, details: log.details }, null, 2)}
              </pre>
            )}
          </Section>
        )}

        {/* ── Related events ── */}
        <Section title="Related Events (±10 min, same actor)" icon={ShieldAlert}>
          <RelatedEvents log={log} allLogs={allLogs} onSelect={onSelect} />
        </Section>
      </div>
    </div>
  )
}
