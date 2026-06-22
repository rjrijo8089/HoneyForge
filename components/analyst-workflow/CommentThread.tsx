'use client'
import { useState } from 'react'
import {
  MessageSquare, Send, Activity, UserPlus, ArrowUpCircle,
  Download, Bell, Scale, FileCode, Pin
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { IncidentComment, IncidentActivity, ActivityAction } from '@/types/analyst-workflow'

const ACTION_META: Record<ActivityAction, { icon: React.ComponentType<{className?: string}>; color: string; label: string }> = {
  'created':        { icon: Activity,      color: 'text-hf-dim',     label: 'created'              },
  'assigned':       { icon: UserPlus,      color: 'text-blue-400',   label: 'assigned incident to' },
  'reassigned':     { icon: UserPlus,      color: 'text-blue-400',   label: 'reassigned to'        },
  'status-changed': { icon: Activity,      color: 'text-hf-warning', label: 'changed status'       },
  'comment-added':  { icon: MessageSquare, color: 'text-hf-primary', label: 'added comment'        },
  'escalated':      { icon: ArrowUpCircle, color: 'text-purple-400', label: 'escalated incident'   },
  'exported':       { icon: Download,      color: 'text-hf-dim',     label: 'exported'             },
  'sent-to-siem':   { icon: Activity,      color: 'text-hf-primary', label: 'forwarded to SIEM'    },
  'sent-to-misp':   { icon: Scale,         color: 'text-orange-400', label: 'shared to MISP'       },
  'slack-notified': { icon: Bell,          color: 'text-green-400',  label: 'sent Slack alert'     },
  'rule-created':   { icon: FileCode,      color: 'text-hf-accent',  label: 'created detection rule'},
  'note-added':     { icon: MessageSquare, color: 'text-hf-muted',   label: 'added note'           },
}

type TimelineItem =
  | { kind: 'comment';  data: IncidentComment  }
  | { kind: 'activity'; data: IncidentActivity }

interface Props {
  comments: IncidentComment[]
  activity: IncidentActivity[]
  onAddComment: (text: string) => void
  incidentId: string
}

export function CommentThread({ comments, activity, onAddComment }: Props) {
  const [draft, setDraft] = useState('')
  const [view, setView] = useState<'all' | 'comments' | 'history'>('all')

  const submit = () => {
    if (!draft.trim()) return
    onAddComment(draft.trim())
    setDraft('')
  }

  /* Merge and sort timeline */
  const timeline: TimelineItem[] = []
  if (view !== 'history') comments.forEach((c) => timeline.push({ kind: 'comment', data: c }))
  if (view !== 'comments') activity.forEach((a) => timeline.push({ kind: 'activity', data: a }))
  timeline.sort((a, b) => new Date(a.data.timestamp).getTime() - new Date(b.data.timestamp).getTime())

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center gap-1 border-b border-hf-border/30 pb-0">
        {(['all', 'comments', 'history'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'px-3 py-2 text-xs font-semibold border-b-2 -mb-px capitalize transition-all',
              view === v ? 'text-hf-primary border-hf-primary' : 'text-hf-dim hover:text-hf-muted border-transparent'
            )}
          >
            {v === 'all' ? 'All Activity' : v === 'comments' ? `Comments (${comments.length})` : 'Audit Log'}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {timeline.length === 0 && (
          <p className="text-center text-xs text-hf-dim py-8">No activity yet</p>
        )}

        {timeline.map((item) => {
          if (item.kind === 'comment') {
            const c = item.data
            return (
              <div key={c.id} className={cn('rounded-xl border p-3 space-y-2', c.isPinned ? 'border-hf-warning/40 bg-hf-warning/5' : 'border-hf-border/40 bg-hf-surface/40')}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-hf-primary/20 text-hf-primary text-[9px] font-black flex items-center justify-center shrink-0">
                    {c.authorName.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <span className="text-xs font-semibold text-hf-text">{c.authorName}</span>
                  {c.isPinned && <Pin className="w-3 h-3 text-hf-warning ml-auto" />}
                  <span className="text-[10px] text-hf-dim ml-auto">{formatDate(c.timestamp, 'relative')}</span>
                </div>
                <p className="text-xs text-hf-muted leading-relaxed pl-8">{c.text}</p>
              </div>
            )
          }

          const act = item.data
          const m = ACTION_META[act.action] ?? ACTION_META['created']
          const Icon = m.icon
          return (
            <div key={act.id} className="flex items-start gap-2.5 py-1">
              <div className="w-5 h-5 rounded-full bg-hf-surface border border-hf-border/40 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className={cn('w-2.5 h-2.5', m.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-hf-muted leading-snug">
                  <span className="font-semibold text-hf-text">{act.actorName}</span>{' '}
                  <span>{m.label}</span>
                  {act.newValue && (
                    <>
                      {' '}<span className="font-mono text-hf-primary text-[10px] bg-hf-primary/10 px-1.5 rounded">{act.newValue}</span>
                    </>
                  )}
                  {act.detail && <span className="text-hf-dim"> — {act.detail}</span>}
                </p>
                <p className="text-[10px] text-hf-dim mt-0.5">{formatDate(act.timestamp, 'long')}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Comment input */}
      <div className="border-t border-hf-border/30 pt-4">
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit() }}
            placeholder="Add analyst note… (Ctrl+Enter to submit)"
            rows={3}
            className="flex-1 bg-hf-bg/60 border border-hf-border/50 rounded-xl px-3 py-2.5 text-xs text-hf-text placeholder-hf-dim resize-none focus:outline-none focus:border-hf-primary/60"
          />
          <button
            onClick={submit}
            disabled={!draft.trim()}
            className="px-3 py-2 bg-hf-primary/20 hover:bg-hf-primary/30 border border-hf-primary/40 text-hf-primary rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-hf-dim mt-1.5 pl-1">Ctrl+Enter to submit</p>
      </div>
    </div>
  )
}
