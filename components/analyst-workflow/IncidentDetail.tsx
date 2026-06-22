'use client'
import { useState } from 'react'
import {
  X, Globe, Cpu, Shield, Copy, Check, Hash, Repeat2,
  Tag, Link2, Network,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { IncidentStatusBadge } from './IncidentStatusBadge'
import type { AnalystIncident } from '@/types/analyst-workflow'

/* ── Confidence bar ── */
function ConfBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-hf-success' : value >= 70 ? 'bg-hf-warning' : value >= 50 ? 'bg-orange-400' : 'bg-hf-danger'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-hf-surface rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${value}%` }} />
      </div>
      <span className={cn('text-xs font-bold', color.replace('bg-', 'text-'))}>{value}%</span>
    </div>
  )
}

/* ── Copy button ── */
function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <button onClick={copy} className="text-hf-dim hover:text-hf-muted transition-colors">
      {copied ? <Check className="w-3 h-3 text-hf-success" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

/* ── Field row ── */
function Field({ label, value, mono, copyable, children }: {
  label: string; value?: string; mono?: boolean; copyable?: boolean; children?: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-0.5">{label}</p>
      {children ?? (
        <div className="flex items-center gap-1.5">
          <span className={cn('text-xs text-hf-text break-all', mono && 'font-mono')}>{value ?? '—'}</span>
          {copyable && value && <CopyBtn value={value} />}
        </div>
      )}
    </div>
  )
}

/* ── MITRE chip ── */
function MitreChip({ technique }: { technique: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-hf-warning/30 bg-hf-warning/8 text-hf-warning text-[10px] font-mono font-semibold">
      {technique}
    </span>
  )
}

/* ── Payload preview ── */
function PayloadBlock({ payload }: { payload: string }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const copy = () => { navigator.clipboard.writeText(payload); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const preview = expanded ? payload : payload.slice(0, 800)
  return (
    <div className="rounded-xl border border-hf-border/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-hf-surface/60 border-b border-hf-border/30">
        <span className="text-[10px] font-bold text-hf-dim uppercase tracking-widest">Payload / Request</span>
        <button onClick={copy} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted transition-colors">
          {copied ? <><Check className="w-3 h-3 text-hf-success" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="font-mono text-[11px] text-hf-text leading-relaxed p-3 bg-[#0a0c10] overflow-x-auto whitespace-pre-wrap break-all">
        {preview}{!expanded && payload.length > 800 && '…'}
      </pre>
      {payload.length > 800 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full py-1.5 text-[10px] text-hf-dim hover:text-hf-muted text-center border-t border-hf-border/20 bg-hf-surface/30 transition-colors"
        >
          {expanded ? 'Collapse' : `Show all ${payload.length} chars`}
        </button>
      )}
    </div>
  )
}

/* ── Tab button ── */
function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all',
        active ? 'text-hf-primary border-hf-primary' : 'text-hf-dim hover:text-hf-muted border-transparent'
      )}
    >
      {children}
    </button>
  )
}

interface Props {
  incident: AnalystIncident
  onClose: () => void
  actionPanel: React.ReactNode
  activityPanel: React.ReactNode
}

