'use client'
import { useState } from 'react'
import { X, Copy, Check, Globe, Server, Cpu, Shield, ExternalLink } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { DETECTION_SOURCE_META } from '@/types/live-feed'
import type { LiveFeedEvent } from '@/types/live-feed'

function CopyBtn({ value }: { value: string }) {
  const [c, setC] = useState(false)
  const copy = () => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500) }
  return (
    <button onClick={copy} className="text-hf-dim hover:text-hf-muted transition-colors">
      {c ? <Check className="w-3 h-3 text-hf-success" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

function Field({ label, value, mono, copyable, children }: {
  label: string; value?: string; mono?: boolean; copyable?: boolean; children?: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-0.5">{label}</p>
      {children ?? (
        <div className="flex items-center gap-1.5">
          <span className={cn('text-xs text-hf-text break-all', mono && 'font-mono')}>{value ?? '—'}</span>
          {copyable && value && <CopyBtn value={value} />}
        </div>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{className?: string}>; children: React.ReactNode }) {
  return (
    <div className="glass-card border border-hf-border/40 rounded-xl p-3.5">
      <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {title}
      </p>
      {children}
    </div>
  )
}

interface Props {
  event: LiveFeedEvent
  onClose: () => void
}

function formatHMS(ts: string): string {
  const d = new Date(ts)
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
}

export function EventDetailDrawer({ event: ev, onClose }: Props) {
  const [payloadExpanded, setPayloadExpanded] = useState(false)
  const [payloadCopied,   setPayloadCopied]   = useState(false)

  const srcMeta = DETECTION_SOURCE_META[ev.detectionSource]

  const copyPayload = () => {
    if (ev.payload) { navigator.clipboard.writeText(ev.payload); setPayloadCopied(true); setTimeout(() => setPayloadCopied(false), 1500) }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-hf-bg border-l border-hf-border shadow-2xl animate-slide-in-right">

      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-hf-border/40">
        <div className="flex items-start gap-3">
          <SeverityBadge severity={ev.severity} size="md" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-hf-text leading-tight">{ev.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono', srcMeta.color, srcMeta.bg, srcMeta.border)}>
                {ev.detectionSource}
              </span>
              <span className="font-mono text-[10px] text-hf-dim">{formatHMS(ev.timestamp)}</span>
              <span className="text-[10px] text-hf-dim">{formatDate(ev.timestamp, 'relative')}</span>
              {ev.isKnownBad && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-hf-danger/40 bg-hf-danger/10 text-hf-danger">KNOWN BAD</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Source / Target */}
        <div className="grid grid-cols-2 gap-3">
          <Section title="Source" icon={Globe}>
            <div className="space-y-2">
              <Field label="IP Address"   value={ev.sourceIp}          mono copyable />
              <Field label="Port"         value={`:${ev.sourcePort}`}   mono />
              <Field label="Country"      value={`${ev.sourceCountry} (${ev.sourceCountryCode})`} />
              <Field label="ASN / Org"    value={`${ev.sourceAsn} — ${ev.sourceOrg}`} />
            </div>
          </Section>
          <Section title="Target" icon={Server}>
            <div className="space-y-2">
              <Field label="Decoy"        value={ev.targetDecoyName} />
              <Field label="Port"         value={`:${ev.targetPort}`}   mono />
              <Field label="Protocol"     value={ev.targetProtocol}     mono />
              {ev.requestMethod && <Field label="Method"   value={ev.requestMethod} mono />}
              {ev.requestPath    && <Field label="Path"     value={ev.requestPath}  mono copyable />}
              {ev.responseCode   && <Field label="Response" value={`HTTP ${ev.responseCode}`} mono />}
            </div>
          </Section>
        </div>

        {/* Event details */}
        <Section title="Event" icon={Shield}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Field label="Attack Type"  value={ev.attackType} />
            <Field label="Category"     value={ev.attackCategory.toUpperCase()} mono />
            <Field label="Confidence">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-hf-surface rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', ev.confidence >= 90 ? 'bg-hf-success' : ev.confidence >= 70 ? 'bg-hf-warning' : 'bg-hf-danger')}
                    style={{ width: `${ev.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-hf-muted">{ev.confidence}%</span>
              </div>
            </Field>
            <Field label="Event ID" value={ev.id} mono />
          </div>
        </Section>

        {/* MITRE */}
        {ev.mitreTechniques.length > 0 && (
          <Section title="MITRE ATT&CK" icon={Cpu}>
            <div className="space-y-2">
              {ev.mitreTactics.length > 0 && (
                <div>
                  <p className="text-[9px] text-hf-dim mb-1">Tactics</p>
                  <div className="flex flex-wrap gap-1">
                    {ev.mitreTactics.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded border border-hf-primary/30 bg-hf-primary/8 text-hf-primary font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[9px] text-hf-dim mb-1">Techniques</p>
                <div className="flex flex-wrap gap-1">
                  {ev.mitreTechniques.map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-hf-warning/30 bg-hf-warning/8 text-hf-warning font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Request headers */}
        {ev.requestHeaders && Object.keys(ev.requestHeaders).length > 0 && (
          <Section title="Request Headers" icon={ExternalLink}>
            <div className="space-y-1">
              {Object.entries(ev.requestHeaders).map(([k, v]) => (
                <div key={k} className="flex gap-2 text-[10px]">
                  <span className="font-mono text-hf-dim shrink-0 w-36 truncate">{k}:</span>
                  <span className="font-mono text-hf-muted break-all">{v}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Payload */}
        {ev.payload && (
          <div className="rounded-xl border border-hf-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-hf-surface/60 border-b border-hf-border/30">
              <span className="text-[9px] font-bold text-hf-dim uppercase tracking-widest">Payload / Data</span>
              <button onClick={copyPayload} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted transition-colors">
                {payloadCopied ? <><Check className="w-3 h-3 text-hf-success" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="font-mono text-[10px] text-hf-text leading-relaxed p-3 bg-[#07090f] overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
              {payloadExpanded ? ev.payload : ev.payload.slice(0, 600)}{!payloadExpanded && ev.payload.length > 600 && '…'}
            </pre>
            {ev.payload.length > 600 && (
              <button
                onClick={() => setPayloadExpanded((v) => !v)}
                className="w-full py-1.5 text-[10px] text-hf-dim hover:text-hf-muted text-center border-t border-hf-border/20 bg-hf-surface/30 transition-colors"
              >
                {payloadExpanded ? 'Collapse' : `Show full (${ev.payload.length} chars)`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer quick actions */}
      <div className="shrink-0 border-t border-hf-border/40 px-4 py-3 flex items-center gap-2">
        <button className="flex-1 py-2 text-xs font-semibold border border-hf-danger/40 bg-hf-danger/8 text-hf-danger hover:bg-hf-danger/15 rounded-lg transition-colors">
          Confirm Attack
        </button>
        <button className="flex-1 py-2 text-xs font-semibold border border-hf-success/40 bg-hf-success/8 text-hf-success hover:bg-hf-success/15 rounded-lg transition-colors">
          Mark Benign
        </button>
        <button className="flex-1 py-2 text-xs font-semibold border border-hf-primary/40 bg-hf-primary/8 text-hf-primary hover:bg-hf-primary/15 rounded-lg transition-colors">
          Send to SIEM
        </button>
      </div>
    </div>
  )
}
