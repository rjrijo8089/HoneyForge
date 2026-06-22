'use client'
import { useState, useMemo, useCallback } from 'react'
import { Plus, Plug, Search, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { MOCK_INTEGRATIONS } from '@/services/mock/data/integrations'
import { IntegrationOverviewCards } from '@/components/integrations/IntegrationOverviewCards'
import { IntegrationCard } from '@/components/integrations/IntegrationCard'
import { IntegrationConfigModal } from '@/components/integrations/IntegrationConfigModal'
import { INTEGRATION_CATEGORIES } from '@/types/integration'
import type { Integration, IntegrationCategory, IntegrationConfig } from '@/types/integration'

/* ── Mock test state per card (from the "Test" button on the card itself) ── */
interface CardTestState { status: 'idle' | 'running' | 'success' | 'error'; latencyMs?: number; at?: string }

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(
    MOCK_INTEGRATIONS as unknown as Integration[]
  )
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory | 'all'>('all')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [configTarget,   setConfigTarget]   = useState<Integration | null>(null)
  const [cardTests,      setCardTests]      = useState<Record<string, CardTestState>>({})

  /* ── Derived ── */
  const filtered = useMemo(() => {
    let list = integrations
    if (activeCategory !== 'all') list = list.filter((i) => i.category === activeCategory)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((i) =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.includes(q)
      )
    }
    return list
  }, [integrations, activeCategory, searchQuery])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: integrations.length }
    for (const cat of ['siem','threat-intel','alerting','case-management','storage','email'] as const)
      c[cat] = integrations.filter((i) => i.category === cat).length
    return c
  }, [integrations])

  /* ── Handlers ── */
  const handleToggle = useCallback((id: string, enabled: boolean) => {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, enabled } : i))
  }, [])

  const handleSave = useCallback((id: string, config: IntegrationConfig) => {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, config } : i))
  }, [])

  const handleCardTest = useCallback(async (integration: Integration) => {
    setCardTests((prev) => ({ ...prev, [integration.id]: { status: 'running' } }))
    await new Promise((r) => setTimeout(r, 1600))
    const now = new Date().toISOString()
    if (integration.mockTestOutcome === 'success') {
      setIntegrations((prev) => prev.map((i) =>
        i.id === integration.id ? { ...i, testedAt: now, health: 'healthy', healthMessage: `Last test passed — ${integration.mockTestLatencyMs}ms` } : i
      ))
      setCardTests((prev) => ({ ...prev, [integration.id]: { status: 'success', latencyMs: integration.mockTestLatencyMs, at: now } }))
    } else {
      setIntegrations((prev) => prev.map((i) =>
        i.id === integration.id ? { ...i, testedAt: now, health: 'error', healthMessage: integration.mockTestError ?? 'Connection failed' } : i
      ))
      setCardTests((prev) => ({ ...prev, [integration.id]: { status: 'error', at: now } }))
    }
    // Clear result badge after 5 seconds
    setTimeout(() => {
      setCardTests((prev) => ({ ...prev, [integration.id]: { status: 'idle' } }))
    }, 5000)
  }, [])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
            <Plug className="w-4.5 h-4.5 text-hf-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-hf-text">Integrations</h2>
            <p className="text-xs text-hf-muted mt-0.5">Forward honeypot intelligence to your security stack</p>
          </div>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Integration
        </Button>
      </div>

      {/* ── Overview cards ── */}
      <IntegrationOverviewCards integrations={integrations} />

      {/* ── Category tabs + search ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category tabs */}
        <div className="flex items-center gap-1 p-1 bg-hf-surface-2 border border-hf-border/40 rounded-xl flex-wrap">
          {INTEGRATION_CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id as IntegrationCategory | 'all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                activeCategory === id
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/30'
                  : 'text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
              )}
            >
              {label}
              <span className={cn(
                'ml-1.5 text-[9px] font-mono tabular-nums',
                activeCategory === id ? 'text-hf-primary' : 'text-hf-dim'
              )}>
                {counts[id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-40 max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-hf-surface-2 border border-hf-border/50 rounded-xl text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/50"
          />
        </div>
      </div>

      {/* ── Test result toast row (transient) ── */}
      {Object.entries(cardTests).some(([, t]) => t.status === 'running' || t.status === 'success' || t.status === 'error') && (
        <div className="space-y-1.5">
          {Object.entries(cardTests).filter(([, t]) => t.status !== 'idle').map(([id, t]) => {
            const integ = integrations.find((i) => i.id === id)
            if (!integ) return null
            return (
              <div key={id} className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs animate-fade-in',
                t.status === 'running' ? 'border-hf-border bg-hf-surface-2 text-hf-muted' :
                t.status === 'success' ? 'border-hf-success/30 bg-hf-success/8 text-hf-success' :
                                         'border-hf-danger/30 bg-hf-danger/8 text-hf-danger'
              )}>
                {t.status === 'running'
                  ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  : t.status === 'success'
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : <XCircle className="w-3.5 h-3.5" />
                }
                <span className="font-semibold">{integ.name}</span>
                <span className="text-current/70">
                  {t.status === 'running' ? '— Testing connection…' :
                   t.status === 'success' ? `— Connected (${t.latencyMs}ms)` :
                   '— Connection failed'}
                </span>
                {t.at && t.status !== 'running' && (
                  <span className="ml-auto text-[10px] flex items-center gap-1 opacity-60">
                    <Clock className="w-3 h-3" /> {formatDate(t.at, 'relative')}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-hf-dim gap-3">
          <Plug className="w-10 h-10 opacity-20" />
          <p className="text-sm">No integrations match your filter</p>
          <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }} className="text-xs text-hf-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((integ) => (
            <div key={integ.id} className="relative">
              <IntegrationCard
                integration={integ}
                onToggle={handleToggle}
                onConfigure={setConfigTarget}
                onTest={handleCardTest}
              />
              {/* Running spinner overlay on card */}
              {cardTests[integ.id]?.status === 'running' && (
                <div className="absolute inset-0 rounded-2xl bg-hf-bg/40 flex items-center justify-center pointer-events-none">
                  <RefreshCw className="w-6 h-6 text-hf-primary animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Config modal ── */}
      {configTarget && (
        <IntegrationConfigModal
          integration={configTarget}
          onClose={() => setConfigTarget(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
