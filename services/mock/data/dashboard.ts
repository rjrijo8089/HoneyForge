/* ── Dashboard-specific mock data ── */

export interface HourlyTrend {
  time: string
  critical: number
  high: number
  medium: number
  low: number
  [key: string]: string | number
}

export interface AttackTypeItem {
  name: string
  count: number
  color: string
  barClass: string
}

export interface CountryData {
  name: string
  code: string
  count: number
  percent: number
}

export interface MitreTechniqueItem {
  id: string
  name: string
  tactic: string
  tacticClass: string
  count: number
  maxCount: number
  color: string
}

export interface IOCItem {
  id: string
  type: 'ip' | 'domain' | 'hash' | 'url'
  value: string
  tags: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  source: string
}

export interface PlatformService {
  name: string
  description: string
  status: 'healthy' | 'warning' | 'offline'
  uptime: number
  eventsPerMin: number
  cpu: number
  memory: number
}

export interface IntegrationHealth {
  id: string
  name: string
  vendor: string
  type: string
  status: 'connected' | 'error' | 'pending' | 'disconnected'
  eventsHour: number
  latencyMs: number | null
  lastSync: string | null
}

export interface TickerEvent {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  sourceIp: string
  countryCode: string
  targetDecoy: string
  attackType: string
}

// ── 24-hour Hourly Attack Trend ─────────────────────────────────
export const HOURLY_TREND: HourlyTrend[] = [
  { time: '00:00', critical: 1,  high: 3,  medium: 8,  low: 14 },
  { time: '01:00', critical: 0,  high: 2,  medium: 5,  low: 9  },
  { time: '02:00', critical: 1,  high: 3,  medium: 7,  low: 8  },
  { time: '03:00', critical: 0,  high: 1,  medium: 4,  low: 6  },
  { time: '04:00', critical: 0,  high: 2,  medium: 5,  low: 7  },
  { time: '05:00', critical: 1,  high: 4,  medium: 9,  low: 12 },
  { time: '06:00', critical: 2,  high: 7,  medium: 16, low: 19 },
  { time: '07:00', critical: 3,  high: 10, medium: 22, low: 25 },
  { time: '08:00', critical: 5,  high: 14, medium: 28, low: 30 },
  { time: '09:00', critical: 6,  high: 17, medium: 34, low: 33 },
  { time: '10:00', critical: 7,  high: 19, medium: 38, low: 31 },
  { time: '11:00', critical: 5,  high: 15, medium: 30, low: 26 },
  { time: '12:00', critical: 8,  high: 21, medium: 42, low: 28 },
  { time: '13:00', critical: 6,  high: 18, medium: 36, low: 29 },
  { time: '14:00', critical: 9,  high: 23, medium: 44, low: 32 },
  { time: '15:00', critical: 7,  high: 20, medium: 39, low: 30 },
  { time: '16:00', critical: 10, high: 25, medium: 46, low: 34 },
  { time: '17:00', critical: 8,  high: 22, medium: 40, low: 31 },
  { time: '18:00', critical: 6,  high: 16, medium: 31, low: 27 },
  { time: '19:00', critical: 4,  high: 12, medium: 24, low: 21 },
  { time: '20:00', critical: 3,  high: 9,  medium: 18, low: 17 },
  { time: '21:00', critical: 3,  high: 7,  medium: 15, low: 14 },
  { time: '22:00', critical: 2,  high: 6,  medium: 12, low: 12 },
  { time: '23:00', critical: 9,  high: 21, medium: 17, low: 11 },
]

