'use client'
import { useState } from 'react'
import {
  X, Copy, CheckCheck, Download,
  Clock, Tag, Shield, FileText, GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IOCTypeIcon } from './IOCTypeIcon'
import { IOCStatusBadge, StatusDropdown } from './IOCStatusBadge'
import { SeverityPill, ConfidenceBar } from './ConfidenceScore'
import { RelationshipGraph } from './RelationshipGraph'
import type { IOC, IOCStatus, IOCTimelineEvent } from '@/types/threat-intel'

const TLP_COLOR: Record<string, string> = {
  red:   'text-hf-danger border-hf-danger/30 bg-hf-danger/10',
  amber: 'text-hf-warning border-hf-warning/30 bg-hf-warning/10',
  green: 'text-hf-success border-hf-success/30 bg-hf-success/10',
  white: 'text-hf-dim border-hf-border/40 bg-hf-surface-3',
}

const TIMELINE_COLORS: Record<IOCTimelineEvent['type'], string> = {
  'first-seen':    'bg-hf-primary',
  attack:          'bg-hf-danger',
  'status-change': 'bg-hf-warning',
  'analyst-note':  'bg-hf-accent',
  correlation:     'bg-hf-success',
  closed:          'bg-hf-dim',
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
      className="text-hf-dim hover:text-hf-muted transition-colors"
      title="Copy"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-hf-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function DetailRow({ label, value, mono = false, accent = false }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-hf-border/15 last:border-0">
      <span className="text-[10px] text-hf-dim w-32 shrink-0 pt-0.5">{label}</span>
      <span className={cn('text-xs flex-1 break-all', mono ? 'font-mono' : '', accent ? 'text-hf-primary' : 'text-hf-text')}>
        {value}
      </span>
    </div>
  )
}

type DrawerTab = 'overview' | 'timeline' | 'relationships' | 'raw'
const TABS: { id: DrawerTab; label: string; icon: React.ComponentType<{className?: string}> }[] = [
  { id: 'overview',      label: 'Overview',      icon: Shield    },
  { id: 'timeline',      label: 'Timeline',       icon: Clock     },
  { id: 'relationships', label: 'Relationships',  icon: GitBranch },
  { id: 'raw',           label: 'Raw Data',       icon: FileText  },
]

function exportIOC(ioc: IOC, format: 'json' | 'csv') {
  let content: string
  let filename: string
  let type: string

  if (format === 'json') {
    content = JSON.stringify(ioc, null, 2)
    filename = `ioc_${ioc.id}.json`
    type = 'application/json'
  } else {
    const fields = ['id','type','value','status','severity','confidence','firstSeen','lastSeen','hitCount','source','tlp','country','asn','malwareFamily']
    const row = fields.map((f) => {
      const v = (ioc as unknown as Record<string, unknown>)[f]
      return typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v ?? '')
    })
    content = fields.join(',') + '\n' + row.join(',')
    filename = `ioc_${ioc.id}.csv`
    type = 'text/csv'
  }

  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

interface IOCDetailDrawerProps {
  ioc: IOC | null
  allIOCs: IOC[]
  onClose: () => void
  onStatusChange: (id: string, status: IOCStatus) => void
  onNavigate: (ioc: IOC) => void
}

