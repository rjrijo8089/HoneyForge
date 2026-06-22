import type { ReportTemplate } from '@/types/report'

export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    "id": "rpt_001",
    "name": "Daily Honeypot Summary",
    "slug": "daily-summary",
    "category": "technical",
    "description": "A comprehensive daily digest of all honeypot interaction events, top attacker IPs, newly observed IOCs, and decoy health across the entire HoneyForge deployment.",
    "status": "active",
    "schedule": {
      "frequency": "daily",
      "hour": 6,
      "recipients": [
        "soc@corp.com",
        "analyst@honeyforge.io"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ],
      "slackChannel": "#soc-daily"
    },
    "lastRun": {
      "runId": "run_001a",
      "status": "ready",
      "at": "2026-06-18T06:04:11Z",
      "fileSize": 1245184
    },
    "owner": "analyst@honeyforge.io",
    "createdAt": "2025-01-10T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Total Events",
          "value": "2,341",
          "change": "+12%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Unique Attackers",
          "value": "847",
          "change": "+5%",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "New IOCs",
          "value": "23",
          "change": "+8",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "Active Decoys",
          "value": "8 / 8",
          "change": "",
          "trend": "neutral",
          "accent": "green"
        },
        {
          "label": "Rules Triggered",
          "value": "12",
          "change": "+3",
          "trend": "up",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 1842
        },
        {
          "label": "Jun 13",
          "value": 2103
        },
        {
          "label": "Jun 14",
          "value": 1984
        },
        {
          "label": "Jun 15",
          "value": 2289
        },
        {
          "label": "Jun 16",
          "value": 2108
        },
        {
          "label": "Jun 17",
          "value": 2174
        },
        {
          "label": "Jun 18",
          "value": 2341
        }
      ],
      "trendLabel": "Daily Events (last 7 days)",
      "topAttackTypes": [
        {
          "name": "SSH Brute Force",
          "count": 847,
          "percent": 36
        },
        {
          "name": "Port Scan",
          "count": 612,
          "percent": 26
        },
        {
          "name": "Web Exploit",
          "count": 389,
          "percent": 17
        },
        {
          "name": "SQL Injection",
          "count": 284,
          "percent": 12
        },
        {
          "name": "XSS Attempt",
          "count": 209,
          "percent": 9
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "Mass SSH Scanning from 3 CIDR Ranges",
          "description": "Three coordinated /24 blocks (103.27.202.0/24, 45.128.232.0/24, 185.220.101.0/24) initiated synchronized brute-force campaigns against Cowrie. Timing correlation suggests automated tooling."
        },
        {
          "severity": "high",
          "title": "New Cobalt Strike Beacon Traffic Pattern",
          "description": "JARM fingerprint matching default CS 4.x profile detected on port 443. Source IP 91.219.237.41 (AS: AS60781 LeaseWeb) not previously observed."
        },
        {
          "severity": "medium",
          "title": "SQL Injection Volume Spike +47%",
          "description": "TANNER honeypot logged a 47% increase in SQLi attempts targeting /api/login and /admin endpoints. Automated tool signature (sqlmap/1.7.x) identified in 83% of requests."
        }
      ],
      "recommendedActions": [
        "Block CIDR ranges 103.27.202.0/24, 45.128.232.0/24, 185.220.101.0/24 at perimeter firewall",
        "Push source IP 91.219.237.41 to Sentinel watchlist and enable alerting for 30-day period",
        "Update TANNER SQLi detection threshold from 5 to 3 requests/min to reduce dwell time",
        "Review Cowrie session logs for credential pairs captured in overnight SSH campaigns",
        "Verify MISP auto-export is ingesting today's 23 new IOCs into threat intel platform"
      ],
      "executiveSummary": "HoneyForge recorded 2,341 malicious interaction events during the 24-hour reporting period ending June 18th at 06:00 UTC, a 12% increase over the prior day. Three coordinated SSH brute-force campaigns from China-attributed ASNs were the dominant threat vector (36% of volume), with a newly observed Cobalt Strike beacon pattern representing the highest-risk finding. All 8 decoys remained operational throughout the period. The 23 newly captured IOCs have been automatically exported to MISP for cross-organizational sharing."
    }
  },
  {
    "id": "rpt_002",
    "name": "Weekly Threat Intelligence Report",
    "slug": "weekly-threat",
    "category": "threat",
    "description": "Aggregated weekly view of threat actor TTPs, newly observed malware families, IOC clusters, and threat campaign attribution observed across the honeypot network.",
    "status": "active",
    "schedule": {
      "frequency": "weekly",
      "dayOfWeek": 1,
      "hour": 7,
      "recipients": [
        "soc@corp.com",
        "ciso@corp.com",
        "analyst@honeyforge.io"
      ],
      "format": "pdf",
      "delivery": [
        "email",
        "slack"
      ],
      "slackChannel": "#threat-intel"
    },
    "lastRun": {
      "runId": "run_002a",
      "status": "ready",
      "at": "2026-06-16T07:08:22Z",
      "fileSize": 3145728
    },
    "owner": "analyst@honeyforge.io",
    "createdAt": "2025-01-15T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Total Events (7d)",
          "value": "14,821",
          "change": "+9%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Threat Campaigns",
          "value": "7",
          "change": "+2",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "New Malware Hashes",
          "value": "41",
          "change": "+14",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "IOCs Shared",
          "value": "312",
          "change": "+28",
          "trend": "up",
          "accent": "green"
        },
        {
          "label": "Techniques Seen",
          "value": "18",
          "change": "-1",
          "trend": "down",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 1984
        },
        {
          "label": "Jun 13",
          "value": 2241
        },
        {
          "label": "Jun 14",
          "value": 2108
        },
        {
          "label": "Jun 15",
          "value": 1847
        },
        {
          "label": "Jun 16",
          "value": 2289
        },
        {
          "label": "Jun 17",
          "value": 2211
        },
        {
          "label": "Jun 18",
          "value": 2341
        }
      ],
      "trendLabel": "Weekly Event Volume (last 7 days)",
      "topAttackTypes": [
        {
          "name": "Credential Brute Force",
          "count": 5841,
          "percent": 39
        },
        {
          "name": "Reconnaissance Scan",
          "count": 3847,
          "percent": 26
        },
        {
          "name": "Web Application Attack",
          "count": 2341,
          "percent": 16
        },
        {
          "name": "Malware Delivery",
          "count": 1847,
          "percent": 12
        },
        {
          "name": "C2 Communication",
          "count": 1041,
          "percent": 7
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "APT-Style Lateral Movement Chain Detected",
          "description": "Post-login command sequence on Cowrie SSH honeypot followed APT29-like enumeration order: uname -a → cat /etc/passwd → curl http://…/dl — wget binary download attempted from 3 distinct C2 IPs within 90 seconds."
        },
        {
          "severity": "critical",
          "title": "Cryptominer Campaign: XMRig Cluster",
          "description": "14 unique source IPs deployed XMRig miner payloads within 48h window. Wallet address 48XY…9FB1 linked to known Kinsing botnet infrastructure. Campaign still active."
        },
        {
          "severity": "high",
          "title": "Suricata: 3 New Malicious Domain FQDNs",
          "description": "DNS queries to cdn-update[.]systems, api-telemetry[.]net, and svc-health[.]io observed from honeypot outbound. All resolve to Cobalt Strike team servers per threat intel feeds."
        }
      ],
      "recommendedActions": [
        "Submit XMRig wallet 48XY…9FB1 and associated 14 IPs to MISP as a threat campaign cluster",
        "Block DNS resolution for cdn-update[.]systems, api-telemetry[.]net, svc-health[.]io at DNS firewall",
        "Correlate APT29-pattern session with SIEM — check if same enumeration sequence appeared in production endpoints",
        "Create Jira ticket for cryptominer campaign — classify as P2 for threat intel team lead review",
        "Review 41 new malware hashes against VirusTotal Enterprise for family classification"
      ],
      "executiveSummary": "The week of June 12–18 saw a 9% increase in total honeypot interactions, with 7 distinct threat campaigns identified through behavioral clustering. The most significant finding was an APT29-style post-compromise chain that successfully traversed the SSH honeypot's simulated environment, capturing a full attack playbook. A parallel XMRig cryptominer campaign tied to known Kinsing botnet infrastructure remains active and should be addressed immediately. 312 IOCs were automatically shared to MISP during this period."
    }
  },
  {
    "id": "rpt_003",
    "name": "Monthly Executive Security Report",
    "slug": "monthly-executive",
    "category": "executive",
    "description": "Board-ready monthly summary of honeypot program value, threat landscape trends, key incidents, threat actor profiling, and ROI metrics suitable for CISO and executive presentation.",
    "status": "active",
    "schedule": {
      "frequency": "monthly",
      "dayOfMonth": 1,
      "hour": 8,
      "recipients": [
        "ciso@corp.com",
        "cto@corp.com",
        "soc@corp.com"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ],
      "slackChannel": ""
    },
    "lastRun": {
      "runId": "run_003a",
      "status": "ready",
      "at": "2026-06-01T08:12:05Z",
      "fileSize": 5242880
    },
    "owner": "admin@honeyforge.io",
    "createdAt": "2025-01-01T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Total Events (30d)",
          "value": "58,472",
          "change": "+18%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Threat Actors",
          "value": "184",
          "change": "+22",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "IOCs Captured",
          "value": "1,847",
          "change": "+341",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "Incidents Escalated",
          "value": "14",
          "change": "-3",
          "trend": "down",
          "accent": "green"
        },
        {
          "label": "MTTD Improvement",
          "value": "2.4h",
          "change": "-18%",
          "trend": "down",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "W1",
          "value": 12847
        },
        {
          "label": "W2",
          "value": 14201
        },
        {
          "label": "W3",
          "value": 15489
        },
        {
          "label": "W4",
          "value": 15935
        }
      ],
      "trendLabel": "Monthly Event Volume by Week",
      "topAttackTypes": [
        {
          "name": "SSH Brute Force",
          "count": 24841,
          "percent": 42
        },
        {
          "name": "Web Application Attack",
          "count": 14120,
          "percent": 24
        },
        {
          "name": "Malware Distribution",
          "count": 9847,
          "percent": 17
        },
        {
          "name": "C2 Callback Attempt",
          "count": 5841,
          "percent": 10
        },
        {
          "name": "Lateral Movement",
          "count": 3823,
          "percent": 7
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "Organized Cryptomining Campaign — Month-Long Activity",
          "description": "A coordinated XMRig deployment campaign operated from 47 rotating IPs throughout May. Estimated 340 GPU-hours of mining attempted. Full campaign IOC set exported to MISP."
        },
        {
          "severity": "high",
          "title": "Detection Rule Coverage Improved to 87%",
          "description": "New Sigma rules deployed this month increased MITRE ATT&CK coverage from 71% to 87% across Reconnaissance through Exfiltration kill chain. 4 blind spots remain in Persistence category."
        },
        {
          "severity": "medium",
          "title": "Decoy Interaction Rate Increased 23%",
          "description": "SSH and web decoys logged 23% more unique attacker sessions than the prior month, suggesting growing internet-facing asset visibility or increased adversary automation."
        }
      ],
      "recommendedActions": [
        "Present honeypot ROI metrics to board: 1,847 IOCs captured vs. ~$340/IOC commercial threat intel cost = $630K equivalent value",
        "Approve Q3 budget for 4 additional geographic decoy nodes (APAC/EU) to improve attacker attribution coverage",
        "Close Persistence kill-chain coverage gap — assign 2 analyst-days to write missing YARA/Sigma rules",
        "Initiate formal information sharing agreement with 2 ISACs using this month's IOC data as inaugural contribution",
        "Schedule follow-up for Cobalt Strike beacon pattern observed last week — confirm no production environment overlap"
      ],
      "executiveSummary": "May 2026 represented a record month for HoneyForge with 58,472 total threat interactions — an 18% increase month-over-month. The program captured 1,847 unique indicators of compromise, equivalent to approximately $630,000 in commercial threat intelligence value. Mean Time to Detect improved by 18% to 2.4 hours following new detection rule deployments. 14 incidents were escalated to the security team, 3 fewer than the prior month despite higher interaction volume, reflecting improved automated triage. Executive leadership should note the APAC geographic coverage gap identified in the threat actor attribution data."
    }
  },
  {
    "id": "rpt_004",
    "name": "Top Attacker IPs Report",
    "slug": "top-attackers",
    "category": "technical",
    "description": "Ranked list of the most prolific attacking IP addresses and ASNs, with geolocation, ASN reputation, attack type breakdown, campaign attribution, and first/last seen timestamps.",
    "status": "active",
    "schedule": {
      "frequency": "weekly",
      "dayOfWeek": 1,
      "hour": 6,
      "recipients": [
        "analyst@honeyforge.io",
        "soc@corp.com"
      ],
      "format": "csv",
      "delivery": [
        "email"
      ]
    },
    "lastRun": {
      "runId": "run_004a",
      "status": "ready",
      "at": "2026-06-16T06:09:47Z",
      "fileSize": 204800
    },
    "owner": "analyst@honeyforge.io",
    "createdAt": "2025-02-01T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Unique IPs (7d)",
          "value": "5,847",
          "change": "+412",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Repeat Offenders",
          "value": "284",
          "change": "+31",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "Blocked by Rules",
          "value": "1,204",
          "change": "+87",
          "trend": "up",
          "accent": "green"
        },
        {
          "label": "Unique ASNs",
          "value": "847",
          "change": "+42",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "TOR Exit Nodes",
          "value": "312",
          "change": "+28",
          "trend": "up",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 721
        },
        {
          "label": "Jun 13",
          "value": 814
        },
        {
          "label": "Jun 14",
          "value": 756
        },
        {
          "label": "Jun 15",
          "value": 891
        },
        {
          "label": "Jun 16",
          "value": 847
        },
        {
          "label": "Jun 17",
          "value": 803
        },
        {
          "label": "Jun 18",
          "value": 815
        }
      ],
      "trendLabel": "Unique Attacking IPs per Day",
      "topAttackTypes": [
        {
          "name": "AS-4134 China Telecom",
          "count": 2841,
          "percent": 29
        },
        {
          "name": "AS-7922 Comcast",
          "count": 1847,
          "percent": 19
        },
        {
          "name": "AS-60781 LeaseWeb",
          "count": 1204,
          "percent": 12
        },
        {
          "name": "AS-42473 ANEXIA",
          "count": 987,
          "percent": 10
        },
        {
          "name": "AS-24940 Hetzner",
          "count": 841,
          "percent": 9
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "high",
          "title": "Top IP 103.27.202.187: 1,847 Events in 24h",
          "description": "Single IP responsible for 1,847 SSH authentication attempts. Attributed to AS-4134 China Telecom. IP not listed in existing blocklists. Recommend immediate block and MISP export."
        },
        {
          "severity": "high",
          "title": "28 IPs Matching Known Scanning Tool Fingerprints",
          "description": "Masscan/Zmap default fingerprints detected from 28 distinct IPs coordinated within 4-minute window — likely automated scanning infrastructure."
        },
        {
          "severity": "medium",
          "title": "312 TOR Exit Node IPs Active This Week",
          "description": "6.7% increase in TOR-originated attacks. TOR exit node IPs obfuscate attacker attribution. Consider TOR exit blocklist subscription for lower-signal coverage."
        }
      ],
      "recommendedActions": [
        "Export top 50 attacker IPs to EDL and push to perimeter firewall for 30-day block",
        "Submit 103.27.202.187 to AbuseIPDB and configured threat intel feeds",
        "Evaluate TOR exit node blocklist (e.g., dan.me.uk) for integration into firewall policy",
        "Correlate top ASNs against SIEM data to detect if any attacker IPs appear in production logs"
      ],
      "executiveSummary": "During the 7-day reporting window, 5,847 unique IP addresses interacted with the honeypot network across 847 distinct autonomous systems. China Telecom (AS-4134) accounted for the largest single-ASN source with 2,841 unique IPs. 284 IPs were observed on multiple consecutive days, indicating persistent adversaries. 312 interactions originated from TOR exit nodes, complicating attribution. The top 50 IPs have been pre-packaged in STIX 2.1 format for immediate blocklist deployment."
    }
  },
  {
    "id": "rpt_005",
    "name": "Web Attack Trends Report",
    "slug": "web-attacks",
    "category": "technical",
    "description": "Detailed analysis of web application attack patterns observed via SNARE and TANNER honeypots, including SQLi, XSS, LFI, RCE, SSRF, path traversal, and emerging web exploit techniques.",
    "status": "active",
    "schedule": {
      "frequency": "weekly",
      "dayOfWeek": 5,
      "hour": 7,
      "recipients": [
        "analyst@honeyforge.io",
        "appsec@corp.com"
      ],
      "format": "pdf",
      "delivery": [
        "email",
        "slack"
      ],
      "slackChannel": "#appsec"
    },
    "lastRun": {
      "runId": "run_005a",
      "status": "ready",
      "at": "2026-06-13T07:11:38Z",
      "fileSize": 2097152
    },
    "owner": "mlee@honeyforge.io",
    "createdAt": "2025-03-01T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Web Events (7d)",
          "value": "12,847",
          "change": "+23%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "SQLi Attempts",
          "value": "4,120",
          "change": "+31%",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "XSS Attempts",
          "value": "2,841",
          "change": "+12%",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "LFI / Path Trav.",
          "value": "1,847",
          "change": "+8%",
          "trend": "up",
          "accent": "cyan"
        },
        {
          "label": "RCE / Injection",
          "value": "1,034",
          "change": "+47%",
          "trend": "up",
          "accent": "green"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 1547
        },
        {
          "label": "Jun 13",
          "value": 1841
        },
        {
          "label": "Jun 14",
          "value": 1702
        },
        {
          "label": "Jun 15",
          "value": 1983
        },
        {
          "label": "Jun 16",
          "value": 1847
        },
        {
          "label": "Jun 17",
          "value": 1927
        },
        {
          "label": "Jun 18",
          "value": 2000
        }
      ],
      "trendLabel": "Web Attack Events per Day",
      "topAttackTypes": [
        {
          "name": "SQL Injection",
          "count": 4120,
          "percent": 32
        },
        {
          "name": "Cross-Site Scripting",
          "count": 2841,
          "percent": 22
        },
        {
          "name": "Path Traversal / LFI",
          "count": 1847,
          "percent": 14
        },
        {
          "name": "OS Command Injection",
          "count": 1034,
          "percent": 8
        },
        {
          "name": "SSRF to IMDS",
          "count": 984,
          "percent": 8
        },
        {
          "name": "PHP Wrapper Abuse",
          "count": 718,
          "percent": 6
        }
      ],
      "topCountries": [
        {
          "name": "United States",
          "code": "US",
          "count": 3847,
          "percent": 32
        },
        {
          "name": "Germany",
          "code": "DE",
          "count": 2241,
          "percent": 18
        },
        {
          "name": "China",
          "code": "CN",
          "count": 1847,
          "percent": 15
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1204,
          "percent": 10
        },
        {
          "name": "Singapore",
          "code": "SG",
          "count": 847,
          "percent": 7
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "RCE via OS Injection: +47% Week-Over-Week",
          "description": "OS command injection attempts increased 47% this week. PCRE analysis shows 83% use bash/sh as the interpreter — payloads include wget/curl download chains targeting /tmp directories."
        },
        {
          "severity": "high",
          "title": "SSRF to AWS IMDS Targeted 221 Times",
          "description": "Server-Side Request Forgery attempts targeting 169.254.169.254 (AWS IMDS) detected 221 times. 4 unique source IPs appeared in prior MISP datasets linked to cloud credential theft campaigns."
        },
        {
          "severity": "high",
          "title": "New PHP WebShell Upload Variant Detected",
          "description": "YARA rule HoneyForge_PHP_WebShell_Upload triggered on 12 unique upload payloads using obfuscated base64-encoded eval chains — variant not seen prior to this week."
        }
      ],
      "recommendedActions": [
        "Update OS injection Suricata rule to include Python3, Ruby, and Perl interpreters (current rule covers bash/sh only)",
        "Add AWS IMDS SSRF source IPs to Sentinel watchlist; verify no overlap with production cloud environment traffic logs",
        "Quarantine and submit 12 new PHP web shell variants to VirusTotal and internal YARA rule corpus",
        "Schedule AppSec team review of RCE trend — validate production WAF rules cover current injection patterns",
        "Consider deploying WordPress honeypot specifically for WP-targeted XSS/SQLi campaign tracking"
      ],
      "executiveSummary": "Web application attacks increased 23% week-over-week to 12,847 events, driven primarily by SQL injection (32% share) and a concerning 47% spike in OS command injection attempts. SSRF attacks targeting AWS Instance Metadata endpoints represent an elevated threat, with source IPs cross-matching known cloud credential theft campaigns. A new PHP webshell upload variant not previously observed in threat intelligence feeds was successfully captured by YARA detection rules. AppSec teams should review production WAF configurations against the updated injection technique inventory."
    }
  },
  {
    "id": "rpt_006",
    "name": "SSH Brute Force Report",
    "slug": "ssh-bruteforce",
    "category": "technical",
    "description": "Daily analysis of SSH credential brute-force campaigns observed via Cowrie honeypot, including top credential pairs attempted, campaign timing, attacker tooling signatures, and post-login activity.",
    "status": "active",
    "schedule": {
      "frequency": "daily",
      "hour": 5,
      "recipients": [
        "analyst@honeyforge.io"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ]
    },
    "lastRun": {
      "runId": "run_006a",
      "status": "ready",
      "at": "2026-06-18T05:07:14Z",
      "fileSize": 876544
    },
    "owner": "jsmith@honeyforge.io",
    "createdAt": "2025-01-20T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Auth Attempts",
          "value": "12,847",
          "change": "+8%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Unique Passwords",
          "value": "8,241",
          "change": "+412",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "Successful Logins",
          "value": "47",
          "change": "-3",
          "trend": "down",
          "accent": "yellow"
        },
        {
          "label": "Post-Login Cmds",
          "value": "312",
          "change": "+41",
          "trend": "up",
          "accent": "green"
        },
        {
          "label": "Unique Src IPs",
          "value": "2,341",
          "change": "+187",
          "trend": "up",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 10847
        },
        {
          "label": "Jun 13",
          "value": 11241
        },
        {
          "label": "Jun 14",
          "value": 10984
        },
        {
          "label": "Jun 15",
          "value": 12109
        },
        {
          "label": "Jun 16",
          "value": 11847
        },
        {
          "label": "Jun 17",
          "value": 12341
        },
        {
          "label": "Jun 18",
          "value": 12847
        }
      ],
      "trendLabel": "SSH Auth Attempts per Day",
      "topAttackTypes": [
        {
          "name": "root / admin",
          "count": 4841,
          "percent": 38
        },
        {
          "name": "root / 123456",
          "count": 2341,
          "percent": 18
        },
        {
          "name": "admin / password",
          "count": 1847,
          "percent": 14
        },
        {
          "name": "ubuntu / ubuntu",
          "count": 1204,
          "percent": 9
        },
        {
          "name": "pi / raspberry",
          "count": 887,
          "percent": 7
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 5841,
          "percent": 48
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 2241,
          "percent": 18
        },
        {
          "name": "Vietnam",
          "code": "VN",
          "count": 1120,
          "percent": 9
        },
        {
          "name": "Brazil",
          "code": "BR",
          "count": 847,
          "percent": 7
        },
        {
          "name": "India",
          "code": "IN",
          "count": 622,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "47 Successful Honeypot Logins — Command Activity Captured",
          "description": "47 attacker sessions achieved valid credentials. 34 attempted wget/curl downloads within 120 seconds of login. 3 unique download URLs resolved to active Kinsing C2 infrastructure."
        },
        {
          "severity": "high",
          "title": "Credential Stuffing: Known Breach Dataset Detected",
          "description": "Pattern matching identified 1,247 credential pairs from the Rockyou2024 dataset. This indicates credential stuffing automation targeting IoT/Linux default credentials."
        },
        {
          "severity": "medium",
          "title": "Scanning Tool: Mirai Variant Fingerprint",
          "description": "Timing and credential ordering matches Mirai botnet scanner behavior. 312 IPs using identical 3-second connection timeout and ordered credential list — likely same botnet cluster."
        }
      ],
      "recommendedActions": [
        "Export 3 Kinsing C2 download URLs to threat intel and block at DNS/proxy layer immediately",
        "Rotate any default credentials matching top attack patterns on non-honeypot infrastructure",
        "Configure Cowrie to capture full file downloads for the next 7 days for malware family analysis",
        "Submit Mirai scanner IP cluster to CERTs and update automated blocklist feeds",
        "Review 47 successful login sessions in Cowrie logs — extract full command sequences for MITRE mapping"
      ],
      "executiveSummary": "The Cowrie SSH honeypot processed 12,847 authentication attempts from 2,341 unique source IPs during the 24-hour reporting period. 47 sessions achieved successful login using common default credential pairs, resulting in 312 captured attacker commands including 3 live malware download URLs tied to Kinsing botnet infrastructure. Pattern analysis confirmed the presence of Mirai variant scanning behavior, and credential matching against breach datasets indicates automated credential-stuffing tooling. Download URLs have been shared with threat intel partners."
    }
  },
  {
    "id": "rpt_007",
    "name": "Malware Delivery Attempts Report",
    "slug": "malware",
    "category": "threat",
    "description": "Analysis of malware delivery attempts observed across honeypots — file uploads, download commands, packed binaries, dropper URLs, and behavioral indicators of post-exploitation staging.",
    "status": "active",
    "schedule": {
      "frequency": "weekly",
      "dayOfWeek": 1,
      "hour": 8,
      "recipients": [
        "analyst@honeyforge.io",
        "soc@corp.com"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ]
    },
    "lastRun": {
      "runId": "run_007a",
      "status": "ready",
      "at": "2026-06-16T08:15:02Z",
      "fileSize": 1572864
    },
    "owner": "mlee@honeyforge.io",
    "createdAt": "2025-04-01T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Download Attempts",
          "value": "1,847",
          "change": "+34%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Unique URLs",
          "value": "412",
          "change": "+87",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "Unique File Hashes",
          "value": "284",
          "change": "+41",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "Live C2 Domains",
          "value": "23",
          "change": "+8",
          "trend": "up",
          "accent": "cyan"
        },
        {
          "label": "Cryptominers",
          "value": "156",
          "change": "+28%",
          "trend": "up",
          "accent": "green"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 221
        },
        {
          "label": "Jun 13",
          "value": 287
        },
        {
          "label": "Jun 14",
          "value": 241
        },
        {
          "label": "Jun 15",
          "value": 312
        },
        {
          "label": "Jun 16",
          "value": 289
        },
        {
          "label": "Jun 17",
          "value": 298
        },
        {
          "label": "Jun 18",
          "value": 199
        }
      ],
      "trendLabel": "Malware Delivery Attempts per Day",
      "topAttackTypes": [
        {
          "name": "XMRig / Cryptominer",
          "count": 156,
          "percent": 37
        },
        {
          "name": "Mirai/Botnet Binary",
          "count": 98,
          "percent": 23
        },
        {
          "name": "PHP Web Shell",
          "count": 72,
          "percent": 17
        },
        {
          "name": "Reverse Shell Script",
          "count": 47,
          "percent": 11
        },
        {
          "name": "Rootkit / Backdoor",
          "count": 34,
          "percent": 8
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "critical",
          "title": "Active Kinsing Campaign: 23 Live C2 Domains",
          "description": "23 unique domains serving XMRig payloads are actively resolving to live infrastructure. Wallet address confirmed Kinsing group attribution. Estimated 14 external hosts infected based on return beacon traffic to honeypot."
        },
        {
          "severity": "high",
          "title": "4 Novel Malware Hashes — No AV Coverage",
          "description": "4 of the 284 unique file hashes submitted to VirusTotal returned 0/70 detection rate. Packed ELF binaries targeting x86_64 Linux. Extracted strings suggest custom backdoor with TLS-encrypted C2."
        },
        {
          "severity": "high",
          "title": "PHP WebShell Upload via WordPress xmlrpc.php",
          "description": "72 PHP webshell upload attempts via WordPress XML-RPC endpoint. 12 variants used novel base64+gzip encoding to evade signature detection. 3 successfully executed before honeypot contained."
        }
      ],
      "recommendedActions": [
        "Immediately submit 4 zero-detection hashes to internal AV vendor for signature development",
        "Block 23 Kinsing C2 domains at DNS firewall and share IOC set with sector ISAC",
        "Submit novel backdoor samples to sandbox analysis (Cuckoo/Any.run) for full behavioral report",
        "Verify WordPress XML-RPC is disabled on all production servers — xmlrpc.php exploitation is trivially scriptable",
        "Update YARA rule corpus with new webshell encoding variant (base64+gzip pattern)"
      ],
      "executiveSummary": "HoneyForge captured 1,847 malware delivery attempts this week, a 34% increase over the prior week. 23 live Kinsing group C2 domains were identified serving XMRig cryptominer payloads, with 14 estimated external hosts beaconing to these domains via the honeypot network. Four previously unknown malware samples with zero antivirus detection were captured and are ready for sandbox analysis. The sharp increase in delivery attempts correlates with the SSH brute-force campaign spike and suggests a coordinated, automated exploitation pipeline."
    }
  },
  {
    "id": "rpt_008",
    "name": "MITRE ATT&CK Coverage Report",
    "slug": "mitre",
    "category": "executive",
    "description": "Monthly assessment of HoneyForge detection rule coverage mapped to the MITRE ATT&CK Enterprise framework, highlighting coverage gaps, newly observed techniques, and rule tuning recommendations.",
    "status": "active",
    "schedule": {
      "frequency": "monthly",
      "dayOfMonth": 1,
      "hour": 9,
      "recipients": [
        "ciso@corp.com",
        "analyst@honeyforge.io"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ]
    },
    "lastRun": {
      "runId": "run_008a",
      "status": "ready",
      "at": "2026-06-01T09:08:33Z",
      "fileSize": 3670016
    },
    "owner": "analyst@honeyforge.io",
    "createdAt": "2025-02-01T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Techniques Covered",
          "value": "87 / 100",
          "change": "+4",
          "trend": "up",
          "accent": "green"
        },
        {
          "label": "Coverage %",
          "value": "87%",
          "change": "+4%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Blind Spots",
          "value": "13",
          "change": "-4",
          "trend": "down",
          "accent": "red"
        },
        {
          "label": "New Techniques",
          "value": "6",
          "change": "+6",
          "trend": "up",
          "accent": "yellow"
        },
        {
          "label": "Active Rules",
          "value": "18",
          "change": "+3",
          "trend": "up",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jan",
          "value": 64
        },
        {
          "label": "Feb",
          "value": 68
        },
        {
          "label": "Mar",
          "value": 73
        },
        {
          "label": "Apr",
          "value": 79
        },
        {
          "label": "May",
          "value": 83
        },
        {
          "label": "Jun",
          "value": 87
        }
      ],
      "trendLabel": "MITRE Coverage % by Month",
      "topAttackTypes": [
        {
          "name": "Credential Access",
          "count": 18,
          "percent": 94
        },
        {
          "name": "Reconnaissance",
          "count": 12,
          "percent": 92
        },
        {
          "name": "Initial Access",
          "count": 11,
          "percent": 91
        },
        {
          "name": "Execution",
          "count": 14,
          "percent": 87
        },
        {
          "name": "Persistence",
          "count": 9,
          "percent": 56
        },
        {
          "name": "Command & Control",
          "count": 10,
          "percent": 83
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "high",
          "title": "Persistence Tactic: 44% Coverage Gap",
          "description": "Only 56% of Persistence techniques observed in honeypot logs are covered by current detection rules. T1547 (Boot/Logon Autostart Execution) and T1543 (Create/Modify System Process) have no corresponding YARA or Sigma rules."
        },
        {
          "severity": "medium",
          "title": "6 New Techniques Observed This Month",
          "description": "6 ATT&CK techniques were observed in honeypot sessions for the first time: T1059.004 (Unix Shell), T1055 (Process Injection), T1048.003 (DNS Tunneling), T1071.004 (DNS C2), T1496 (Resource Hijacking), T1134 (Access Token Manipulation)."
        },
        {
          "severity": "low",
          "title": "Discovery Tactic: 94% Coverage",
          "description": "Discovery tactic has near-complete coverage. T1083 (File/Dir Discovery), T1046 (Network Scan), T1082 (System Info Discovery) all have active Sigma rules with low false positive rates."
        }
      ],
      "recommendedActions": [
        "Assign 3 analyst-days to close Persistence coverage gap — prioritize T1547, T1543, T1505 (Web Shell)",
        "Create Sigma rules for 3 of 6 newly observed techniques: T1059.004, T1048.003, T1071.004",
        "Schedule quarterly MITRE ATT&CK Navigator review with SOC lead to validate coverage map",
        "Publish coverage report to threat intel sharing community — demonstrates program maturity",
        "Evaluate commercial MITRE ATT&CK–mapped rule sets to close remaining 13 blind spots faster"
      ],
      "executiveSummary": "HoneyForge detection rules now cover 87 of the 100 monitored MITRE ATT&CK Enterprise techniques, representing an 87% coverage rate and a 4-point improvement over last month. The Persistence tactic remains the largest coverage gap at 56%, with four high-priority technique categories lacking detection rules. Six new adversary techniques were observed in honeypot sessions for the first time this month, all now queued for rule development. At the current improvement rate, 95% coverage is projected by Q4 2026."
    }
  },
  {
    "id": "rpt_009",
    "name": "Decoy Health Report",
    "slug": "decoy-health",
    "category": "technical",
    "description": "Weekly status report on all deployed honeypot decoys — uptime, interaction rates, alert pipeline health, capture quality, and maintenance actions required to maintain operational fidelity.",
    "status": "active",
    "schedule": {
      "frequency": "weekly",
      "dayOfWeek": 1,
      "hour": 5,
      "recipients": [
        "analyst@honeyforge.io",
        "ops@corp.com"
      ],
      "format": "pdf",
      "delivery": [
        "email"
      ]
    },
    "lastRun": {
      "runId": "run_009a",
      "status": "ready",
      "at": "2026-06-16T05:06:55Z",
      "fileSize": 1048576
    },
    "owner": "jsmith@honeyforge.io",
    "createdAt": "2025-01-15T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Decoys Online",
          "value": "8 / 8",
          "change": "",
          "trend": "neutral",
          "accent": "green"
        },
        {
          "label": "Avg Uptime (7d)",
          "value": "99.7%",
          "change": "+0.2%",
          "trend": "up",
          "accent": "blue"
        },
        {
          "label": "Total Interactions",
          "value": "58,472",
          "change": "+12%",
          "trend": "up",
          "accent": "cyan"
        },
        {
          "label": "Log Pipeline Lag",
          "value": "< 2s",
          "change": "",
          "trend": "neutral",
          "accent": "yellow"
        },
        {
          "label": "Capture Quality",
          "value": "98.4%",
          "change": "+0.4%",
          "trend": "up",
          "accent": "red"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 7841
        },
        {
          "label": "Jun 13",
          "value": 8241
        },
        {
          "label": "Jun 14",
          "value": 7984
        },
        {
          "label": "Jun 15",
          "value": 8847
        },
        {
          "label": "Jun 16",
          "value": 8341
        },
        {
          "label": "Jun 17",
          "value": 8521
        },
        {
          "label": "Jun 18",
          "value": 8697
        }
      ],
      "trendLabel": "Total Decoy Interactions per Day",
      "topAttackTypes": [
        {
          "name": "Cowrie SSH (x2)",
          "count": 28471,
          "percent": 49
        },
        {
          "name": "SNARE HTTP (x2)",
          "count": 17841,
          "percent": 30
        },
        {
          "name": "TANNER Web (x2)",
          "count": 8472,
          "percent": 14
        },
        {
          "name": "Dionaea DB (x1)",
          "count": 2341,
          "percent": 4
        },
        {
          "name": "Suricata IDS (x1)",
          "count": 1347,
          "percent": 2
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "medium",
          "title": "Decoy HF-SNARE-02: Elevated Memory Usage (87%)",
          "description": "SNARE instance HF-SNARE-02 has been running at 87% memory utilization for the past 3 days. High web traffic volume from automated scanners may be causing memory accumulation. Restart recommended."
        },
        {
          "severity": "low",
          "title": "Dionaea Database Honeypot: Low Interaction Rate",
          "description": "Dionaea database honeypot logged only 2,341 interactions this week — the lowest of all decoys. Consider reviewing firewall exposure rules to ensure the database port (3306/5432) is reachable from internet-facing subnets."
        },
        {
          "severity": "low",
          "title": "Log Pipeline Latency Spike: +4.2s on Jun 15",
          "description": "OpenSearch pipeline experienced a 4.2-second log ingestion latency spike on June 15 at 14:37 UTC lasting ~8 minutes. Root cause: OpenSearch shard rebalancing. No events were lost (buffered in Logstash)."
        }
      ],
      "recommendedActions": [
        "Schedule restart of HF-SNARE-02 during next maintenance window to clear memory leak",
        "Review firewall ACL for Dionaea MySQL/PostgreSQL port exposure — confirm internet reachability",
        "Add memory utilization alert to monitoring dashboard (alert at >80%)",
        "Verify OpenSearch shard allocation policy to minimize future rebalancing-driven latency spikes",
        "Consider deploying 2 additional Cowrie instances in APAC region — SSH interaction rate supports the capacity"
      ],
      "executiveSummary": "All 8 HoneyForge decoys maintained 99.7% aggregate uptime during the 7-day reporting period, capturing 58,472 total attacker interactions. Capture quality remained high at 98.4%, with no event loss recorded despite a brief OpenSearch pipeline latency spike on June 15. One maintenance action is required: HF-SNARE-02 has elevated memory consumption and should be restarted. The Dionaea database honeypot is underperforming relative to other decoys and may require firewall rule adjustments to improve attacker reachability."
    }
  },
  {
    "id": "rpt_010",
    "name": "Analyst Review Queue Report",
    "slug": "analyst-queue",
    "category": "technical",
    "description": "Daily snapshot of the analyst review queue — pending events requiring human triage, escalated incidents, SLA adherence metrics, analyst workload distribution, and false positive feedback stats.",
    "status": "active",
    "schedule": {
      "frequency": "daily",
      "hour": 7,
      "recipients": [
        "soc@corp.com",
        "analyst@honeyforge.io"
      ],
      "format": "pdf",
      "delivery": [
        "email",
        "slack"
      ],
      "slackChannel": "#soc-ops"
    },
    "lastRun": {
      "runId": "run_010a",
      "status": "ready",
      "at": "2026-06-18T07:05:41Z",
      "fileSize": 614400
    },
    "owner": "admin@honeyforge.io",
    "createdAt": "2025-01-10T00:00:00Z",
    "preview": {
      "metrics": [
        {
          "label": "Queue Depth",
          "value": "47",
          "change": "+12",
          "trend": "up",
          "accent": "red"
        },
        {
          "label": "Resolved Today",
          "value": "23",
          "change": "+5",
          "trend": "up",
          "accent": "green"
        },
        {
          "label": "SLA Breaches",
          "value": "3",
          "change": "-1",
          "trend": "down",
          "accent": "yellow"
        },
        {
          "label": "Avg MTTD",
          "value": "2.4h",
          "change": "-18%",
          "trend": "down",
          "accent": "blue"
        },
        {
          "label": "False Positive %",
          "value": "8.3%",
          "change": "-1.2%",
          "trend": "down",
          "accent": "cyan"
        }
      ],
      "trendData": [
        {
          "label": "Jun 12",
          "value": 41
        },
        {
          "label": "Jun 13",
          "value": 38
        },
        {
          "label": "Jun 14",
          "value": 44
        },
        {
          "label": "Jun 15",
          "value": 52
        },
        {
          "label": "Jun 16",
          "value": 49
        },
        {
          "label": "Jun 17",
          "value": 43
        },
        {
          "label": "Jun 18",
          "value": 47
        }
      ],
      "trendLabel": "Review Queue Depth per Day",
      "topAttackTypes": [
        {
          "name": "Awaiting Triage",
          "count": 21,
          "percent": 45
        },
        {
          "name": "In Investigation",
          "count": 14,
          "percent": 30
        },
        {
          "name": "Escalated (P1/P2)",
          "count": 8,
          "percent": 17
        },
        {
          "name": "Pending Closure",
          "count": 4,
          "percent": 8
        }
      ],
      "topCountries": [
        {
          "name": "China",
          "code": "CN",
          "count": 7841,
          "percent": 34
        },
        {
          "name": "Russia",
          "code": "RU",
          "count": 4120,
          "percent": 18
        },
        {
          "name": "United States",
          "code": "US",
          "count": 2341,
          "percent": 10
        },
        {
          "name": "Netherlands",
          "code": "NL",
          "count": 1847,
          "percent": 8
        },
        {
          "name": "Ukraine",
          "code": "UA",
          "count": 1204,
          "percent": 5
        }
      ],
      "criticalFindings": [
        {
          "severity": "high",
          "title": "3 SLA Breaches: Events Older Than 4h Unreviewed",
          "description": "Three events in the queue have exceeded the 4-hour review SLA: rep_evt_8841 (SSH campaign, 6.2h), rep_evt_8892 (malware download, 5.1h), rep_evt_8904 (C2 beacon, 4.4h). Immediate assignment required."
        },
        {
          "severity": "medium",
          "title": "Queue Depth Trend: 3-Day Increase",
          "description": "Queue depth has grown from 38 to 52 over 3 days. Analyst capacity may be insufficient for current alert volume. Consider temporary alert threshold adjustment or additional analyst support."
        },
        {
          "severity": "low",
          "title": "False Positive Rate Declining — Rule Tuning Effective",
          "description": "False positive rate dropped from 9.5% to 8.3% this week following Redis monitoring host whitelist addition. Further reduction expected after RDP provisioning filter is applied (pending review)."
        }
      ],
      "recommendedActions": [
        "Immediately assign 3 SLA-breached events to on-call analyst: rep_evt_8841, rep_evt_8892, rep_evt_8904",
        "Evaluate temporary severity threshold increase (medium → high) to reduce queue volume during backlog clearance",
        "Schedule weekly rule tuning session to continue FP reduction — target <5% FP rate by Q3",
        "Consider automated pre-triage for port scan events using confidence score threshold (>90% → auto-close)",
        "Review analyst workload distribution — 2 analysts have >15 open items vs. team average of 8"
      ],
      "executiveSummary": "The analyst review queue contains 47 pending events as of the report generation time, a 12-event increase from yesterday driven by overnight SSH campaign activity. Three events have breached the 4-hour review SLA and require immediate assignment. Mean Time to Detect improved 18% to 2.4 hours, and the false positive rate declined to 8.3% — both trending in the right direction. Queue depth growth over the past 3 days warrants a staffing assessment or temporary alert threshold adjustment."
    }
  }
]

// ── Legacy compat ──────────────────────────────────────────────
import type { Report } from '@/types/report'
export const MOCK_REPORTS: Report[] = []
