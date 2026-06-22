'use client'
import { Check, Globe, Settings2, ShieldCheck, Plug, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WizardStepId = 1 | 2 | 3 | 4 | 5

const STEPS = [
  { id: 1 as WizardStepId, icon: Globe,         label: 'Clone Source',   desc: 'URL, type & auth'         },
  { id: 2 as WizardStepId, icon: Settings2,     label: 'Configuration',  desc: 'Name, category & owners'  },
  { id: 3 as WizardStepId, icon: ShieldCheck,   label: 'Monitoring',     desc: 'Attack detection rules'   },
  { id: 4 as WizardStepId, icon: Plug,          label: 'Integrations',   desc: 'SIEM & alerting outputs'  },
  { id: 5 as WizardStepId, icon: ClipboardCheck,label: 'Review & Deploy',desc: 'Config & architecture'    },
]

interface WizardSidebarProps {
  current: WizardStepId
  maxReached: WizardStepId
  onChange: (step: WizardStepId) => void
}

export function WizardSidebar({ current, maxReached, onChange }: WizardSidebarProps) {
  return (
    <div className="glass-card rounded-2xl border border-hf-border/50 p-4 space-y-1">
      {/* Title */}
      <div className="px-2 pb-3 border-b border-hf-border/40 mb-3">
        <p className="text-[10px] font-semibold text-hf-dim uppercase tracking-widest">Setup Wizard</p>
        <p className="text-xs text-hf-muted mt-0.5">Step {current} of 5</p>
      </div>

      {STEPS.map((step) => {
        const done    = step.id < current
        const active  = step.id === current
        const locked  = step.id > maxReached

        return (
          <button
            key={step.id}
            disabled={locked}
            onClick={() => !locked && onChange(step.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
              active  && 'bg-hf-primary/15 border border-hf-primary/30',
              done    && !active && 'hover:bg-hf-surface-2/60 cursor-pointer',
              !done && !active && !locked && 'hover:bg-hf-surface-2/40 cursor-pointer',
              locked  && 'opacity-40 cursor-not-allowed',
            )}
          >
            {/* Number / check circle */}
            <span className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-all',
              done    ? 'bg-hf-success/20 border-hf-success/50 text-hf-success'
                      : active ? 'bg-hf-primary/20 border-hf-primary/60 text-hf-primary'
                               : 'bg-hf-surface-3 border-hf-border/50 text-hf-dim'
            )}>
              {done ? <Check className="w-3.5 h-3.5" /> : step.id}
            </span>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-xs font-semibold truncate',
                active ? 'text-hf-primary' : done ? 'text-hf-text' : 'text-hf-muted'
              )}>
                {step.label}
              </p>
              <p className="text-[10px] text-hf-dim truncate">{step.desc}</p>
            </div>

            {/* Active indicator */}
            {active && <span className="w-1.5 h-1.5 bg-hf-primary rounded-full animate-pulse shrink-0" />}
          </button>
        )
      })}

      {/* Progress bar */}
      <div className="pt-3 px-2">
        <div className="flex justify-between text-[9px] text-hf-dim mb-1.5">
          <span>Progress</span>
          <span>{Math.round(((current - 1) / 4) * 100)}%</span>
        </div>
        <div className="h-1 bg-hf-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-hf-primary to-hf-accent rounded-full transition-all duration-500"
            style={{ width: `${((current - 1) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