// ── Attack Type Distribution ─────────────────────────────────────
export const ATTACK_TYPES: AttackTypeItem[] = [
  { name: 'SSH Brute Force',    count: 847, color: '#ef4444', barClass: 'bar-critical' },
  { name: 'Web Attacks',        count: 612, color: '#ea580c', barClass: 'bar-high'     },
  { name: 'SQL Injection',      count: 412, color: '#d97706', barClass: 'bar-medium'   },
  { name: 'Port Scanning',      count: 334, color: '#16a34a', barClass: 'bar-low'      },
  { name: 'Dir Traversal',      count: 201, color: '#3b82f6', barClass: 'bar-primary'  },
  { name: 'Malware Upload',     count: 147, color: '#8b5cf6', barClass: 'bar-accent'   },
  { name: 'RCE Attempt',        count:  89, color: '#ec4899', barClass: 'bar-high'     },
  { name: 'SSRF',               count:  44, color: '#06b6d4', barClass: 'bar-accent'   },
]

// ── Severity Distribution (today) ────────────────────────────────
export const SEVERITY_DIST = [
  { name: 'Critical', value:  47, color: '#dc2626' },
  { name: 'High',     value: 213, color: '#ea580c' },
  { name: 'Medium',   value: 518, color: '#d97706' },
  { name: 'Low',      value: 891, color: '#16a34a' },
]

// ── Top Attacked Decoys ──────────────────────────────────────────
export const TOP_DECOYS = [
  { name: 'HTTP-WEB-LURE',       count: 1204, type: 'http',  color: '#3b82f6' },
  { name: 'SSH-Honeypot-01',     count:  847, type: 'ssh',   color: '#ef4444' },
  { name: 'FTP-Legacy-Server',   count:  512, type: 'ftp',   color: '#d97706' },
  { name: 'SMB-FileShare-Lure',  count:   89, type: 'smb',   color: '#8b5cf6' },
  { name: 'HTTPS-Admin-Fake',    count:   78, type: 'https', color: '#06b6d4' },
  { name: 'MySQL-DB-Canary',     count:   23, type: 'mysql', color: '#16a34a' },
]

// ── Top Attacker Countries ────────────────────────────────────────
export const TOP_COUNTRIES: CountryData[] = [
  { name: 'China',          code: 'CN', count: 892, percent: 38 },
  { name: 'Russia',         code: 'RU', count: 654, percent: 28 },
  { name: 'United States',  code: 'US', count: 281, percent: 12 },
  { name: 'Netherlands',    code: 'NL', count: 187, percent:  8 },
  { name: 'Ukraine',        code: 'UA', count: 164, percent:  7 },
  { name: 'Germany',        code: 'DE', count: 140, percent:  6 },
  { name: 'Brazil',         code: 'BR', count: 117, percent:  5 },
]

// ── MITRE ATT&CK Techniques ───────────────────────────────────────
export const MITRE_TECHNIQUES: MitreTechniqueItem[] = [
  { id: 'T1110', name: 'Brute Force',              tactic: 'Credential Access', tacticClass: 'tactic-cred',    count: 847, maxCount: 847, color: '#f472b6' },
  { id: 'T1190', name: 'Exploit Public-Facing App',tactic: 'Initial Access',    tacticClass: 'tactic-initial', count: 412, maxCount: 847, color: '#f87171' },
  { id: 'T1595', name: 'Active Scanning',          tactic: 'Reconnaissance',    tacticClass: 'tactic-recon',   count: 334, maxCount: 847, color: '#a78bfa' },
  { id: 'T1083', name: 'File & Dir Discovery',     tactic: 'Discovery',         tacticClass: 'tactic-discovery',count:201, maxCount: 847, color: '#facc15' },
  { id: 'T1059', name: 'Scripting Interpreter',    tactic: 'Execution',         tacticClass: 'tactic-exec',    count: 147, maxCount: 847, color: '#fb923c' },
  { id: 'T1021', name: 'Remote Services',          tactic: 'Lateral Movement',  tacticClass: 'tactic-lateral', count:  89, maxCount: 847, color: '#38bdf8' },
  { id: 'T1078', name: 'Valid Accounts',           tactic: 'Defense Evasion',   tacticClass: 'tactic-evasion', count:  67, maxCount: 847, color: '#60a5fa' },
  { id: 'T1133', name: 'External Remote Services', tactic: 'Persistence',       tacticClass: 'tactic-persist', count:  44, maxCount: 847, color: '#34d399' },
]

