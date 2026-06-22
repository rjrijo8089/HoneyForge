import type { ThreatEvent, AttackTrend } from '@/types'

export const MOCK_THREATS: ThreatEvent[] = [
  { id: 't_001', title: 'SSH Brute Force from CN', severity: 'high', status: 'confirmed', sourceIp: '103.45.78.12', sourcePort: 54321, targetDecoyId: 'd_001', targetDecoyName: 'SSH-Honeypot-01', attackType: 'Brute Force', ttps: ['T1110', 'T1078'], timestamp: '2024-06-17T16:23:00Z', countryCode: 'CN', countryName: 'China', asn: 'AS4134', isMalicious: true, confidence: 97 },
  { id: 't_002', title: 'SQL Injection Attempt on Web Lure', severity: 'critical', status: 'new', sourceIp: '185.220.101.45', sourcePort: 51234, targetDecoyId: 'd_002', targetDecoyName: 'HTTP-WEB-LURE', attackType: 'SQL Injection', ttps: ['T1190'], payload: "' OR 1=1 --", timestamp: '2024-06-17T15:55:00Z', countryCode: 'RU', countryName: 'Russia', asn: 'AS49505', isMalicious: true, confidence: 99 },
  { id: 't_003', title: 'SMB Lateral Movement Probe', severity: 'high', status: 'investigating', sourceIp: '192.168.1.55', targetDecoyId: 'd_003', targetDecoyName: 'SMB-FileShare-Lure', attackType: 'Lateral Movement', ttps: ['T1021.002', 'T1083'], timestamp: '2024-06-17T14:10:00Z', isMalicious: true, confidence: 88 },
  { id: 't_004', title: 'Directory Traversal on Web Lure', severity: 'medium', status: 'resolved', sourceIp: '45.33.32.156', sourcePort: 44321, targetDecoyId: 'd_002', targetDecoyName: 'HTTP-WEB-LURE', attackType: 'Directory Traversal', ttps: ['T1083'], payload: '../../../etc/passwd', timestamp: '2024-06-17T10:30:00Z', countryCode: 'US', countryName: 'United States', isMalicious: true, confidence: 94 },
  { id: 't_005', title: 'MySQL Auth Bypass Attempt', severity: 'critical', status: 'new', sourceIp: '77.123.45.67', targetDecoyId: 'd_005', targetDecoyName: 'MySQL-DB-Canary', attackType: 'Auth Bypass', ttps: ['T1190', 'T1078.001'], timestamp: '2024-06-17T09:44:00Z', countryCode: 'DE', countryName: 'Germany', isMalicious: true, confidence: 91 },
  { id: 't_006', title: 'Automated Scan - FTP Banner Grab', severity: 'low', status: 'false_positive', sourceIp: '141.98.11.22', targetDecoyId: 'd_006', targetDecoyName: 'FTP-Legacy-Server', attackType: 'Reconnaissance', ttps: ['T1595'], timestamp: '2024-06-16T22:15:00Z', countryCode: 'NL', countryName: 'Netherlands', isMalicious: false, confidence: 45 },
  { id: 't_007', title: 'SSH Key Exhaustion Attack', severity: 'high', status: 'confirmed', sourceIp: '198.199.65.44', targetDecoyId: 'd_001', targetDecoyName: 'SSH-Honeypot-01', attackType: 'Credential Stuffing', ttps: ['T1110.001'], timestamp: '2024-06-16T18:00:00Z', countryCode: 'US', countryName: 'United States', isMalicious: true, confidence: 96 },
  { id: 't_008', title: 'RDP NLA Bypass Probe', severity: 'medium', status: 'new', sourceIp: '31.184.198.71', targetDecoyId: 'd_004', targetDecoyName: 'RDP-Workstation-Fake', attackType: 'Auth Bypass', ttps: ['T1021.001'], timestamp: '2024-06-16T12:30:00Z', countryCode: 'UA', countryName: 'Ukraine', isMalicious: true, confidence: 82 },
]

export const MOCK_ATTACK_TRENDS: AttackTrend[] = [
  { date: 'Jun 11', critical: 2, high: 8,  medium: 14, low: 21 },
  { date: 'Jun 12', critical: 5, high: 12, medium: 18, low: 15 },
  { date: 'Jun 13', critical: 3, high: 9,  medium: 22, low: 19 },
  { date: 'Jun 14', critical: 7, high: 15, medium: 11, low: 24 },
  { date: 'Jun 15', critical: 4, high: 11, medium: 16, low: 18 },
  { date: 'Jun 16', critical: 6, high: 18, medium: 20, low: 13 },
  { date: 'Jun 17', critical: 9, high: 21, medium: 17, low: 11 },
]
