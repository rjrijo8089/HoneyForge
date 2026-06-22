'use client'
import { useState, useCallback, useId } from 'react'
import { X, Calendar, ChevronDown, Plus, Trash2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { ReportTemplate, ReportSchedule, ReportFrequency, ReportFormat, ReportDelivery } from '@/types/report'

const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const HOURS = Array.from({ length: 24 }, (_, i) => ({ value: i, label: `${String(i).padStart(2,'0')}:00 UTC` }))

interface BtnGroupProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}
function BtnGroup<T extends string>({ options, value, onChange }: BtnGroupProps<T>) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
            value === o.value
              ? 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
              : 'border-hf-border/50 text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const fieldCls = 'w-full bg-hf-bg/60 border border-hf-border/60 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim/60 focus:outline-none focus:border-hf-primary/60 transition-colors'

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-hf-dim">{children}</label>
      {hint && <span className="text-[9px] text-hf-dim/70">{hint}</span>}
    </div>
  )
}

interface Props {
  report:  ReportTemplate
  onClose: () => void
  onSave:  (id: string, schedule: ReportSchedule) => void
}

export function ScheduleModal({ report, onClose, onSave }: Props) {
  const uid = useId()
  const [form, setForm] = useState<ReportSchedule>({ ...report.schedule })
  const [saving, setSaving] = useState(false)
  const [recipientInput, setRecipientInput] = useState('')

  const set = useCallback(<K extends keyof ReportSchedule>(key: K, value: ReportSchedule[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleDelivery = (d: ReportDelivery) => {
    setForm((prev) => ({
      ...prev,
      delivery: prev.delivery.includes(d)
        ? prev.delivery.filter((x) => x !== d)
        : [...prev.delivery, d],
    }))
  }

  const addRecipient = () => {
    const email = recipientInput.trim()
    if (!email || form.recipients.includes(email)) { setRecipientInput(''); return }
    set('recipients', [...form.recipients, email])
    setRecipientInput('')
  }

  const removeRecipient = (email: string) => {
    set('recipients', form.recipients.filter((r) => r !== email))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    onSave(report.id, form)
    setSaving(false)
    onClose()
  }

  const showEmail   = form.delivery.includes('email')
  const showSlack   = form.delivery.includes('slack')
  const showWebhook = form.delivery.includes('webhook')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col bg-hf-surface border border-hf-border/60 rounded-2xl shadow-2xl animate-fade-in">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hf-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-hf-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-hf-text">Edit Schedule</h2>
              <p className="text-[10px] text-hf-dim truncate max-w-[260px]">{report.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Frequency ── */}
          <div>
            <Label>Frequency</Label>
            <BtnGroup<ReportFrequency>
              options={[
                { value: 'daily',   label: 'Daily'   },
                { value: 'weekly',  label: 'Weekly'  },
                { value: 'monthly', label: 'Monthly' },
                { value: 'manual',  label: 'Manual'  },
              ]}
              value={form.frequency}
              onChange={(v) => set('frequency', v)}
            />
          </div>

          {/* ── Day / Time ── */}
          {form.frequency !== 'manual' && (
            <div className="grid grid-cols-2 gap-3">
              {form.frequency === 'weekly' && (
                <div>
                  <Label>Day of Week</Label>
                  <div className="relative">
                    <select
                      value={form.dayOfWeek ?? 1}
                      onChange={(e) => set('dayOfWeek', Number(e.target.value))}
                      className={cn(fieldCls, 'appearance-none pr-8')}
                    >
                      {DAYS_OF_WEEK.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
                  </div>
                </div>
              )}
              {form.frequency === 'monthly' && (
                <div>
                  <Label hint="1–28">Day of Month</Label>
                  <div className="relative">
                    <select
                      value={form.dayOfMonth ?? 1}
                      onChange={(e) => set('dayOfMonth', Number(e.target.value))}
                      className={cn(fieldCls, 'appearance-none pr-8')}
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}{d===1?'st':d===2?'nd':d===3?'rd':'th'} of month</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
                  </div>
                </div>
              )}
              <div className={form.frequency === 'daily' ? 'col-span-2' : ''}>
                <Label>Time (UTC)</Label>
                <div className="relative">
                  <select
                    value={form.hour}
                    onChange={(e) => set('hour', Number(e.target.value))}
                    className={cn(fieldCls, 'appearance-none pr-8')}
                  >
                    {HOURS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                  <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* ── Format ── */}
          <div>
            <Label>Output Format</Label>
            <BtnGroup<ReportFormat>
              options={[
                { value: 'pdf',  label: 'PDF'  },
                { value: 'csv',  label: 'CSV'  },
                { value: 'json', label: 'JSON' },
              ]}
              value={form.format}
              onChange={(v) => set('format', v)}
            />
          </div>

          {/* ── Delivery methods (multi-select) ── */}
          <div>
            <Label>Delivery Methods</Label>
            <div className="flex gap-2 flex-wrap mb-3">
              {(['email','slack','webhook'] as ReportDelivery[]).map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDelivery(d)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all',
                    form.delivery.includes(d)
                      ? 'bg-hf-primary/15 border-hf-primary/40 text-hf-primary'
                      : 'border-hf-border/50 text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Email recipients */}
            {showEmail && (
              <div className="mb-3">
                <Label hint="— press Enter to add">Email Recipients</Label>
                <div className="flex gap-2">
                  <input
                    id={`${uid}-email`}
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                    placeholder="analyst@corp.com"
                    className={cn(fieldCls, 'flex-1')}
                  />
                  <button
                    onClick={addRecipient}
                    className="px-3 py-2 rounded-lg border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {form.recipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.recipients.map((r) => (
                      <div key={r} className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[10px] bg-hf-surface-3 border border-hf-border/40 text-hf-muted">
                        {r}
                        <button onClick={() => removeRecipient(r)} className="hover:text-hf-danger transition-colors">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Slack channel */}
            {showSlack && (
              <div className="mb-3">
                <Label>Slack Channel</Label>
                <input
                  value={form.slackChannel ?? ''}
                  onChange={(e) => set('slackChannel', e.target.value)}
                  placeholder="#soc-reports"
                  className={fieldCls}
                />
              </div>
            )}

            {/* Webhook URL */}
            {showWebhook && (
              <div>
                <Label>Webhook URL</Label>
                <input
                  value={form.webhookUrl ?? ''}
                  onChange={(e) => set('webhookUrl', e.target.value)}
                  placeholder="https://your-endpoint.com/hook"
                  className={fieldCls}
                />
                <p className="mt-1 text-[9px] text-hf-dim">Reports will be POSTed as JSON payloads to this URL.</p>
              </div>
            )}
          </div>

          {/* ── Preview ── */}
          {form.frequency !== 'manual' && (
            <div className="bg-hf-surface-2/40 border border-hf-border/30 rounded-xl px-4 py-3">
              <p className="text-[9px] font-bold text-hf-dim uppercase tracking-widest mb-1.5">Schedule Preview</p>
              <p className="text-xs text-hf-muted">
                {form.frequency === 'daily' && `Runs every day at ${String(form.hour).padStart(2,'0')}:00 UTC`}
                {form.frequency === 'weekly' && `Runs every ${DAYS_OF_WEEK[form.dayOfWeek ?? 1]} at ${String(form.hour).padStart(2,'0')}:00 UTC`}
                {form.frequency === 'monthly' && `Runs on the ${form.dayOfMonth ?? 1}${(form.dayOfMonth??1)===1?'st':(form.dayOfMonth??1)===2?'nd':(form.dayOfMonth??1)===3?'rd':'th'} of each month at ${String(form.hour).padStart(2,'0')}:00 UTC`}
              </p>
              <p className="text-[10px] text-hf-dim mt-0.5">
                Output: <span className="font-mono font-bold text-hf-muted uppercase">{form.format}</span>
                {form.delivery.length > 0 && ` · Delivered via ${form.delivery.join(', ')}`}
                {form.recipients.length > 0 && ` to ${form.recipients.length} recipient${form.recipients.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hf-border/40 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" isLoading={saving} onClick={handleSave}>
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