// ── IOC Feed ─────────────────────────────────────────────────────
export const IOC_DATA: IOCItem[] = [
  { id: 'ioc_001', type: 'ip',     value: '103.45.78.12',       tags: ['cn', 'confirmed-malicious'],  severity: 'critical', timestamp: '2m ago',  source: 'Cowrie' },
  { id: 'ioc_002', type: 'ip',     value: '185.220.101.45',     tags: ['tor-exit', 'ru'],             severity: 'high',     timestamp: '5m ago',  source: 'HTTP Lure' },
  { id: 'ioc_003', type: 'domain', value: 'c2-stage.evil.io',   tags: ['c2', 'malware-dropper'],      severity: 'critical', timestamp: '11m ago', source: 'Dionaea' },
  { id: 'ioc_004', type: 'hash',   value: 'a4b2c8d1e6f3...',    tags: ['ransomware', 'lockbit'],      severity: 'critical', timestamp: '18m ago', source: 'Dionaea' },
  { id: 'ioc_005', type: 'ip',     value: '31.184.198.71',      tags: ['ua', 'rdp-scan'],             severity: 'medium',   timestamp: '24m ago', source: 'RDP Decoy' },
  { id: 'ioc_006', type: 'url',    value: '/wp-admin/shell.php',tags: ['webshell', 'php'],            severity: 'high',     timestamp: '31m ago', source: 'SNARE' },
  { id: 'ioc_007', type: 'ip',     value: '77.123.45.67',       tags: ['de', 'mysql-exploit'],        severity: 'high',     timestamp: '38m ago', source: 'MySQL Canary' },
  { id: 'ioc_008', type: 'domain', value: 'malware-cdn.ru.net', tags: ['payload-host', 'ru'],         severity: 'high',     timestamp: '45m ago', source: 'Dionaea' },
]

// ── Platform Health ───────────────────────────────────────────────
export const PLATFORM_SERVICES: PlatformService[] = [
  { name: 'Cowrie',     description: 'SSH/Telnet honeypot',      status: 'healthy',  uptime: 99.9, eventsPerMin: 147,  cpu: 12, memory: 34 },
  { name: 'Dionaea',    description: 'Multi-protocol honeypot',  status: 'healthy',  uptime: 99.7, eventsPerMin:  89,  cpu:  8, memory: 22 },
  { name: 'SNARE',      description: 'Web application honeypot', status: 'healthy',  uptime: 99.8, eventsPerMin: 201,  cpu: 15, memory: 41 },
  { name: 'TANNER',     description: 'SNARE response handler',   status: 'warning',  uptime: 98.2, eventsPerMin: 134,  cpu: 67, memory: 78 },
  { name: 'Suricata',   description: 'IDS/IPS engine',           status: 'healthy',  uptime: 99.5, eventsPerMin: 892,  cpu: 23, memory: 55 },
  { name: 'OpenSearch', description: 'Log storage & analytics',  status: 'warning',  uptime: 97.1, eventsPerMin: 1204, cpu: 45, memory: 84 },
  { name: 'Vector',     description: 'Log aggregation pipeline', status: 'healthy',  uptime: 99.9, eventsPerMin: 1847, cpu: 18, memory: 38 },
]

