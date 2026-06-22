'use client'
import {
  CalendarDays, TrendingUp, Award, Crosshair, Globe,
  Terminal, Bug, Cpu, Activity, ClipboardList,
  Clock, User, Download, Eye, Zap, Calendar,
  CheckCircle2, Loader2, AlertTriangle, PauseCircle,
} from 'lucide-react'
import { cn, formatDate, formatBytes } from '@/lib/utils'
import type { ReportTemplate, ReportCategory, RunStatus } from '@/types/report'

/* ── Slug → icon + palette ── */
interface SlugMeta {
  Icon: React.ComponentType<{ className?: string }>
  iconBg: string; iconText: string; accentBorder: string
}
const SLUG_META: Record<string, SlugMeta> = {
  'daily-summary':    { Icon: CalendarDays,  iconBg: 'bg-blue-500/15',   iconText: 'text-blue-400',   accentBorder: 'border-blue-500/20'   },
  'weekly-threat':    { Icon: TrendingUp,    iconBg: 'bg-orange-500/15', iconText: 'text-orange-400', accentBorder: 'border-orange-500/20' },
  'monthly-executive':{ Icon: Award,         iconBg: 'bg-hf-primary/15', iconText: 'text-hf-primary', accentBorder: 'border-hf-primary/20' },
  'top-attackers':    { Icon: Crosshair,     iconBg: 'bg-red-500/15',    iconText: 'text-red-400',    accentBorder: 'border-red-500/20'    },
  'web-attacks':      { Icon: Globe,         iconBg: 'bg-emerald-500/15',iconText: 'text-emerald-400',accentBorder: 'border-emerald-500/20'},
  'ssh-bruteforce':   { Icon: Terminal,      iconBg: 'bg-purple-500/15', iconText: 'text-purple-400', accentBorder: 'border-purple-500/20' },
  'malware':          { Icon: Bug,           iconBg: 'bg-red-700/15',    iconText: 'text-red-300',    accentBorder: 'border-red-700/20'    },
  'mitre':            { Icon: Cpu,           iconBg: 'bg-cyan-500/15',   iconText: 'text-cyan-400',   accentBorder: 'border-cyan-500/20'   },
  'decoy-health':     { Icon: Activity,      iconBg: 'bg-green-500/15',  iconText: 'text-green-400',  accentBorder: 'border-green-500/20'  },
  'analyst-queue':    { Icon: ClipboardList, iconBg: 'bg-yellow-500/15', iconText: 'text-yellow-400', accentBorder: 'border-yellow-500/20' },
}
const FALLBACK_META: SlugMeta = {
  Icon: CalendarDays, iconBg: 'bg-hf-dim/15', iconText: 'text-hf-muted', accentBorder: 'border-hf-border',
}

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  executive:  'Executive',  technical:  'Technical',
  threat:     'Threat',     compliance: 'Compliance',
}
const CATEGORY_COLORS: Record<ReportCategory, string> = {
  executive:  'text-hf-primary bg-hf-primary/10 border-hf-primary/25',
  technical:  'text-hf-accent bg-hf-accent/10 border-hf-accent/25',
  threat:     'text-hf-warning bg-hf-warning/10 border-hf-warning/25',
  compliance: 'text-purple-400 bg-purple-400/10 border-purple-400/25',
}

/* ── Status badge ── */
function StatusPill({ status }: { status: ReportTemplate['status'] }) {
  const styles = {
    active: { cls: 'text-hf-success bg-hf-success/10 border-hf-success/25', icon: CheckCircle2, label: 'Active' },
    paused: { cls: 'text-hf-warning bg-hf-warning/10 border-hf-warning/25', icon: PauseCircle,  label: 'Paused' },
    draft:  { cls: 'text-hf-dim   bg-hf-dim/10    border-hf-border',        icon: Clock,        label: 'Draft'  },
  }[status]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', styles.cls)}>
      <styles.icon className="w-3 h-3" /> {styles.label}
    </span>
  )
}

/* ── Run status badge ── */
function RunBadge({ status }: { status: RunStatus }) {
  if (status === 'ready')      return <span className="flex items-center gap-1 text-[10px] text-hf-success"><CheckCircle2 className="w-3 h-3" /> Ready</span>
  if (status === 'generating') return <span className="flex items-center gap-1 text-[10px] text-hf-accent animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Generating</span>
  return <span className="flex items-center gap-1 text-[10px] text-hf-danger"><AlertTriangle className="w-3 h-3" /> Failed</span>
}

