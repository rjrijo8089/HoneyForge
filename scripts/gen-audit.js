// node scripts/gen-audit.js
const fs = require('fs')
const path = require('path')

const ACTORS = [
  { userId: 'usr_admin_001',   userEmail: 'admin@honeyforge.io',    userRole: 'admin',   ip: '10.0.0.5',  ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' },
  { userId: 'usr_analyst_002', userEmail: 'jsmith@honeyforge.io',   userRole: 'analyst', ip: '10.0.0.8',  ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/125.0' },
  { userId: 'usr_analyst_003', userEmail: 'mlee@honeyforge.io',     userRole: 'analyst', ip: '10.0.0.12', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/124.0.0.0 Safari/537.36' },
  { userId: 'usr_analyst_001', userEmail: 'analyst@honeyforge.io',  userRole: 'analyst', ip: '10.0.0.15', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/124.0.0.0' },
  { userId: 'usr_viewer_001',  userEmail: 'viewer@honeyforge.io',   userRole: 'viewer',  ip: '10.0.0.20', ua: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124.0.0.0 Safari/537.36' },
]
const ADMIN    = ACTORS[0]
const JSMITH   = ACTORS[1]
const MLEE     = ACTORS[2]
const ANALYST  = ACTORS[3]
const VIEWER   = ACTORS[4]
const EXT_IP1  = '203.0.113.45'
const EXT_IP2  = '185.220.101.38'
const EXT_UA   = 'Python-urllib/3.11'

// Events defined as [ts, actor, overrides]
// ts relative to 2026-06-18T00:00:00Z (negative = days in the past)
// overrides = partial AuditLog (action, resourceType, etc.)
const EVENTS = [
  // ── TODAY (June 18) ──────────────────────────────────────────────────────
  { ts: '2026-06-18T08:30:12Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_a001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-18T08:31:40Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_a002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-18T08:33:05Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_a003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-18T08:34:22Z', actor: ANALYST, action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_a004', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-18T08:35:01Z', actor: VIEWER,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_a005', details: { mfa: false, method: 'password' } },
  { ts: '2026-06-18T08:41:00Z', actor: { ...ADMIN, ip: EXT_IP1, ua: EXT_UA },    action: 'login', resourceType: 'session', outcome: 'failed', riskLevel: 'critical', details: { reason: 'Invalid MFA token', attempts: 3 } },
  { ts: '2026-06-18T08:41:44Z', actor: { ...ADMIN, ip: EXT_IP1, ua: EXT_UA },    action: 'login', resourceType: 'session', outcome: 'failed', riskLevel: 'critical', details: { reason: 'Invalid MFA token', attempts: 4 } },
  { ts: '2026-06-18T08:42:07Z', actor: { ...ADMIN, ip: EXT_IP2, ua: EXT_UA },    action: 'login', resourceType: 'session', outcome: 'failed', riskLevel: 'critical', details: { reason: 'Account locked after 5 attempts' } },

  { ts: '2026-06-18T09:02:14Z', actor: MLEE,    action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8821', resourceName: 'Mass SSH Scanning — 103.27.202.187', details: { confidence: 'high', mitre: 'T1046', iocs: ['103.27.202.187'] } },
  { ts: '2026-06-18T09:08:33Z', actor: JSMITH,  action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8822', resourceName: 'Cobalt Strike Beacon — 91.219.237.41', details: { confidence: 'critical', mitre: 'T1071.001', iocs: ['91.219.237.41', '185.220.101.22'] } },
  { ts: '2026-06-18T09:15:47Z', actor: ANALYST, action: 'event_marked_benign',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8819', resourceName: 'Internal Port Scan — 10.0.0.88',        details: { reason: 'Authorized vulnerability scanner', scanner: 'Nessus' } },
  { ts: '2026-06-18T09:22:55Z', actor: MLEE,    action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 12, format: 'STIX 2.1', destination: 'MISP', tlp: 'AMBER' } },
  { ts: '2026-06-18T09:31:18Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_opensearch', resourceName: 'OpenSearch SIEM', details: { changes: ['index_name: hf-events-v2 → hf-events-v3', 'flush_interval: 5s → 10s'] } },
  { ts: '2026-06-18T09:47:03Z', actor: JSMITH,  action: 'rule_enabled',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_001', resourceName: 'SSH Brute Force Detection', details: { previousStatus: 'disabled', triggeredBy: 'threat campaign' } },
  { ts: '2026-06-18T10:02:44Z', actor: ADMIN,   action: 'decoy_created',         resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_012', resourceName: 'Cowrie-SSH-SG-04', details: { type: 'ssh', port: 22, region: 'ap-southeast-1', template: 'ubuntu-22.04-cowrie' } },
  { ts: '2026-06-18T10:31:22Z', actor: MLEE,    action: 'report_generated',      resourceType: 'report',        outcome: 'success', riskLevel: 'low',      resourceId: 'rep_daily', resourceName: 'Daily Honeypot Summary', details: { format: 'pdf', fileSize: 1248921, recipients: 2 } },
  { ts: '2026-06-18T11:04:09Z', actor: JSMITH,  action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8825', resourceName: 'XMRig Cryptominer Download via SSH',    details: { confidence: 'high', mitre: 'T1496', sha256: 'e3b0c44298fc1c149afbf4c8996fb924' } },
  { ts: '2026-06-18T11:17:34Z', actor: ADMIN,   action: 'settings_changed',      resourceType: 'settings',      outcome: 'success', riskLevel: 'high',     details: { key: 'alert_threshold', from: 'medium', to: 'high', reason: 'Active threat campaign' } },
  { ts: '2026-06-18T11:30:00Z', actor: VIEWER,  action: 'rule_disabled',         resourceType: 'rule',          outcome: 'failed',  riskLevel: 'medium',   resourceId: 'r_005', resourceName: 'HTTP Path Traversal', details: { reason: 'Insufficient permissions — viewer role cannot modify rules' } },
  { ts: '2026-06-18T12:03:55Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'warning', riskLevel: 'medium',   sessionId: 'sess_a006', details: { warning: 'New device fingerprint detected', mfa: true, method: 'totp' } },
  { ts: '2026-06-18T12:45:18Z', actor: ANALYST, action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8830', resourceName: 'MySQL Auth Probe — 37.44.238.92',       details: { confidence: 'medium', mitre: 'T1110', port: 3306 } },
  { ts: '2026-06-18T13:02:00Z', actor: MLEE,    action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 7, format: 'CSV', destination: 'Threat Intel Platform', tlp: 'WHITE' } },
  { ts: '2026-06-18T13:20:42Z', actor: JSMITH,  action: 'clone_studio_changed',  resourceType: 'clone-studio',  outcome: 'success', riskLevel: 'medium',   details: { changes: ['fingerprint: generic-nginx → CVE-2023-44487-patched', 'banner_version: 1.18.0 → 1.25.3'] } },
  { ts: '2026-06-18T14:00:07Z', actor: ADMIN,   action: 'rule_created',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_021', resourceName: 'Log4Shell RCE Attempt (CVE-2021-44228)', details: { type: 'sigma', severity: 'critical', mitre: 'T1190' } },
  { ts: '2026-06-18T14:33:29Z', actor: MLEE,    action: 'event_marked_benign',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8828', resourceName: 'Internal ICMP Sweep — 10.0.0.0/24',    details: { reason: 'Scheduled network health check', approvedBy: 'admin@honeyforge.io' } },

  // ── JUNE 17 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-17T07:01:00Z', actor: ANALYST, action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_b001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-17T07:04:30Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_b002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-17T07:08:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_b003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-17T07:30:14Z', actor: MLEE,    action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8810', resourceName: 'Tor Exit Node Probe — 185.220.101.50',  details: { confidence: 'high', mitre: 'T1090.003', iocs: ['185.220.101.50'] } },
  { ts: '2026-06-17T07:44:52Z', actor: MLEE,    action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8812', resourceName: 'Telnet Default Credential Attempt',     details: { confidence: 'high', credential: 'admin:admin', mitre: 'T1078' } },
  { ts: '2026-06-17T08:02:10Z', actor: ANALYST, action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 23, format: 'STIX 2.1', destination: 'ISAC Feed', tlp: 'GREEN' } },
  { ts: '2026-06-17T09:00:38Z', actor: JSMITH,  action: 'rule_created',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_020', resourceName: 'DNS Tunneling via Base64 Encoding',     details: { type: 'sigma', severity: 'high', mitre: 'T1071.004' } },
  { ts: '2026-06-17T09:29:00Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_slack', resourceName: 'Slack Alerting', details: { changes: ['channel: #soc → #soc-critical', 'mention_on_critical: false → true'] } },
  { ts: '2026-06-17T10:00:00Z', actor: MLEE,    action: 'event_marked_benign',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8808', resourceName: 'DevOps CI Runner — 10.0.0.99',          details: { reason: 'Known build pipeline, confirmed with DevOps team' } },
  { ts: '2026-06-17T11:02:44Z', actor: ANALYST, action: 'report_generated',      resourceType: 'report',        outcome: 'success', riskLevel: 'low',      resourceId: 'rep_ssh', resourceName: 'SSH Brute Force Report', details: { format: 'pdf', fileSize: 892334, period: '7d' } },
  { ts: '2026-06-17T12:00:00Z', actor: ADMIN,   action: 'decoy_paused',          resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_008', resourceName: 'SNARE-HTTP-02', details: { reason: 'Scheduled maintenance window', resumeAt: '2026-06-17T14:00:00Z' } },
  { ts: '2026-06-17T14:11:22Z', actor: JSMITH,  action: 'threat_assigned',       resourceType: 'threat',        outcome: 'success', riskLevel: 'low',      resourceId: 'thr_441', resourceName: 'APT41 Campaign IOC Cluster', details: { assignedTo: 'mlee@honeyforge.io', priority: 'high' } },
  { ts: '2026-06-17T15:05:18Z', actor: MLEE,    action: 'threat_resolved',       resourceType: 'threat',        outcome: 'success', riskLevel: 'low',      resourceId: 'thr_439', resourceName: 'FIN7 Phishing Pivot Attempt', details: { resolution: 'Contained — decoy interactions catalogued, no lateral movement', ttc: '4h 22m' } },
  { ts: '2026-06-17T16:00:55Z', actor: ADMIN,   action: 'role_changed',          resourceType: 'user',          outcome: 'success', riskLevel: 'critical', resourceId: 'usr_viewer_001', resourceName: 'viewer@honeyforge.io', details: { from: 'viewer', to: 'analyst', reason: 'Analyst onboarding complete, probation lifted' } },
  { ts: '2026-06-17T16:30:00Z', actor: ADMIN,   action: 'settings_changed',      resourceType: 'settings',      outcome: 'success', riskLevel: 'high',     details: { key: 'session_timeout_minutes', from: 480, to: 240, reason: 'Security policy update' } },
  { ts: '2026-06-17T17:02:00Z', actor: ADMIN,   action: 'logout',                resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_b010', details: { duration: '9h 32m' } },
  { ts: '2026-06-17T17:30:44Z', actor: JSMITH,  action: 'logout',                resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_b002', details: { duration: '10h 26m' } },

  // ── JUNE 16 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-16T07:00:00Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_c001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-16T07:15:00Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_c002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-16T08:00:00Z', actor: ADMIN,   action: 'user_created',          resourceType: 'user',          outcome: 'success', riskLevel: 'high',     resourceId: 'usr_analyst_004', resourceName: 'priya.v@honeyforge.io', details: { role: 'analyst', mfa_required: true, onboarded_by: 'admin@honeyforge.io' } },
  { ts: '2026-06-16T08:15:10Z', actor: JSMITH,  action: 'rule_enabled',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_008', resourceName: 'Ransomware File Extension Spike', details: { previousStatus: 'draft', approvedBy: 'admin@honeyforge.io' } },
  { ts: '2026-06-16T09:00:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_c003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-16T09:30:22Z', actor: JSMITH,  action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8790', resourceName: 'CVE-2023-44487 HTTP/2 Flood',           details: { confidence: 'critical', mitre: 'T1499.004', cve: 'CVE-2023-44487' } },
  { ts: '2026-06-16T10:00:00Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'warning', riskLevel: 'high',     resourceId: 'int_splunk', resourceName: 'Splunk SIEM', details: { warning: 'TLS certificate expiring in 8 days', changes: ['index: main → hf_honeypot'] } },
  { ts: '2026-06-16T10:30:00Z', actor: MLEE,    action: 'clone_studio_changed',  resourceType: 'clone-studio',  outcome: 'success', riskLevel: 'medium',   details: { changes: ['lure_page: login-portal-v1 → login-portal-v2', 'enabled_services: [ssh, http] → [ssh, http, ftp]'] } },
  { ts: '2026-06-16T11:00:00Z', actor: ANALYST, action: 'event_marked_benign',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8785', resourceName: 'Heartbeat Check — monitoring.internal',details: { reason: 'Prometheus scraper, confirmed with SRE team' } },
  { ts: '2026-06-16T11:45:55Z', actor: JSMITH,  action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 18, format: 'OpenIOC', destination: 'TheHive', tlp: 'AMBER' } },
  { ts: '2026-06-16T12:00:00Z', actor: ADMIN,   action: 'decoy_created',         resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_011', resourceName: 'Dionaea-FTP-EU-03', details: { type: 'ftp', port: 21, region: 'eu-west-2', template: 'vsftpd-2.3.4' } },
  { ts: '2026-06-16T14:00:00Z', actor: MLEE,    action: 'report_generated',      resourceType: 'report',        outcome: 'success', riskLevel: 'low',      resourceId: 'rep_web', resourceName: 'Web Attack Trends Report', details: { format: 'pdf', fileSize: 1104882 } },
  { ts: '2026-06-16T14:55:00Z', actor: JSMITH,  action: 'rule_disabled',         resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_003', resourceName: 'Generic HTTP Scanner Detection', details: { reason: 'Too many false positives from internal scanner, being retune', nextReview: '2026-06-23' } },
  { ts: '2026-06-16T17:00:00Z', actor: ADMIN,   action: 'logout',                resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_c001', details: { duration: '10h 00m' } },

  // ── JUNE 15 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-15T07:00:00Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_d001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-15T08:00:00Z', actor: ADMIN,   action: 'settings_changed',      resourceType: 'settings',      outcome: 'success', riskLevel: 'high',     details: { key: 'data_retention_days', from: 90, to: 180, reason: 'Compliance audit requirement' } },
  { ts: '2026-06-15T08:30:00Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_d002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-15T09:00:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_d003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-15T09:15:00Z', actor: ANALYST, action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_d004', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-15T09:30:00Z', actor: MLEE,    action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8770', resourceName: 'BlueKeep Exploit Attempt — 45.155.205.10',details: { confidence: 'critical', cve: 'CVE-2019-0708', mitre: 'T1210' } },
  { ts: '2026-06-15T10:00:00Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_jira', resourceName: 'Jira Case Management', details: { changes: ['project_key: SOC → HUNT', 'auto_create_threshold: high → critical'] } },
  { ts: '2026-06-15T10:30:00Z', actor: JSMITH,  action: 'rule_updated',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_012', resourceName: 'SMB Lateral Movement Probe', details: { changes: ['threshold: 5 → 3', 'window: 60s → 30s'], reason: 'Reduce dwell time' } },
  { ts: '2026-06-15T11:00:00Z', actor: MLEE,    action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 35, format: 'STIX 2.1', destination: 'MISP', tlp: 'GREEN' } },
  { ts: '2026-06-15T11:30:00Z', actor: ANALYST, action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8772', resourceName: 'Redis Unauthorized SLAVEOF',             details: { confidence: 'high', mitre: 'T1219', port: 6379 } },
  { ts: '2026-06-15T12:00:00Z', actor: ADMIN,   action: 'decoy_paused',          resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_005', resourceName: 'Glastopf-HTTP-01', details: { reason: 'Decommissioning — replacing with Heralding', scheduledDelete: '2026-06-22' } },
  { ts: '2026-06-15T13:00:00Z', actor: JSMITH,  action: 'threat_assigned',       resourceType: 'threat',        outcome: 'success', riskLevel: 'low',      resourceId: 'thr_440', resourceName: 'Lazarus Group RDP Probes', details: { assignedTo: 'analyst@honeyforge.io', priority: 'critical' } },
  { ts: '2026-06-15T14:30:00Z', actor: MLEE,    action: 'report_generated',      resourceType: 'report',        outcome: 'success', riskLevel: 'low',      resourceId: 'rep_exec', resourceName: 'Monthly Executive Security Report', details: { format: 'pdf', fileSize: 3248123, period: '30d' } },
  { ts: '2026-06-15T15:00:00Z', actor: ANALYST, action: 'threat_resolved',       resourceType: 'threat',        outcome: 'success', riskLevel: 'low',      resourceId: 'thr_438', resourceName: 'Mass SQLi Campaign from 45.155.x.x', details: { resolution: 'IOCs published to MISP, blocking rules deployed', ttc: '2h 45m' } },

  // ── JUNE 14 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-14T07:00:00Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_e001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-14T08:00:00Z', actor: ADMIN,   action: 'user_created',          resourceType: 'user',          outcome: 'success', riskLevel: 'high',     resourceId: 'usr_analyst_003', resourceName: 'mlee@honeyforge.io', details: { role: 'analyst', mfa_required: true, onboarded_by: 'admin@honeyforge.io' } },
  { ts: '2026-06-14T08:30:00Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_e002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-14T09:00:00Z', actor: JSMITH,  action: 'rule_created',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_019', resourceName: 'Python ReverseShell via SSH', details: { type: 'sigma', severity: 'high', mitre: 'T1059.006' } },
  { ts: '2026-06-14T10:00:00Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_s3', resourceName: 'S3-Compatible Storage', details: { changes: ['bucket: hf-logs-dev → hf-logs-prod', 'encryption: off → AES-256'] } },
  { ts: '2026-06-14T10:30:00Z', actor: ANALYST, action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8750', resourceName: 'MongoDB NoSQL Injection — 91.108.4.41', details: { confidence: 'high', mitre: 'T1190', port: 27017 } },
  { ts: '2026-06-14T11:00:00Z', actor: ADMIN,   action: 'clone_studio_changed',  resourceType: 'clone-studio',  outcome: 'success', riskLevel: 'medium',   details: { changes: ['global_response_delay: 50ms → 200ms', 'simulate_packet_loss: false → true'] } },
  { ts: '2026-06-14T11:30:00Z', actor: JSMITH,  action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 9, format: 'CSV', destination: 'CrowdStrike Falcon', tlp: 'WHITE' } },
  { ts: '2026-06-14T12:00:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_e003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-14T14:00:00Z', actor: ADMIN,   action: 'decoy_created',         resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_010', resourceName: 'HoneD-RDP-US-02', details: { type: 'rdp', port: 3389, region: 'us-east-1', template: 'windows-2019-vanilla' } },

  // ── JUNE 13 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-13T07:00:00Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_f001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-13T08:00:00Z', actor: ADMIN,   action: 'settings_changed',      resourceType: 'settings',      outcome: 'success', riskLevel: 'high',     details: { key: 'siem_forwarding_enabled', from: false, to: true, reason: 'New OpenSearch cluster ready' } },
  { ts: '2026-06-13T08:30:00Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_f002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-13T09:00:00Z', actor: ADMIN,   action: 'integration_removed',   resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_legacy', resourceName: 'Legacy Syslog Export', details: { reason: 'Decommissioned — replaced by OpenSearch direct feed', decommissionedBy: 'admin@honeyforge.io' } },
  { ts: '2026-06-13T09:30:00Z', actor: JSMITH,  action: 'rule_enabled',          resourceType: 'rule',          outcome: 'success', riskLevel: 'medium',   resourceId: 'r_015', resourceName: 'ICMP Ping Sweep Detection', details: { previousStatus: 'disabled', reason: 'Internal network expanded to /16' } },
  { ts: '2026-06-13T10:00:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_f003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-13T10:30:00Z', actor: MLEE,    action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8730', resourceName: 'Eternal Blue Probe — 198.54.117.212',   details: { confidence: 'critical', cve: 'MS17-010', mitre: 'T1210' } },
  { ts: '2026-06-13T11:00:00Z', actor: ANALYST, action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_f004', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-13T12:00:00Z', actor: ADMIN,   action: 'role_changed',          resourceType: 'user',          outcome: 'success', riskLevel: 'critical', resourceId: 'usr_analyst_001', resourceName: 'analyst@honeyforge.io', details: { from: 'analyst', to: 'admin', reason: 'Promoted to SOC lead after onboarding period' } },
  { ts: '2026-06-13T14:00:00Z', actor: JSMITH,  action: 'threat_assigned',       resourceType: 'threat',        outcome: 'success', riskLevel: 'low',      resourceId: 'thr_437', resourceName: 'Mirai Botnet C2 Callbacks', details: { assignedTo: 'analyst@honeyforge.io', priority: 'high' } },
  { ts: '2026-06-13T17:30:00Z', actor: ADMIN,   action: 'logout',                resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_f001', details: { duration: '10h 30m' } },

  // ── JUNE 12 ──────────────────────────────────────────────────────────────
  { ts: '2026-06-12T07:00:00Z', actor: ADMIN,   action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_g001', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-12T08:00:00Z', actor: ADMIN,   action: 'user_deleted',          resourceType: 'user',          outcome: 'success', riskLevel: 'critical', resourceId: 'usr_viewer_002', resourceName: 'contractor1@honeyforge.io', details: { reason: 'Contract ended — access revoked per offboarding policy', deletedBy: 'admin@honeyforge.io' } },
  { ts: '2026-06-12T09:00:00Z', actor: JSMITH,  action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_g002', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-12T09:30:00Z', actor: ADMIN,   action: 'decoy_created',         resourceType: 'decoy',         outcome: 'success', riskLevel: 'medium',   resourceId: 'd_009', resourceName: 'Heralding-SMB-AS-01', details: { type: 'smb', port: 445, region: 'ap-south-1', template: 'heralding-smb' } },
  { ts: '2026-06-12T10:00:00Z', actor: MLEE,    action: 'login',                 resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_g003', details: { mfa: true, method: 'totp' } },
  { ts: '2026-06-12T10:30:00Z', actor: JSMITH,  action: 'event_marked_attack',   resourceType: 'event',         outcome: 'success', riskLevel: 'low',      resourceId: 'evt_8700', resourceName: 'WannaCry Signature Match — 92.63.194.10',details: { confidence: 'critical', cve: 'MS17-010', mitre: 'T1486', iocs: ['92.63.194.10'] } },
  { ts: '2026-06-12T11:00:00Z', actor: ADMIN,   action: 'integration_configured',resourceType: 'integration',   outcome: 'success', riskLevel: 'high',     resourceId: 'int_misp', resourceName: 'MISP Threat Intel', details: { changes: ['sharing_group: SECTOR → OPSEC', 'auto_publish: false → true'] } },
  { ts: '2026-06-12T12:00:00Z', actor: MLEE,    action: 'ioc_exported',          resourceType: 'ioc',           outcome: 'success', riskLevel: 'medium',   details: { count: 41, format: 'STIX 2.1', destination: 'MISP', tlp: 'AMBER' } },
  { ts: '2026-06-12T14:00:00Z', actor: JSMITH,  action: 'report_generated',      resourceType: 'report',        outcome: 'success', riskLevel: 'low',      resourceId: 'rep_mitre', resourceName: 'MITRE ATT&CK Coverage Report', details: { format: 'pdf', fileSize: 2108234, period: '30d' } },
  { ts: '2026-06-12T16:00:00Z', actor: ADMIN,   action: 'settings_changed',      resourceType: 'settings',      outcome: 'success', riskLevel: 'high',     details: { key: 'max_concurrent_sessions', from: 3, to: 2, reason: 'Enforce principle of least privilege' } },
  { ts: '2026-06-12T17:00:00Z', actor: ADMIN,   action: 'logout',                resourceType: 'session',       outcome: 'success', riskLevel: 'low',      sessionId: 'sess_g001', details: { duration: '10h 00m' } },
]

const logs = EVENTS.map((e, i) => {
  const id = `al_${String(i + 1).padStart(4, '0')}`
  const { actor, ts, ...rest } = e
  return {
    id,
    userId:       actor.userId,
    userEmail:    actor.userEmail,
    userRole:     actor.userRole,
    ipAddress:    actor.ip,
    userAgent:    actor.ua,
    timestamp:    ts,
    resourceId:   rest.resourceId,
    resourceName: rest.resourceName,
    sessionId:    rest.sessionId,
    action:       rest.action,
    resourceType: rest.resourceType,
    outcome:      rest.outcome,
    riskLevel:    rest.riskLevel,
    details:      rest.details || {},
  }
})

const header = `import type { AuditLog } from '@/types/audit'

// Generated by scripts/gen-audit.js — ${logs.length} entries across 7 days
export const MOCK_AUDIT_LOGS: AuditLog[] = `

const body = JSON.stringify(logs, (_k, v) => v === undefined ? undefined : v, 2)

const footer = `

// Legacy compat
export const AUDIT_LOG_COUNT = ${logs.length}
`

const out = path.join(__dirname, '..', 'services', 'mock', 'data', 'audit.ts')
fs.writeFileSync(out, header + body + footer, 'utf8')
console.log(`Wrote ${logs.length} entries → ${out}`)