export function IncidentDetail({ incident: inc, onClose, actionPanel, activityPanel }: Props) {
  const [tab, setTab] = useState<'investigation' | 'activity'>('investigation')

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Header ── */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-hf-border/40">
        <div className="flex items-start gap-3">
          <SeverityBadge severity={inc.severity} size="md" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-hf-text leading-tight">{inc.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <IncidentStatusBadge status={inc.status} size="sm" />
              <span className="text-[10px] font-mono text-hf-dim">{inc.id}</span>
              <span className="text-[10px] text-hf-dim">{formatDate(inc.timestamp, 'relative')}</span>
              {inc.assignedToName && (
                <span className="text-[10px] text-hf-muted">
                  → <span className="font-semibold">{inc.assignedToName}</span>
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex items-center border-b border-hf-border/40 px-4">
        <TabBtn active={tab === 'investigation'} onClick={() => setTab('investigation')}>Investigation</TabBtn>
        <TabBtn active={tab === 'activity'}      onClick={() => setTab('activity')}>
          Activity
          {inc.comments.length > 0 && (
            <span className="ml-1.5 text-[9px] bg-hf-primary text-white rounded-full px-1 py-px">{inc.comments.length}</span>
          )}
        </TabBtn>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'investigation' && (
          <div className="p-4 space-y-5">

            {/* ── Event summary grid ── */}
            <div className="glass-card border border-hf-border/50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Event Summary
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <Field label="Source IP" value={inc.sourceIp} mono copyable />
                <Field label="Target Decoy" value={inc.targetDecoyName} />
                <Field label="Attack Type" value={inc.attackType} />
                <Field label="Detection Source">
                  <span className="font-mono text-xs bg-hf-surface/60 px-2 py-0.5 rounded border border-hf-border/30 text-hf-text">{inc.detectionSource}</span>
                </Field>
                <Field label="Confidence">
                  <ConfBar value={inc.confidence} />
                </Field>
                <Field label="Event Count">
                  <span className="text-xs font-bold text-hf-warning">{inc.eventCount.toLocaleString()}</span>
                </Field>
                <Field label="First Seen" value={formatDate(inc.firstSeen, 'long')} />
                <Field label="Last Seen"  value={formatDate(inc.lastSeen,  'long')} />
              </div>
            </div>

            {/* ── Network info ── */}
            <div className="glass-card border border-hf-border/50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Network className="w-3 h-3" /> Network
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <Field label="Source Port"  value={inc.sourcePort ? `:${inc.sourcePort}` : '—'} mono />
                <Field label="Target Port"  value={inc.targetPort ? `:${inc.targetPort}` : '—'} mono />
                <Field label="Protocol"     value={inc.targetProtocol ?? '—'} mono />
                <Field label="HTTP Method"  value={inc.requestMethod ?? '—'} mono />
                {inc.requestPath && <Field label="Request Path" value={inc.requestPath} mono copyable />}
                {inc.responseCode && <Field label="Response Code" value={String(inc.responseCode)} mono />}
                {inc.sourceCountry && (
                  <Field label="Origin Country">
                    <span className="flex items-center gap-1.5 text-xs text-hf-text">
                      <Globe className="w-3 h-3 text-hf-dim" />
                      {inc.sourceCountry}
                      {inc.sourceCountryCode && ` (${inc.sourceCountryCode})`}
                    </span>
                  </Field>
                )}
                {inc.sourceAsn && <Field label="ASN" value={`${inc.sourceAsn} — ${inc.sourceOrg ?? ''}`} mono />}
              </div>

              {/* Request headers */}
              {inc.requestHeaders && Object.keys(inc.requestHeaders).length > 0 && (
                <div className="mt-3 pt-3 border-t border-hf-border/20">
                  <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Request Headers</p>
                  <div className="space-y-1">
                    {Object.entries(inc.requestHeaders).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-[11px]">
                        <span className="font-mono text-hf-dim shrink-0">{k}:</span>
                        <span className="font-mono text-hf-muted break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── MITRE mapping ── */}
            {(inc.mitreTechniques.length > 0 || inc.mitreTactics.length > 0) && (
              <div className="glass-card border border-hf-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" /> MITRE ATT&amp;CK
                </p>
                <div className="space-y-2">
                  {inc.mitreTactics.length > 0 && (
                    <div>
                      <p className="text-[10px] text-hf-dim mb-1.5">Tactics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {inc.mitreTactics.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded border border-hf-primary/30 bg-hf-primary/8 text-hf-primary text-[10px] font-semibold">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {inc.mitreTechniques.length > 0 && (
                    <div>
                      <p className="text-[10px] text-hf-dim mb-1.5">Techniques</p>
                      <div className="flex flex-wrap gap-1.5">
                        {inc.mitreTechniques.map((t) => <MitreChip key={t} technique={t} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Payload ── */}
            {inc.payload && <PayloadBlock payload={inc.payload} />}

            {/* ── Campaign link ── */}
            {inc.campaignName && (
              <div className="glass-card border border-hf-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Link2 className="w-3 h-3" /> Campaign
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded border border-hf-danger/30 bg-hf-danger/8 text-hf-danger text-xs font-semibold">{inc.campaignName}</span>
                  {inc.malwareFamily && (
                    <span className="px-2 py-1 rounded border border-purple-400/30 bg-purple-400/8 text-purple-400 text-xs font-semibold">{inc.malwareFamily}</span>
                  )}
                </div>
              </div>
            )}

            {/* ── IOC refs ── */}
            {inc.iocIds.length > 0 && (
              <div className="glass-card border border-hf-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Hash className="w-3 h-3" /> Linked IOCs
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {inc.iocIds.map((id) => (
                    <span key={id} className="font-mono text-[10px] px-2 py-0.5 bg-hf-surface/60 border border-hf-border/40 rounded text-hf-muted">{id}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Related events ── */}
            {inc.relatedEvents.length > 0 && (
              <div className="glass-card border border-hf-border/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Repeat2 className="w-3 h-3" /> Related Events
                </p>
                <div className="space-y-2">
                  {inc.relatedEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-hf-surface/40 border border-hf-border/20">
                      <SeverityBadge severity={ev.severity} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-hf-text truncate">{ev.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-hf-dim">{ev.sourceIp}</span>
                          <span className="text-[10px] text-hf-dim">{ev.attackType}</span>
                          {ev.sameSource && <span className="text-[9px] bg-hf-warning/10 border border-hf-warning/30 text-hf-warning px-1.5 rounded font-semibold">Same IP</span>}
                          {ev.sameDecoy  && <span className="text-[9px] bg-hf-primary/10 border border-hf-primary/30 text-hf-primary px-1.5 rounded font-semibold">Same Decoy</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-hf-dim shrink-0">{formatDate(ev.timestamp, 'relative')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tags ── */}
            {inc.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3 h-3 text-hf-dim shrink-0" />
                {inc.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-hf-surface border border-hf-border/40 text-hf-dim">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div className="p-4">
            {activityPanel}
          </div>
        )}
      </div>

      {/* ── Action panel (always visible at bottom) ── */}
      <div className="shrink-0 border-t border-hf-border/40 bg-hf-bg/80 backdrop-blur-sm">
        {actionPanel}
      </div>
    </div>
  )
}
