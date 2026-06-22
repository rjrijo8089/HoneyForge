'use client'
import { useState } from 'react'
import {
  X, Copy, Check, Download, Shield, Code2, Cpu,
  Link2, History, Clock, User, Tag, AlertTriangle, FileWarning,
  Zap,
} from 'lucide-react'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { RuleStatusBadge } from './RuleStatusBadge'
import { RuleTypeBadge } from './RuleTypeBadge'
import type { DetectionRule } from '@/types/rule'

/* ── Copy button ── */
function CopyBtn({ value, className }: { value: string; className?: string }) {
  const [c, setC] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500) }}
      className={cn('text-hf-dim hover:text-hf-muted transition-colors', className)}
    >
      {c ? <Check className="w-3.5 h-3.5 text-hf-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

/* ── Export rule ── */
function exportRule(rule: DetectionRule, fmt: 'json' | 'raw') {
  const content = fmt === 'json' ? JSON.stringify(rule, null, 2) : rule.content
  const filename = fmt === 'json' ? `rule_${rule.id}.json` : `rule_${rule.id}.${rule.type === 'suricata' ? 'rules' : rule.type === 'yara' ? 'yar' : 'txt'}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click(); URL.revokeObjectURL(url)
}

/* ── Section wrapper ── */
function Section({ title, icon: Icon, children, className }: {
  title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('glass-card border border-hf-border/30 rounded-xl p-3.5', className)}>
      <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {title}
      </p>
      {children}
    </div>
  )
}

/* ── Row ── */
function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-hf-border/15 last:border-0">
      <span className="text-[10px] text-hf-dim w-28 shrink-0 pt-0.5">{label}</span>
      <span className={cn('text-xs flex-1 break-all', mono ? 'font-mono' : '', accent ? 'text-hf-primary' : 'text-hf-text')}>
        {value}
      </span>
    </div>
  )
}

/* ── MITRE ATT&CK mini-map ── */
const TACTIC_MAP: Record<string, string[]> = {
  'Reconnaissance':        ['T1595', 'T1592', 'T1589', 'T1590', 'T1591', 'T1596', 'T1597', 'T1598'],
  'Initial Access':        ['T1190', 'T1566', 'T1078', 'T1133', 'T1091', 'T1200', 'T1195', 'T1199'],
  'Execution':             ['T1059', 'T1106', 'T1053', 'T1129', 'T1072', 'T1569', 'T1204', 'T1047'],
  'Persistence':           ['T1098', 'T1136', 'T1543', 'T1037', 'T1505', 'T1176', 'T1546', 'T1547'],
  'Privilege Escalation':  ['T1548', 'T1134', 'T1068', 'T1484', 'T1611', 'T1574', 'T1055'],
  'Credential Access':     ['T1110', 'T1555', 'T1552', 'T1539', 'T1558', 'T1557', 'T1606', 'T1528'],
  'Discovery':             ['T1083', 'T1046', 'T1082', 'T1069', 'T1087', 'T1135', 'T1040'],
  'Lateral Movement':      ['T1021', 'T1080', 'T1550', 'T1563', 'T1534', 'T1570'],
  'Command and Control':   ['T1071', 'T1090', 'T1048', 'T1095', 'T1105', 'T1573', 'T1008'],
  'Exfiltration':          ['T1041', 'T1048', 'T1052', 'T1567', 'T1030', 'T1020'],
  'Impact':                ['T1496', 'T1486', 'T1498', 'T1499', 'T1491', 'T1561', 'T1529'],
}

function MitreMap({ techniques }: { techniques: string[] }) {
  const techSet = new Set(techniques.map((t) => t.split('.')[0]))
  return (
    <div className="space-y-1.5">
      {Object.entries(TACTIC_MAP).map(([tactic, techs]) => {
        const matched = techs.filter((t) => techSet.has(t))
        if (matched.length === 0) return null
        return (
          <div key={tactic} className="flex items-start gap-2">
            <span className="text-[9px] font-bold text-hf-primary/70 w-32 shrink-0 pt-0.5">{tactic}</span>
            <div className="flex flex-wrap gap-1">
              {matched.map((t) => (
                <span key={t} className="text-[9px] font-mono text-hf-warning bg-hf-warning/10 border border-hf-warning/25 px-1.5 py-0.5 rounded">
                  {techniques.find((x) => x.startsWith(t)) ?? t}
                </span>
              ))}
            </div>
          </div>
        )
      })}
      {/* Techniques not matched to any tactic */}
      {techniques.filter((t) => !Object.values(TACTIC_MAP).flat().includes(t.split('.')[0])).map((t) => (
        <div key={t} className="flex items-start gap-2">
          <span className="text-[9px] font-bold text-hf-muted w-32 shrink-0 pt-0.5">Other</span>
          <span className="text-[9px] font-mono text-hf-warning bg-hf-warning/10 border border-hf-warning/25 px-1.5 py-0.5 rounded">{t}</span>
        </div>
      ))}
    </div>
  )
}

type Tab = 'summary' | 'logic' | 'attack' | 'related' | 'history'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'summary', label: 'Summary',  icon: Shield  },
  { id: 'logic',   label: 'Rule Logic',icon: Code2  },
  { id: 'attack',  label: 'ATT&CK',   icon: Cpu     },
  { id: 'related', label: 'Related',  icon: Link2   },
  { id: 'history', label: 'History',  icon: History },
]

interface Props {
  rule: DetectionRule
  onClose:     () => void
  onToggle:    (rule: DetectionRule) => void
  onDuplicate: (rule: DetectionRule) => void
}

export function RuleDetailDrawer({ rule, onClose, onToggle, onDuplicate }: Props) {
  const [tab, setTab] = useState<Tab>('summary')

  const isActive = rule.status === 'active'

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl flex flex-col bg-hf-surface border-l border-hf-border shadow-2xl animate-slide-in-right">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-hf-border/40">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <RuleTypeBadge type={rule.type} />
              <SeverityBadge severity={rule.severity} />
              <RuleStatusBadge status={rule.status} />
            </div>
            <h2 className="text-sm font-bold text-hf-text leading-snug">{rule.name}</h2>
            <p className="text-[10px] text-hf-dim mt-0.5 font-mono">{rule.id}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyBtn value={rule.id} />
            <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-2.5 text-[10px] text-hf-dim">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-hf-accent" />{formatNumber(rule.hitCount)} hits</span>
          {rule.lastHitAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last: {formatDate(rule.lastHitAt, 'relative')}</span>}
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{rule.owner.split('@')[0]}</span>
          <span>Conf: <span className={cn('font-semibold', rule.confidence >= 90 ? 'text-hf-success' : rule.confidence >= 70 ? 'text-hf-warning' : 'text-hf-danger')}>{rule.confidence}%</span></span>
        </div>
      </div>

      {/* ── Action row ── */}
      <div className="shrink-0 flex items-center gap-2 px-5 py-2 border-b border-hf-border/30 bg-hf-surface-2/20">
        <button
          onClick={() => onToggle(rule)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
            isActive
              ? 'border-hf-dim/30 text-hf-muted hover:bg-hf-surface-3'
              : 'border-hf-success/30 bg-hf-success/10 text-hf-success hover:bg-hf-success/15'
          )}
        >
          {isActive ? 'Disable Rule' : 'Enable Rule'}
        </button>
        <button
          onClick={() => onDuplicate(rule)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-border text-hf-muted hover:bg-hf-surface-3 transition-all"
        >
          Duplicate
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => exportRule(rule, 'raw')} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted border border-hf-border/40 rounded px-2 py-1 transition-colors">
            <Download className="w-3 h-3" /> Rule
          </button>
          <button onClick={() => exportRule(rule, 'json')} className="flex items-center gap-1 text-[10px] text-hf-dim hover:text-hf-muted border border-hf-border/40 rounded px-2 py-1 transition-colors">
            <Download className="w-3 h-3" /> JSON
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-hf-border/40 shrink-0 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 whitespace-nowrap',
              tab === id
                ? 'text-hf-primary border-hf-primary'
                : 'text-hf-dim hover:text-hf-muted border-transparent'
            )}
          >
            <Icon className="w-3 h-3" /> {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* ── Summary ── */}
        {tab === 'summary' && (
          <>
            {rule.description && (
              <p className="text-xs text-hf-muted leading-relaxed bg-hf-surface-2/40 border border-hf-border/30 rounded-xl px-3 py-2.5">
                {rule.description}
              </p>
            )}

            <Section title="Rule Details" icon={Shield}>
              <Row label="Rule ID"      value={rule.id}          mono />
              <Row label="Type"         value={rule.type.toUpperCase()} />
              <Row label="Status"       value={rule.status}      />
              <Row label="Severity"     value={rule.severity}    />
              <Row label="Confidence"   value={`${rule.confidence}%`} />
              <Row label="Owner"        value={rule.owner}       />
              <Row label="Created By"   value={rule.createdBy}   />
              <Row label="Created"      value={formatDate(rule.createdAt, 'long')} />
              <Row label="Updated"      value={formatDate(rule.updatedAt, 'long')} />
              <Row label="Hit Count"    value={formatNumber(rule.hitCount)} />
              {rule.lastHitAt && <Row label="Last Hit" value={formatDate(rule.lastHitAt, 'long')} />}
            </Section>

            {/* Detection Sources */}
            {rule.detectionSources.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2">Detection Sources</p>
                <div className="flex flex-wrap gap-1.5">
                  {rule.detectionSources.map((src) => (
                    <span key={src} className="text-[10px] font-mono text-hf-muted border border-hf-border/50 px-2 py-0.5 rounded bg-hf-surface-2/40">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {rule.tags.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </p>
                <div className="flex flex-wrap gap-1">
                  {rule.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tuning notes */}
            {rule.tuningNotes && (
              <div className="rounded-xl border border-hf-primary/20 bg-hf-primary/5 px-3 py-2.5">
                <p className="text-[9px] font-bold text-hf-primary mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Tuning Notes
                </p>
                <p className="text-xs text-hf-muted leading-relaxed">{rule.tuningNotes}</p>
              </div>
            )}

            {/* False positive notes */}
            {rule.falsePositiveNotes && (
              <div className="rounded-xl border border-hf-warning/20 bg-hf-warning/5 px-3 py-2.5">
                <p className="text-[9px] font-bold text-hf-warning mb-1 flex items-center gap-1">
                  <FileWarning className="w-3 h-3" /> False Positive Notes
                </p>
                <p className="text-xs text-hf-muted leading-relaxed">{rule.falsePositiveNotes}</p>
              </div>
            )}
          </>
        )}

        {/* ── Rule Logic ── */}
        {tab === 'logic' && (
          <div className="rounded-xl border border-hf-border/40 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-hf-surface-3 border-b border-hf-border/30">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-hf-dim" />
                <span className="text-[10px] font-mono font-semibold text-hf-dim">
                  {rule.name.toLowerCase().replace(/\s+/g, '_')}.{rule.type === 'suricata' ? 'rules' : rule.type === 'yara' ? 'yar' : rule.type === 'opensearch' ? 'json' : 'yml'}
                </span>
              </div>
              <CopyBtn value={rule.content} />
            </div>
            <pre className="p-4 text-[11px] font-mono text-hf-muted leading-relaxed overflow-x-auto bg-[#07090f] whitespace-pre-wrap break-all max-h-[60vh] overflow-y-auto">
              <code>{rule.content}</code>
            </pre>
          </div>
        )}

        {/* ── ATT&CK ── */}
        {tab === 'attack' && (
          <>
            {rule.mitreTechniques.length === 0 ? (
              <div className="text-center py-12 text-hf-dim">
                <Cpu className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No MITRE techniques mapped</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {rule.mitreTechniques.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-hf-warning bg-hf-warning/10 border border-hf-warning/30 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                <Section title="Tactic Mapping" icon={Cpu}>
                  <MitreMap techniques={rule.mitreTechniques} />
                </Section>
                {rule.mitreTactics.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-2">Tactics Covered</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.mitreTactics.map((tac) => (
                        <span key={tac} className="text-[10px] font-semibold text-hf-primary bg-hf-primary/10 border border-hf-primary/30 px-2.5 py-1 rounded-lg">
                          {tac}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Related ── */}
        {tab === 'related' && (
          <>
            {/* Related IOCs */}
            <Section title="Related IOCs" icon={Link2}>
              {rule.relatedIOCIds.length === 0 ? (
                <p className="text-xs text-hf-dim py-2">No related IOCs linked to this rule.</p>
              ) : (
                <div className="space-y-1.5">
                  {rule.relatedIOCIds.map((id) => (
                    <div key={id} className="flex items-center gap-2 py-1 border-b border-hf-border/15 last:border-0">
                      <span className="font-mono text-[10px] text-hf-accent">{id}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Confidence Score breakdown */}
            <Section title="Detection Confidence" icon={Shield}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-hf-dim">Overall Confidence</span>
                  <span className={cn('text-xs font-bold', rule.confidence >= 90 ? 'text-hf-success' : rule.confidence >= 70 ? 'text-hf-warning' : 'text-hf-danger')}>
                    {rule.confidence}%
                  </span>
                </div>
                <div className="h-2 bg-hf-surface rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', rule.confidence >= 90 ? 'bg-hf-success' : rule.confidence >= 70 ? 'bg-hf-warning' : 'bg-hf-danger')}
                    style={{ width: `${rule.confidence}%` }}
                  />
                </div>
                <p className="text-[10px] text-hf-dim leading-relaxed">
                  Confidence reflects trigger accuracy based on historical analysis. Tune thresholds to reduce false positives.
                </p>
              </div>
            </Section>
          </>
        )}

        {/* ── History ── */}
        {tab === 'history' && (
          <>
            {rule.versionHistory.length === 0 ? (
              <div className="text-center py-12 text-hf-dim">
                <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No version history available</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-hf-border/40" />
                <div className="space-y-4">
                  {[...rule.versionHistory].reverse().map((v, i) => (
                    <div key={v.version} className="flex gap-4">
                      <div className={cn(
                        'w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2 border-hf-bg relative z-10',
                        i === 0 ? 'bg-hf-primary' : 'bg-hf-dim'
                      )} />
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-hf-primary">v{v.version}</span>
                          <span className="text-[10px] text-hf-dim tabular-nums">
                            {new Date(v.changedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] text-hf-accent">by {v.changedBy.split('@')[0]}</span>
                        </div>
                        <p className="text-xs text-hf-muted mt-0.5 leading-relaxed">{v.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
