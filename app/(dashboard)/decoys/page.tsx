'use client'
import { useState, useMemo } from 'react'
import { Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MOCK_DECOYS } from '@/services/mock'
import { useDataMode } from '@/contexts/DataModeContext'
import { DecoyOverview }      from '@/components/decoys/DecoyOverview'
import { DecoyFilters }       from '@/components/decoys/DecoyFilters'
import { DecoyTable }         from '@/components/decoys/DecoyTable'
import { DecoyDetailDrawer }  from '@/components/decoys/DecoyDetailDrawer'
import { CreateDecoyModal, type CreateDecoyData } from '@/components/decoys/CreateDecoyModal'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Decoy, DecoyStatus, DecoyCategory } from '@/types'

const DEMO_DECOYS: Decoy[] = MOCK_DECOYS.map((d) => ({ ...d, source: 'demo' as const }))

export default function DecoysPage() {
  const { isDemoMode } = useDataMode()

  const [localDecoys,   setLocalDecoys]   = useState<Decoy[]>([])
  const [hiddenDemoIds, setHiddenDemoIds] = useState<string[]>([])
  const [selectedDecoy, setSelectedDecoy] = useState<Decoy | null>(null)
  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [modalOpen,     setModalOpen]     = useState(false)

  // Merge local decoys + visible demo decoys — no useEffect needed
  const decoys = useMemo(() => [
    ...localDecoys,
    ...(isDemoMode ? DEMO_DECOYS.filter((d) => !hiddenDemoIds.includes(d.id)) : []),
  ], [localDecoys, isDemoMode, hiddenDemoIds])

  // ── Filters ──────────────────────────────────────────
  const [search, setSearch]                 = useState('')
  const [statusFilter, setStatusFilter]     = useState<DecoyStatus[]>([])
  const [categoryFilter, setCategoryFilter] = useState<DecoyCategory[]>([])
  const [envFilter, setEnvFilter]           = useState<string[]>([])

  const toggleStatus   = (v: DecoyStatus)   => setStatusFilter((f) => f.includes(v) ? f.filter((x) => x !== v) : [...f, v])
  const toggleCategory = (v: DecoyCategory) => setCategoryFilter((f) => f.includes(v) ? f.filter((x) => x !== v) : [...f, v])
  const toggleEnv      = (v: string)        => setEnvFilter((f) => f.includes(v) ? f.filter((x) => x !== v) : [...f, v])
  const clearFilters   = () => { setSearch(''); setStatusFilter([]); setCategoryFilter([]); setEnvFilter([]) }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return decoys.filter((d) => {
      if (statusFilter.length   > 0 && !statusFilter.includes(d.status))     return false
      if (categoryFilter.length > 0 && !categoryFilter.includes(d.category)) return false
      if (envFilter.length      > 0 && !envFilter.includes(d.environment))   return false
      if (q && !(
        d.name.toLowerCase().includes(q) ||
        d.ipAddress.includes(q) ||
        (d.os ?? '').toLowerCase().includes(q) ||
        d.tags.some((t) => t.includes(q)) ||
        d.category.includes(q) ||
        d.type.includes(q)
      )) return false
      return true
    })
  }, [decoys, search, statusFilter, categoryFilter, envFilter])

  // ── Actions ───────────────────────────────────────────
  const openDrawer = (decoy: Decoy) => {
    setSelectedDecoy(decoy)
    setDrawerOpen(true)
  }

  const handleToggleStatus = (id: string, next: DecoyStatus) => {
    if (localDecoys.some((d) => d.id === id)) {
      setLocalDecoys((prev) => prev.map((d) => d.id === id ? { ...d, status: next } : d))
    } else {
      // Promote demo decoy to local with updated status, hide original from demo pool
      const demoDecoy = DEMO_DECOYS.find((d) => d.id === id)
      if (demoDecoy) {
        setHiddenDemoIds((prev) => [...prev, id])
        setLocalDecoys((prev) => [{ ...demoDecoy, status: next, source: 'local' as const }, ...prev])
      }
    }
    if (selectedDecoy?.id === id) {
      setSelectedDecoy((d) => d ? { ...d, status: next } : d)
    }
  }

  const handleDelete = (id: string) => {
    if (localDecoys.some((d) => d.id === id)) {
      setLocalDecoys((prev) => prev.filter((d) => d.id !== id))
    } else {
      setHiddenDemoIds((prev) => [...prev, id])
    }
    if (selectedDecoy?.id === id) {
      setDrawerOpen(false)
      setSelectedDecoy(null)
    }
  }

  const handleCreate = (data: CreateDecoyData) => {
    const newDecoy: Decoy = {
      id: `d_${Date.now()}`,
      name:          data.name,
      category:      data.category,
      type:          data.type,
      status:        'deploying',
      ipAddress:     data.ipAddress,
      port:          data.port,
      os:            data.os || undefined,
      environment:   data.environment,
      description:   data.description || undefined,
      tags:          data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      riskScore:     0,
      healthStatus:  'unknown',
      interactionsCount: 0,
      attacksToday:  0,
      capturedMalware: 0,
      openAlerts:    0,
      uptime:        0,
      activityLast7Days: [0, 0, 0, 0, 0, 0, 0],
      createdAt:     new Date().toISOString(),
      updatedAt:     new Date().toISOString(),
      createdBy:     'admin@honeyforge.io',
      notes:         data.description || undefined,
      source:        'local',
    }
    setLocalDecoys((prev) => [newDecoy, ...prev])
    setModalOpen(false)
  }

  const localCount = localDecoys.length
  const visibleDemoCount = isDemoMode ? DEMO_DECOYS.length - hiddenDemoIds.length : 0

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Page header ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-hf-text">Decoy Manager</h1>
          <p className="text-sm text-hf-muted mt-0.5">
            Deploy and manage honeypot instances across your network
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Deploy Decoy
        </Button>
      </div>

      {/* ── Demo mode notice ───────────────────────────── */}
      {isDemoMode && (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-orange-400/25 bg-orange-400/[0.06] text-xs text-orange-300">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
          Showing {visibleDemoCount} simulated demo decoys
          {localCount > 0 && <span className="text-hf-muted"> + {localCount} real decoy{localCount !== 1 ? 's' : ''} you deployed</span>}
          <span className="text-orange-400/50">· Demo records are marked with a badge</span>
        </div>
      )}

      {/* ── Overview cards ─────────────────────────────── */}
      <DecoyOverview decoys={decoys} />

      {/* ── Empty clean-mode state ─────────────────────── */}
      {!isDemoMode && decoys.length === 0 ? (
        <div className="glass-card rounded-2xl border border-hf-border">
          <EmptyState
            icon={<Shield />}
            title="No decoys deployed"
            description="Deploy your first honeypot decoy to start capturing attacker activity. Enable Demo Mode in Settings › Developer to explore with simulated data."
            action={
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                Deploy your first decoy
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* ── Filters ──────────────────────────────────── */}
          <DecoyFilters
            search={search}
            onSearch={setSearch}
            statuses={statusFilter}
            onStatusToggle={toggleStatus}
            categories={categoryFilter}
            onCategoryToggle={toggleCategory}
            environments={envFilter}
            onEnvToggle={toggleEnv}
            onClear={clearFilters}
            activeCount={filtered.length}
          />

          {/* ── Table ────────────────────────────────────── */}
          {filtered.length === 0 && (search || statusFilter.length > 0 || categoryFilter.length > 0 || envFilter.length > 0) ? (
            <div className="glass-card rounded-2xl border border-hf-border/50 py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-hf-surface-3 border border-hf-border flex items-center justify-center">
                <Shield className="w-6 h-6 text-hf-dim" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-hf-text">No decoys match your filters</p>
                <p className="text-xs text-hf-muted mt-1">Try adjusting your search or filter criteria</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <DecoyTable
              decoys={filtered}
              onView={openDrawer}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      {/* ── Detail Drawer ──────────────────────────────── */}
      <DecoyDetailDrawer
        decoy={selectedDecoy}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* ── Create Modal ───────────────────────────────── */}
      <CreateDecoyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

    </div>
  )
}
