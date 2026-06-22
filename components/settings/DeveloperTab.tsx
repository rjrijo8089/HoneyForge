'use client'
import { useState } from 'react'
import { Copy, Eye, EyeOff, RefreshCw, Download, AlertTriangle, CheckCircle2, Eraser, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle, SettingRow, SectionHeader, BtnGroup, SaveBar, TabCard, useSave, inputCls, labelCls } from './shared'
import { Button } from '@/components/ui/Button'
import { useDataMode } from '@/contexts/DataModeContext'

type EnvMode = 'production' | 'staging' | 'development'

const ENV_OPTIONS: { value: EnvMode; label: string }[] = [
  { value: 'production',  label: 'Production'  },
  { value: 'staging',     label: 'Staging'     },
  { value: 'development', label: 'Development' },
]

function CopyField({ label, value, hint, mono = true }: { label: string; value: string; hint?: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div>
      <label className={cn(labelCls, 'block mb-1.5')}>{label}</label>
      <div className="flex items-center gap-2">
        <div className={cn(inputCls, 'flex-1 flex items-center', mono && 'font-mono text-xs text-hf-muted select-all')}>
          {value}
        </div>
        <button
          onClick={copy}
          title="Copy"
          className={cn(
            'p-2 rounded-lg border transition-all shrink-0',
            copied ? 'border-hf-success/30 text-hf-success bg-hf-success/10' : 'border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
          )}
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      {hint && <p className="text-xs text-hf-dim mt-1">{hint}</p>}
    </div>
  )
}

function SecretField({ label, value, onRotate, hint }: { label: string; value: string; onRotate: () => void; hint?: string }) {
  const [show,     setShow]     = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [rotating, setRotating] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rotate = async () => {
    setRotating(true)
    await new Promise((r) => setTimeout(r, 1000))
    onRotate()
    setRotating(false)
  }

  return (
    <div>
      <label className={cn(labelCls, 'block mb-1.5')}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          readOnly
          className={cn(inputCls, 'flex-1 font-mono text-xs')}
        />
        <button onClick={() => setShow((p) => !p)} className="p-2 rounded-lg border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button onClick={copy} title="Copy" className={cn('p-2 rounded-lg border transition-all', copied ? 'border-hf-success/30 text-hf-success bg-hf-success/10' : 'border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3')}>
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button onClick={rotate} title="Rotate secret" disabled={rotating}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all disabled:opacity-50 text-xs">
          <RefreshCw className={cn('w-3.5 h-3.5', rotating && 'animate-spin')} />
          {rotating ? 'Rotating…' : 'Rotate'}
        </button>
      </div>
      {hint && <p className="text-xs text-hf-dim mt-1">{hint}</p>}
    </div>
  )
}

/* ── Seed reset confirmation ── */
function ResetConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const [resetting, setResetting] = useState(false)
  const confirm = async () => {
    setResetting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setResetting(false)
    onConfirm()
  }
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-hf-danger/30 bg-hf-danger/[0.06]">
      <AlertTriangle className="w-4 h-4 text-hf-danger shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-bold text-hf-danger">This will reset all mock data to factory defaults.</p>
        <p className="text-[11px] text-hf-danger/70 mt-0.5">All decoys, events, integrations, rules, and reports will be wiped and regenerated. This cannot be undone.</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="ghost" size="xs" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" size="xs" isLoading={resetting} onClick={confirm}>Confirm Reset</Button>
      </div>
    </div>
  )
}

/* ── Clear demo data confirmation ── */
function ClearDemoConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const [clearing, setClearing] = useState(false)
  const confirm = async () => {
    setClearing(true)
    await new Promise((r) => setTimeout(r, 1200))
    setClearing(false)
    onConfirm()
  }
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-hf-warning/30 bg-hf-warning/[0.06]">
      <AlertTriangle className="w-4 h-4 text-hf-warning shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-bold text-amber-300">Switch to Clean Mode?</p>
        <p className="text-[11px] text-amber-400/70 mt-0.5">
          All pages will show empty states. Demo data will not be deleted — it is never persisted to the database.
          Real honeypot events will be shown instead.
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="ghost" size="xs" onClick={onCancel}>Cancel</Button>
        <Button variant="outline" size="xs" isLoading={clearing} onClick={confirm}>Clear Demo Data</Button>
      </div>
    </div>
  )
}

