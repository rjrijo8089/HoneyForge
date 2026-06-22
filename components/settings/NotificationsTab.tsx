'use client'
import { useState } from 'react'
import { Plus, X, MessageSquare, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle, SettingRow, SectionHeader, BtnGroup, SaveBar, TabCard, useSave, inputCls, labelCls } from './shared'

type AlertThreshold = 'all' | 'high_critical' | 'critical'
const THRESHOLD_OPTIONS: { value: AlertThreshold; label: string }[] = [
  { value: 'all',          label: 'All Events'      },
  { value: 'high_critical',label: 'High & Critical' },
  { value: 'critical',     label: 'Critical Only'   },
]

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: `${String(i).padStart(2, '0')}:00`,
  label: `${String(i).padStart(2, '0')}:00 UTC`,
}))

export function NotificationsTab() {
  const { saving, saved, save } = useSave()

  const [slackEnabled,      setSlackEnabled]      = useState(true)
  const [slackWebhook,      setSlackWebhook]      = useState('https://hooks.slack.com/services/T00000000/B00000000/••••••••••••••••')
  const [slackChannel,      setSlackChannel]      = useState('#soc-alerts')
  const [mentionOnCritical, setMentionOnCritical] = useState(true)

  const [emailEnabled,      setEmailEnabled]      = useState(true)
  const [emailInput,        setEmailInput]        = useState('')
  const [recipients,        setRecipients]        = useState<string[]>(['soc-team@acmecorp.io', 'ciso@acmecorp.io'])
  const [digestTime,        setDigestTime]        = useState('07:00')

  const [alertThreshold,    setAlertThreshold]    = useState<AlertThreshold>('high_critical')

  const addEmail = () => {
    const v = emailInput.trim()
    if (v && !recipients.includes(v)) setRecipients((p) => [...p, v])
    setEmailInput('')
  }
  const removeEmail = (e: string) => setRecipients((p) => p.filter((x) => x !== e))

  return (
    <TabCard>
      {/* ── Alert threshold ── */}
      <SectionHeader title="Alert Threshold" description="Which events trigger real-time notifications." />

      <SettingRow label="Critical Alert Threshold" hint="Only events meeting this severity trigger immediate Slack and email alerts.">
        <BtnGroup options={THRESHOLD_OPTIONS} value={alertThreshold} onChange={setAlertThreshold} />
      </SettingRow>

      {/* ── Slack ── */}
      <div className="pt-2">
        <SectionHeader
          title="Slack"
          description="Send real-time alerts to a Slack channel."
        />
      </div>

      <SettingRow
        label="Slack Alerts"
        badge={<MessageSquare className="w-3.5 h-3.5 text-[#4A154B]" />}
      >
        <Toggle checked={slackEnabled} onChange={setSlackEnabled} />
      </SettingRow>

      {slackEnabled && (
        <div className="space-y-3 pb-2">
          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>Webhook URL</label>
            <input
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className={cn(inputCls, 'font-mono text-xs')}
              placeholder="https://hooks.slack.com/services/…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn(labelCls, 'block mb-1.5')}>Channel</label>
              <input
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                className={inputCls}
                placeholder="#soc-alerts"
              />
            </div>
            <SettingRow label="@mention channel on Critical" className="!py-0 !border-0">
              <Toggle checked={mentionOnCritical} onChange={setMentionOnCritical} />
            </SettingRow>
          </div>
        </div>
      )}

      {/* ── Email ── */}
      <div className="pt-2">
        <SectionHeader title="Email Digest" description="Daily summary email of honeypot activity." />
      </div>

      <SettingRow label="Email Digest" badge={<Mail className="w-3.5 h-3.5 text-hf-dim" />}>
        <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
      </SettingRow>

      {emailEnabled && (
        <div className="space-y-3 pb-2">
          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>Recipients</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recipients.map((r) => (
                <span key={r} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs bg-hf-surface-3 border border-hf-border/40 text-hf-muted">
                  {r}
                  <button onClick={() => removeEmail(r)} className="hover:text-hf-danger transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                placeholder="analyst@corp.com"
                className={cn(inputCls, 'flex-1')}
              />
              <button onClick={addEmail} className="px-3 py-2 rounded-lg border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>Daily Digest Time (UTC)</label>
            <div className="relative w-40">
              <select
                value={digestTime}
                onChange={(e) => setDigestTime(e.target.value)}
                className="w-full bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text appearance-none focus:outline-none focus:border-hf-primary pr-8"
              >
                {HOURS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      )}

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
