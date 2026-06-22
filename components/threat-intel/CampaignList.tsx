'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SeverityPill } from './ConfidenceScore'
import { IOCTypeBadge } from './IOCTypeIcon'
import { MOCK_CAMPAIGNS } from '@/services/mock/data/threatIntel'
import type { Campaign, IOCType } from '@/types/threat-intel'

function MiniSparkbar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-px h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${Math.max((v / max) * 100, v > 0 ? 4 : 0)}%`,
            background: v > 0 ? `rgba(59,130,246,${0.3 + (v / max) * 0.7})` : '#1a2438',
          }}
        />
      ))}
    </div>
  )
}

const IOC_TYPES: IOCType[] = ['ip','domain','url','file-hash','user-agent','payload','cve','email']

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [expanded, setExpanded] = useState(false)
  const statusColor = campaign.status === 'active' ? 'text-hf-success bg-hf-success/10 border-hf-success/30'
    : campaign.status === 'dormant' ? 'text-hf-warning bg-hf-warning/10 border-hf-warning/30'
    : 'text-hf-dim bg-hf-surface-3 border-hf-border/40'

  return (
    <div className={cn(
      'glass-card rounded-2xl border overflow-hidden transition-all',
      campaign.status === 'active' ? 'border-hf-border/60' : 'border-hf-border/30 opacity-80'
    )}>
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-7 h-7 rounded-lg bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 text-hf-primary" />
              </div>
              <h3 className="text-sm font-bold text-hf-text">{campaign.name}</h3>
              <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider', statusColor)}>
                {campaign.status}
              </span>
              <SeverityPill severity={campaign.severity} size="xs" />
            </div>

            <p className="text-xs text-hf-muted mt-2 leading-relaxed line-clamp-2">{campaign.description}</p>
          </div>

          {/* Quick stats */}
          <div className="shrink-0 text-right space-y-1">
            <p className="text-2xl font-black text-hf-text tabular-nums">{campaign.iocCount}</p>
            <p className="text-[9px] text-hf-dim">IOCs</p>
          </div>
        </div>

        {/* Activity sparkbar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[9px] text-hf-dim">30-day activity</p>
            <p className="text-[9px] text-hf-dim">Confidence: <span className="text-hf-muted">{campaign.confidence}%</span></p>
          </div>
          <MiniSparkbar data={campaign.activityLast30Days} />
        </div>

        {/* IOC type breakdown */}
        <div className="flex flex-wrap gap-1 mt-3">
          {IOC_TYPES.filter((t) => (campaign.iocTypes[t] ?? 0) > 0).map((t) => (
            <div key={t} className="flex items-center gap-1">
              <IOCTypeBadge type={t} />
              <span className="text-[9px] text-hf-dim">×{campaign.iocTypes[t]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-2.5 border-t border-hf-border/30 bg-hf-surface-2/20 hover:bg-hf-surface-2/40 transition-colors text-xs text-hf-muted"
      >
        <span>{expanded ? 'Hide details' : 'Show techniques, targets & TTPs'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-4 border-t border-hf-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {/* Targets */}
          <div>
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Targeted Sectors</p>
            <div className="flex flex-wrap gap-1">
              {campaign.targets.map((t) => (
                <span key={t} className="text-[10px] text-hf-muted bg-hf-surface-3 border border-hf-border/40 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Malware */}
          {campaign.malwareFamilies.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Malware Families</p>
              <div className="flex flex-wrap gap-1">
                {campaign.malwareFamilies.map((m) => (
                  <span key={m} className="text-[10px] text-hf-danger bg-hf-danger/10 border border-hf-danger/30 px-2 py-0.5 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actor */}
          {campaign.threatActor && (
            <div>
              <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">Threat Actor</p>
              <span className="text-xs font-semibold text-hf-accent">{campaign.threatActor}</span>
            </div>
          )}

          {/* ATT&CK Techniques */}
          <div className="sm:col-span-2">
            <p className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-2">MITRE ATT&CK Techniques</p>
            <div className="flex flex-wrap gap-1">
              {campaign.techniques.map((t) => (
                <span key={t} className="text-[9px] font-mono text-hf-primary bg-hf-primary/10 border border-hf-primary/30 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="sm:col-span-2 flex gap-6 text-xs text-hf-muted">
            <span>First seen: <strong className="text-hf-text">{new Date(campaign.firstSeen).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
            <span>Last seen: <strong className="text-hf-text">{new Date(campaign.lastSeen).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}

export function CampaignList() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dormant' | 'closed'>('all')
  const filtered = MOCK_CAMPAIGNS.filter((c) => statusFilter === 'all' || c.status === statusFilter)

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-hf-surface-2 border border-hf-border/40 rounded-xl p-1 w-fit">
        {(['all', 'active', 'dormant', 'closed'] as const).map((s) => {
          const count = s === 'all' ? MOCK_CAMPAIGNS.length : MOCK_CAMPAIGNS.filter((c) => c.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize',
                statusFilter === s ? 'bg-hf-primary text-white' : 'text-hf-muted hover:text-hf-text'
              )}
            >
              {s} <span className={cn('text-[9px] font-black', statusFilter === s ? 'text-white/80' : 'text-hf-dim')}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {filtered.map((c) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  )
}