/* ── Frequency label ── */
function freqLabel(r: ReportTemplate): string {
  const { frequency, dayOfWeek, dayOfMonth, hour } = r.schedule
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const h    = `${String(hour).padStart(2,'0')}:00 UTC`
  if (frequency === 'daily')   return `Daily at ${h}`
  if (frequency === 'weekly')  return `Weekly ${days[dayOfWeek ?? 1]} at ${h}`
  if (frequency === 'monthly') return `Monthly on ${dayOfMonth ?? 1}${dayOfMonth === 1 ? 'st' : dayOfMonth === 2 ? 'nd' : dayOfMonth === 3 ? 'rd' : 'th'} at ${h}`
  return 'Manual'
}

interface Props {
  report:        ReportTemplate
  isSelected:    boolean
  isGenerating:  boolean
  onSelect:      (r: ReportTemplate) => void
  onGenerate:    (r: ReportTemplate) => void
  onDownload:    (r: ReportTemplate) => void
  onSchedule:    (r: ReportTemplate) => void
}

export function ReportCard({ report: r, isSelected, isGenerating, onSelect, onGenerate, onDownload, onSchedule }: Props) {
  const meta    = SLUG_META[r.slug] ?? FALLBACK_META
  const { Icon } = meta
  const canDownload = r.lastRun?.status === 'ready' && !isGenerating

  return (
    <div
      onClick={() => onSelect(r)}
      className={cn(
        'glass-card glass-card-hover rounded-2xl border flex flex-col cursor-pointer transition-all',
        isSelected
          ? 'border-hf-primary/50 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]'
          : 'border-hf-border/40',
        isGenerating && 'opacity-80'
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', meta.iconBg, meta.accentBorder)}>
          <Icon className={cn('w-5 h-5', meta.iconText)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-hf-text leading-snug">{r.name}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={cn('text-[9px] font-bold uppercase tracking-wide border px-1.5 py-0.5 rounded', CATEGORY_COLORS[r.category])}>
              {CATEGORY_LABELS[r.category]}
            </span>
            <StatusPill status={r.status} />
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="text-[11px] text-hf-muted leading-relaxed px-4 pb-3 line-clamp-2 flex-1">{r.description}</p>

      {/* ── Meta rows ── */}
      <div className="px-4 pb-3 space-y-1.5 border-t border-hf-border/25 pt-3">
        {/* Schedule */}
        <div className="flex items-center gap-2 text-[10px] text-hf-dim">
          <Calendar className="w-3 h-3 shrink-0" />
          <span>{freqLabel(r)}</span>
        </div>
        {/* Owner */}
        <div className="flex items-center gap-2 text-[10px] text-hf-dim">
          <User className="w-3 h-3 shrink-0" />
          <span>{r.owner.split('@')[0]}</span>
          {r.schedule.recipients.length > 0 && (
            <span className="text-hf-dim">→ {r.schedule.recipients.length} recipient{r.schedule.recipients.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {/* Last run */}
        {r.lastRun && (
          <div className="flex items-center gap-2 text-[10px]">
            <Clock className="w-3 h-3 text-hf-dim shrink-0" />
            <span className="text-hf-dim">{formatDate(r.lastRun.at, 'relative')}</span>
            <span className="ml-auto"><RunBadge status={r.lastRun.status} /></span>
            {r.lastRun.fileSize && r.lastRun.status === 'ready' && (
              <span className="text-[9px] text-hf-dim font-mono">{formatBytes(r.lastRun.fileSize)}</span>
            )}
          </div>
        )}
        {/* Format badge */}
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'text-[9px] font-mono font-bold uppercase',
            r.schedule.format === 'pdf' ? 'text-red-400' : r.schedule.format === 'csv' ? 'text-green-400' : 'text-hf-accent'
          )}>{r.schedule.format}</span>
          {r.schedule.delivery.map((d) => (
            <span key={d} className="text-[9px] text-hf-dim border border-hf-border/40 px-1 py-0.5 rounded">{d}</span>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-1.5 px-4 py-3 border-t border-hf-border/25" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelect(r)}
          title="View preview"
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
            isSelected
              ? 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
              : 'border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
          )}
        >
          <Eye className="w-3 h-3" /> Preview
        </button>
        <button
          onClick={() => onGenerate(r)}
          disabled={isGenerating}
          title="Generate now"
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold border border-hf-primary/30 text-hf-primary bg-hf-primary/5 hover:bg-hf-primary/10 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
          {isGenerating ? 'Running…' : 'Generate'}
        </button>
        <button
          onClick={() => onDownload(r)}
          disabled={!canDownload}
          title="Download last run"
          className="px-2.5 py-1.5 rounded-lg text-[11px] border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="w-3 h-3" />
        </button>
        <button
          onClick={() => onSchedule(r)}
          title="Edit schedule"
          className="px-2.5 py-1.5 rounded-lg text-[11px] border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all"
        >
          <Calendar className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
