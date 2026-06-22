'use client'
import { useState, useRef, useEffect } from 'react'
import { X, ShieldAlert, CheckCircle2, XCircle, UserPlus, Download, Send, Archive, ChevronDown } from 'lucide-react'
import type { Analyst, IncidentStatus } from '@/types/analyst-workflow'

interface Props {
  selectedCount: number
  analysts: Analyst[]
  onClearSelection: () => void
  onBulkStatus: (status: IncidentStatus) => void
  onBulkAssign: (analystId: string) => void
  onBulkExport: () => void
  onBulkSIEM: () => void
}

export function BulkActionBar({
  selectedCount, analysts, onClearSelection,
  onBulkStatus, onBulkAssign, onBulkExport, onBulkSIEM,
}: Props) {
  const [showAssign, setShowAssign] = useState(false)
  const assignRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) setShowAssign(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 glass-card border border-hf-border rounded-2xl shadow-2xl bg-hf-surface/95 backdrop-blur-xl">
        {/* Selection badge */}
        <div className="flex items-center gap-2 pr-3 border-r border-hf-border/40">
          <span className="w-6 h-6 rounded-full bg-hf-primary/20 text-hf-primary text-xs font-black flex items-center justify-center">
            {selectedCount}
          </span>
          <span className="text-xs text-hf-muted font-semibold whitespace-nowrap">incident{selectedCount > 1 ? 's' : ''} selected</span>
          <button onClick={onClearSelection} className="text-hf-dim hover:text-hf-muted ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status bulk actions */}
        <button
          onClick={() => onBulkStatus('confirmed-attack')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-danger/40 bg-hf-danger/10 text-hf-danger hover:bg-hf-danger/20 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Attack
        </button>
        <button
          onClick={() => onBulkStatus('benign')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-success/40 bg-hf-success/10 text-hf-success hover:bg-hf-success/20 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Benign
        </button>
        <button
          onClick={() => onBulkStatus('unauthorized-activity')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-orange-400/40 bg-orange-400/10 text-orange-400 hover:bg-orange-400/20 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Unauthorized
        </button>

        <div className="w-px h-5 bg-hf-border/40" />

        {/* Assign */}
        <div ref={assignRef} className="relative">
          <button
            onClick={() => setShowAssign((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-border bg-hf-surface hover:bg-hf-bg text-hf-muted transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Assign
            <ChevronDown className="w-3 h-3" />
          </button>
          {showAssign && (
            <div className="absolute bottom-full left-0 mb-1 w-48 bg-hf-surface border border-hf-border rounded-xl shadow-xl z-50 py-1">
              {analysts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { onBulkAssign(a.id); setShowAssign(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-hf-bg text-left"
                >
                  <span className="w-6 h-6 rounded-full bg-hf-primary/20 text-hf-primary text-[9px] font-black flex items-center justify-center">{a.initials}</span>
                  <div>
                    <p className="text-xs font-semibold text-hf-text">{a.name}</p>
                    <p className="text-[10px] text-hf-dim">{a.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <button
          onClick={onBulkExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-border bg-hf-surface hover:bg-hf-bg text-hf-muted transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        {/* Send to SIEM */}
        <button
          onClick={onBulkSIEM}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-primary/30 bg-hf-primary/8 text-hf-primary hover:bg-hf-primary/15 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Send to SIEM
        </button>

        {/* Close */}
        <button
          onClick={() => onBulkStatus('closed')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-hf-border/30 bg-hf-surface/30 text-hf-dim hover:text-hf-muted transition-colors"
        >
          <Archive className="w-3.5 h-3.5" />
          Close
        </button>
      </div>
    </div>
  )
}