export function DeveloperTab() {
  const { saving, saved, save } = useSave()
  const { isDemoMode, setDemoMode } = useDataMode()

  const [envMode,        setEnvMode]        = useState<EnvMode>('production')
  const [secret,         setSecret]         = useState('whsec_hf_••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••')
  const [showReset,      setShowReset]      = useState(false)
  const [resetDone,      setResetDone]      = useState(false)
  const [showClearDemo,  setShowClearDemo]  = useState(false)
  const [seedDone,       setSeedDone]       = useState(false)

  const rotateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const rand  = Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setSecret(`whsec_hf_${rand}`)
  }

  const handleReset = () => {
    setShowReset(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 4000)
  }

  const handleClearDemo = () => {
    setShowClearDemo(false)
    setDemoMode(false)
  }

  const handleSeedDemo = () => {
    setDemoMode(true)
    setSeedDone(true)
    setTimeout(() => setSeedDone(false), 3000)
  }

  const exportConfig = () => {
    const config = {
      _note: 'HoneyForge platform config export — secrets redacted',
      envMode,
      isDemoMode,
      apiBaseUrl: 'https://api.honeyforge.io/v1',
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'honeyforge-config.json' })
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <TabCard>
      {/* ── API access ── */}
      <SectionHeader title="API Access" description="Base URL and signing secrets for API and webhook integration." />

      <div className="space-y-4 py-2">
        <CopyField
          label="API Base URL"
          value="https://api.honeyforge.io/v1"
          hint="All REST API endpoints are relative to this base. Include your API key in the X-HF-API-Key header."
        />
        <SecretField
          label="Webhook Signing Secret"
          value={secret}
          onRotate={rotateSecret}
          hint="Used to verify HMAC-SHA256 signatures on outgoing webhook payloads. Store securely — never commit to version control."
        />
      </div>

      {/* ── Environment ── */}
      <div className="pt-3"><SectionHeader title="Environment" /></div>

      <SettingRow label="Environment Mode" hint="Controls which feature flags and data sources are active. Production mode enforces stricter security policies.">
        <BtnGroup options={ENV_OPTIONS} value={envMode} onChange={setEnvMode} />
      </SettingRow>

      <SettingRow
        label="Demo Mode"
        hint="Serves all data from mock fixtures. Real honeypot traffic is suspended. Toggle off for clean zero-state mode."
        badge={
          isDemoMode
            ? <span className="text-[9px] font-bold text-hf-warning border border-hf-warning/30 px-1.5 py-0.5 rounded">Active</span>
            : <span className="text-[9px] font-bold text-hf-success border border-hf-success/30 px-1.5 py-0.5 rounded">Clean</span>
        }
      >
        <Toggle checked={isDemoMode} onChange={setDemoMode} />
      </SettingRow>

      {isDemoMode && envMode === 'production' && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-hf-danger/25 bg-hf-danger/[0.05] text-xs text-hf-muted">
          <AlertTriangle className="w-3.5 h-3.5 text-hf-danger shrink-0 mt-0.5" />
          Demo Mode is active in Production environment. Real honeypot traffic will be discarded until Demo Mode is disabled.
        </div>
      )}

      {/* ── Demo data management ── */}
      <div className="pt-3"><SectionHeader title="Demo Data" description="Control the simulated dataset used across all pages when Demo Mode is active." /></div>

      <div className="space-y-3">
        {/* Seed demo data */}
        <div className="flex items-center justify-between py-3 border-b border-hf-border/20">
          <div>
            <p className="text-sm font-medium text-hf-text">Seed Demo Data</p>
            <p className="text-xs text-hf-dim mt-0.5">Populate all pages with simulated honeypot events, decoys, reports, and audit logs.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemo}
            leftIcon={<Sprout className="w-3.5 h-3.5" />}
          >
            Seed Data
          </Button>
        </div>

        {seedDone && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-hf-success/25 bg-hf-success/[0.06] text-xs text-hf-success">
            <CheckCircle2 className="w-3.5 h-3.5" /> Demo data seeded — all pages now show simulated data.
          </div>
        )}

        {/* Clear demo data */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-hf-text">Clear Demo Data</p>
              <p className="text-xs text-hf-dim mt-0.5">Switch to clean mode. All pages show empty states. Demo records are never database-persisted.</p>
            </div>
            {!showClearDemo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDemo(true)}
                leftIcon={<Eraser className="w-3.5 h-3.5" />}
              >
                Clear Demo…
              </Button>
            )}
          </div>
          {showClearDemo && <ClearDemoConfirm onCancel={() => setShowClearDemo(false)} onConfirm={handleClearDemo} />}
        </div>
      </div>

      {/* ── Platform data management ── */}
      <div className="pt-1"><SectionHeader title="Data Management" /></div>

      <div className="flex items-center justify-between py-3.5 border-b border-hf-border/20">
        <div>
          <p className="text-sm font-medium text-hf-text">Export Platform Config</p>
          <p className="text-xs text-hf-dim mt-0.5">Download a JSON snapshot of current settings (secrets redacted).</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportConfig} leftIcon={<Download className="w-3.5 h-3.5" />}>
          Export JSON
        </Button>
      </div>

      <div className="py-3.5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-hf-text">Reset Seed Data</p>
            <p className="text-xs text-hf-dim mt-0.5">Restore all mock data to factory defaults. Useful after destructive testing.</p>
          </div>
          {!showReset && (
            <Button variant="danger" size="sm" onClick={() => setShowReset(true)}>
              Reset Data…
            </Button>
          )}
        </div>
        {showReset && <ResetConfirm onCancel={() => setShowReset(false)} onConfirm={handleReset} />}
        {resetDone && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-hf-success/25 bg-hf-success/[0.06] text-xs text-hf-success">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mock data reset to factory defaults.
          </div>
        )}
      </div>

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
