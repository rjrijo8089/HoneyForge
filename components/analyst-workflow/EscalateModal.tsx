'use client'
import { useState } from 'react'
import { X, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalystIncident } from '@/types/analyst-workflow'

type Priority  = 'P1' | 'P2' | 'P3'
type EscalateTo = 'security-lead' | 'ciso' | 'ir-team' | 'external-ir'

const PRIORITIES: { id: Priority; label: string; desc: string; color: string }[] = [
  { id: 'P1', label: 'P1 — Critical', desc: 'Active breach / ransomware', color: 'border-hf-danger/50 bg-hf-danger/10 text-hf-danger' },
  { id: 'P2', label: 'P2 — High',     desc: 'Confirmed attack, no breach',  color: 'border-orange-400/50 bg-orange-400/10 text-orange-400' },
  { id: 'P3', label: 'P3 — Medium',   desc: 'Significant threat, contained', color: 'border-hf-warning/50 bg-hf-warning/10 text-hf-warning' },
]
const ESCALATION_PATHS: { id: EscalateTo; label: string }[] = [
  { id: 'security-lead', label: 'Security Lead'   },
  { id: 'ciso',          label: 'CISO'            },
  { id: 'ir-team',       label: 'IR Team'         },
  { id: 'external-ir',   label: 'External IR'     },
]

interface Props {
  incident: AnalystIncident
  onConfirm: (priority: Priority, to: EscalateTo, reason: string, notify: boolean) => void
  onClose: () => void
}

export function EscalateModal({ incident, onConfirm, onClose }: Props) {
  const [priority, setPriority]       = useState<Priority>('P2')
  const [escalateTo, setEscalateTo]   = useState<EscalateTo>('ir-team')
  const [reason, setReason]           = useState('')
  const [notify, setNotify]           = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg glass-card border border-hf-border rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-hf-border/40">
          <div className="w-8 h-8 rounded-lg bg-purple-400/15 border border-purple-400/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-hf-text">Escalate Incident</h2>
            <p className="text-xs text-hf-dim mt-0.5 truncate">{incident.title}</p>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Priority */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Priority</p>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all',
                    priority === p.id ? p.color : 'border-hf-border/40 bg-hf-surface/30 text-hf-dim hover:text-hf-muted'
                  )}
                >
                  {p.label}
                  <span className="text-[9px] font-normal opacity-80">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Escalate to */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Escalate To</p>
            <div className="grid grid-cols-2 gap-2">
              {ESCALATION_PATHS.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setEscalateTo(ep.id)}
                  className={cn(
                    'py-2 px-3 rounded-lg border text-xs font-semibold text-left transition-all',
                    escalateTo === ep.id
                      ? 'border-purple-400/50 bg-purple-400/10 text-purple-400'
                      : 'border-hf-border/40 bg-hf-surface/30 text-hf-dim hover:text-hf-muted'
                  )}
                >
                  {ep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Reason / Context</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the escalation reason and any relevant context for the recipient…"
              rows={4}
              className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-xl px-3 py-2.5 text-xs text-hf-text placeholder-hf-dim resize-none focus:outline-none focus:border-hf-primary/60"
            />
          </div>

          {/* Email notify */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 rounded border-hf-border text-purple-400 focus:ring-0"
            />
            <span className="text-xs text-hf-muted">Notify recipient by email</span>
          </label>

          {priority === 'P1' && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-hf-danger/30 bg-hf-danger/5">
              <AlertTriangle className="w-4 h-4 text-hf-danger shrink-0 mt-0.5" />
              <p className="text-xs text-hf-danger leading-relaxed">
                P1 incidents trigger immediate pager alerts and open a War Room channel in Slack.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-hf-border/40">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-hf-muted hover:text-hf-text border border-hf-border rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(priority, escalateTo, reason, notify); onClose() }}
            className="px-5 py-2 text-xs font-bold bg-purple-400/20 border border-purple-400/50 text-purple-400 hover:bg-purple-400/30 rounded-lg transition-colors"
          >
            Escalate Incident
          </button>
        </div>
      </div>
    </div>
  )
}
