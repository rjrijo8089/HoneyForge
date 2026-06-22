'use client'
import {
  Activity, Shield, AlertTriangle, ClipboardList,
  Bug, Terminal, Globe2, Database,
} from 'lucide-react'
import { useDataMode } from '@/contexts/DataModeContext'

import { LiveTicker }        from '@/components/dashboard/LiveTicker'
import { StatCard }          from '@/components/dashboard/StatCard'
import { AttackTrend }       from '@/components/dashboard/AttackTrend'
import { SeverityDonut }     from '@/components/dashboard/SeverityDonut'
import { AttackTypeBar }     from '@/components/dashboard/AttackTypeBar'
import { TopDecoys }         from '@/components/dashboard/TopDecoys'
import { TopCountries }      from '@/components/dashboard/TopCountries'
import { MitreAttack }       from '@/components/dashboard/MitreAttack'
import { RecentAttacks }     from '@/components/dashboard/RecentAttacks'
import { ReviewQueue }       from '@/components/dashboard/ReviewQueue'
import { IOCFeed }           from '@/components/dashboard/IOCFeed'
import { PlatformHealth }    from '@/components/dashboard/PlatformHealth'
import { IntegrationStatus } from '@/components/dashboard/IntegrationStatus'
import { NotificationFeed }  from '@/components/dashboard/NotificationFeed'

import {
  DASHBOARD_STATS,
  HOURLY_TREND,
  SEVERITY_DIST,
  ATTACK_TYPES,
  TOP_DECOYS,
  TOP_COUNTRIES,
  MITRE_TECHNIQUES,
  IOC_DATA,
  PLATFORM_SERVICES,
  INTEGRATION_HEALTH,
  TICKER_EVENTS,
} from '@/services/mock/data/dashboard'

import { MOCK_THREATS } from '@/services/mock'

const EMPTY_STATS = {
  totalAttacksToday: 0,
  activeDecoys:      0,
  totalDecoys:       0,
  criticalAlerts:    0,
  pendingReviews:    0,
  malwareCaptured:   0,
  sshBruteForce:     0,
  webAttacks:        0,
  threatIntelIOCs:   0,
  attacksDelta:      '—',
  criticalDelta:     '—',
  malwareDelta:      '—',
}

const CLEAN_HOURLY_TREND = HOURLY_TREND.map((h) => ({
  ...h, critical: 0, high: 0, medium: 0, low: 0,
}))

const CLEAN_SEVERITY_DIST = SEVERITY_DIST.map((s) => ({ ...s, value: 0 }))

export default function DashboardPage() {
  const { isDemoMode } = useDataMode()

  const stats          = isDemoMode ? DASHBOARD_STATS   : EMPTY_STATS
  const trend          = isDemoMode ? HOURLY_TREND       : CLEAN_HOURLY_TREND
  const severityDist   = isDemoMode ? SEVERITY_DIST      : CLEAN_SEVERITY_DIST
  const attackTypes    = isDemoMode ? ATTACK_TYPES       : []
  const topDecoys      = isDemoMode ? TOP_DECOYS         : []
  const topCountries   = isDemoMode ? TOP_COUNTRIES      : []
  const mitreTechs     = isDemoMode ? MITRE_TECHNIQUES   : []
  const iocData        = isDemoMode ? IOC_DATA           : []
  const tickerEvents   = isDemoMode ? TICKER_EVENTS      : []
  const recentAttacks  = isDemoMode ? MOCK_THREATS.slice(0, 10) : []
  const pendingReviews = isDemoMode
    ? MOCK_THREATS.filter((t) => t.status === 'new' || t.status === 'investigating')
    : []

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Live attack ticker ─────────────────────────────── */}
      <LiveTicker events={tickerEvents} />

      {/* ── Primary KPI row ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Attacks Today"
          value={stats.totalAttacksToday}
          change={stats.attacksDelta}
          changeType="up"
          icon={<Activity className="w-4 h-4" />}
          accent="red"
          live={isDemoMode}
          delay={0}
        />
        <StatCard
          label="Active Decoys"
          value={stats.activeDecoys === 0 ? '0 / 0' : `${stats.activeDecoys} / ${stats.totalDecoys}`}
          change={isDemoMode ? '+2 this week' : undefined}
          changeType="up"
          icon={<Shield className="w-4 h-4" />}
          accent="blue"
          delay={60}
        />
        <StatCard
          label="Critical Alerts"
          value={stats.criticalAlerts}
          change={stats.criticalDelta}
          changeType="up"
          icon={<AlertTriangle className="w-4 h-4" />}
          accent="orange"
          live={isDemoMode}
          delay={120}
        />
        <StatCard
          label="Pending Reviews"
          value={stats.pendingReviews}
          sublabel="awaiting analyst"
          icon={<ClipboardList className="w-4 h-4" />}
          accent="yellow"
          delay={180}
        />
      </div>

      {/* ── Secondary KPI row ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Malware Captured"
          value={stats.malwareCaptured}
          change={stats.malwareDelta}
          changeType="up"
          icon={<Bug className="w-4 h-4" />}
          accent="purple"
          delay={240}
        />
        <StatCard
          label="SSH Brute Force"
          value={stats.sshBruteForce}
          sublabel="attempts this session"
          icon={<Terminal className="w-4 h-4" />}
          accent="red"
          delay={300}
        />
        <StatCard
          label="Web Attacks"
          value={stats.webAttacks}
          sublabel="HTTP/HTTPS vectors"
          icon={<Globe2 className="w-4 h-4" />}
          accent="cyan"
          delay={360}
        />
        <StatCard
          label="Threat Intel IOCs"
          value={stats.threatIntelIOCs}
          sublabel="indicators collected"
          icon={<Database className="w-4 h-4" />}
          accent="green"
          delay={420}
        />
      </div>

      {/* ── Main charts row ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <AttackTrend data={trend} />
        </div>
        <SeverityDonut data={severityDist} />
      </div>

      {/* ── Distribution charts ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AttackTypeBar  data={attackTypes}   />
        <TopDecoys      data={topDecoys}     />
        <TopCountries   data={topCountries}  />
      </div>

      {/* ── MITRE ATT&CK ───────────────────────────────────── */}
      <MitreAttack data={mitreTechs} />

      {/* ── Content + queues ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentAttacks events={recentAttacks} />
        </div>
        <div className="flex flex-col gap-4">
          <ReviewQueue events={pendingReviews.length > 0 ? pendingReviews : recentAttacks.slice(0, 6)} />
          <IOCFeed     iocs={iocData} />
        </div>
      </div>

      {/* ── Ops widgets row ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
        <IntegrationStatus integrations={INTEGRATION_HEALTH} />
        <PlatformHealth    services={PLATFORM_SERVICES}      />
        <NotificationFeed />
      </div>

    </div>
  )
}
