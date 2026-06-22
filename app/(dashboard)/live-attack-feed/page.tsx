'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Activity, Pause, Play, Trash2, ChevronsDown, ChevronsUp, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { FeedTicker }       from '@/components/live-feed/FeedTicker'
import { FeedFilters }      from '@/components/live-feed/FeedFilters'
import { FeedTable }        from '@/components/live-feed/FeedTable'
import { EventDetailDrawer }from '@/components/live-feed/EventDetailDrawer'
import { AttackTimeline }   from '@/components/live-feed/AttackTimeline'
import { TopStats }         from '@/components/live-feed/TopStats'

import { buildInitialFeed, makeNextEvent } from '@/services/mock/data/liveFeed'
import { DEFAULT_LIVE_FILTERS }            from '@/types/live-feed'
import type { LiveFeedEvent, LiveFeedFilters } from '@/types/live-feed'
import { useDataMode } from '@/contexts/DataModeContext'

const MAX_EVENTS   = 300
const INTERVAL_MS  = 1400   // new event every 1.4 s

/* ── Ctrl button ── */
function CtrlBtn({
  onClick, active, activeClass, icon: Icon, label, title,
}: {
  onClick: () => void; active?: boolean; activeClass?: string
  icon: React.ComponentType<{ className?: string }>; label: string; title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
        active
          ? activeClass ?? 'border-hf-primary/50 bg-hf-primary/15 text-hf-primary'
          : 'border-hf-border bg-hf-surface text-hf-muted hover:text-hf-text hover:bg-hf-surface/80'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

function LiveAttackFeedContent({ isDemoMode }: { isDemoMode: boolean }) {
  const [feed,       setFeed]       = useState<LiveFeedEvent[]>(() => isDemoMode ? buildInitialFeed() : [])
  const [paused,     setPaused]     = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [filters,    setFilters]    = useState<LiveFeedFilters>(DEFAULT_LIVE_FILTERS)
  const [selected,   setSelected]   = useState<LiveFeedEvent | null>(null)
  const [newIds,     setNewIds]     = useState<Set<string>>(new Set())

  const seq = useRef(0)

  /* ── Live stream (demo mode only) ── */
  useEffect(() => {
    if (paused || !isDemoMode) return
    const timer = setInterval(() => {
      const ev = makeNextEvent(seq.current++)
      setFeed((prev) => [ev, ...prev].slice(0, MAX_EVENTS))
      setNewIds((prev) => {
        const next = new Set(prev)
        next.add(ev.id)
        return next
      })
      /* Remove flash class after animation completes */
      setTimeout(() => {
        setNewIds((prev) => { const next = new Set(prev); next.delete(ev.id); return next })
      }, 1300)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, isDemoMode])

  /* ── Filtered view ── */
  const filtered = useMemo(() => {
    return feed.filter((ev) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const hay = [ev.sourceIp, ev.attackType, ev.targetDecoyName, ev.title, ev.detectionSource, ev.sourceCountry].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.severities.length     > 0 && !filters.severities.includes(ev.severity))             return false
      if (filters.attackCategories.length > 0 && !filters.attackCategories.includes(ev.attackCategory)) return false
      if (filters.detectionSources.length > 0 && !filters.detectionSources.includes(ev.detectionSource)) return false
      if (filters.countryCode && ev.sourceCountryCode !== filters.countryCode)                         return false
      if (filters.decoyId     && ev.targetDecoyId     !== filters.decoyId)                             return false
      return true
    })
  }, [feed, filters])

  const handleClear = useCallback(() => {
    setFeed([])
    setSelected(null)
    setNewIds(new Set())
  }, [])

  const handleSelect = useCallback((ev: LiveFeedEvent) => {
    setSelected((prev) => prev?.id === ev.id ? null : ev)
  }, [])

  /* ── Stats ── */
  const totalByStatus = useMemo(() => ({
    critical: feed.filter((e) => e.severity === 'critical').length,
    high:     feed.filter((e) => e.severity === 'high').length,
    events:   feed.length,
  }), [feed])

  return (
    <div className="flex flex-col gap-4 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hf-danger/15 border border-hf-danger/30 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-hf-danger" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-hf-text">Live Attack Feed</h1>
              {!paused && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-hf-danger">
                  <span className="relative w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-hf-danger live-ring" />
                    <span className="absolute inset-0 rounded-full bg-hf-danger" />
                  </span>
                  LIVE
                </span>
              )}
              {paused && (
                <span className="text-xs font-bold text-hf-dim border border-hf-border px-2 py-0.5 rounded-full">PAUSED</span>
              )}
            </div>
            <p className="text-xs text-hf-muted mt-0.5">
              {totalByStatus.events.toLocaleString()} events ·{' '}
              <span className="text-severity-critical font-semibold">{totalByStatus.critical} critical</span> ·{' '}
              <span className="text-severity-high font-semibold">{totalByStatus.high} high</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <CtrlBtn
            onClick={() => setPaused((v) => !v)}
            active={paused}
            activeClass="border-hf-warning/50 bg-hf-warning/15 text-hf-warning"
            icon={paused ? Play : Pause}
            label={paused ? 'Resume' : 'Pause'}
          />
          <CtrlBtn
            onClick={() => setAutoScroll((v) => !v)}
            active={autoScroll}
            icon={autoScroll ? ChevronsDown : ChevronsUp}
            label="Auto-scroll"
            title="Keep newest events visible"
          />
          <CtrlBtn
            onClick={handleClear}
            active={false}
            icon={Trash2}
            label="Clear"
            title="Clear all events"
          />
        </div>
      </div>

      {/* ── Ticker ── */}
      <FeedTicker events={feed} paused={paused} />

      {/* ── Filters ── */}
      <FeedFilters
        filters={filters}
        onChange={setFilters}
        events={feed}
        filteredCount={filtered.length}
      />

      {/* ── Main body: feed + sidebar ── */}
      <div className="flex gap-4 items-start">

        {/* Left: feed table */}
        <div className="flex-1 min-w-0 glass-card border border-hf-border/50 rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Table header bar */}
          <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-hf-border/40 bg-hf-surface/60">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-hf-muted" />
              <span className="text-xs font-semibold text-hf-muted">
                {filtered.length !== feed.length
                  ? `${filtered.length} / ${feed.length} events`
                  : `${feed.length} events`}
              </span>
              {!paused && (
                <span className="flex items-center gap-1 text-[10px] text-hf-dim">
                  <Zap className="w-2.5 h-2.5" />
                  ~{(1000 / INTERVAL_MS).toFixed(1)}/s
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-hf-dim">
              <span>Click row to inspect</span>
            </div>
          </div>

          <FeedTable
            events={filtered}
            autoScroll={autoScroll}
            onSelect={handleSelect}
            selectedId={selected?.id ?? null}
            newIds={newIds}
          />
        </div>

        {/* Right: sidebar stats */}
        <div className="w-72 shrink-0">
          <TopStats events={feed} />
        </div>
      </div>

      {/* ── Attack Timeline ── */}
      <AttackTimeline events={feed} />

      {/* ── Event detail drawer + backdrop ── */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <EventDetailDrawer event={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  )
}

export default function LiveAttackFeedPage() {
  const { isDemoMode } = useDataMode()
  return <LiveAttackFeedContent key={String(isDemoMode)} isDemoMode={isDemoMode} />
}
