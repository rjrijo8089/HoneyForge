'use client'
import { useState, useMemo, useCallback } from 'react'
import { Crosshair, ShieldAlert, GitBranch, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useDataMode } from '@/contexts/DataModeContext'

import { ThreatIntelStats }   from '@/components/threat-intel/ThreatIntelStats'
import { IOCFilterPanel, DEFAULT_FILTERS } from '@/components/threat-intel/IOCFilters'
import { IOCTable }           from '@/components/threat-intel/IOCTable'
import { IOCDetailDrawer }    from '@/components/threat-intel/IOCDetailDrawer'
import { CampaignList }       from '@/components/threat-intel/CampaignList'
import { MitrePanel }         from '@/components/threat-intel/MitrePanel'
import { MOCK_IOCS }          from '@/services/mock/data/threatIntel'

import type { IOC, IOCFilters, IOCStatus } from '@/types/threat-intel'

/* ── Export all IOCs (filtered) ── */
function exportAll(iocs: IOC[], format: 'json' | 'csv') {
  let content: string; let filename: string; let type: string
  if (format === 'json') {
    content = JSON.stringify(iocs, null, 2); filename = 'honeyforge_iocs.json'; type = 'application/json'
  } else {
    const cols = ['id','type','value','status','severity','confidence','firstSeen','lastSeen','hitCount','source','tlp','country','asn','malwareFamily']
    const rows = iocs.map((i) => cols.map((c) => {
      const v = (i as unknown as Record<string, unknown>)[c]
      return typeof v === 'string' ? `"${v.replace(/"/g,'""')}"` : String(v ?? '')
    }).join(','))
    content = cols.join(',') + '\n' + rows.join('\n')
    filename = 'honeyforge_iocs.csv'; type = 'text/csv'
  }
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click(); URL.revokeObjectURL(url)
}

type Tab = 'explorer' | 'campaigns' | 'mitre'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{className?: string}> }[] = [
  { id: 'explorer',  label: 'IOC Explorer',   icon: ShieldAlert  },
  { id: 'campaigns', label: 'Campaigns',       icon: GitBranch   },
  { id: 'mitre',     label: 'MITRE ATT&CK',   icon: Crosshair   },
]

function ThreatIntelContent({ isDemoMode }: { isDemoMode: boolean }) {
  const [tab,     setTab]     = useState<Tab>('explorer')
  const [filters, setFilters] = useState<IOCFilters>(DEFAULT_FILTERS)
  const [iocs,    setIocs]    = useState<IOC[]>(isDemoMode ? MOCK_IOCS : [])
  const [selectedIOC, setSelectedIOC] = useState<IOC | null>(null)

  /* ── Filter logic ── */
  const filtered = useMemo(() => {
    return iocs.filter((ioc) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const haystack = [ioc.value, ioc.type, ioc.description ?? '', ...ioc.tags, ioc.malwareFamily ?? '', ioc.source, ioc.reportedBy].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (filters.types.length > 0 && !filters.types.includes(ioc.type)) return false
      if (filters.statuses.length > 0 && !filters.statuses.includes(ioc.status)) return false
      if (filters.severities.length > 0 && !filters.severities.includes(ioc.severity)) return false
      if (filters.tlp.length > 0 && !filters.tlp.includes(ioc.tlp)) return false
      if (filters.campaigns.length > 0 && !ioc.campaigns.some((c) => filters.campaigns.includes(c))) return false
      if (ioc.confidence < filters.confidenceMin || ioc.confidence > filters.confidenceMax) return false
      return true
    })
  }, [iocs, filters])

  /* ── Status change ── */
  const handleStatusChange = useCallback((id: string, status: IOCStatus) => {
    setIocs((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
    setSelectedIOC((prev) => prev?.id === id ? { ...prev, status } : prev)
  }, [])

  /* ── Navigate from relationship graph ── */
  const handleNavigate = useCallback((ioc: IOC) => {
    setSelectedIOC(ioc)
  }, [])

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hf-danger/15 border border-hf-danger/30 flex items-center justify-center shrink-0">
            <Crosshair className="w-5 h-5 text-hf-danger" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-hf-text">Threat Intelligence</h1>
            <p className="text-xs text-hf-muted">IOC repository, campaign tracking, and MITRE ATT&CK mapping</p>
          </div>
        </div>

        {tab === 'explorer' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportAll(filtered, 'json')}
            >
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportAll(filtered, 'csv')}
            >
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <ThreatIntelStats />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-hf-border/40 pb-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px',
              tab === id
                ? 'text-hf-primary border-hf-primary'
                : 'text-hf-dim hover:text-hf-muted border-transparent'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'explorer' && filtered.length !== iocs.length && (
              <span className="text-[9px] bg-hf-primary text-white rounded-full px-1.5 py-0.5 font-black">{filtered.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── IOC Explorer ── */}
      {tab === 'explorer' && (
        <div className="space-y-4">
          <IOCFilterPanel
            filters={filters}
            onChange={setFilters}
            totalCount={iocs.length}
            filteredCount={filtered.length}
          />
          <div className="glass-card border border-hf-border/50 rounded-2xl overflow-hidden">
            <IOCTable
              iocs={filtered}
              onSelect={setSelectedIOC}
              onStatusChange={handleStatusChange}
              selectedId={selectedIOC?.id}
            />
          </div>
        </div>
      )}

      {/* ── Campaigns ── */}
      {tab === 'campaigns' && <CampaignList />}

      {/* ── MITRE ATT&CK ── */}
      {tab === 'mitre' && <MitrePanel />}

      {/* ── IOC Detail Drawer (overlay) ── */}
      {selectedIOC && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedIOC(null)}
          />
          <IOCDetailDrawer
            ioc={selectedIOC}
            allIOCs={iocs}
            onClose={() => setSelectedIOC(null)}
            onStatusChange={handleStatusChange}
            onNavigate={handleNavigate}
          />
        </>
      )}
    </div>
  )
}

export default function ThreatIntelPage() {
  const { isDemoMode } = useDataMode()
  return <ThreatIntelContent key={String(isDemoMode)} isDemoMode={isDemoMode} />
}
