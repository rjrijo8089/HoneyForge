'use client'
import { useState, useMemo, useCallback } from 'react'
import { Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MOCK_RULES } from '@/services/mock/data/rules'
import { RuleOverviewCards } from '@/components/detection-rules/RuleOverviewCards'
import { RuleFilterPanel, DEFAULT_RULE_FILTERS } from '@/components/detection-rules/RuleFilters'
import { RuleTable } from '@/components/detection-rules/RuleTable'
import { RuleDetailDrawer } from '@/components/detection-rules/RuleDetailDrawer'
import { CreateRuleModal } from '@/components/detection-rules/CreateRuleModal'
import type { DetectionRule, RuleFilters as RuleFiltersType } from '@/types/rule'

function exportRule(rule: DetectionRule) {
  const blob = new Blob([rule.content], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `${rule.id}.${rule.type === 'suricata' ? 'rules' : rule.type === 'yara' ? 'yar' : rule.type === 'opensearch' ? 'json' : 'yml'}`,
  })
  a.click(); URL.revokeObjectURL(url)
}

function applyFilters(rules: DetectionRule[], f: RuleFiltersType): DetectionRule[] {
  return rules.filter((r) => {
    if (f.search) {
      const s = f.search.toLowerCase()
      const match = r.name.toLowerCase().includes(s)
        || r.description.toLowerCase().includes(s)
        || r.tags.some((t) => t.toLowerCase().includes(s))
        || r.id.toLowerCase().includes(s)
        || r.owner.toLowerCase().includes(s)
      if (!match) return false
    }
    if (f.types.length        && !f.types.includes(r.type))             return false
    if (f.statuses.length     && !f.statuses.includes(r.status))        return false
    if (f.severities.length   && !f.severities.includes(r.severity))    return false
    if (f.detectionSources.length && !r.detectionSources.some((s) => f.detectionSources.includes(s))) return false
    if (f.mitreTactic && !r.mitreTactics.includes(f.mitreTactic))       return false
    return true
  })
}

export default function DetectionRulesPage() {
  const [rules, setRules]           = useState<DetectionRule[]>(MOCK_RULES as unknown as DetectionRule[])
  const [filters, setFilters]       = useState<RuleFiltersType>(DEFAULT_RULE_FILTERS)
  const [selectedRule, setSelected] = useState<DetectionRule | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => applyFilters(rules, filters), [rules, filters])

  const handleToggle = useCallback((rule: DetectionRule) => {
    setRules((prev) => prev.map((r) =>
      r.id === rule.id
        ? { ...r, status: r.status === 'active' ? 'disabled' : 'active', updatedAt: new Date().toISOString() }
        : r
    ))
    setSelected((prev) => prev?.id === rule.id ? { ...prev, status: prev.status === 'active' ? 'disabled' : 'active' } : prev)
  }, [])

  const handleDuplicate = useCallback((rule: DetectionRule) => {
    const copy: DetectionRule = {
      ...rule,
      id:        `r_${Date.now()}`,
      name:      `${rule.name} (Copy)`,
      status:    'draft',
      hitCount:  0,
      lastHitAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionHistory: [{
        version:   '1.0',
        changedAt: new Date().toISOString(),
        changedBy: rule.owner,
        summary:   `Duplicated from ${rule.id}`,
      }],
    }
    setRules((prev) => [copy, ...prev])
  }, [])

  const handleDelete = useCallback((rule: DetectionRule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id))
    setSelected((prev) => prev?.id === rule.id ? null : prev)
  }, [])

  const handleCreate = useCallback((partial: Partial<DetectionRule>) => {
    setRules((prev) => [partial as DetectionRule, ...prev])
  }, [])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-hf-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-hf-text">Detection Rules</h2>
            <p className="text-xs text-hf-muted mt-0.5">Sigma, YARA, Suricata, OpenSearch &amp; SIEM rules for honeypot event analysis</p>
          </div>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowCreate(true)}
        >
          Create Rule
        </Button>
      </div>

      {/* ── Overview cards ── */}
      <RuleOverviewCards rules={rules} />

      {/* ── Filters ── */}
      <RuleFilterPanel
        filters={filters}
        onChange={setFilters}
        totalCount={rules.length}
        filteredCount={filtered.length}
      />

      {/* ── Table ── */}
      <div className={cn(
        'glass-card border border-hf-border/30 rounded-2xl overflow-hidden transition-all',
        selectedRule && 'mr-[calc(theme(maxWidth.xl)+1rem)]'
      )}>
        <RuleTable
          rules={filtered}
          selectedId={selectedRule?.id ?? null}
          onSelect={setSelected}
          onEdit={(r) => setSelected(r)}
          onToggle={handleToggle}
          onDuplicate={handleDuplicate}
          onExport={exportRule}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Detail drawer backdrop ── */}
      {selectedRule && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        />
      )}

      {/* ── Detail drawer ── */}
      {selectedRule && (
        <RuleDetailDrawer
          rule={selectedRule}
          onClose={() => setSelected(null)}
          onToggle={handleToggle}
          onDuplicate={handleDuplicate}
        />
      )}

      {/* ── Create rule modal ── */}
      {showCreate && (
        <CreateRuleModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}
