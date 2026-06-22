'use client'
import { useState } from 'react'
import { Archive, HardDrive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle, SettingRow, SectionHeader, SelectField, SaveBar, TabCard, useSave, numberCls, labelCls } from './shared'

interface RetentionField {
  key:   string
  label: string
  hint:  string
  min:   number
  max:   number
  warn:  number
}

const FIELDS: RetentionField[] = [
  { key: 'events',    label: 'Event Retention',              hint: 'Honeypot interaction events and alerts',          min: 7,  max: 730, warn: 30  },
  { key: 'indicators',label: 'Indicator (IOC) Retention',   hint: 'IP, domain, hash, and URL indicators of compromise',min: 30, max: 1825,warn: 90  },
  { key: 'audit',     label: 'Audit Log Retention',         hint: 'Platform action audit trail — regulatory minimum may apply', min: 90, max: 2190, warn: 180 },
  { key: 'malware',   label: 'Malware Metadata Retention',  hint: 'File hashes, YARA hits, and sandbox analysis metadata',     min: 30, max: 1825,warn: 90  },
]

type RetentionKey = 'events' | 'indicators' | 'audit' | 'malware'

function RetentionRow({ field, value, onChange }: { field: RetentionField; value: number; onChange: (v: number) => void }) {
  const isShort = value < field.warn

  return (
    <div className="py-3.5 border-b border-hf-border/20 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-medium text-hf-text">{field.label}</p>
          <p className="text-xs text-hf-dim mt-0.5">{field.hint}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(field.max, Math.max(field.min, Number(e.target.value))))}
            className={cn(numberCls, isShort && 'border-hf-warning/50 text-hf-warning')}
            min={field.min}
            max={field.max}
          />
          <span className="text-xs text-hf-dim">days</span>
        </div>
      </div>
      {/* Visual bar */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-hf-primary h-1"
        />
        <span className={cn('text-[10px] font-mono w-16 text-right shrink-0', isShort ? 'text-hf-warning' : 'text-hf-dim')}>
          ~{Math.round(value / 30)}mo
        </span>
      </div>
    </div>
  )
}

export function DataRetentionTab() {
  const { saving, saved, save } = useSave()

  const [days, setDays] = useState<Record<RetentionKey, number>>({
    events:     90,
    indicators: 365,
    audit:      730,
    malware:    365,
  })

  const [archiveEnabled, setArchiveEnabled] = useState(false)
  const [archivePath,    setArchivePath]    = useState('/var/hf-archive')
  const [archiveFormat,  setArchiveFormat]  = useState('gzip')

  const setDay = (k: RetentionKey) => (v: number) => setDays((p) => ({ ...p, [k]: v }))

  // Storage estimate (very rough: 1KB/event, 1 event/min)
  const eventsEstimate = Math.round((days.events * 1440 * 1) / 1024) // MB
  const totalGB        = (eventsEstimate / 1024 + days.indicators * 0.01 + days.audit * 0.005).toFixed(1)

  return (
    <TabCard>
      <SectionHeader title="Retention Periods" description="How long each data category is kept before automatic deletion." />

      {FIELDS.map((f) => (
        <RetentionRow
          key={f.key}
          field={f}
          value={days[f.key as RetentionKey]}
          onChange={setDay(f.key as RetentionKey)}
        />
      ))}

      {/* Storage estimate */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-hf-border/30 bg-hf-surface-2/50 mt-1">
        <HardDrive className="w-4 h-4 text-hf-dim shrink-0" />
        <p className="text-xs text-hf-dim">
          Estimated retention footprint: <span className="font-bold text-hf-muted">~{totalGB} GB</span> — actual usage depends on event volume and compression ratio.
        </p>
      </div>

      {/* ── Archive ── */}
      <div className="pt-3"><SectionHeader title="Archive" description="Archive data past retention windows instead of deleting." /></div>

      <SettingRow
        label="Enable Archive"
        hint="Data past the retention window is moved to archive storage rather than deleted. Archived data is read-only."
        badge={<Archive className="w-3.5 h-3.5 text-hf-dim" />}
      >
        <Toggle checked={archiveEnabled} onChange={setArchiveEnabled} />
      </SettingRow>

      {archiveEnabled && (
        <div className="grid grid-cols-2 gap-4 pb-2">
          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>Archive Storage Path</label>
            <input
              value={archivePath}
              onChange={(e) => setArchivePath(e.target.value)}
              className="w-full bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text font-mono focus:outline-none focus:border-hf-primary transition-colors"
              placeholder="/var/hf-archive"
            />
          </div>
          <SelectField
            label="Archive Format"
            value={archiveFormat}
            onChange={setArchiveFormat}
            options={[{ value: 'gzip', label: 'NDJSON + gzip' }, { value: 'json', label: 'Plain JSON' }, { value: 'parquet', label: 'Parquet' }]}
          />
        </div>
      )}

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
