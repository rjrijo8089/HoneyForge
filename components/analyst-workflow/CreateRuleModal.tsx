'use client'
import { useState } from 'react'
import { X, FileCode, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalystIncident } from '@/types/analyst-workflow'
import type { ThreatSeverity } from '@/types/threat'

type RuleType = 'signature' | 'behavioral' | 'threshold' | 'anomaly'

const RULE_TYPES: { id: RuleType; label: string; desc: string }[] = [
  { id: 'signature',  label: 'Signature',  desc: 'Exact pattern match'        },
  { id: 'behavioral', label: 'Behavioral', desc: 'Attack behavior pattern'     },
  { id: 'threshold',  label: 'Threshold',  desc: 'Rate-based detection'        },
  { id: 'anomaly',    label: 'Anomaly',    desc: 'Statistical deviation'       },
]

const SEV_OPTS: ThreatSeverity[] = ['critical', 'high', 'medium', 'low']

function buildCondition(inc: AnalystIncident): string {
  if (inc.payload) {
    const sample = inc.payload.slice(0, 120).replace(/\n/g, ' ')
    return `request.body contains "${sample.slice(0, 80).trim()}" OR request.path matches "${inc.requestPath ?? '/*'}"`
  }
  return `source.ip == "${inc.sourceIp}" AND attack.category == "${inc.attackCategory}"`
}

interface Props {
  incident: AnalystIncident
  onConfirm: (name: string, type: RuleType, severity: ThreatSeverity, condition: string, description: string) => void
  onClose: () => void
}

export function CreateRuleModal({ incident, onConfirm, onClose }: Props) {
  const [name,        setName]        = useState(`${incident.attackType} — ${incident.targetDecoyName}`)
  const [ruleType,    setRuleType]    = useState<RuleType>('signature')
  const [severity,    setSeverity]    = useState<ThreatSeverity>(incident.severity)
  const [condition,   setCondition]   = useState(buildCondition(incident))
  const [description, setDescription] = useState(
    `Auto-generated from incident ${incident.id}. Detects ${incident.attackType} targeting ${incident.targetDecoyName} via ${incident.detectionSource}.`
  )

  const SEV_COLOR: Record<ThreatSeverity, string> = {
    critical: 'border-hf-danger/50 bg-hf-danger/10 text-hf-danger',
    high:     'border-orange-400/50 bg-orange-400/10 text-orange-400',
    medium:   'border-hf-warning/50 bg-hf-warning/10 text-hf-warning',
    low:      'border-hf-success/50 bg-hf-success/10 text-hf-success',
    info:     'border-hf-dim/50 bg-hf-dim/10 text-hf-dim',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl glass-card border border-hf-border rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-hf-border/40 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-hf-accent/15 border border-hf-accent/30 flex items-center justify-center">
            <FileCode className="w-4 h-4 text-hf-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-hf-text">Create Detection Rule</h2>
            <p className="text-xs text-hf-dim mt-0.5">Pre-filled from incident — review and adjust before saving</p>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* MITRE tags */}
          {incident.mitreTechniques.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-hf-dim font-semibold">MITRE:</span>
              {incident.mitreTechniques.map((t) => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded border border-hf-warning/30 bg-hf-warning/8 text-hf-warning">{t}</span>
              ))}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest block mb-1.5">Rule Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-xl px-3 py-2.5 text-xs text-hf-text focus:outline-none focus:border-hf-primary/60"
            />
          </div>

          {/* Type + Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest block mb-2">Rule Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {RULE_TYPES.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setRuleType(rt.id)}
                    className={cn(
                      'flex flex-col items-start gap-0.5 py-2 px-2.5 rounded-lg border text-left transition-all',
                      ruleType === rt.id
                        ? 'border-hf-accent/50 bg-hf-accent/10 text-hf-accent'
                        : 'border-hf-border/40 bg-hf-surface/30 text-hf-dim hover:text-hf-muted'
                    )}
                  >
                    <span className="text-[11px] font-semibold">{rt.label}</span>
                    <span className="text-[9px] opacity-70">{rt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest block mb-2">Severity</label>
              <div className="space-y-1.5">
                {SEV_OPTS.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={cn(
                      'w-full py-1.5 px-3 rounded-lg border text-xs font-semibold capitalize text-left transition-all',
                      severity === sev ? SEV_COLOR[sev] : 'border-hf-border/30 bg-hf-surface/20 text-hf-dim hover:text-hf-muted'
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest block mb-1.5">Detection Condition</label>
            <textarea
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              rows={4}
              className="w-full bg-[#0a0c10] border border-hf-border/50 rounded-xl px-3 py-2.5 text-xs font-mono text-hf-text resize-none focus:outline-none focus:border-hf-primary/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-xl px-3 py-2.5 text-xs text-hf-text resize-none focus:outline-none focus:border-hf-primary/60"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-hf-border/40 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-hf-muted hover:text-hf-text border border-hf-border rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(name, ruleType, severity, condition, description); onClose() }}
            disabled={!name.trim() || !condition.trim()}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-hf-accent/20 border border-hf-accent/50 text-hf-accent hover:bg-hf-accent/30 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5" />
            Create Rule
          </button>
        </div>
      </div>
    </div>
  )
}
