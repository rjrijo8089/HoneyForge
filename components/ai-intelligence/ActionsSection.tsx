'use client'
import { useState, useCallback } from 'react'
import { Zap, Send, Database, Share2, FileText, Bell, Settings2, Flag, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle, SectionHeader, BtnGroup, TabCard, useSave, SaveBar, inputCls, labelCls } from '@/components/settings/shared'
import { executeAction, type ActionType } from '@/services/ai/suggestedActionService'
import type { AIConfiguration, AIProvider } from '@/types/ai-intelligence'

type Toast = { id: number; message: string; success: boolean }

const ACTIONS: { key: ActionType; label: string; description: string; icon: React.ComponentType<{className?: string}>; variant: string }[] = [
  { key: 'send_to_review',      label: 'Send to Review Queue', description: 'Escalate high-confidence events to analyst review',        icon: Send,     variant: 'text-hf-primary border-hf-primary/30 hover:bg-hf-primary/10'   },
  { key: 'export_siem',         label: 'Export to SIEM',       description: 'Push IOCs to OpenSearch index',                           icon: Database, variant: 'text-blue-400 border-blue-400/30 hover:bg-blue-400/10'          },
  { key: 'push_to_misp',        label: 'Push to MISP',         description: 'Share Campaign α-7 IOCs via MISP (TLP:GREEN)',            icon: Share2,   variant: 'text-purple-400 border-purple-400/30 hover:bg-purple-400/10'     },
  { key: 'create_rule',         label: 'Create Detection Rule', description: 'Auto-generate rule from current campaign signatures',    icon: Settings2,variant: 'text-amber-400 border-amber-400/30 hover:bg-amber-400/10'       },
  { key: 'send_slack_alert',    label: 'Send Slack Alert',      description: 'Notify #soc-alerts with current threat summary',         icon: Bell,     variant: 'text-hf-warning border-hf-warning/30 hover:bg-hf-warning/10'    },
  { key: 'generate_report',     label: 'Generate Report',       description: 'Create AI executive briefing report for this period',    icon: FileText, variant: 'text-hf-success border-hf-success/30 hover:bg-hf-success/10'    },
  { key: 'tune_decoy',          label: 'Tune Decoy',            description: 'Increase Cowrie-SSH-01 interaction depth to capture more', icon: Zap,   variant: 'text-hf-primary border-hf-primary/30 hover:bg-hf-primary/10'   },
  { key: 'mark_false_positive', label: 'Mark False Positive',   description: 'Exclude low-confidence events from campaign scoring',   icon: Flag,     variant: 'text-hf-dim border-hf-border hover:bg-hf-surface-3'              },
]

const PROVIDER_OPTIONS: { value: AIProvider; label: string }[] = [
  { value: 'anthropic',   label: 'Anthropic'     },
  { value: 'openai',      label: 'OpenAI'        },
  { value: 'ollama',      label: 'Ollama (local)'},
  { value: 'azure_openai',label: 'Azure OpenAI'  },
]

export function ActionsSection({ configuration }: { configuration: AIConfiguration }) {
  const [toasts,    setToasts]    = useState<Toast[]>([])
  const [loading,   setLoading]   = useState<ActionType | null>(null)

  const [provider,  setProvider]  = useState<AIProvider>(configuration.provider)
  const [model,     setModel]     = useState(configuration.model)
  const [endpoint,  setEndpoint]  = useState(configuration.endpoint)
  const [privMode,  setPrivMode]  = useState(configuration.privacyMode)
  const [autoRun,   setAutoRun]   = useState(configuration.enableAutoAnalysis)
  const [interval,  setInterval]  = useState(configuration.analysisIntervalMinutes)
  const { saving, saved, save }   = useSave()

  const addToast = useCallback((message: string, success: boolean) => {
    const id = Date.now()
    setToasts((p) => [...p, { id, message, success }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000)
  }, [])

  const handleAction = async (key: ActionType) => {
    if (loading) return
    setLoading(key)
    try {
      const result = await executeAction(key)
      addToast(result.message, result.success)
    } catch {
      addToast('Action failed — check service connectivity', false)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Toast stack ── */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className={cn(
              'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium shadow-xl animate-slide-in-right',
              t.success ? 'bg-hf-surface border-hf-success/30 text-hf-success' : 'bg-hf-surface border-hf-danger/30 text-hf-danger'
            )}>
              {t.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
              {t.message}
            </div>
          ))}
        </div>
      )}

      {/* ── Suggested actions ── */}
      <div className="glass-card rounded-2xl border border-hf-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-hf-primary" />
          <h3 className="text-sm font-bold text-hf-text">Suggested Actions</h3>
          <span className="text-[10px] text-hf-dim">All actions require analyst approval</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ACTIONS.map(({ key, label, description, icon: Icon, variant }) => {
            const isLoading = loading === key
            return (
              <button
                key={key}
                onClick={() => handleAction(key)}
                disabled={!!loading}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                  variant
                )}
              >
                <div className="shrink-0">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{label}</p>
                  <p className="text-[10px] opacity-70 truncate">{description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── AI configuration ── */}
      <TabCard>
        <SectionHeader title="AI Configuration" description="Settings for the AI analysis engine. API keys are stored server-side and never exposed to the browser." />

        <div className="space-y-4 py-2">
          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>AI Provider</label>
            <BtnGroup options={PROVIDER_OPTIONS} value={provider} onChange={setProvider} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn(labelCls, 'block mb-1.5')}>Model</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} className={inputCls} placeholder="claude-sonnet-4-6" />
            </div>
            <div>
              <label className={cn(labelCls, 'block mb-1.5')}>Analysis Interval (min)</label>
              <input
                type="number" min={15} max={1440} value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full bg-hf-surface-2 border border-hf-border rounded-lg px-3 py-2 text-sm text-hf-text focus:outline-none focus:border-hf-primary"
              />
            </div>
          </div>

          <div>
            <label className={cn(labelCls, 'block mb-1.5')}>API Endpoint</label>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className={cn(inputCls, 'font-mono text-xs')} />
            <p className="text-xs text-hf-dim mt-1">API keys are stored server-side only and are never transmitted to the browser.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-2.5 border-b border-hf-border/20">
              <div>
                <p className="text-sm font-medium text-hf-text">Privacy Mode</p>
                <p className="text-xs text-hf-dim">Strip all PII and sensitive payloads before sending to AI provider.</p>
              </div>
              <Toggle checked={privMode} onChange={setPrivMode} />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-hf-text">Auto-Analysis</p>
                <p className="text-xs text-hf-dim">Run AI intelligence analysis automatically on the configured interval.</p>
              </div>
              <Toggle checked={autoRun} onChange={setAutoRun} />
            </div>
          </div>
        </div>

        <SaveBar onSave={() => save()} saving={saving} saved={saved} />
      </TabCard>
    </div>
  )
}
