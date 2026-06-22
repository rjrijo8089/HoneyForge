'use client'
import { useState } from 'react'
import { Globe, Lock, Search, Eye, FileCode2, Layers, Braces } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ToggleSwitch } from './ToggleSwitch'
import type { WizardStep1, WizardCloneType } from './types'

interface StepCloneSourceProps {
  data: WizardStep1
  onChange: (data: WizardStep1) => void
}

const CLONE_TYPES: { value: WizardCloneType; label: string; icon: React.ComponentType<{className?: string}>; desc: string; badge?: string }[] = [
  { value: 'full',      label: 'Full Clone',     icon: Layers,   desc: 'Replicate all pages, CSS, assets and JS. Highest fidelity decoy.', badge: 'Recommended' },
  { value: 'template',  label: 'Template Clone',  icon: FileCode2,desc: 'Use a pre-built template matching the site category. Faster deployment.' },
  { value: 'partial',   label: 'Partial Clone',   icon: Eye,      desc: 'Clone landing page and login form only. Low-noise, high-signal.' },
  { value: 'api-mock',  label: 'API Mock',        icon: Braces,   desc: 'Generate a fake REST/GraphQL API with documented endpoints.' },
]

function ClonePreview({ data }: { data: WizardStep1 }) {
  const hostname = (() => {
    try { return new URL(data.url).hostname } catch { return data.url }
  })()

  return (
    <div className="rounded-xl border border-hf-border/50 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-hf-surface-3 border-b border-hf-border/50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hf-danger/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-hf-warning/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-hf-success/60" />
        </div>
        <div className="flex-1 bg-hf-surface-2 rounded-md px-3 py-1 text-xs font-mono text-hf-muted border border-hf-border/40">
          🔒 {hostname || 'enter-url-above.example.com'}
        </div>
      </div>

      {/* Simulated page wireframe */}
      <div className="bg-hf-bg-2 p-4 space-y-3 min-h-[200px]">
        {/* Nav */}
        <div className="flex items-center gap-3 pb-3 border-b border-hf-border/30">
          <div className="w-6 h-6 bg-hf-primary/20 rounded" />
          <div className="flex gap-4">
            {[60, 48, 52, 44].map((w, i) => (
              <div key={i} className="h-2 bg-hf-surface-3 rounded" style={{ width: w }} />
            ))}
          </div>
          <div className="ml-auto w-16 h-6 bg-hf-primary/30 rounded-md animate-shimmer" />
        </div>

        {/* Hero */}
        <div className="space-y-2 py-2">
          <div className="h-4 bg-hf-surface-3 rounded w-3/4" />
          <div className="h-3 bg-hf-surface-3/60 rounded w-1/2" />
        </div>

        {/* Cards / form */}
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-hf-surface/60 border border-hf-border/30 rounded-lg p-2 space-y-1.5">
              <div className="h-2.5 bg-hf-surface-3 rounded w-2/3" />
              <div className="h-2 bg-hf-surface-3/60 rounded" />
              <div className="h-2 bg-hf-surface-3/60 rounded w-4/5" />
            </div>
          ))}
        </div>

        {data.analyzed && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: 'Pages detected',   value: data.detectedPages,  color: 'text-hf-primary' },
              { label: 'Forms detected',   value: data.detectedForms,  color: 'text-hf-warning' },
              { label: 'Links detected',   value: data.detectedLinks,  color: 'text-hf-accent'  },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5 bg-hf-surface-2 border border-hf-border/40 rounded-lg px-2.5 py-1.5">
                <span className={cn('text-sm font-bold tabular-nums', color)}>{value}</span>
                <span className="text-[10px] text-hf-dim">{label}</span>
              </div>
            ))}
            {data.detectedTitle && (
              <div className="flex items-center gap-1.5 bg-hf-surface-2 border border-hf-border/40 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] text-hf-muted">Title: <span className="text-hf-text">&ldquo;{data.detectedTitle}&rdquo;</span></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function StepCloneSource({ data, onChange }: StepCloneSourceProps) {
  const [analyzing, setAnalyzing] = useState(false)

  const update = (patch: Partial<WizardStep1>) => onChange({ ...data, ...patch })

  const handleAnalyze = async () => {
    if (!data.url) return
    setAnalyzing(true)
    await new Promise((r) => setTimeout(r, 1600))

    // Simulate detection results from URL
    const hostname = (() => { try { return new URL(data.url).hostname } catch { return 'unknown' } })()
    const words = hostname.split('.').filter((w) => w.length > 2)
    const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Portal'

    update({
      analyzed: true,
      detectedTitle: title,
      detectedPages: Math.floor(Math.random() * 30 + 8),
      detectedForms: Math.floor(Math.random() * 5 + 1),
      detectedLinks: Math.floor(Math.random() * 80 + 20),
    })
    setAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      {/* URL + Analyze */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-hf-muted uppercase tracking-wider">Clone Source URL</label>
        <div className="flex gap-2">
          <Input
            value={data.url}
            onChange={(e) => update({ url: e.target.value, analyzed: false })}
            placeholder="https://finance.internal.corp"
            leftIcon={<Globe className="w-4 h-4" />}
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="primary"
            size="md"
            isLoading={analyzing}
            disabled={!data.url || analyzing}
            onClick={handleAnalyze}
            leftIcon={<Search className="w-4 h-4" />}
          >
            Analyze
          </Button>
        </div>
        <p className="text-[11px] text-hf-dim">
          Enter the internal URL of the asset you own or are authorized to decoy. HoneyForge does not crawl external sites.
        </p>
      </div>

      {/* Clone type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-hf-muted uppercase tracking-wider">Clone Strategy</label>
        <div className="grid grid-cols-2 gap-2">
          {CLONE_TYPES.map((ct) => {
            const Icon    = ct.icon
            const active  = data.cloneType === ct.value
            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => update({ cloneType: ct.value })}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                  active
                    ? 'bg-hf-primary/10 border-hf-primary/50'
                    : 'bg-hf-surface-2/40 border-hf-border/40 hover:bg-hf-surface-2 hover:border-hf-border-2'
                )}
              >
                <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', active ? 'text-hf-primary' : 'text-hf-muted')} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className={cn('text-xs font-semibold', active ? 'text-hf-primary' : 'text-hf-text')}>
                      {ct.label}
                    </p>
                    {ct.badge && (
                      <span className="text-[9px] font-bold text-hf-success border border-hf-success/40 bg-hf-success/10 px-1.5 rounded">
                        {ct.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-hf-dim mt-0.5 leading-snug">{ct.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Auth toggle */}
      <div className="glass-card rounded-xl border border-hf-border/40 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className={cn('w-4 h-4', data.authRequired ? 'text-hf-warning' : 'text-hf-dim')} />
            <div>
              <p className="text-sm font-medium text-hf-text">Authentication Required</p>
              <p className="text-[11px] text-hf-dim">Store credentials to enable authenticated clone captures</p>
            </div>
          </div>
          <ToggleSwitch checked={data.authRequired} onChange={(v) => update({ authRequired: v })} />
        </div>

        {data.authRequired && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-hf-border/30">
            <Input
              label="Username"
              value={data.username}
              onChange={(e) => update({ username: e.target.value })}
              placeholder="admin"
              autoComplete="off"
            />
            <Input
              label="Password"
              type="password"
              value={data.password}
              onChange={(e) => update({ password: e.target.value })}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="col-span-2 text-[10px] text-hf-dim">
              Credentials are stored encrypted and used only during the initial page structure capture.
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-hf-muted uppercase tracking-wider">Clone Preview</label>
          {data.analyzed && (
            <span className="text-[10px] font-bold text-hf-success border border-hf-success/40 bg-hf-success/10 px-2 py-0.5 rounded-full">
              ✓ Analyzed
            </span>
          )}
        </div>
        <ClonePreview data={data} />
        {!data.analyzed && (
          <p className="text-[11px] text-hf-dim text-center">Enter a URL and click Analyze to see a simulated structure preview</p>
        )}
      </div>
    </div>
  )
}