export function IOCDetailDrawer({ ioc, allIOCs, onClose, onStatusChange, onNavigate }: IOCDetailDrawerProps) {
  const [tab, setTab]         = useState<DrawerTab>('overview')
  const [statusOpen, setStatusOpen] = useState(false)

  if (!ioc) return null

  const handleStatusChange = (s: IOCStatus) => { onStatusChange(ioc.id, s); setStatusOpen(false) }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-hf-surface border-l border-hf-border shadow-2xl animate-slide-in-right">

      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-hf-border/40 shrink-0">
        <IOCTypeIcon type={ioc.type} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-hf-text break-all leading-snug">{ioc.value}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <SeverityPill severity={ioc.severity} />
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider', TLP_COLOR[ioc.tlp])}>
              TLP:{ioc.tlp.toUpperCase()}
            </span>
            <span className="text-[10px] text-hf-dim">{ioc.hitCount} hits</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton value={ioc.value} />
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status + Export row */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-hf-border/30 bg-hf-surface-2/30 shrink-0">
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
          >
            <IOCStatusBadge status={ioc.status} showDot />
            <span className="text-[9px] text-hf-dim">▾</span>
          </button>
          {statusOpen && (
            <StatusDropdown current={ioc.status} onChange={handleStatusChange} />
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => exportIOC(ioc, 'json')} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted transition-colors border border-hf-border/40 rounded px-2 py-1">
            <Download className="w-3 h-3" /> JSON
          </button>
          <button onClick={() => exportIOC(ioc, 'csv')} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted transition-colors border border-hf-border/40 rounded px-2 py-1">
            <Download className="w-3 h-3" /> CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hf-border/40 shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all border-b-2',
              tab === id
                ? 'text-hf-primary border-hf-primary'
                : 'text-hf-dim hover:text-hf-muted border-transparent'
            )}
          >
            <Icon className="w-3 h-3" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            {/* Confidence + Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-hf-dim mb-1">Confidence</p>
                  <ConfidenceBar value={ioc.confidence} size="md" />
                </div>
                <div className="ml-4">
                  <p className="text-[10px] text-hf-dim mb-1">Source</p>
                  <p className="text-xs font-medium text-hf-text">{ioc.source}</p>
                </div>
              </div>
              {ioc.description && (
                <p className="text-xs text-hf-muted leading-relaxed bg-hf-surface-2/40 border border-hf-border/30 rounded-xl px-3 py-2.5">
                  {ioc.description}
                </p>
              )}
            </div>

            {/* Core fields */}
            <div className="glass-card border border-hf-border/30 rounded-xl px-3 pt-2 pb-1">
              <DetailRow label="Type"         value={ioc.type}      />
              <DetailRow label="First Seen"   value={new Date(ioc.firstSeen).toLocaleString()} />
              <DetailRow label="Last Seen"    value={new Date(ioc.lastSeen).toLocaleString()}  />
              <DetailRow label="Hit Count"    value={ioc.hitCount.toLocaleString()} />
              <DetailRow label="Reported By"  value={ioc.reportedBy} />
              {ioc.analyst && <DetailRow label="Analyst" value={ioc.analyst} />}
            </div>

            {/* Network info */}
            {(ioc.country || ioc.asn) && (
              <div className="glass-card border border-hf-border/30 rounded-xl px-3 pt-2 pb-1">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1 pt-1">Network Info</p>
                {ioc.country    && <DetailRow label="Country" value={`${ioc.country} (${ioc.countryCode})`} />}
                {ioc.asn        && <DetailRow label="ASN" value={ioc.asn} mono />}
                {ioc.asOrg      && <DetailRow label="AS Org" value={ioc.asOrg} />}
              </div>
            )}

            {/* CVE details */}
            {ioc.cveDetails && (
              <div className="glass-card border border-hf-border/30 rounded-xl px-3 pt-2 pb-1">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1 pt-1">CVE Details</p>
                <DetailRow label="CVSS Score" value={`${ioc.cveDetails.cvss} / 10.0`} accent />
                <DetailRow label="CVSS Vector" value={ioc.cveDetails.cvssVector} mono />
                <DetailRow label="Patch Available" value={ioc.cveDetails.patchAvailable ? 'Yes' : 'No — Patch Urgently'} />
                <DetailRow label="Public Exploit" value={ioc.cveDetails.exploitPublic ? 'Yes' : 'No'} />
                <div className="py-2">
                  <p className="text-[10px] text-hf-dim mb-1">Affected Products</p>
                  <div className="flex flex-wrap gap-1">
                    {ioc.cveDetails.affected.map((a) => (
                      <span key={a} className="text-[9px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-1.5 py-0.5 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payload details */}
            {ioc.payloadDetails && (
              <div className="glass-card border border-hf-border/30 rounded-xl px-3 pt-2 pb-1">
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1 pt-1">Payload Details</p>
                <DetailRow label="MIME Type" value={ioc.payloadDetails.mimeType} />
                <DetailRow label="Size" value={`${(ioc.payloadDetails.size / 1024).toFixed(1)} KB`} />
                <DetailRow label="SHA-256" value={ioc.payloadDetails.sha256} mono />
                <DetailRow label="MD5" value={ioc.payloadDetails.md5} mono />
                {ioc.payloadDetails.packerSignature && <DetailRow label="Packer" value={ioc.payloadDetails.packerSignature} />}
              </div>
            )}

            {/* MITRE Techniques */}
            {ioc.mitreTechniques.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">MITRE ATT&CK</p>
                <div className="flex flex-wrap gap-1.5">
                  {ioc.mitreTechniques.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-hf-primary bg-hf-primary/10 border border-hf-primary/30 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {ioc.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Tags
                </p>
                <div className="flex flex-wrap gap-1">
                  {ioc.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Campaigns */}
            {ioc.campaigns.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Campaigns</p>
                <div className="flex flex-wrap gap-1.5">
                  {ioc.campaigns.map((cid) => (
                    <span key={cid} className="text-[10px] font-medium text-hf-accent bg-hf-accent/10 border border-hf-accent/30 px-2 py-0.5 rounded">
                      {cid}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {ioc.notes && (
              <div className="rounded-xl border border-hf-warning/20 bg-hf-warning/5 px-3 py-2.5">
                <p className="text-[10px] font-bold text-hf-warning mb-1">Analyst Notes</p>
                <p className="text-xs text-hf-muted leading-relaxed">{ioc.notes}</p>
              </div>
            )}
          </>
        )}

        {/* ── Timeline ── */}
        {tab === 'timeline' && (
          <div className="relative">
            <div className="absolute left-[7px] top-3 bottom-0 w-px bg-hf-border/40" />
            <div className="space-y-5">
              {[...ioc.timeline].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((evt) => (
                <div key={evt.id} className="flex gap-4 relative">
                  <div className={cn('w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2 border-hf-bg relative z-10', TIMELINE_COLORS[evt.type])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-hf-text">{evt.title}</p>
                      {evt.severity && <SeverityPill severity={evt.severity} size="xs" />}
                    </div>
                    <p className="text-xs text-hf-muted mt-0.5 leading-relaxed">{evt.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-hf-dim tabular-nums">
                        {new Date(evt.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {evt.actor && <span className="text-[9px] text-hf-accent">by {evt.actor}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Relationships ── */}
        {tab === 'relationships' && (
          <RelationshipGraph ioc={ioc} allIOCs={allIOCs} onNavigate={onNavigate} />
        )}

        {/* ── Raw Data ── */}
        {tab === 'raw' && (
          <div className="rounded-xl border border-hf-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-hf-surface-3 border-b border-hf-border/30">
              <span className="text-[10px] font-mono font-semibold text-hf-dim">ioc_{ioc.id}.json</span>
              <CopyButton value={JSON.stringify(ioc, null, 2)} />
            </div>
            <pre className="p-4 text-[10px] font-mono text-hf-muted leading-relaxed overflow-x-auto bg-hf-bg-2 max-h-[60vh]">
              <code>{JSON.stringify(ioc, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
