'use client'
import { useState } from 'react'
import { Info } from 'lucide-react'
import { Toggle, SettingRow, SectionHeader, BtnGroup, SaveBar, TabCard, useSave, numberCls } from './shared'

type Severity = 'all' | 'low' | 'medium' | 'high' | 'critical'

const SEV_OPTIONS: { value: Severity; label: string }[] = [
  { value: 'all',      label: 'All'      },
  { value: 'low',      label: 'Low'      },
  { value: 'medium',   label: 'Medium'   },
  { value: 'high',     label: 'High'     },
  { value: 'critical', label: 'Critical' },
]

export function DetectionTab() {
  const { saving, saved, save } = useSave()

  const [severityThreshold,       setSeverityThreshold]       = useState<Severity>('medium')
  const [confidenceThreshold,     setConfidenceThreshold]     = useState(60)
  const [autoCreateReview,        setAutoCreateReview]        = useState(true)
  const [autoTagMitre,            setAutoTagMitre]            = useState(true)
  const [capturePayload,          setCapturePayload]          = useState(true)
  const [captureCredential,       setCaptureCredential]       = useState(false)

  return (
    <TabCard>
      {/* ── Thresholds ── */}
      <SectionHeader title="Thresholds" description="Controls which events are surfaced and flagged for analyst review." />

      <SettingRow
        label="Default Severity Threshold"
        hint="Only events at or above this severity are processed into the review queue."
      >
        <BtnGroup options={SEV_OPTIONS} value={severityThreshold} onChange={setSeverityThreshold} />
      </SettingRow>

      <SettingRow
        label="Confidence Threshold"
        hint={`Events below ${confidenceThreshold}% confidence are filed as informational only.`}
      >
        <div className="flex items-center gap-3 w-60">
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="flex-1 accent-hf-primary"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Math.min(100, Math.max(0, Number(e.target.value))))}
              className={numberCls}
              min={0}
              max={100}
            />
            <span className="text-xs text-hf-dim">%</span>
          </div>
        </div>
      </SettingRow>

      {/* ── Automation ── */}
      <div className="pt-2"><SectionHeader title="Automation" description="Automatic actions applied to inbound honeypot events." /></div>

      <SettingRow
        label="Auto-create Review Items"
        hint="Automatically create analyst review queue items for events matching the severity threshold."
      >
        <Toggle checked={autoCreateReview} onChange={setAutoCreateReview} />
      </SettingRow>

      <SettingRow
        label="Auto-tag MITRE ATT&CK Techniques"
        hint="Use signature matching and ML classification to automatically assign MITRE technique IDs to incoming events."
      >
        <Toggle checked={autoTagMitre} onChange={setAutoTagMitre} />
      </SettingRow>

      {/* ── Metadata capture ── */}
      <div className="pt-2"><SectionHeader title="Metadata Capture" /></div>

      <SettingRow
        label="Enable Payload Metadata Capture"
        hint="Capture file hashes, command strings, and protocol fields from attacker payloads. Raw binaries are not stored."
      >
        <Toggle checked={capturePayload} onChange={setCapturePayload} />
      </SettingRow>

      <SettingRow
        label="Enable Credential Attempt Metadata"
        hint="Record attempted usernames and one-way hashes of attempted passwords for analysis. Raw credentials are never persisted."
        badge={
          <span className="inline-flex items-center gap-1 text-[9px] text-hf-accent border border-hf-accent/30 px-1.5 py-0.5 rounded">
            <Info className="w-2.5 h-2.5" /> Hashed only
          </span>
        }
      >
        <Toggle checked={captureCredential} onChange={setCaptureCredential} />
      </SettingRow>

      {captureCredential && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-hf-accent/25 bg-hf-accent/[0.05] text-xs text-hf-muted">
          <Info className="w-3.5 h-3.5 text-hf-accent shrink-0 mt-0.5" />
          Attempted passwords are stored as bcrypt hashes (cost 12). Original values are discarded immediately. Ensure your data handling policy covers credential honeypot data.
        </div>
      )}

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
