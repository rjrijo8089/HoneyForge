'use client'
import { useState, useMemo, useCallback } from 'react'
import { FileText, CheckCircle2, Calendar, HardDrive, Search } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { MOCK_REPORT_TEMPLATES } from '@/services/mock/data/reports'
import { useDataMode } from '@/contexts/DataModeContext'
import { ReportCard } from '@/components/reports/ReportCard'
import { ReportPreviewPanel } from '@/components/reports/ReportPreviewPanel'
import { ScheduleModal } from '@/components/reports/ScheduleModal'
import type { ReportTemplate, ReportCategory, ReportSchedule } from '@/types/report'

/* ── Overview metric chips ── */
function StatChip({ icon: Icon, label, value, accent }: {
  icon: React.ComponentType<{className?: string}>; label: string; value: string | number; accent: string
}) {
  return (
    <div className={cn('flex items-center gap-3 glass-card border rounded-xl px-4 py-3', accent)}>
      <Icon className="w-4 h-4 shrink-0 opacity-80" />
      <div>
        <p className="text-lg font-bold text-hf-text tabular-nums leading-none">{value}</p>
        <p className="text-[10px] text-hf-dim mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const CATEGORIES: { id: ReportCategory | 'all'; label: string }[] = [
  { id: 'all',        label: 'All'        },
  { id: 'executive',  label: 'Executive'  },
  { id: 'technical',  label: 'Technical'  },
  { id: 'threat',     label: 'Threat'     },
  { id: 'compliance', label: 'Compliance' },
]

function ReportsContent({ isDemoMode }: { isDemoMode: boolean }) {
  const [reports,        setReports]        = useState<ReportTemplate[]>(
    isDemoMode ? MOCK_REPORT_TEMPLATES as unknown as ReportTemplate[] : []
  )
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [scheduleTarget, setScheduleTarget] = useState<ReportTemplate | null>(null)
  const [generating,     setGenerating]     = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'all'>('all')
  const [search,         setSearch]         = useState('')

  /* ── Derived ── */
  const filtered = useMemo(() => {
    let list = reports
    if (activeCategory !== 'all') list = list.filter((r) => r.category === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }
    return list
  }, [reports, activeCategory, search])

  const selected = useMemo(() => reports.find((r) => r.id === selectedId) ?? null, [reports, selectedId])

  const stats = useMemo(() => ({
    total:    reports.length,
    active:   reports.filter((r) => r.status === 'active').length,
    scheduled: reports.filter((r) => r.schedule.frequency !== 'manual').length,
    ready:    reports.filter((r) => r.lastRun?.status === 'ready').length,
  }), [reports])

  /* ── Handlers ── */
  const handleGenerate = useCallback(async (report: ReportTemplate) => {
    setGenerating((prev) => new Set([...prev, report.id]))
    setReports((prev) => prev.map((r) =>
      r.id === report.id
        ? { ...r, lastRun: { runId: `run_${Date.now()}`, status: 'generating', at: new Date().toISOString() } }
        : r
    ))
    await new Promise((res) => setTimeout(res, 3000))
    const size = Math.floor(Math.random() * 3_000_000) + 500_000
    setReports((prev) => prev.map((r) =>
      r.id === report.id
        ? { ...r, lastRun: { runId: `run_${Date.now()}`, status: 'ready', at: new Date().toISOString(), fileSize: size } }
        : r
    ))
    setGenerating((prev) => { const s = new Set(prev); s.delete(report.id); return s })
  }, [])

  const handleDownload = useCallback((report: ReportTemplate) => {
    const content = `HoneyForge Report: ${report.name}\nGenerated: ${new Date().toISOString()}\n\n${report.preview.executiveSummary}`
    const ext     = report.schedule.format
    const blob    = new Blob([content], { type: 'text/plain' })
    const url     = URL.createObjectURL(blob)
    const a       = Object.assign(document.createElement('a'), {
      href: url, download: `${report.slug}-${new Date().toISOString().slice(0,10)}.${ext}`,
    })
    a.click(); URL.revokeObjectURL(url)
  }, [])

  const handleSaveSchedule = useCallback((id: string, schedule: ReportSchedule) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, schedule } : r))
  }, [])

  const handleSelect = useCallback((r: ReportTemplate) => {
    setSelectedId((prev) => prev === r.id ? null : r.id)
  }, [])

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = { all: reports.length }
    for (const cat of ['executive','technical','threat','compliance'] as ReportCategory[])
      m[cat] = reports.filter((r) => r.category === cat).length
    return m
  }, [reports])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-hf-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-hf-text">Reports</h2>
            <p className="text-xs text-hf-muted mt-0.5">Generate, schedule, and download executive and analyst reports</p>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatChip icon={FileText}     label="Total templates" value={stats.total}     accent="border-hf-primary/20" />
        <StatChip icon={CheckCircle2} label="Active schedules" value={stats.active}    accent="border-hf-success/20" />
        <StatChip icon={Calendar}     label="Scheduled runs"   value={stats.scheduled} accent="border-hf-accent/20"  />
        <StatChip icon={HardDrive}    label="Ready to download" value={stats.ready}   accent="border-hf-warning/20" />
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category tabs */}
        <div className="flex items-center gap-1 p-1 bg-hf-surface-2 border border-hf-border/40 rounded-xl flex-wrap">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id as ReportCategory | 'all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                activeCategory === id
                  ? 'bg-hf-primary/15 text-hf-primary border border-hf-primary/30'
                  : 'text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3'
              )}
            >
              {label}
              <span className={cn('ml-1.5 text-[9px] font-mono', activeCategory === id ? 'text-hf-primary' : 'text-hf-dim')}>
                {categoryCounts[id] ?? 0}
              </span>
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative flex-1 min-w-40 max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hf-dim pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-hf-surface-2 border border-hf-border/50 rounded-xl text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/50"
          />
        </div>
        {filtered.length !== reports.length && (
          <span className="text-xs text-hf-dim">
            {filtered.length} of {formatNumber(reports.length)} reports
          </span>
        )}
      </div>

      {/* ── Card grid (shifts when preview panel open) ── */}
      <div className={cn('transition-all duration-300', selected && 'xl:pr-[calc(min(50vw,672px)+1.5rem)]')}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-hf-dim gap-3">
            <FileText className="w-10 h-10 opacity-20" />
            <p className="text-sm">No reports match your filter</p>
            <button onClick={() => { setActiveCategory('all'); setSearch('') }} className="text-xs text-hf-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                isSelected={selectedId === r.id}
                isGenerating={generating.has(r.id)}
                onSelect={handleSelect}
                onGenerate={handleGenerate}
                onDownload={handleDownload}
                onSchedule={setScheduleTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Preview panel backdrop ── */}
      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setSelectedId(null)}
        />
      )}

      {/* ── Preview panel ── */}
      {selected && (
        <ReportPreviewPanel
          report={selected}
          onClose={() => setSelectedId(null)}
          onDownload={handleDownload}
        />
      )}

      {/* ── Schedule modal ── */}
      {scheduleTarget && (
        <ScheduleModal
          report={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onSave={handleSaveSchedule}
        />
      )}
    </div>
  )
}

export default function ReportsPage() {
  const { isDemoMode } = useDataMode()
  return <ReportsContent key={String(isDemoMode)} isDemoMode={isDemoMode} />
}
