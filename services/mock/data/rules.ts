import type { DetectionRule } from '@/types/rule'

export const MOCK_RULES: DetectionRule[] = [
  {
    "id": "r_001",
    "name": "SSH Brute Force Detection",
    "type": "sigma",
    "status": "active",
    "severity": "high",
    "description": "Detects rapid SSH authentication failures from a single source IP over a short time window. Triggers when failure count exceeds threshold within 60 seconds.",
    "content": "title: SSH Brute Force Detection\nid: a1b2c3d4-0001\nstatus: stable\ndescription: Detects rapid SSH authentication failures\nauthor: analyst@honeyforge.io\ndate: 2025/01/10\nmodified: 2026/03/15\nlogsource:\n  product: honeypot\n  service: cowrie\ndetection:\n  selection:\n    event_type: auth_failed\n    protocol: ssh\n  timeframe: 60s\n  condition: selection | count(src_ip) by src_ip > 10\nlevel: high\ntags:\n  - attack.credential_access\n  - attack.t1110\n  - attack.t1110.001",
    "detectionSources": [
      "Cowrie"
    ],
    "tags": [
      "ssh",
      "brute-force",
      "credential-access"
    ],
    "mitreTechniques": [
      "T1110",
      "T1110.001"
    ],
    "mitreTactics": [
      "Credential Access"
    ],
    "confidence": 95,
    "hitCount": 3847,
    "lastHitAt": "2026-06-18T08:23:00Z",
    "createdAt": "2025-01-10T00:00:00Z",
    "updatedAt": "2026-03-15T00:00:00Z",
    "createdBy": "admin@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [
      "ioc_011",
      "ioc_019"
    ],
    "falsePositiveNotes": "May trigger on legitimate admin bulk SSH connections. Whitelist CI/CD jump hosts.",
    "tuningNotes": "Threshold set at 10 failures/60s. Lower to 5 for high-security environments.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-01-10T00:00:00Z",
        "changedBy": "admin@honeyforge.io",
        "summary": "Initial rule creation"
      },
      {
        "version": "1.1",
        "changedAt": "2025-06-01T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Adjusted threshold from 20 to 10 based on baseline analysis"
      },
      {
        "version": "2.0",
        "changedAt": "2026-03-15T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Added time-window grouping, migrated to Sigma 2.0 format"
      }
    ]
  },
  {
    "id": "r_002",
    "name": "SQL Injection via HTTP POST",
    "type": "suricata",
    "status": "active",
    "severity": "critical",
    "description": "Suricata IDS signature detecting SQL injection attempts in HTTP POST body. Matches common UNION SELECT, OR 1=1, and comment sequences used in automated SQLi tools.",
    "content": "alert http $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (\n  msg:\"HONEYFORGE SQL Injection in HTTP POST Body\";\n  flow:established,to_server;\n  content:\"POST\"; http_method;\n  pcre:\"/(\\'|\\\"|%27|%22).*(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|--)/Ui\";\n  nocase;\n  threshold:type limit,track by_src,count 3,seconds 60;\n  classtype:web-application-attack;\n  sid:9001001; rev:3;\n  metadata:\n    affected_product Web_Application,\n    attack_target Web_Server,\n    created_at 2025-01-15,\n    severity Critical,\n    mitre_technique T1190;\n)",
    "detectionSources": [
      "TANNER",
      "SNARE"
    ],
    "tags": [
      "sqli",
      "web",
      "injection",
      "http"
    ],
    "mitreTechniques": [
      "T1190",
      "T1059.004"
    ],
    "mitreTactics": [
      "Initial Access",
      "Execution"
    ],
    "confidence": 91,
    "hitCount": 11240,
    "lastHitAt": "2026-06-18T07:55:00Z",
    "createdAt": "2025-01-15T00:00:00Z",
    "updatedAt": "2026-05-20T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [
      "ioc_003",
      "ioc_007"
    ],
    "falsePositiveNotes": "Low false positive rate. Confirmed via canary token logs.",
    "tuningNotes": "Threshold of 3 requests/60s prevents noise from automated scanners.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-01-15T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial Suricata signature"
      },
      {
        "version": "2.0",
        "changedAt": "2025-09-10T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Added PCRE pattern for percent-encoded payloads"
      },
      {
        "version": "3.0",
        "changedAt": "2026-05-20T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Updated PCRE to catch more evasion techniques"
      }
    ]
  },
  {
    "id": "r_003",
    "name": "PHP Web Shell Upload Detection",
    "type": "yara",
    "status": "active",
    "severity": "critical",
    "description": "YARA rule identifying PHP web shell patterns in uploaded files. Matches common web shell strings and PHP execution functions used in post-exploitation payloads.",
    "content": "rule HoneyForge_PHP_WebShell_Upload {\n  meta:\n    description = \"Detects PHP web shell patterns in uploaded files\"\n    author = \"analyst@honeyforge.io\"\n    date = \"2025-02-01\"\n    severity = \"critical\"\n    mitre_technique = \"T1505.003\"\n    reference = \"OWASP Top 10 A05\"\n  strings:\n    $php_open  = \"<?php\" nocase\n    $func_exec = \"system(\" nocase\n    $func_pass = \"passthru(\" nocase\n    $func_eval = \"eval(base64_decode(\" nocase\n    $func_shell = \"shell_exec(\" nocase\n    $func_popen = \"popen(\" nocase\n    $get_param = \"$_GET[\" nocase\n    $post_param = \"$_POST[\" nocase\n    $req_param  = \"$_REQUEST[\" nocase\n  condition:\n    $php_open and 2 of ($func_*) and 1 of ($get_param, $post_param, $req_param)\n}",
    "detectionSources": [
      "SNARE",
      "TANNER"
    ],
    "tags": [
      "webshell",
      "php",
      "upload",
      "persistence"
    ],
    "mitreTechniques": [
      "T1505.003",
      "T1190"
    ],
    "mitreTactics": [
      "Persistence",
      "Initial Access"
    ],
    "confidence": 97,
    "hitCount": 284,
    "lastHitAt": "2026-06-17T14:30:00Z",
    "createdAt": "2025-02-01T00:00:00Z",
    "updatedAt": "2026-01-10T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [
      "ioc_015"
    ],
    "falsePositiveNotes": "Very low FP rate. Rule requires PHP open tag + 2 exec functions + input parameter.",
    "tuningNotes": "Consider adding more web shell family strings from threat intel feeds.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-02-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial YARA rule for PHP web shells"
      },
      {
        "version": "1.1",
        "changedAt": "2026-01-10T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Added popen() and additional exec function variants"
      }
    ]
  },
  {
    "id": "r_004",
    "name": "Directory Traversal Attack",
    "type": "sigma",
    "status": "active",
    "severity": "high",
    "description": "Detects HTTP requests containing path traversal sequences targeting system files. Covers encoded variants including URL-encoding and double-encoding.",
    "content": "title: Directory Traversal Attack Detection\nid: a1b2c3d4-0004\nstatus: stable\ndescription: Detects HTTP directory traversal patterns\nauthor: jsmith@honeyforge.io\ndate: 2025-02-15\nlogsource:\n  product: honeypot\n  service: tanner\n  category: webserver\ndetection:\n  selection_raw:\n    http.uri|contains:\n      - '../'\n      - '..\\'\n  selection_encoded:\n    http.uri|contains:\n      - '%2e%2e%2f'\n      - '%2e%2e/'\n      - '..%2f'\n      - '%252e%252e'\n  selection_targets:\n    http.uri|contains:\n      - '/etc/passwd'\n      - '/etc/shadow'\n      - 'win.ini'\n      - 'boot.ini'\n  condition: (selection_raw or selection_encoded) and selection_targets\nlevel: high\ntags:\n  - attack.discovery\n  - attack.t1083",
    "detectionSources": [
      "TANNER",
      "SNARE"
    ],
    "tags": [
      "traversal",
      "lfi",
      "web",
      "recon"
    ],
    "mitreTechniques": [
      "T1083",
      "T1190"
    ],
    "mitreTactics": [
      "Discovery",
      "Initial Access"
    ],
    "confidence": 92,
    "hitCount": 1847,
    "lastHitAt": "2026-06-18T06:10:00Z",
    "createdAt": "2025-02-15T00:00:00Z",
    "updatedAt": "2026-02-10T00:00:00Z",
    "createdBy": "jsmith@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "Some legitimate file management tools may use relative paths. Review HTTP host header.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-02-15T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Initial rule creation"
      },
      {
        "version": "1.1",
        "changedAt": "2026-02-10T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Added double-encoding variants and target file list"
      }
    ]
  },
  {
    "id": "r_005",
    "name": "Port Scan Detection (Masscan/Nmap)",
    "type": "sigma",
    "status": "active",
    "severity": "low",
    "description": "Identifies automated port scanning activity by detecting rapid connection attempts to multiple ports from a single source within a short time window.",
    "content": "title: Rapid Port Scan Detection\nid: a1b2c3d4-0005\nstatus: stable\ndescription: Detects masscan/nmap style port scans\nauthor: analyst@honeyforge.io\ndate: 2025-03-01\nlogsource:\n  product: honeypot\n  service: suricata\ndetection:\n  selection:\n    event_type: alert\n    alert.category: 'Attempted Information Leak'\n  timeframe: 5s\n  condition: selection | count(dest_port) by src_ip > 50\nlevel: low\ntags:\n  - attack.reconnaissance\n  - attack.t1595\n  - attack.t1046",
    "detectionSources": [
      "Suricata"
    ],
    "tags": [
      "recon",
      "port-scan",
      "masscan",
      "nmap"
    ],
    "mitreTechniques": [
      "T1595",
      "T1046"
    ],
    "mitreTactics": [
      "Reconnaissance",
      "Discovery"
    ],
    "confidence": 78,
    "hitCount": 5120,
    "lastHitAt": "2026-06-18T07:00:00Z",
    "createdAt": "2025-03-01T00:00:00Z",
    "updatedAt": "2025-03-01T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "Vulnerability scanners in internal network may trigger. Whitelist approved scanner IPs.",
    "tuningNotes": "Threshold of 50 distinct ports in 5s was validated against baseline traffic. Shodan uses ~1000 pps.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-03-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial rule creation"
      }
    ]
  },
  {
    "id": "r_006",
    "name": "SSH Post-Login System Commands",
    "type": "sigma",
    "status": "active",
    "severity": "critical",
    "description": "Detects common system enumeration and persistence commands executed after a successful SSH login on a honeypot. Indicates hands-on keyboard attacker activity.",
    "content": "title: SSH Post-Login System Enumeration Commands\nid: a1b2c3d4-0006\nstatus: stable\ndescription: Detects attacker commands after SSH honeypot login\nauthor: mlee@honeyforge.io\ndate: 2025-03-15\nlogsource:\n  product: honeypot\n  service: cowrie\ndetection:\n  selection_login:\n    event_type: login_success\n  selection_commands:\n    command|contains:\n      - 'cat /etc/passwd'\n      - 'uname -a'\n      - 'whoami'\n      - 'id'\n      - 'ps aux'\n      - 'netstat'\n      - 'ifconfig'\n      - 'ip addr'\n      - 'crontab'\n      - 'wget http'\n      - 'curl http'\n  condition: selection_login | near selection_commands within 120s\nlevel: critical\ntags:\n  - attack.execution\n  - attack.discovery\n  - attack.t1059.004",
    "detectionSources": [
      "Cowrie"
    ],
    "tags": [
      "ssh",
      "post-exploitation",
      "enumeration",
      "cowrie"
    ],
    "mitreTechniques": [
      "T1059.004",
      "T1082",
      "T1057",
      "T1033"
    ],
    "mitreTactics": [
      "Execution",
      "Discovery"
    ],
    "confidence": 99,
    "hitCount": 892,
    "lastHitAt": "2026-06-18T05:47:00Z",
    "createdAt": "2025-03-15T00:00:00Z",
    "updatedAt": "2026-04-01T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [
      "ioc_002",
      "ioc_009"
    ],
    "falsePositiveNotes": "Zero expected false positives — all SSH logins on honeypot are unauthorized by design.",
    "tuningNotes": "Commands list is non-exhaustive. Cowrie captures all commands for manual review.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-03-15T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial rule"
      },
      {
        "version": "1.1",
        "changedAt": "2026-04-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Extended command list, added wget/curl download detection"
      }
    ]
  },
  {
    "id": "r_007",
    "name": "DNS Tunneling Detection",
    "type": "suricata",
    "status": "active",
    "severity": "high",
    "description": "Suricata signature detecting DNS-based exfiltration tunneling by monitoring query frequency, subdomain entropy, and TXT record abuse patterns.",
    "content": "alert dns $HOME_NET any -> any 53 (\n  msg:\"HONEYFORGE Possible DNS Tunneling - High Query Frequency\";\n  flow:to_server;\n  dns.query;\n  content:!\".google.com\"; dns.query;\n  content:!\".microsoft.com\"; dns.query;\n  threshold:type both,track by_src,count 50,seconds 60;\n  classtype:policy-violation;\n  sid:9001007; rev:2;\n  metadata:\n    mitre_technique T1048.003,\n    created_at 2025-04-01,\n    severity High;\n)\n\nalert dns $HOME_NET any -> any 53 (\n  msg:\"HONEYFORGE DNS TXT Record Exfiltration Pattern\";\n  flow:to_server;\n  dns.query.type:TXT;\n  pcre:\"/^[a-zA-Z0-9+/=]{40,}/\";\n  classtype:policy-violation;\n  sid:9001008; rev:1;\n)",
    "detectionSources": [
      "Suricata",
      "TANNER"
    ],
    "tags": [
      "dns",
      "exfiltration",
      "tunneling",
      "c2"
    ],
    "mitreTechniques": [
      "T1048.003",
      "T1041",
      "T1071.004"
    ],
    "mitreTactics": [
      "Exfiltration",
      "Command and Control"
    ],
    "confidence": 85,
    "hitCount": 134,
    "lastHitAt": "2026-06-17T21:30:00Z",
    "createdAt": "2025-04-01T00:00:00Z",
    "updatedAt": "2026-01-20T00:00:00Z",
    "createdBy": "jsmith@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [
      "ioc_021"
    ],
    "falsePositiveNotes": "CDN traffic and legitimate update services may generate high DNS rates. Tune whitelist.",
    "tuningNotes": "TXT record pattern requires base64-like string of 40+ chars. Adjust length threshold based on environment.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-04-01T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Initial DNS tunneling rule"
      },
      {
        "version": "2.0",
        "changedAt": "2026-01-20T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Added TXT record exfil pattern, adjusted thresholds"
      }
    ]
  },
  {
    "id": "r_008",
    "name": "Cross-Site Scripting (XSS) Patterns",
    "type": "yara",
    "status": "active",
    "severity": "high",
    "description": "YARA rule detecting common XSS injection patterns in HTTP request parameters. Covers reflected, stored, and DOM-based XSS variants including base64-encoded payloads.",
    "content": "rule HoneyForge_XSS_Patterns {\n  meta:\n    description = \"Detects cross-site scripting attack patterns\"\n    author = \"mlee@honeyforge.io\"\n    date = \"2025-04-15\"\n    severity = \"high\"\n    mitre_technique = \"T1190\"\n  strings:\n    $script_tag     = \"<script\" nocase\n    $script_close   = \"</script>\" nocase\n    $on_event       = /on(load|click|error|mouseover|focus|blur|change|submit)=/i\n    $iframe         = \"<iframe\" nocase\n    $img_onerror    = \"onerror=\" nocase\n    $javascript_uri = \"javascript:\" nocase\n    $svg_tag        = \"<svg\" nocase\n    $base64_eval    = /evals*(s*atobs*(/ nocase\n    $doc_write      = \"document.write(\" nocase\n    $inner_html     = \".innerHTML\" nocase\n  condition:\n    2 of them\n}",
    "detectionSources": [
      "TANNER",
      "SNARE"
    ],
    "tags": [
      "xss",
      "web",
      "injection"
    ],
    "mitreTechniques": [
      "T1190",
      "T1059.007"
    ],
    "mitreTactics": [
      "Initial Access"
    ],
    "confidence": 88,
    "hitCount": 3291,
    "lastHitAt": "2026-06-18T07:42:00Z",
    "createdAt": "2025-04-15T00:00:00Z",
    "updatedAt": "2025-11-01T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "Web application testing tools and WAF bypass tests may trigger. Review source context.",
    "tuningNotes": "Threshold of 2 matches reduces false positives from legitimate JS-heavy pages.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-04-15T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial XSS detection rule"
      },
      {
        "version": "1.1",
        "changedAt": "2025-11-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Added base64 eval and innerHTML patterns"
      }
    ]
  },
  {
    "id": "r_009",
    "name": "Redis Unauthenticated Access Attempt",
    "type": "sigma",
    "status": "needs-review",
    "severity": "high",
    "description": "Detects unauthenticated access attempts to Redis instances including SLAVEOF and CONFIG SET commands used for SSH key persistence. Needs tuning for internal Redis traffic.",
    "content": "title: Redis Unauthenticated Access and Persistence Attempt\nid: a1b2c3d4-0009\nstatus: experimental\ndescription: Detects Redis commands used for unauthorized access and persistence\nauthor: analyst@honeyforge.io\ndate: 2025-05-01\nlogsource:\n  product: honeypot\n  service: dionaea\ndetection:\n  selection_commands:\n    command|contains:\n      - 'SLAVEOF'\n      - 'CONFIG SET dir'\n      - 'CONFIG SET dbfilename'\n      - 'FLUSHALL'\n      - 'FLUSHDB'\n  condition: selection_commands\nlevel: high\ntags:\n  - attack.persistence\n  - attack.t1505",
    "detectionSources": [
      "Dionaea"
    ],
    "tags": [
      "redis",
      "database",
      "persistence",
      "lateral-movement"
    ],
    "mitreTechniques": [
      "T1505",
      "T1563"
    ],
    "mitreTactics": [
      "Persistence"
    ],
    "confidence": 82,
    "hitCount": 47,
    "lastHitAt": "2026-06-15T09:00:00Z",
    "createdAt": "2025-05-01T00:00:00Z",
    "updatedAt": "2026-06-01T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [
      "ioc_018"
    ],
    "falsePositiveNotes": "Internal Redis replication (SLAVEOF) from legitimate replicas needs to be whitelisted. Currently generating FPs.",
    "tuningNotes": "NEEDS REVIEW: Add source IP whitelist for known Redis replica hosts before enabling in production.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-05-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial rule, marked experimental"
      },
      {
        "version": "1.1",
        "changedAt": "2026-06-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Flagged for review — FP from internal Redis cluster"
      }
    ]
  },
  {
    "id": "r_010",
    "name": "SSRF to AWS Instance Metadata",
    "type": "opensearch",
    "status": "active",
    "severity": "critical",
    "description": "OpenSearch query detecting SSRF requests targeting AWS EC2 Instance Metadata Service (IMDS) endpoint. Critical as successful SSRF can expose IAM credentials.",
    "content": "{\n  \"query\": {\n    \"bool\": {\n      \"must\": [\n        { \"term\": { \"event.category\": \"network\" } },\n        { \"term\": { \"event.type\": \"http_request\" } }\n      ],\n      \"should\": [\n        { \"match_phrase\": { \"url.query\": \"169.254.169.254\" } },\n        { \"match_phrase\": { \"http.request.body.content\": \"169.254.169.254\" } },\n        { \"match_phrase\": { \"url.path\": \"169.254.169.254\" } }\n      ],\n      \"minimum_should_match\": 1,\n      \"filter\": [\n        { \"range\": { \"@timestamp\": { \"gte\": \"now-5m\" } } }\n      ]\n    }\n  },\n  \"aggs\": {\n    \"by_source_ip\": {\n      \"terms\": { \"field\": \"source.ip\", \"size\": 20, \"order\": { \"_count\": \"desc\" } }\n    },\n    \"by_request_path\": {\n      \"terms\": { \"field\": \"url.path\", \"size\": 10 }\n    }\n  },\n  \"size\": 100,\n  \"_source\": [\"@timestamp\", \"source.ip\", \"url.full\", \"http.request.method\", \"event.outcome\"]\n}",
    "detectionSources": [
      "TANNER"
    ],
    "tags": [
      "ssrf",
      "aws",
      "cloud",
      "credential-access"
    ],
    "mitreTechniques": [
      "T1552.005",
      "T1190"
    ],
    "mitreTactics": [
      "Credential Access",
      "Initial Access"
    ],
    "confidence": 96,
    "hitCount": 221,
    "lastHitAt": "2026-06-18T04:15:00Z",
    "createdAt": "2025-05-15T00:00:00Z",
    "updatedAt": "2026-02-20T00:00:00Z",
    "createdBy": "jsmith@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [
      "ioc_006"
    ],
    "falsePositiveNotes": "Negligible FP rate. The IMDS address is only used by AWS instances requesting their own metadata.",
    "tuningNotes": "Consider adding GCP metadata endpoint (metadata.google.internal) and Azure IMDS (169.254.169.254/metadata) variants.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-05-15T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Initial OpenSearch query for AWS SSRF detection"
      },
      {
        "version": "1.1",
        "changedAt": "2026-02-20T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Added request body scan and aggregation pipeline"
      }
    ]
  },
  {
    "id": "r_011",
    "name": "Cobalt Strike HTTP Beacon Traffic",
    "type": "suricata",
    "status": "active",
    "severity": "critical",
    "description": "Detects Cobalt Strike HTTP beacon communication patterns based on default malleable C2 profile indicators including JARM fingerprinting and characteristic URI patterns.",
    "content": "alert http $HOME_NET any -> $EXTERNAL_NET any (\n  msg:\"HONEYFORGE Possible Cobalt Strike HTTP Beacon\";\n  flow:established,to_server;\n  content:\"GET\"; http_method;\n  content:\"/jquery-3.3.1.min.js\"; http_uri;\n  content:\"__utma=\"; http_cookie;\n  classtype:trojan-activity;\n  sid:9001011; rev:2;\n  metadata:\n    mitre_technique T1071.001,\n    mitre_technique T1573,\n    created_at 2025-06-01,\n    severity Critical;\n)\n\nalert tls $HOME_NET any -> $EXTERNAL_NET any (\n  msg:\"HONEYFORGE Cobalt Strike JARM Fingerprint\";\n  flow:to_server;\n  tls.fingerprint;\n  content:\"07d14d16d21d21d07c42d41d00041d24a458a375eef0c576d23a7bab9a9fb1b\";\n  classtype:trojan-activity;\n  sid:9001012; rev:1;\n)",
    "detectionSources": [
      "Suricata",
      "TANNER"
    ],
    "tags": [
      "cobalt-strike",
      "c2",
      "beacon",
      "malware"
    ],
    "mitreTechniques": [
      "T1071.001",
      "T1573",
      "T1105"
    ],
    "mitreTactics": [
      "Command and Control"
    ],
    "confidence": 88,
    "hitCount": 43,
    "lastHitAt": "2026-06-16T23:10:00Z",
    "createdAt": "2025-06-01T00:00:00Z",
    "updatedAt": "2026-03-10T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [
      "ioc_012",
      "ioc_013"
    ],
    "falsePositiveNotes": "Default profile indicators only — sophisticated red teams use custom profiles. Update signatures regularly.",
    "tuningNotes": "JARM fingerprint matches default CS 4.x profile. Operators using custom malleable C2 will evade this.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-06-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial Cobalt Strike detection"
      },
      {
        "version": "2.0",
        "changedAt": "2026-03-10T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Added JARM fingerprint rule"
      }
    ]
  },
  {
    "id": "r_012",
    "name": "FTP Anonymous Login Attempt",
    "type": "sigma",
    "status": "draft",
    "severity": "low",
    "description": "Detects FTP anonymous login attempts on the FTP honeypot. Low severity but useful for tracking reconnaissance activity and building attacker attribution profiles.",
    "content": "title: FTP Anonymous Login Attempt\nid: a1b2c3d4-0012\nstatus: experimental\ndescription: Detects FTP anonymous credential attempts on Dionaea honeypot\nauthor: analyst@honeyforge.io\ndate: 2026-05-01\nlogsource:\n  product: honeypot\n  service: dionaea\ndetection:\n  selection:\n    event_type: ftp_login\n    username:\n      - 'anonymous'\n      - 'ftp'\n      - 'anon'\n      - ''\n  condition: selection\nlevel: low\ntags:\n  - attack.reconnaissance\n  - attack.t1133",
    "detectionSources": [
      "Dionaea"
    ],
    "tags": [
      "ftp",
      "anonymous",
      "recon"
    ],
    "mitreTechniques": [
      "T1133",
      "T1595"
    ],
    "mitreTactics": [
      "Reconnaissance"
    ],
    "confidence": 70,
    "hitCount": 0,
    "createdAt": "2026-05-01T00:00:00Z",
    "updatedAt": "2026-05-01T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [],
    "tuningNotes": "Draft — needs testing on Dionaea sandbox before deployment.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2026-05-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial draft rule"
      }
    ]
  },
  {
    "id": "r_013",
    "name": "WordPress Login Brute Force",
    "type": "sigma",
    "status": "active",
    "severity": "medium",
    "description": "Detects brute force attempts against WordPress wp-login.php endpoint. Correlates failed login attempts by source IP using WPScan user-agent detection.",
    "content": "title: WordPress Login Brute Force Attempt\nid: a1b2c3d4-0013\nstatus: stable\ndescription: Detects WordPress wp-login brute force attacks\nauthor: analyst@honeyforge.io\ndate: 2025-07-01\nlogsource:\n  product: honeypot\n  service: snare\n  category: webserver\ndetection:\n  selection_endpoint:\n    http.uri|contains: '/wp-login.php'\n    http.method: POST\n  selection_agents:\n    http.user_agent|contains:\n      - 'WPScan'\n      - 'DirBuster'\n      - 'sqlmap'\n      - 'Nikto'\n  filter_success:\n    http.status: 200\n    http.response_body|contains: 'Dashboard'\n  condition: selection_endpoint and not filter_success\n  timeframe: 300s\n  aggregate: count() by src_ip > 5\nlevel: medium\ntags:\n  - attack.credential_access\n  - attack.t1110",
    "detectionSources": [
      "SNARE"
    ],
    "tags": [
      "wordpress",
      "brute-force",
      "web",
      "cms"
    ],
    "mitreTechniques": [
      "T1110",
      "T1110.001"
    ],
    "mitreTactics": [
      "Credential Access"
    ],
    "confidence": 87,
    "hitCount": 2841,
    "lastHitAt": "2026-06-18T06:30:00Z",
    "createdAt": "2025-07-01T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "Legitimate admin bulk operations may trigger. Success filter should prevent most FPs.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-07-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial rule"
      },
      {
        "version": "1.1",
        "changedAt": "2026-01-15T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Added success response filter to reduce FPs"
      }
    ]
  },
  {
    "id": "r_014",
    "name": "GraphQL Schema Enumeration",
    "type": "opensearch",
    "status": "active",
    "severity": "medium",
    "description": "OpenSearch query identifying GraphQL introspection queries used for API reconnaissance. Detects automated schema extraction attempts that reveal available types and fields.",
    "content": "{\n  \"query\": {\n    \"bool\": {\n      \"must\": [\n        { \"term\": { \"event.category\": \"network\" } },\n        { \"term\": { \"http.request.method\": \"POST\" } },\n        { \"wildcard\": { \"url.path\": \"*graphql*\" } }\n      ],\n      \"should\": [\n        { \"match_phrase\": { \"http.request.body.content\": \"__schema\" } },\n        { \"match_phrase\": { \"http.request.body.content\": \"__type\" } },\n        { \"match_phrase\": { \"http.request.body.content\": \"introspectionQuery\" } }\n      ],\n      \"minimum_should_match\": 1,\n      \"filter\": [\n        { \"range\": { \"@timestamp\": { \"gte\": \"now-15m\" } } }\n      ]\n    }\n  },\n  \"aggs\": {\n    \"by_source\": {\n      \"terms\": { \"field\": \"source.ip\", \"size\": 10 }\n    },\n    \"over_time\": {\n      \"date_histogram\": { \"field\": \"@timestamp\", \"calendar_interval\": \"1m\" }\n    }\n  }\n}",
    "detectionSources": [
      "TANNER"
    ],
    "tags": [
      "graphql",
      "api",
      "recon",
      "enumeration"
    ],
    "mitreTechniques": [
      "T1590",
      "T1595"
    ],
    "mitreTactics": [
      "Reconnaissance"
    ],
    "confidence": 75,
    "hitCount": 381,
    "lastHitAt": "2026-06-17T16:45:00Z",
    "createdAt": "2025-08-01T00:00:00Z",
    "updatedAt": "2025-08-01T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "GraphQL IDEs like Altair and GraphiQL send introspection queries for schema completion. Whitelist dev tool IPs.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-08-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial GraphQL introspection detection"
      }
    ]
  },
  {
    "id": "r_015",
    "name": "PHP Wrapper LFI via Stream Filter",
    "type": "sigma",
    "status": "active",
    "severity": "high",
    "description": "Detects Local File Inclusion via PHP stream wrappers including php://filter, php://input, and data:// URIs. These bypass simple path traversal filters.",
    "content": "title: PHP Stream Wrapper LFI Attempt\nid: a1b2c3d4-0015\nstatus: stable\ndescription: Detects PHP wrapper-based LFI attacks\nauthor: mlee@honeyforge.io\ndate: 2025-09-01\nlogsource:\n  product: honeypot\n  service: tanner\ndetection:\n  selection:\n    http.uri|contains:\n      - 'php://filter'\n      - 'php://input'\n      - 'php://fd'\n      - 'data://text'\n      - 'expect://'\n      - 'zip://'\n  condition: selection\nlevel: high\ntags:\n  - attack.discovery\n  - attack.t1083",
    "detectionSources": [
      "TANNER",
      "SNARE"
    ],
    "tags": [
      "lfi",
      "php",
      "wrapper",
      "web"
    ],
    "mitreTechniques": [
      "T1083",
      "T1190"
    ],
    "mitreTactics": [
      "Discovery",
      "Initial Access"
    ],
    "confidence": 93,
    "hitCount": 718,
    "lastHitAt": "2026-06-17T23:00:00Z",
    "createdAt": "2025-09-01T00:00:00Z",
    "updatedAt": "2025-09-01T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "PHP applications using file streaming internally may match. Very rare in honeypot context.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-09-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial rule"
      }
    ]
  },
  {
    "id": "r_016",
    "name": "OS Command Injection Detection",
    "type": "suricata",
    "status": "active",
    "severity": "critical",
    "description": "Detects OS command injection attempts in HTTP parameters including shell metacharacters and command separators used to execute system commands via web forms.",
    "content": "alert http $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (\n  msg:\"HONEYFORGE OS Command Injection Attempt\";\n  flow:established,to_server;\n  content:\"POST\"; http_method;\n  pcre:\"/[;&|`]\\s*(id|whoami|uname|cat\\s+\\/etc|ls\\s+-[la]|wget|curl|bash|sh|python|perl|nc\\s+-)/i\";\n  http_client_body;\n  classtype:web-application-attack;\n  sid:9001016; rev:2;\n  metadata:\n    mitre_technique T1059,\n    mitre_technique T1190,\n    severity Critical;\n)",
    "detectionSources": [
      "TANNER",
      "SNARE"
    ],
    "tags": [
      "command-injection",
      "rce",
      "web",
      "execution"
    ],
    "mitreTechniques": [
      "T1059",
      "T1190",
      "T1059.004"
    ],
    "mitreTactics": [
      "Execution",
      "Initial Access"
    ],
    "confidence": 90,
    "hitCount": 1034,
    "lastHitAt": "2026-06-18T08:00:00Z",
    "createdAt": "2025-09-15T00:00:00Z",
    "updatedAt": "2026-01-05T00:00:00Z",
    "createdBy": "jsmith@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "Shell metacharacters in form data may be legitimate. Review HTTP body context before escalation.",
    "tuningNotes": "PCRE covers common injection patterns. Add language-specific interpreters (python3, php, ruby) as needed.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-09-15T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Initial rule"
      },
      {
        "version": "2.0",
        "changedAt": "2026-01-05T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Extended PCRE, added curl and wget variants"
      }
    ]
  },
  {
    "id": "r_017",
    "name": "MySQL Auth Bypass Pattern",
    "type": "sigma",
    "status": "disabled",
    "severity": "high",
    "description": "Detects MySQL authentication bypass attempts on the database honeypot. Disabled due to high false positive rate from internal monitoring tools — pending re-tuning.",
    "content": "title: MySQL Authentication Bypass Attempt\nid: a1b2c3d4-0017\nstatus: deprecated\ndescription: Detects MySQL auth bypass on Dionaea honeypot (DISABLED - high FP rate)\nauthor: analyst@honeyforge.io\ndate: 2025-04-01\nlogsource:\n  product: honeypot\n  service: dionaea\ndetection:\n  selection:\n    event_type: mysql_login\n    password:\n      - ''\n      - 'root'\n      - 'mysql'\n      - 'password'\n  condition: selection\nlevel: high",
    "detectionSources": [
      "Dionaea"
    ],
    "tags": [
      "mysql",
      "database",
      "auth-bypass"
    ],
    "mitreTechniques": [
      "T1190",
      "T1078.001"
    ],
    "mitreTactics": [
      "Initial Access"
    ],
    "confidence": 60,
    "hitCount": 892,
    "lastHitAt": "2026-05-01T00:00:00Z",
    "createdAt": "2025-04-01T00:00:00Z",
    "updatedAt": "2026-05-01T00:00:00Z",
    "createdBy": "analyst@honeyforge.io",
    "owner": "analyst@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "DISABLED: Internal monitoring service uses empty MySQL password — generating 80% FP rate. Needs source IP filter.",
    "tuningNotes": "Re-enable after adding source IP exclusion for monitoring hosts (10.0.0.0/24).",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-04-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Initial rule"
      },
      {
        "version": "1.1",
        "changedAt": "2026-05-01T00:00:00Z",
        "changedBy": "analyst@honeyforge.io",
        "summary": "Disabled due to high FP from internal monitoring tool"
      }
    ]
  },
  {
    "id": "r_018",
    "name": "Cryptominer Download via SSH",
    "type": "yara",
    "status": "active",
    "severity": "critical",
    "description": "YARA rule matching cryptomining malware filenames and mining pool connection strings commonly downloaded to honeypots post-SSH compromise.",
    "content": "rule HoneyForge_Cryptominer_Payload {\n  meta:\n    description = \"Detects cryptominer downloads and config patterns\"\n    author = \"mlee@honeyforge.io\"\n    date = \"2025-10-01\"\n    severity = \"critical\"\n    mitre_technique = \"T1496\"\n  strings:\n    $miner_xmr   = \"xmrig\" nocase\n    $miner_strm  = \"stratum+\" nocase\n    $pool_port   = \":4444\" nocase\n    $pool_port2  = \":3333\" nocase\n    $pool_kinsing = \"kinsing\" nocase\n    $pool_minerd = \"minerd\" nocase\n    $cpu_usage   = \"--cpu-priority\" nocase\n    $wallet_xmr  = /[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}/\n  condition:\n    2 of ($miner_*, $pool_*, $cpu_usage) or $wallet_xmr\n}",
    "detectionSources": [
      "Cowrie"
    ],
    "tags": [
      "cryptominer",
      "xmrig",
      "impact",
      "malware"
    ],
    "mitreTechniques": [
      "T1496",
      "T1105"
    ],
    "mitreTactics": [
      "Impact",
      "Command and Control"
    ],
    "confidence": 94,
    "hitCount": 156,
    "lastHitAt": "2026-06-17T19:20:00Z",
    "createdAt": "2025-10-01T00:00:00Z",
    "updatedAt": "2025-10-01T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [
      "ioc_004"
    ],
    "falsePositiveNotes": "Mining pool port numbers could appear in legitimate content. Wallet regex is highly specific.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-10-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial cryptominer detection rule"
      }
    ]
  },
  {
    "id": "r_019",
    "name": "RDP Credential Spray Detection",
    "type": "sigma",
    "status": "needs-review",
    "severity": "high",
    "description": "Detects RDP credential spraying via NLA authentication failures. Rule needs review as current threshold triggers on legitimate admin batch operations.",
    "content": "title: RDP Credential Spray Detection\nid: a1b2c3d4-0019\nstatus: experimental\ndescription: Detects RDP password spray via NLA failures\nauthor: jsmith@honeyforge.io\ndate: 2025-11-01\nlogsource:\n  product: honeypot\n  service: snare\ndetection:\n  selection:\n    event_type: rdp_auth_failed\n    protocol: rdp\n  timeframe: 300s\n  condition: selection | count(username) by src_ip > 20\nlevel: high\ntags:\n  - attack.credential_access\n  - attack.t1110.003",
    "detectionSources": [
      "SNARE"
    ],
    "tags": [
      "rdp",
      "credential-spray",
      "brute-force",
      "windows"
    ],
    "mitreTechniques": [
      "T1110.003",
      "T1021.001"
    ],
    "mitreTactics": [
      "Credential Access",
      "Lateral Movement"
    ],
    "confidence": 79,
    "hitCount": 312,
    "lastHitAt": "2026-06-14T11:00:00Z",
    "createdAt": "2025-11-01T00:00:00Z",
    "updatedAt": "2026-06-01T00:00:00Z",
    "createdBy": "jsmith@honeyforge.io",
    "owner": "jsmith@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "NEEDS REVIEW: IT batch provisioning scripts trigger this during domain join. Need to exclude provisioning subnet.",
    "tuningNotes": "Increase threshold to 30 or add time-of-day filter to exclude business hours provisioning.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-11-01T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Initial rule"
      },
      {
        "version": "1.1",
        "changedAt": "2026-06-01T00:00:00Z",
        "changedBy": "jsmith@honeyforge.io",
        "summary": "Marked needs-review: FP from IT provisioning"
      }
    ]
  },
  {
    "id": "r_020",
    "name": "HTTP Request Flood Rate Anomaly",
    "type": "siem",
    "status": "active",
    "severity": "medium",
    "description": "SIEM query correlating HTTP request rate anomalies from single sources. Detects HTTP flood reconnaissance and DDoS probe patterns exceeding baseline thresholds.",
    "content": "// SIEM Rule — KQL-based Correlation\n// Platform: Elastic SIEM / OpenSearch Security\n\n// Primary query\nevent.category: \"network\" AND\nevent.type: \"http_request\" AND\nNOT source.ip: (10.0.0.0/8 OR 172.16.0.0/12 OR 192.168.0.0/16) AND\nevent.outcome: * AND\n@timestamp >= now-5m\n\n// Aggregation threshold (via rule configuration)\n// GROUP BY: source.ip\n// THRESHOLD: count(*) > 500 in 5 minutes\n// ALERT: when group exceeds threshold\n\n// Additional context fields to include in alert:\n// - source.geo.country_name\n// - destination.port\n// - http.request.method (HEAD/GET anomaly ratio)\n// - url.path (top paths accessed)\n// - network.bytes (bandwidth spike indicator)",
    "detectionSources": [
      "Suricata",
      "SNARE"
    ],
    "tags": [
      "http-flood",
      "dos",
      "rate-limiting",
      "recon"
    ],
    "mitreTechniques": [
      "T1595",
      "T1498"
    ],
    "mitreTactics": [
      "Reconnaissance",
      "Impact"
    ],
    "confidence": 72,
    "hitCount": 4891,
    "lastHitAt": "2026-06-18T08:10:00Z",
    "createdAt": "2025-12-01T00:00:00Z",
    "updatedAt": "2026-04-15T00:00:00Z",
    "createdBy": "mlee@honeyforge.io",
    "owner": "mlee@honeyforge.io",
    "relatedIOCIds": [],
    "falsePositiveNotes": "CDN health checks and crawlers may trigger. User-agent filtering recommended for known good bots.",
    "tuningNotes": "Threshold of 500 req/5min validated against Shodan scanner traffic. Adjust based on decoy capacity.",
    "versionHistory": [
      {
        "version": "1.0",
        "changedAt": "2025-12-01T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Initial SIEM correlation rule"
      },
      {
        "version": "1.1",
        "changedAt": "2026-04-15T00:00:00Z",
        "changedBy": "mlee@honeyforge.io",
        "summary": "Added network bytes field, HEAD/GET ratio analysis"
      }
    ]
  }
]
