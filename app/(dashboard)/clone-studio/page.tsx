'use client'
import { useState } from 'react'
import { Copy, Activity, ChevronRight, ChevronLeft, CheckCircle2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useNotificationStore } from '@/store/notificationStore'

import { AuthBanner } from '@/components/clone-studio/AuthBanner'
import { WizardSidebar, type WizardStepId } from '@/components/clone-studio/WizardSidebar'
import { StepCloneSource } from '@/components/clone-studio/StepCloneSource'
import { StepDecoyConfig } from '@/components/clone-studio/StepDecoyConfig'
import { StepMonitoring } from '@/components/clone-studio/StepMonitoring'
import { StepIntegrations } from '@/components/clone-studio/StepIntegrations'
import { StepReview } from '@/components/clone-studio/StepReview'
import { CloneHealthDashboard } from '@/components/clone-studio/CloneHealthDashboard'
import { DEFAULT_WIZARD, type WizardData } from '@/components/clone-studio/types'

/* ─────────────────────── Step titles / validation ─────────────────────── */

const STEP_TITLES: Record<WizardStepId, string> = {
  1: 'Clone Source',
  2: 'Decoy Configuration',
  3: 'Attack Monitoring',
  4: 'Integrations',
  5: 'Review & Deploy',
}

function canAdvance(step: WizardStepId, data: WizardData): boolean {
  if (step === 1) return data.step1.url.length > 0
  if (step === 2) return data.step2.name.length > 0
  return true
}

/* ─────────────────────────── Success Screen ───────────────────────────── */

function SuccessScreen({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-hf-success/20 border-2 border-hf-success/40 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-hf-success" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-hf-text">Decoy Deployed!</h2>
        <p className="text-hf-muted max-w-sm">
          <strong className="text-hf-text">{name}</strong> is now live. SNARE is serving the decoy and TANNER is analyzing incoming traffic.
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        <Button variant="primary" size="md" onClick={onReset} leftIcon={<Plus className="w-4 h-4" />}>
          Deploy Another
        </Button>
        <Button variant="outline" size="md" onClick={onReset}>
          View Health Dashboard
        </Button>
      </div>
    </div>
  )
}

/* ─────────────────────────── Main Page ─────────────────────────────────── */

export default function CloneStudioPage() {
  const addNotification = useNotificationStore((s) => s.addNotification)

  const [view,       setView]       = useState<'wizard' | 'health'>('wizard')
  const [step,       setStep]       = useState<WizardStepId>(1)
  const [maxReached, setMaxReached] = useState<WizardStepId>(1)
  const [wizardData, setWizardData] = useState<WizardData>(DEFAULT_WIZARD)
  const [deploying,  setDeploying]  = useState(false)
  const [deployed,   setDeployed]   = useState(false)

  /* ── Wizard navigation ── */
  const goTo = (target: WizardStepId) => {
    setStep(target)
    if (target > maxReached) setMaxReached(target)
  }

  const goNext = () => {
    if (step < 5) goTo((step + 1) as WizardStepId)
  }

  const goPrev = () => {
    if (step > 1) setStep((step - 1) as WizardStepId)
  }

  /* ── Deploy handler ── */
  const handleDeploy = async () => {
    setDeploying(true)
    await new Promise((r) => setTimeout(r, 2200))
    setDeploying(false)
    setDeployed(true)
    addNotification({
      type: 'success',
      title: 'Decoy Deployed',
      message: `${wizardData.step2.name} is now active and collecting threat intelligence.`,
    })
  }

  /* ── Reset wizard ── */
  const handleReset = () => {
    setWizardData(DEFAULT_WIZARD)
    setStep(1)
    setMaxReached(1)
    setDeployed(false)
    setView('health')
  }

  /* ── Partial data update helpers ── */
  const updateStep1 = (s1: WizardData['step1']) => setWizardData((d) => ({ ...d, step1: s1 }))
  const updateStep2 = (s2: WizardData['step2']) => setWizardData((d) => ({ ...d, step2: s2 }))
  const updateStep3 = (s3: WizardData['step3']) => setWizardData((d) => ({ ...d, step3: s3 }))
  const updateStep4 = (s4: WizardData['step4']) => setWizardData((d) => ({ ...d, step4: s4 }))

  const suggestedName = (() => {
    try {
      const hostname = new URL(wizardData.step1.url).hostname
      const parts = hostname.split('.').filter((p) => p.length > 2)
      return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-') + '-Lure'
    } catch {
      return ''
    }
  })()

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center shrink-0">
            <Copy className="w-5 h-5 text-hf-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-hf-text">Clone Studio</h1>
            <p className="text-xs text-hf-muted">Create and manage web deception assets for authorized security testing</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-hf-surface-2 border border-hf-border/40 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setView('wizard')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              view === 'wizard'
                ? 'bg-hf-primary text-white shadow-sm'
                : 'text-hf-muted hover:text-hf-text'
            )}
          >
            <Copy className="w-3.5 h-3.5" />
            New Clone
          </button>
          <button
            onClick={() => setView('health')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              view === 'health'
                ? 'bg-hf-primary text-white shadow-sm'
                : 'text-hf-muted hover:text-hf-text'
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            Health Dashboard
          </button>
        </div>
      </div>

      {/* Auth banner — always shown */}
      <AuthBanner />

      {/* ── Wizard view ── */}
      {view === 'wizard' && !deployed && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">

          {/* Left sidebar */}
          <div className="lg:sticky lg:top-6">
            <WizardSidebar current={step} maxReached={maxReached} onChange={goTo} />
          </div>

          {/* Right — step card */}
          <div className="glass-card rounded-2xl border border-hf-border/50 overflow-hidden">
            {/* Step header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-hf-border/40 bg-hf-surface-2/30">
              <div className="w-7 h-7 rounded-full bg-hf-primary/20 border border-hf-primary/40 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-hf-primary">{step}</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-hf-text">{STEP_TITLES[step]}</h2>
                <p className="text-[10px] text-hf-dim">Step {step} of 5</p>
              </div>
            </div>

            {/* Step content */}
            <div className="p-6">
              {step === 1 && (
                <StepCloneSource data={wizardData.step1} onChange={updateStep1} />
              )}
              {step === 2 && (
                <StepDecoyConfig
                  data={wizardData.step2}
                  onChange={updateStep2}
                  suggestedName={suggestedName}
                />
              )}
              {step === 3 && (
                <StepMonitoring data={wizardData.step3} onChange={updateStep3} />
              )}
              {step === 4 && (
                <StepIntegrations data={wizardData.step4} onChange={updateStep4} />
              )}
              {step === 5 && (
                <StepReview data={wizardData} onDeploy={handleDeploy} deploying={deploying} />
              )}
            </div>

            {/* Footer navigation — steps 1–4 only */}
            {step < 5 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-hf-border/30 bg-hf-surface-2/20">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={step === 1}
                  onClick={goPrev}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canAdvance(step, wizardData)}
                  onClick={goNext}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  {step === 4 ? 'Review & Deploy' : 'Continue'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Deployed success ── */}
      {view === 'wizard' && deployed && (
        <div className="glass-card rounded-2xl border border-hf-success/30">
          <SuccessScreen name={wizardData.step2.name} onReset={handleReset} />
        </div>
      )}

      {/* ── Health Dashboard view ── */}
      {view === 'health' && (
        <CloneHealthDashboard />
      )}
    </div>
  )
}