// ── Integration Health ────────────────────────────────────────────
export const INTEGRATION_HEALTH: IntegrationHealth[] = [
  { id: 'ih_001', name: 'Splunk',      vendor: 'Splunk',       type: 'SIEM',        status: 'connected',   eventsHour: 2847, latencyMs: 45,  lastSync: '30s ago' },
  { id: 'ih_002', name: 'MISP',        vendor: 'MISP',         type: 'Threat Intel',status: 'connected',   eventsHour:  134, latencyMs: 120, lastSync: '2m ago'  },
  { id: 'ih_003', name: 'PagerDuty',   vendor: 'PagerDuty',    type: 'Alerting',    status: 'connected',   eventsHour:   12, latencyMs: 234, lastSync: '5m ago'  },
  { id: 'ih_004', name: 'Jira',        vendor: 'Atlassian',    type: 'Ticketing',   status: 'error',       eventsHour:    0, latencyMs: null, lastSync: '3h ago' },
  { id: 'ih_005', name: 'Cortex XSOAR',vendor: 'Palo Alto',    type: 'SOAR',        status: 'pending',     eventsHour:    0, latencyMs: null, lastSync: null      },
]

// ── Live Ticker Events ────────────────────────────────────────────
export const TICKER_EVENTS: TickerEvent[] = [
  { id: 'te_01', severity: 'critical', sourceIp: '103.45.78.12',   countryCode: 'CN', targetDecoy: 'SSH-Honeypot-01',     attackType: 'SSH Brute Force'    },
  { id: 'te_02', severity: 'critical', sourceIp: '185.220.101.45', countryCode: 'RU', targetDecoy: 'HTTP-WEB-LURE',       attackType: 'SQL Injection'      },
  { id: 'te_03', severity: 'high',     sourceIp: '192.168.1.55',   countryCode: 'US', targetDecoy: 'SMB-FileShare-Lure',  attackType: 'Lateral Movement'   },
  { id: 'te_04', severity: 'high',     sourceIp: '31.184.198.71',  countryCode: 'UA', targetDecoy: 'RDP-Workstation-Fake',attackType: 'NLA Bypass'         },
  { id: 'te_05', severity: 'critical', sourceIp: '77.123.45.67',   countryCode: 'DE', targetDecoy: 'MySQL-DB-Canary',     attackType: 'Auth Bypass'        },
  { id: 'te_06', severity: 'medium',   sourceIp: '45.33.32.156',   countryCode: 'US', targetDecoy: 'HTTP-WEB-LURE',       attackType: 'Dir Traversal'      },
  { id: 'te_07', severity: 'high',     sourceIp: '198.199.65.44',  countryCode: 'US', targetDecoy: 'SSH-Honeypot-01',     attackType: 'Key Exhaustion'     },
  { id: 'te_08', severity: 'medium',   sourceIp: '141.98.11.22',   countryCode: 'NL', targetDecoy: 'FTP-Legacy-Server',   attackType: 'Banner Grab'        },
  { id: 'te_09', severity: 'critical', sourceIp: '91.108.4.178',   countryCode: 'RU', targetDecoy: 'HTTPS-Admin-Fake',    attackType: 'Credential Stuffing'},
  { id: 'te_10', severity: 'high',     sourceIp: '212.73.134.42',  countryCode: 'BR', targetDecoy: 'HTTP-WEB-LURE',       attackType: 'XSS Injection'      },
  { id: 'te_11', severity: 'medium',   sourceIp: '5.188.210.7',    countryCode: 'DE', targetDecoy: 'SSH-Honeypot-01',     attackType: 'Port Scan'          },
  { id: 'te_12', severity: 'low',      sourceIp: '66.240.205.34',  countryCode: 'US', targetDecoy: 'FTP-Legacy-Server',   attackType: 'Reconnaissance'     },
]

// ── Dashboard KPI Stats ───────────────────────────────────────────
export const DASHBOARD_STATS = {
  totalAttacksToday:    2341,
  activeDecoys:            5,
  totalDecoys:             8,
  criticalAlerts:          9,
  pendingReviews:         12,
  malwareCaptured:        47,
  sshBruteForce:         847,
  webAttacks:           1203,
  threatIntelIOCs:       156,
  attacksDelta:        '+18%',
  criticalDelta:       '+3',
  malwareDelta:        '+12',
}
