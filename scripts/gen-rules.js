// Generator: creates services/mock/data/rules.ts
const fs = require('fs')
const path = require('path')
const out = path.join(__dirname, '..', 'services', 'mock', 'data', 'rules.ts')

const rules = [
  {
    id: 'r_001', name: 'SSH Brute Force Detection', type: 'sigma', status: 'active', severity: 'high',
    description: 'Detects rapid SSH authentication failures from a single source IP over a short time window. Triggers when failure count exceeds threshold within 60 seconds.',
    content: `title: SSH Brute Force Detection
id: a1b2c3d4-0001
status: stable
description: Detects rapid SSH authentication failures
author: analyst@honeyforge.io
date: 2025/01/10
modified: 2026/03/15
logsource:
  product: honeypot
  service: cowrie
detection:
  selection:
    event_type: auth_failed
    protocol: ssh
  timeframe: 60s
  condition: selection | count(src_ip) by src_ip > 10
level: high
tags:
  - attack.credential_access
  - attack.t1110
  - attack.t1110.001`,
    detectionSources: ['Cowrie'], tags: ['ssh', 'brute-force', 'credential-access'],
    mitreTechniques: ['T1110', 'T1110.001'], mitreTactics: ['Credential Access'],
    confidence: 95, hitCount: 3847, lastHitAt: '2026-06-18T08:23:00Z',
    createdAt: '2025-01-10T00:00:00Z', updatedAt: '2026-03-15T00:00:00Z',
    createdBy: 'admin@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: ['ioc_011', 'ioc_019'],
    falsePositiveNotes: 'May trigger on legitimate admin bulk SSH connections. Whitelist CI/CD jump hosts.',
    tuningNotes: 'Threshold set at 10 failures/60s. Lower to 5 for high-security environments.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-01-10T00:00:00Z', changedBy: 'admin@honeyforge.io', summary: 'Initial rule creation' },
      { version: '1.1', changedAt: '2025-06-01T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Adjusted threshold from 20 to 10 based on baseline analysis' },
      { version: '2.0', changedAt: '2026-03-15T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Added time-window grouping, migrated to Sigma 2.0 format' },
    ],
  },
  {
    id: 'r_002', name: 'SQL Injection via HTTP POST', type: 'suricata', status: 'active', severity: 'critical',
    description: 'Suricata IDS signature detecting SQL injection attempts in HTTP POST body. Matches common UNION SELECT, OR 1=1, and comment sequences used in automated SQLi tools.',
    content: `alert http $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
  msg:"HONEYFORGE SQL Injection in HTTP POST Body";
  flow:established,to_server;
  content:"POST"; http_method;
  pcre:"/(\\'|\\"|%27|%22).*(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|--)/Ui";
  nocase;
  threshold:type limit,track by_src,count 3,seconds 60;
  classtype:web-application-attack;
  sid:9001001; rev:3;
  metadata:
    affected_product Web_Application,
    attack_target Web_Server,
    created_at 2025-01-15,
    severity Critical,
    mitre_technique T1190;
)`,
    detectionSources: ['TANNER', 'SNARE'], tags: ['sqli', 'web', 'injection', 'http'],
    mitreTechniques: ['T1190', 'T1059.004'], mitreTactics: ['Initial Access', 'Execution'],
    confidence: 91, hitCount: 11240, lastHitAt: '2026-06-18T07:55:00Z',
    createdAt: '2025-01-15T00:00:00Z', updatedAt: '2026-05-20T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: ['ioc_003', 'ioc_007'],
    falsePositiveNotes: 'Low false positive rate. Confirmed via canary token logs.',
    tuningNotes: 'Threshold of 3 requests/60s prevents noise from automated scanners.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-01-15T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial Suricata signature' },
      { version: '2.0', changedAt: '2025-09-10T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Added PCRE pattern for percent-encoded payloads' },
      { version: '3.0', changedAt: '2026-05-20T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Updated PCRE to catch more evasion techniques' },
    ],
  },
  {
    id: 'r_003', name: 'PHP Web Shell Upload Detection', type: 'yara', status: 'active', severity: 'critical',
    description: 'YARA rule identifying PHP web shell patterns in uploaded files. Matches common web shell strings and PHP execution functions used in post-exploitation payloads.',
    content: `rule HoneyForge_PHP_WebShell_Upload {
  meta:
    description = "Detects PHP web shell patterns in uploaded files"
    author = "analyst@honeyforge.io"
    date = "2025-02-01"
    severity = "critical"
    mitre_technique = "T1505.003"
    reference = "OWASP Top 10 A05"
  strings:
    $php_open  = "<?php" nocase
    $func_exec = "system(" nocase
    $func_pass = "passthru(" nocase
    $func_eval = "eval(base64_decode(" nocase
    $func_shell = "shell_exec(" nocase
    $func_popen = "popen(" nocase
    $get_param = "$_GET[" nocase
    $post_param = "$_POST[" nocase
    $req_param  = "$_REQUEST[" nocase
  condition:
    $php_open and 2 of ($func_*) and 1 of ($get_param, $post_param, $req_param)
}`,
    detectionSources: ['SNARE', 'TANNER'], tags: ['webshell', 'php', 'upload', 'persistence'],
    mitreTechniques: ['T1505.003', 'T1190'], mitreTactics: ['Persistence', 'Initial Access'],
    confidence: 97, hitCount: 284, lastHitAt: '2026-06-17T14:30:00Z',
    createdAt: '2025-02-01T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: ['ioc_015'],
    falsePositiveNotes: 'Very low FP rate. Rule requires PHP open tag + 2 exec functions + input parameter.',
    tuningNotes: 'Consider adding more web shell family strings from threat intel feeds.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-02-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial YARA rule for PHP web shells' },
      { version: '1.1', changedAt: '2026-01-10T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Added popen() and additional exec function variants' },
    ],
  },
  {
    id: 'r_004', name: 'Directory Traversal Attack', type: 'sigma', status: 'active', severity: 'high',
    description: 'Detects HTTP requests containing path traversal sequences targeting system files. Covers encoded variants including URL-encoding and double-encoding.',
    content: `title: Directory Traversal Attack Detection
id: a1b2c3d4-0004
status: stable
description: Detects HTTP directory traversal patterns
author: jsmith@honeyforge.io
date: 2025-02-15
logsource:
  product: honeypot
  service: tanner
  category: webserver
detection:
  selection_raw:
    http.uri|contains:
      - '../'
      - '..\\'
  selection_encoded:
    http.uri|contains:
      - '%2e%2e%2f'
      - '%2e%2e/'
      - '..%2f'
      - '%252e%252e'
  selection_targets:
    http.uri|contains:
      - '/etc/passwd'
      - '/etc/shadow'
      - 'win.ini'
      - 'boot.ini'
  condition: (selection_raw or selection_encoded) and selection_targets
level: high
tags:
  - attack.discovery
  - attack.t1083`,
    detectionSources: ['TANNER', 'SNARE'], tags: ['traversal', 'lfi', 'web', 'recon'],
    mitreTechniques: ['T1083', 'T1190'], mitreTactics: ['Discovery', 'Initial Access'],
    confidence: 92, hitCount: 1847, lastHitAt: '2026-06-18T06:10:00Z',
    createdAt: '2025-02-15T00:00:00Z', updatedAt: '2026-02-10T00:00:00Z',
    createdBy: 'jsmith@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'Some legitimate file management tools may use relative paths. Review HTTP host header.',
    tuningNotes: null,
    versionHistory: [
      { version: '1.0', changedAt: '2025-02-15T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Initial rule creation' },
      { version: '1.1', changedAt: '2026-02-10T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Added double-encoding variants and target file list' },
    ],
  },
  {
    id: 'r_005', name: 'Port Scan Detection (Masscan/Nmap)', type: 'sigma', status: 'active', severity: 'low',
    description: 'Identifies automated port scanning activity by detecting rapid connection attempts to multiple ports from a single source within a short time window.',
    content: `title: Rapid Port Scan Detection
id: a1b2c3d4-0005
status: stable
description: Detects masscan/nmap style port scans
author: analyst@honeyforge.io
date: 2025-03-01
logsource:
  product: honeypot
  service: suricata
detection:
  selection:
    event_type: alert
    alert.category: 'Attempted Information Leak'
  timeframe: 5s
  condition: selection | count(dest_port) by src_ip > 50
level: low
tags:
  - attack.reconnaissance
  - attack.t1595
  - attack.t1046`,
    detectionSources: ['Suricata'], tags: ['recon', 'port-scan', 'masscan', 'nmap'],
    mitreTechniques: ['T1595', 'T1046'], mitreTactics: ['Reconnaissance', 'Discovery'],
    confidence: 78, hitCount: 5120, lastHitAt: '2026-06-18T07:00:00Z',
    createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-03-01T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'Vulnerability scanners in internal network may trigger. Whitelist approved scanner IPs.',
    tuningNotes: 'Threshold of 50 distinct ports in 5s was validated against baseline traffic. Shodan uses ~1000 pps.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-03-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial rule creation' },
    ],
  },
  {
    id: 'r_006', name: 'SSH Post-Login System Commands', type: 'sigma', status: 'active', severity: 'critical',
    description: 'Detects common system enumeration and persistence commands executed after a successful SSH login on a honeypot. Indicates hands-on keyboard attacker activity.',
    content: `title: SSH Post-Login System Enumeration Commands
id: a1b2c3d4-0006
status: stable
description: Detects attacker commands after SSH honeypot login
author: mlee@honeyforge.io
date: 2025-03-15
logsource:
  product: honeypot
  service: cowrie
detection:
  selection_login:
    event_type: login_success
  selection_commands:
    command|contains:
      - 'cat /etc/passwd'
      - 'uname -a'
      - 'whoami'
      - 'id'
      - 'ps aux'
      - 'netstat'
      - 'ifconfig'
      - 'ip addr'
      - 'crontab'
      - 'wget http'
      - 'curl http'
  condition: selection_login | near selection_commands within 120s
level: critical
tags:
  - attack.execution
  - attack.discovery
  - attack.t1059.004`,
    detectionSources: ['Cowrie'], tags: ['ssh', 'post-exploitation', 'enumeration', 'cowrie'],
    mitreTechniques: ['T1059.004', 'T1082', 'T1057', 'T1033'], mitreTactics: ['Execution', 'Discovery'],
    confidence: 99, hitCount: 892, lastHitAt: '2026-06-18T05:47:00Z',
    createdAt: '2025-03-15T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: ['ioc_002', 'ioc_009'],
    falsePositiveNotes: 'Zero expected false positives — all SSH logins on honeypot are unauthorized by design.',
    tuningNotes: 'Commands list is non-exhaustive. Cowrie captures all commands for manual review.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-03-15T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial rule' },
      { version: '1.1', changedAt: '2026-04-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Extended command list, added wget/curl download detection' },
    ],
  },
  {
    id: 'r_007', name: 'DNS Tunneling Detection', type: 'suricata', status: 'active', severity: 'high',
    description: 'Suricata signature detecting DNS-based exfiltration tunneling by monitoring query frequency, subdomain entropy, and TXT record abuse patterns.',
    content: `alert dns $HOME_NET any -> any 53 (
  msg:"HONEYFORGE Possible DNS Tunneling - High Query Frequency";
  flow:to_server;
  dns.query;
  content:!".google.com"; dns.query;
  content:!".microsoft.com"; dns.query;
  threshold:type both,track by_src,count 50,seconds 60;
  classtype:policy-violation;
  sid:9001007; rev:2;
  metadata:
    mitre_technique T1048.003,
    created_at 2025-04-01,
    severity High;
)

alert dns $HOME_NET any -> any 53 (
  msg:"HONEYFORGE DNS TXT Record Exfiltration Pattern";
  flow:to_server;
  dns.query.type:TXT;
  pcre:"/^[a-zA-Z0-9+/=]{40,}/";
  classtype:policy-violation;
  sid:9001008; rev:1;
)`,
    detectionSources: ['Suricata', 'TANNER'], tags: ['dns', 'exfiltration', 'tunneling', 'c2'],
    mitreTechniques: ['T1048.003', 'T1041', 'T1071.004'], mitreTactics: ['Exfiltration', 'Command and Control'],
    confidence: 85, hitCount: 134, lastHitAt: '2026-06-17T21:30:00Z',
    createdAt: '2025-04-01T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z',
    createdBy: 'jsmith@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: ['ioc_021'],
    falsePositiveNotes: 'CDN traffic and legitimate update services may generate high DNS rates. Tune whitelist.',
    tuningNotes: 'TXT record pattern requires base64-like string of 40+ chars. Adjust length threshold based on environment.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-04-01T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Initial DNS tunneling rule' },
      { version: '2.0', changedAt: '2026-01-20T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Added TXT record exfil pattern, adjusted thresholds' },
    ],
  },
  {
    id: 'r_008', name: 'Cross-Site Scripting (XSS) Patterns', type: 'yara', status: 'active', severity: 'high',
    description: 'YARA rule detecting common XSS injection patterns in HTTP request parameters. Covers reflected, stored, and DOM-based XSS variants including base64-encoded payloads.',
    content: `rule HoneyForge_XSS_Patterns {
  meta:
    description = "Detects cross-site scripting attack patterns"
    author = "mlee@honeyforge.io"
    date = "2025-04-15"
    severity = "high"
    mitre_technique = "T1190"
  strings:
    $script_tag     = "<script" nocase
    $script_close   = "</script>" nocase
    $on_event       = /on(load|click|error|mouseover|focus|blur|change|submit)=/i
    $iframe         = "<iframe" nocase
    $img_onerror    = "onerror=" nocase
    $javascript_uri = "javascript:" nocase
    $svg_tag        = "<svg" nocase
    $base64_eval    = /eval\s*\(\s*atob\s*\(/ nocase
    $doc_write      = "document.write(" nocase
    $inner_html     = ".innerHTML" nocase
  condition:
    2 of them
}`,
    detectionSources: ['TANNER', 'SNARE'], tags: ['xss', 'web', 'injection'],
    mitreTechniques: ['T1190', 'T1059.007'], mitreTactics: ['Initial Access'],
    confidence: 88, hitCount: 3291, lastHitAt: '2026-06-18T07:42:00Z',
    createdAt: '2025-04-15T00:00:00Z', updatedAt: '2025-11-01T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'Web application testing tools and WAF bypass tests may trigger. Review source context.',
    tuningNotes: 'Threshold of 2 matches reduces false positives from legitimate JS-heavy pages.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-04-15T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial XSS detection rule' },
      { version: '1.1', changedAt: '2025-11-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Added base64 eval and innerHTML patterns' },
    ],
  },
  {
    id: 'r_009', name: 'Redis Unauthenticated Access Attempt', type: 'sigma', status: 'needs-review', severity: 'high',
    description: 'Detects unauthenticated access attempts to Redis instances including SLAVEOF and CONFIG SET commands used for SSH key persistence. Needs tuning for internal Redis traffic.',
    content: `title: Redis Unauthenticated Access and Persistence Attempt
id: a1b2c3d4-0009
status: experimental
description: Detects Redis commands used for unauthorized access and persistence
author: analyst@honeyforge.io
date: 2025-05-01
logsource:
  product: honeypot
  service: dionaea
detection:
  selection_commands:
    command|contains:
      - 'SLAVEOF'
      - 'CONFIG SET dir'
      - 'CONFIG SET dbfilename'
      - 'FLUSHALL'
      - 'FLUSHDB'
  condition: selection_commands
level: high
tags:
  - attack.persistence
  - attack.t1505`,
    detectionSources: ['Dionaea'], tags: ['redis', 'database', 'persistence', 'lateral-movement'],
    mitreTechniques: ['T1505', 'T1563'], mitreTactics: ['Persistence'],
    confidence: 82, hitCount: 47, lastHitAt: '2026-06-15T09:00:00Z',
    createdAt: '2025-05-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: ['ioc_018'],
    falsePositiveNotes: 'Internal Redis replication (SLAVEOF) from legitimate replicas needs to be whitelisted. Currently generating FPs.',
    tuningNotes: 'NEEDS REVIEW: Add source IP whitelist for known Redis replica hosts before enabling in production.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-05-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial rule, marked experimental' },
      { version: '1.1', changedAt: '2026-06-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Flagged for review — FP from internal Redis cluster' },
    ],
  },
  {
    id: 'r_010', name: 'SSRF to AWS Instance Metadata', type: 'opensearch', status: 'active', severity: 'critical',
    description: 'OpenSearch query detecting SSRF requests targeting AWS EC2 Instance Metadata Service (IMDS) endpoint. Critical as successful SSRF can expose IAM credentials.',
    content: `{
  "query": {
    "bool": {
      "must": [
        { "term": { "event.category": "network" } },
        { "term": { "event.type": "http_request" } }
      ],
      "should": [
        { "match_phrase": { "url.query": "169.254.169.254" } },
        { "match_phrase": { "http.request.body.content": "169.254.169.254" } },
        { "match_phrase": { "url.path": "169.254.169.254" } }
      ],
      "minimum_should_match": 1,
      "filter": [
        { "range": { "@timestamp": { "gte": "now-5m" } } }
      ]
    }
  },
  "aggs": {
    "by_source_ip": {
      "terms": { "field": "source.ip", "size": 20, "order": { "_count": "desc" } }
    },
    "by_request_path": {
      "terms": { "field": "url.path", "size": 10 }
    }
  },
  "size": 100,
  "_source": ["@timestamp", "source.ip", "url.full", "http.request.method", "event.outcome"]
}`,
    detectionSources: ['TANNER'], tags: ['ssrf', 'aws', 'cloud', 'credential-access'],
    mitreTechniques: ['T1552.005', 'T1190'], mitreTactics: ['Credential Access', 'Initial Access'],
    confidence: 96, hitCount: 221, lastHitAt: '2026-06-18T04:15:00Z',
    createdAt: '2025-05-15T00:00:00Z', updatedAt: '2026-02-20T00:00:00Z',
    createdBy: 'jsmith@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: ['ioc_006'],
    falsePositiveNotes: 'Negligible FP rate. The IMDS address is only used by AWS instances requesting their own metadata.',
    tuningNotes: 'Consider adding GCP metadata endpoint (metadata.google.internal) and Azure IMDS (169.254.169.254/metadata) variants.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-05-15T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Initial OpenSearch query for AWS SSRF detection' },
      { version: '1.1', changedAt: '2026-02-20T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Added request body scan and aggregation pipeline' },
    ],
  },
  {
    id: 'r_011', name: 'Cobalt Strike HTTP Beacon Traffic', type: 'suricata', status: 'active', severity: 'critical',
    description: 'Detects Cobalt Strike HTTP beacon communication patterns based on default malleable C2 profile indicators including JARM fingerprinting and characteristic URI patterns.',
    content: `alert http $HOME_NET any -> $EXTERNAL_NET any (
  msg:"HONEYFORGE Possible Cobalt Strike HTTP Beacon";
  flow:established,to_server;
  content:"GET"; http_method;
  content:"/jquery-3.3.1.min.js"; http_uri;
  content:"__utma="; http_cookie;
  classtype:trojan-activity;
  sid:9001011; rev:2;
  metadata:
    mitre_technique T1071.001,
    mitre_technique T1573,
    created_at 2025-06-01,
    severity Critical;
)

alert tls $HOME_NET any -> $EXTERNAL_NET any (
  msg:"HONEYFORGE Cobalt Strike JARM Fingerprint";
  flow:to_server;
  tls.fingerprint;
  content:"07d14d16d21d21d07c42d41d00041d24a458a375eef0c576d23a7bab9a9fb1b";
  classtype:trojan-activity;
  sid:9001012; rev:1;
)`,
    detectionSources: ['Suricata', 'TANNER'], tags: ['cobalt-strike', 'c2', 'beacon', 'malware'],
    mitreTechniques: ['T1071.001', 'T1573', 'T1105'], mitreTactics: ['Command and Control'],
    confidence: 88, hitCount: 43, lastHitAt: '2026-06-16T23:10:00Z',
    createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: ['ioc_012', 'ioc_013'],
    falsePositiveNotes: 'Default profile indicators only — sophisticated red teams use custom profiles. Update signatures regularly.',
    tuningNotes: 'JARM fingerprint matches default CS 4.x profile. Operators using custom malleable C2 will evade this.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-06-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial Cobalt Strike detection' },
      { version: '2.0', changedAt: '2026-03-10T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Added JARM fingerprint rule' },
    ],
  },
  {
    id: 'r_012', name: 'FTP Anonymous Login Attempt', type: 'sigma', status: 'draft', severity: 'low',
    description: 'Detects FTP anonymous login attempts on the FTP honeypot. Low severity but useful for tracking reconnaissance activity and building attacker attribution profiles.',
    content: `title: FTP Anonymous Login Attempt
id: a1b2c3d4-0012
status: experimental
description: Detects FTP anonymous credential attempts on Dionaea honeypot
author: analyst@honeyforge.io
date: 2026-05-01
logsource:
  product: honeypot
  service: dionaea
detection:
  selection:
    event_type: ftp_login
    username:
      - 'anonymous'
      - 'ftp'
      - 'anon'
      - ''
  condition: selection
level: low
tags:
  - attack.reconnaissance
  - attack.t1133`,
    detectionSources: ['Dionaea'], tags: ['ftp', 'anonymous', 'recon'],
    mitreTechniques: ['T1133', 'T1595'], mitreTactics: ['Reconnaissance'],
    confidence: 70, hitCount: 0, lastHitAt: undefined,
    createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: null,
    tuningNotes: 'Draft — needs testing on Dionaea sandbox before deployment.',
    versionHistory: [
      { version: '1.0', changedAt: '2026-05-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial draft rule' },
    ],
  },
  {
    id: 'r_013', name: 'WordPress Login Brute Force', type: 'sigma', status: 'active', severity: 'medium',
    description: 'Detects brute force attempts against WordPress wp-login.php endpoint. Correlates failed login attempts by source IP using WPScan user-agent detection.',
    content: `title: WordPress Login Brute Force Attempt
id: a1b2c3d4-0013
status: stable
description: Detects WordPress wp-login brute force attacks
author: analyst@honeyforge.io
date: 2025-07-01
logsource:
  product: honeypot
  service: snare
  category: webserver
detection:
  selection_endpoint:
    http.uri|contains: '/wp-login.php'
    http.method: POST
  selection_agents:
    http.user_agent|contains:
      - 'WPScan'
      - 'DirBuster'
      - 'sqlmap'
      - 'Nikto'
  filter_success:
    http.status: 200
    http.response_body|contains: 'Dashboard'
  condition: selection_endpoint and not filter_success
  timeframe: 300s
  aggregate: count() by src_ip > 5
level: medium
tags:
  - attack.credential_access
  - attack.t1110`,
    detectionSources: ['SNARE'], tags: ['wordpress', 'brute-force', 'web', 'cms'],
    mitreTechniques: ['T1110', 'T1110.001'], mitreTactics: ['Credential Access'],
    confidence: 87, hitCount: 2841, lastHitAt: '2026-06-18T06:30:00Z',
    createdAt: '2025-07-01T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'Legitimate admin bulk operations may trigger. Success filter should prevent most FPs.',
    tuningNotes: null,
    versionHistory: [
      { version: '1.0', changedAt: '2025-07-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial rule' },
      { version: '1.1', changedAt: '2026-01-15T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Added success response filter to reduce FPs' },
    ],
  },
  {
    id: 'r_014', name: 'GraphQL Schema Enumeration', type: 'opensearch', status: 'active', severity: 'medium',
    description: 'OpenSearch query identifying GraphQL introspection queries used for API reconnaissance. Detects automated schema extraction attempts that reveal available types and fields.',
    content: `{
  "query": {
    "bool": {
      "must": [
        { "term": { "event.category": "network" } },
        { "term": { "http.request.method": "POST" } },
        { "wildcard": { "url.path": "*graphql*" } }
      ],
      "should": [
        { "match_phrase": { "http.request.body.content": "__schema" } },
        { "match_phrase": { "http.request.body.content": "__type" } },
        { "match_phrase": { "http.request.body.content": "introspectionQuery" } }
      ],
      "minimum_should_match": 1,
      "filter": [
        { "range": { "@timestamp": { "gte": "now-15m" } } }
      ]
    }
  },
  "aggs": {
    "by_source": {
      "terms": { "field": "source.ip", "size": 10 }
    },
    "over_time": {
      "date_histogram": { "field": "@timestamp", "calendar_interval": "1m" }
    }
  }
}`,
    detectionSources: ['TANNER'], tags: ['graphql', 'api', 'recon', 'enumeration'],
    mitreTechniques: ['T1590', 'T1595'], mitreTactics: ['Reconnaissance'],
    confidence: 75, hitCount: 381, lastHitAt: '2026-06-17T16:45:00Z',
    createdAt: '2025-08-01T00:00:00Z', updatedAt: '2025-08-01T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'GraphQL IDEs like Altair and GraphiQL send introspection queries for schema completion. Whitelist dev tool IPs.',
    tuningNotes: null,
    versionHistory: [
      { version: '1.0', changedAt: '2025-08-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial GraphQL introspection detection' },
    ],
  },
  {
    id: 'r_015', name: 'PHP Wrapper LFI via Stream Filter', type: 'sigma', status: 'active', severity: 'high',
    description: 'Detects Local File Inclusion via PHP stream wrappers including php://filter, php://input, and data:// URIs. These bypass simple path traversal filters.',
    content: `title: PHP Stream Wrapper LFI Attempt
id: a1b2c3d4-0015
status: stable
description: Detects PHP wrapper-based LFI attacks
author: mlee@honeyforge.io
date: 2025-09-01
logsource:
  product: honeypot
  service: tanner
detection:
  selection:
    http.uri|contains:
      - 'php://filter'
      - 'php://input'
      - 'php://fd'
      - 'data://text'
      - 'expect://'
      - 'zip://'
  condition: selection
level: high
tags:
  - attack.discovery
  - attack.t1083`,
    detectionSources: ['TANNER', 'SNARE'], tags: ['lfi', 'php', 'wrapper', 'web'],
    mitreTechniques: ['T1083', 'T1190'], mitreTactics: ['Discovery', 'Initial Access'],
    confidence: 93, hitCount: 718, lastHitAt: '2026-06-17T23:00:00Z',
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2025-09-01T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'PHP applications using file streaming internally may match. Very rare in honeypot context.',
    tuningNotes: null,
    versionHistory: [
      { version: '1.0', changedAt: '2025-09-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial rule' },
    ],
  },
  {
    id: 'r_016', name: 'OS Command Injection Detection', type: 'suricata', status: 'active', severity: 'critical',
    description: 'Detects OS command injection attempts in HTTP parameters including shell metacharacters and command separators used to execute system commands via web forms.',
    content: `alert http $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
  msg:"HONEYFORGE OS Command Injection Attempt";
  flow:established,to_server;
  content:"POST"; http_method;
  pcre:"/[;&|` + "`" + `]\\s*(id|whoami|uname|cat\\s+\\/etc|ls\\s+-[la]|wget|curl|bash|sh|python|perl|nc\\s+-)/i";
  http_client_body;
  classtype:web-application-attack;
  sid:9001016; rev:2;
  metadata:
    mitre_technique T1059,
    mitre_technique T1190,
    severity Critical;
)`,
    detectionSources: ['TANNER', 'SNARE'], tags: ['command-injection', 'rce', 'web', 'execution'],
    mitreTechniques: ['T1059', 'T1190', 'T1059.004'], mitreTactics: ['Execution', 'Initial Access'],
    confidence: 90, hitCount: 1034, lastHitAt: '2026-06-18T08:00:00Z',
    createdAt: '2025-09-15T00:00:00Z', updatedAt: '2026-01-05T00:00:00Z',
    createdBy: 'jsmith@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'Shell metacharacters in form data may be legitimate. Review HTTP body context before escalation.',
    tuningNotes: 'PCRE covers common injection patterns. Add language-specific interpreters (python3, php, ruby) as needed.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-09-15T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Initial rule' },
      { version: '2.0', changedAt: '2026-01-05T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Extended PCRE, added curl and wget variants' },
    ],
  },
  {
    id: 'r_017', name: 'MySQL Auth Bypass Pattern', type: 'sigma', status: 'disabled', severity: 'high',
    description: 'Detects MySQL authentication bypass attempts on the database honeypot. Disabled due to high false positive rate from internal monitoring tools — pending re-tuning.',
    content: `title: MySQL Authentication Bypass Attempt
id: a1b2c3d4-0017
status: deprecated
description: Detects MySQL auth bypass on Dionaea honeypot (DISABLED - high FP rate)
author: analyst@honeyforge.io
date: 2025-04-01
logsource:
  product: honeypot
  service: dionaea
detection:
  selection:
    event_type: mysql_login
    password:
      - ''
      - 'root'
      - 'mysql'
      - 'password'
  condition: selection
level: high`,
    detectionSources: ['Dionaea'], tags: ['mysql', 'database', 'auth-bypass'],
    mitreTechniques: ['T1190', 'T1078.001'], mitreTactics: ['Initial Access'],
    confidence: 60, hitCount: 892, lastHitAt: '2026-05-01T00:00:00Z',
    createdAt: '2025-04-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z',
    createdBy: 'analyst@honeyforge.io', owner: 'analyst@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'DISABLED: Internal monitoring service uses empty MySQL password — generating 80% FP rate. Needs source IP filter.',
    tuningNotes: 'Re-enable after adding source IP exclusion for monitoring hosts (10.0.0.0/24).',
    versionHistory: [
      { version: '1.0', changedAt: '2025-04-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Initial rule' },
      { version: '1.1', changedAt: '2026-05-01T00:00:00Z', changedBy: 'analyst@honeyforge.io', summary: 'Disabled due to high FP from internal monitoring tool' },
    ],
  },
  {
    id: 'r_018', name: 'Cryptominer Download via SSH', type: 'yara', status: 'active', severity: 'critical',
    description: 'YARA rule matching cryptomining malware filenames and mining pool connection strings commonly downloaded to honeypots post-SSH compromise.',
    content: `rule HoneyForge_Cryptominer_Payload {
  meta:
    description = "Detects cryptominer downloads and config patterns"
    author = "mlee@honeyforge.io"
    date = "2025-10-01"
    severity = "critical"
    mitre_technique = "T1496"
  strings:
    $miner_xmr   = "xmrig" nocase
    $miner_strm  = "stratum+" nocase
    $pool_port   = ":4444" nocase
    $pool_port2  = ":3333" nocase
    $pool_kinsing = "kinsing" nocase
    $pool_minerd = "minerd" nocase
    $cpu_usage   = "--cpu-priority" nocase
    $wallet_xmr  = /[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}/
  condition:
    2 of ($miner_*, $pool_*, $cpu_usage) or $wallet_xmr
}`,
    detectionSources: ['Cowrie'], tags: ['cryptominer', 'xmrig', 'impact', 'malware'],
    mitreTechniques: ['T1496', 'T1105'], mitreTactics: ['Impact', 'Command and Control'],
    confidence: 94, hitCount: 156, lastHitAt: '2026-06-17T19:20:00Z',
    createdAt: '2025-10-01T00:00:00Z', updatedAt: '2025-10-01T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: ['ioc_004'],
    falsePositiveNotes: 'Mining pool port numbers could appear in legitimate content. Wallet regex is highly specific.',
    tuningNotes: null,
    versionHistory: [
      { version: '1.0', changedAt: '2025-10-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial cryptominer detection rule' },
    ],
  },
  {
    id: 'r_019', name: 'RDP Credential Spray Detection', type: 'sigma', status: 'needs-review', severity: 'high',
    description: 'Detects RDP credential spraying via NLA authentication failures. Rule needs review as current threshold triggers on legitimate admin batch operations.',
    content: `title: RDP Credential Spray Detection
id: a1b2c3d4-0019
status: experimental
description: Detects RDP password spray via NLA failures
author: jsmith@honeyforge.io
date: 2025-11-01
logsource:
  product: honeypot
  service: snare
detection:
  selection:
    event_type: rdp_auth_failed
    protocol: rdp
  timeframe: 300s
  condition: selection | count(username) by src_ip > 20
level: high
tags:
  - attack.credential_access
  - attack.t1110.003`,
    detectionSources: ['SNARE'], tags: ['rdp', 'credential-spray', 'brute-force', 'windows'],
    mitreTechniques: ['T1110.003', 'T1021.001'], mitreTactics: ['Credential Access', 'Lateral Movement'],
    confidence: 79, hitCount: 312, lastHitAt: '2026-06-14T11:00:00Z',
    createdAt: '2025-11-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
    createdBy: 'jsmith@honeyforge.io', owner: 'jsmith@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'NEEDS REVIEW: IT batch provisioning scripts trigger this during domain join. Need to exclude provisioning subnet.',
    tuningNotes: 'Increase threshold to 30 or add time-of-day filter to exclude business hours provisioning.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-11-01T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Initial rule' },
      { version: '1.1', changedAt: '2026-06-01T00:00:00Z', changedBy: 'jsmith@honeyforge.io', summary: 'Marked needs-review: FP from IT provisioning' },
    ],
  },
  {
    id: 'r_020', name: 'HTTP Request Flood Rate Anomaly', type: 'siem', status: 'active', severity: 'medium',
    description: 'SIEM query correlating HTTP request rate anomalies from single sources. Detects HTTP flood reconnaissance and DDoS probe patterns exceeding baseline thresholds.',
    content: `// SIEM Rule — KQL-based Correlation
// Platform: Elastic SIEM / OpenSearch Security

// Primary query
event.category: "network" AND
event.type: "http_request" AND
NOT source.ip: (10.0.0.0/8 OR 172.16.0.0/12 OR 192.168.0.0/16) AND
event.outcome: * AND
@timestamp >= now-5m

// Aggregation threshold (via rule configuration)
// GROUP BY: source.ip
// THRESHOLD: count(*) > 500 in 5 minutes
// ALERT: when group exceeds threshold

// Additional context fields to include in alert:
// - source.geo.country_name
// - destination.port
// - http.request.method (HEAD/GET anomaly ratio)
// - url.path (top paths accessed)
// - network.bytes (bandwidth spike indicator)`,
    detectionSources: ['Suricata', 'SNARE'], tags: ['http-flood', 'dos', 'rate-limiting', 'recon'],
    mitreTechniques: ['T1595', 'T1498'], mitreTactics: ['Reconnaissance', 'Impact'],
    confidence: 72, hitCount: 4891, lastHitAt: '2026-06-18T08:10:00Z',
    createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-04-15T00:00:00Z',
    createdBy: 'mlee@honeyforge.io', owner: 'mlee@honeyforge.io',
    relatedIOCIds: [],
    falsePositiveNotes: 'CDN health checks and crawlers may trigger. User-agent filtering recommended for known good bots.',
    tuningNotes: 'Threshold of 500 req/5min validated against Shodan scanner traffic. Adjust based on decoy capacity.',
    versionHistory: [
      { version: '1.0', changedAt: '2025-12-01T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Initial SIEM correlation rule' },
      { version: '1.1', changedAt: '2026-04-15T00:00:00Z', changedBy: 'mlee@honeyforge.io', summary: 'Added network bytes field, HEAD/GET ratio analysis' },
    ],
  },
]

// Strip null values so optional fields are omitted (TypeScript: string | undefined, not null)
const tsContent = `import type { DetectionRule } from '@/types/rule'

export const MOCK_RULES: DetectionRule[] = ${JSON.stringify(rules, (_k, v) => v === null ? undefined : v, 2)}
`

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, tsContent, 'utf8')
console.log('Written:', out, fs.statSync(out).size, 'bytes')
