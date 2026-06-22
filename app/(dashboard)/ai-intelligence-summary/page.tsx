'use client'
import { useState } from 'react'
import {
  Bot, Users, Network, Shield, Database, Crosshair, Lightbulb, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDataMode } from '@/contexts/DataModeContext'
import { EmptyState } from '@/components/ui/EmptyState'
import { MOCK_AI_INTELLIGENCE } from '@/services/mock/data/ai-intelligence'

import { OverviewSection }       from '@/components/ai-intelligence/OverviewSection'
import { CampaignsSection }      from '@/components/ai-intelligence/CampaignsSection'
import { CorrelationSection }    from '@/components/ai-intelligence/CorrelationSection'
import { DecoyRankingSection }   from '@/components/ai-intelligence/DecoyRankingSection'
import { IocEnrichmentSection }  from '@/components/ai-intelligence/IocEnrichmentSection'
import { MitreSection }          from '@/components/ai-intelligence/MitreSection'
import { RecommendationsSection }from '@/components/ai-intelligence/RecommendationsSection'
import { ActionsSection }        from '@/components/ai-intelligence/ActionsSection'

type TabId = 'overview' | 'campaigns' | 'correlation' | 'decoy-risk' | 'ioc-enrichment' | 'mitre' | 'recommendations' | 'actions'

const TABS: { id: TabId; label: string; icon: React.ComponentType<{className?: string}>; hint: string }[] = [
  { id: 'overview',        label: 'AI Overview',       icon: Bot,       hint: 'Threat level, key findings & telemetry'   },
  { id: 'campaigns',       label: 'Campaigns',         icon: Users,     hint: 'Active attacker campaign detection'        },
  { id: 'correlation',     label: 'Correlation',       icon: Network,   hint: 'Cross-decoy event correlation groups'      },
  { id: 'decoy-risk',      label: 'Decoy Risk',        icon: Shield,    hint: 'Priority ranking by risk score'            },
  { id: 'ioc-enrichment',  label: 'IOC Enrichment',    icon: Database,  hint: 'Multi-feed IOC reputation enrichment'      },
  { id: 'mitre',           label: 'MITRE ATT&CK',      icon: Crosshair, hint: 'Observed technique coverage map'           },
  { id: 'recommendations', label: 'Recommendations',   icon: Lightbulb, hint: 'Executive summary & analyst guidance'      },
  { id: 'actions',         label: 'Actions & Config',  icon: Zap,       hint: 'Suggested actions & AI engine config'      },
]

const LEVEL_DOT: Record<string, string> = {
  critical: 'bg-hf-danger',
  high:     'bg-hf-warning',
  medium:   'bg-amber-400',
  low:      'bg-hf-success',
}
const LEVEL_TEXT: Record<string, string> = {
  critical: 'text-hf-danger',
  high:     'text-hf-warning',
  medium:   'text-amber-400',
  low:      'text-hf-success',
}

export default function AIIntelligencePage() {
  const { isDemoMode } = useDataMode()
  const [active, setActive] = useState<TabId>('overview')
  const tab = TABS.find((t) => t.id === active)!

  const data = MOCK_AI_INTELLIGENCE

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-hf-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-hf-text">AI Intelligence Summary</h2>
            <p className="text-xs text-hf-muted mt-0.5">Deception intelligence engine — AI-powered correlation, campaign detection, and analyst guidance</p>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div className={cn('w-2.5 h-2.5 rounded-full', LEVEL_DOT[data.summary.threatLevel])} />
              <div className={cn('absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-50', LEVEL_DOT[data.summary.threatLevel])} />
            </div>
            <span className={cn('text-xs font-bold uppercase tracking-widest', LEVEL_TEXT[data.summary.threatLevel])}>
              {data.summary.threatLevel} THREAT
            </span>
            <span className="text-[10px] text-hf-dim">·</span>
            <span className="text-[10px] text-hf-dim font-mono">{data.summary.model}</span>
          </div>
        )}
      </div>

      {/* ── AI privacy notice ── */}
      <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-xl border border-hf-primary/20 bg-hf-primary/[0.05]">
        <Bot className="w-3.5 h-3.5 text-hf-primary shrink-0 mt-0.5" />
        <p className="text-[11px] text-hf-muted">
          AI analysis uses mock data only. No real API calls are made. API keys are stored server-side and are never transmitted to the browser.
          All data shown is simulated for demonstration purposes.
        </p>
      </div>

      {!isDemoMode ? (
        /* ── Clean mode empty state ── */
        <div className="glass-card rounded-2xl border border-hf-border">
          <EmptyState
            icon={<Bot />}
            title="No intelligence data available"
            description="Enable Demo Mode in Settings › Developer to load the AI intelligence engine with simulated honeypot telemetry, or connect real honeypot event sources."
          />
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* ── Sidebar nav ── */}
          <nav className="w-52 shrink-0 space-y-0.5 sticky top-4">
            {TABS.map(({ id, label, icon: Icon, hint }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                title={hint}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  active === id
                    ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/25 shadow-sm'
                    : 'text-hf-muted hover:text-hf-text hover:bg-hf-surface-2 border border-transparent'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}

            {/* AI status chip */}
            <div className="pt-3 px-1">
              <div className="rounded-xl border border-hf-border/40 bg-hf-surface-2 px-3 py-2.5 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-hf-success" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-50 bg-hf-success" />
                  </div>
                  <span className="text-[10px] font-semibold text-hf-success">Analysis Active</span>
                </div>
                <p className="text-[10px] text-hf-dim">
                  {data.summary.eventsAnalyzed.toLocaleString()} events · {data.summary.model}
                </p>
                <p className="text-[10px] text-hf-dim">Last run: 14:23 UTC</p>
              </div>
            </div>
          </nav>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Tab header */}
            <div className="flex items-center gap-2 mb-4">
              <tab.icon className="w-4 h-4 text-hf-dim" />
              <h3 className="text-sm font-bold text-hf-text">{tab.label}</h3>
              <span className="text-[10px] text-hf-dim">·</span>
              <span className="text-xs text-hf-dim">{tab.hint}</span>
            </div>

            {active === 'overview'        && <OverviewSection       summary={data.summary}                                        />}
            {active === 'campaigns'       && <CampaignsSection      campaigns={data.campaigns}                                    />}
            {active === 'correlation'     && <CorrelationSection    groups={data.correlationGroups}                               />}
            {active === 'decoy-risk'      && <DecoyRankingSection   scores={data.decoyRiskScores}                                 />}
            {active === 'ioc-enrichment'  && <IocEnrichmentSection  iocs={data.enrichedIOCs}                                      />}
            {active === 'mitre'           && <MitreSection          techniques={data.mitreTechniques}                             />}
            {active === 'recommendations' && <RecommendationsSection recommendations={data.recommendations} summary={data.summary}/>}
            {active === 'actions'         && <ActionsSection        configuration={data.configuration}                            />}
          </div>
        </div>
      )}
    </div>
  )
}
