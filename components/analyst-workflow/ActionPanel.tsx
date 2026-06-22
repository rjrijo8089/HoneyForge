'use client'
import { useRef, useState, useEffect } from 'react'
import {
  UserPlus, ShieldAlert, CheckCircle2, XCircle, AlertOctagon,
  TrendingUp, FileCode, Download, Send, MessageSquare, ChevronDown,
  Zap, Archive,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalystIncident, IncidentStatus, Analyst } from '@/types/analyst-workflow'

interface ActionConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  highlight?: boolean
}

interface Props {
  incident: AnalystIncident
  analysts: Analyst[]
  onStatusChange: (id: string, status: IncidentStatus) => void
  onAssign: (id: string, analystId: string) => void
  onEscalate: () => void
  onCreateRule: () => void
  onExport: () => void
  onSendSIEM: () => void
  onSendMISP: () => void
  onSendSlack: () => void
}

function AssignDropdown({ analysts, currentAssignee, onAssign, onClose }: {
  analysts: Analyst[]
  currentAssignee?: string
  onAssign: (id: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])
  return (
    <div ref={ref} className="absolute bottom-full left-0 mb-1 w-52 bg-hf-surface border border-hf-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
      {analysts.map((a) => (
        <button
          key={a.id}
          onClick={() => { onAssign(a.id); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-hf-surface/80 text-left"
        >
          <div className="relative">
            <span className="w-6 h-6 rounded-full bg-hf-primary/20 text-hf-primary text-[9px] font-black flex items-center justify-center">
              {a.initials}
            </span>
            <span className={cn('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-hf-surface', a.online ? 'bg-hf-success' : 'bg-hf-dim')} />
          </div>
          <div>
            <p className="text-xs font-semibold text-hf-text">{a.name}</p>
            <p className="text-[10px] text-hf-dim">{a.role}</p>
          </div>
          {currentAssignee === a.id && <span className="ml-auto text-hf-success"><CheckCircle2 className="w-3.5 h-3.5" /></span>}
        </button>
      ))}
      <div className="border-t border-hf-border/30 mt-1 pt-1">
        <button
          onClick={() => { onAssign(''); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-hf-surface/80 text-left"
        >
          <span className="w-6 h-6 rounded-full border border-hf-border/40 bg-hf-surface text-hf-dim text-[9px] flex items-center justify-center">—</span>
          <span className="text-xs text-hf-muted">Unassign</span>
        </button>
      </div>
    </div>
  )
}

function SendMenu({ onClick, incident }: { onClick: (siem: boolean, misp: boolean, slack: boolean) => void; incident: AnalystIncident }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-border bg-hf-surface hover:bg-hf-surface/80 text-hf-muted transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        Forward
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-48 bg-hf-surface border border-hf-border rounded-xl shadow-xl z-50 py-1">
          <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest px-3 py-1.5">Send to:</p>
          {[
            { label: 'SIEM',  icon: Zap,     done: incident.sentToSIEM,    action: () => { onClick(true, false, false); setOpen(false) } },
            { label: 'MISP',  icon: Archive, done: incident.sentToMISP,    action: () => { onClick(false, true, false); setOpen(false) } },
            { label: 'Slack', icon: MessageSquare, done: incident.slackNotified, action: () => { onClick(false, false, true); setOpen(false) } },
          ].map(({ label, icon: Icon, done, action }) => (
            <button key={label} onClick={action} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-hf-bg text-left">
              <Icon className={cn('w-3.5 h-3.5', done ? 'text-hf-success' : 'text-hf-dim')} />
              <span className={cn('text-xs font-semibold', done ? 'text-hf-success' : 'text-hf-muted')}>{label}</span>
              {done && <CheckCircle2 className="w-3 h-3 text-hf-success ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ActionPanel({
  incident, analysts,
  onStatusChange, onAssign, onEscalate, onCreateRule,
  onExport, onSendSIEM, onSendMISP, onSendSlack,
}: Props) {
  const [showAssign, setShowAssign] = useState(false)
  const assignRef = useRef<HTMLDivElement>(null)

  const statusActions: ActionConfig[] = [
    {
      id: 'attack',
      label: 'Mark Attack',
      icon: ShieldAlert,
      color: 'text-hf-danger',
      highlight: incident.status !== 'confirmed-attack',
      danger: true,
      onClick: () => onStatusChange(incident.id, 'confirmed-attack'),
      disabled: incident.status === 'confirmed-attack',
    },
    {
      id: 'benign',
      label: 'Benign',
      icon: CheckCircle2,
      color: 'text-hf-success',
      onClick: () => onStatusChange(incident.id, 'benign'),
      disabled: incident.status === 'benign',
    },
    {
      id: 'unauthorized',
      label: 'Unauthorized',
      icon: XCircle,
      color: 'text-orange-400',
      onClick: () => onStatusChange(incident.id, 'unauthorized-activity'),
      disabled: incident.status === 'unauthorized-activity',
    },
    {
      id: 'investigate',
      label: 'Investigate',
      icon: AlertOctagon,
      color: 'text-hf-warning',
      onClick: () => onStatusChange(incident.id, 'investigating'),
      disabled: incident.status === 'investigating',
    },
  ]

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Primary status actions */}
      <div className="grid grid-cols-4 gap-1.5">
        {statusActions.map((a) => (
          <button
            key={a.id}
            onClick={a.onClick}
            disabled={a.disabled}
            className={cn(
              'flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[10px] font-semibold transition-all',
              a.disabled
                ? 'opacity-40 cursor-not-allowed border-hf-border/20 bg-hf-surface/20 text-hf-dim'
                : a.highlight
                  ? 'border-hf-danger/40 bg-hf-danger/10 text-hf-danger hover:bg-hf-danger/20'
                  : 'border-hf-border/40 bg-hf-surface/40 hover:bg-hf-surface/80 text-hf-muted hover:text-hf-text'
            )}
          >
            <a.icon className={cn('w-3.5 h-3.5', a.disabled ? 'text-hf-dim' : a.color)} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Secondary actions row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Assign */}
        <div ref={assignRef} className="relative">
          <button
            onClick={() => setShowAssign((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-border bg-hf-surface hover:bg-hf-surface/80 text-hf-muted transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {incident.assignedToName ?? 'Assign'}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showAssign && (
            <AssignDropdown
              analysts={analysts}
              currentAssignee={incident.assignedTo}
              onAssign={(id) => onAssign(incident.id, id)}
              onClose={() => setShowAssign(false)}
            />
          )}
        </div>

        {/* Escalate */}
        <button
          onClick={onEscalate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-purple-400/30 bg-purple-400/8 text-purple-400 hover:bg-purple-400/15 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Escalate
        </button>

        {/* Create rule */}
        <button
          onClick={onCreateRule}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-accent/30 bg-hf-accent/8 text-hf-accent hover:bg-hf-accent/15 transition-colors"
        >
          <FileCode className="w-3.5 h-3.5" />
          Create Rule
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-border bg-hf-surface hover:bg-hf-surface/80 text-hf-muted transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        {/* Forward */}
        <SendMenu
          incident={incident}
          onClick={(siem, misp, slack) => {
            if (siem) onSendSIEM()
            if (misp) onSendMISP()
            if (slack) onSendSlack()
          }}
        />

        {/* Close */}
        <button
          onClick={() => onStatusChange(incident.id, 'closed')}
          disabled={incident.status === 'closed'}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-hf-border/30 bg-hf-surface/30 text-hf-dim hover:text-hf-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Archive className="w-3.5 h-3.5" />
          Close
        </button>
      </div>
    </div>
  )
}
