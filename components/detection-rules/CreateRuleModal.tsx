'use client'
import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RuleTypeBadge, ALL_RULE_TYPES } from './RuleTypeBadge'
import type { RuleType, RuleSeverity, DetectionRule } from '@/types/rule'

const RULE_TEMPLATES: Record<RuleType, string> = {
  sigma: `title: My Detection Rule
id: <generate-uuid>
status: experimental
description: Detects suspicious activity
author: analyst@honeyforge.io
date: 2026/06/18
logsource:
  product: honeypot
  service: snare
detection:
  selection:
    http.method: POST
    http.uri|contains: '/admin'
  condition: selection
level: high
tags:
  - attack.initial_access
  - attack.t1190`,

  yara: `rule HoneyForge_Detection {
  meta:
    description = "Detects suspicious pattern"
    author = "analyst@honeyforge.io"
    date = "2026-06-18"
    severity = "high"
  strings:
    $pattern1 = "suspicious_string" ascii nocase
    $pattern2 = { 48 65 6C 6C 6F }
  condition:
    any of them
}`,

  suricata: `alert http $EXTERNAL_NET any -> $HTTP_SERVERS any (
  msg:"HONEYFORGE Suspicious HTTP Request";
  flow:established,to_server;
  content:"suspicious_pattern"; http_uri;
  nocase;
  classtype:web-application-attack;
  sid:9000001; rev:1;
  metadata:author analyst@honeyforge.io,
            created_at 2026-06-18;
)`,

  opensearch: `{
  "query": {
    "bool": {
      "must": [
        { "match": { "event.category": "network" } },
        { "wildcard": { "url.path": "*suspicious*" } }
      ],
      "filter": [
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  },
  "aggs": {
    "by_source_ip": {
      "terms": { "field": "source.ip", "size": 10 }
    }
  }
}`,

  siem: `// SIEM Query — KQL
event.category: "network" AND
event.type: "connection" AND
source.ip: * AND
NOT source.ip: (10.0.0.0/8 OR 192.168.0.0/16) AND
http.request.method: ("POST" OR "PUT") AND
url.path: /admin/*`,
}

interface Props {
  onClose:  () => void
  onCreate: (rule: Partial<DetectionRule>) => void
}

type FormState = {
  name: string
  type: RuleType
  severity: RuleSeverity
  description: string
  content: string
  owner: string
  tags: string
  mitreTechniques: string
}

export function CreateRuleModal({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormState>({
    name: '',
    type: 'sigma',
    severity: 'medium',
    description: '',
    content: RULE_TEMPLATES.sigma,
    owner: 'analyst@honeyforge.io',
    tags: '',
    mitreTechniques: '',
  })

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleTypeChange = (type: RuleType) => {
    setForm((prev) => ({ ...prev, type, content: RULE_TEMPLATES[type] }))
  }

  const handleCreate = () => {
    if (!form.name.trim()) return
    onCreate({
      id: `r_${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      severity: form.severity,
      status: 'draft',
      description: form.description.trim(),
      content: form.content,
      owner: form.owner.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      mitreTechniques: form.mitreTechniques.split(',').map((t) => t.trim()).filter(Boolean),
      mitreTactics: [],
      detectionSources: [],
      confidence: 70,
      hitCount: 0,
      relatedIOCIds: [],
      versionHistory: [{
        version: '1.0',
        changedAt: new Date().toISOString(),
        changedBy: form.owner,
        summary: 'Initial rule creation',
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: form.owner,
    })
    onClose()
  }

  const SEVERITIES: RuleSeverity[] = ['critical', 'high', 'medium', 'low']
  const SEV_COLOR: Record<RuleSeverity, string> = {
    critical: 'text-severity-critical', high: 'text-severity-high',
    medium: 'text-severity-medium', low: 'text-severity-low',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-hf-surface border border-hf-border/60 rounded-2xl shadow-2xl animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hf-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hf-primary/15 border border-hf-primary/30 flex items-center justify-center">
              <Plus className="w-4 h-4 text-hf-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-hf-text">Create Detection Rule</h2>
              <p className="text-[10px] text-hf-dim">New rule will be saved as Draft</p>
            </div>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Name + Owner row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Rule Name *</label>
              <input
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. SSH Brute Force from Tor Exit Nodes"
                className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Owner</label>
              <input
                value={form.owner}
                onChange={set('owner')}
                placeholder="analyst@honeyforge.io"
                className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
              />
            </div>
          </div>

          {/* Type + Severity row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Rule Type</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_RULE_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={cn('transition-all', form.type !== t && 'opacity-40 hover:opacity-70')}
                  >
                    <RuleTypeBadge type={t} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Severity</label>
              <div className="flex gap-2">
                {SEVERITIES.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setForm((p) => ({ ...p, severity: sev }))}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-semibold border capitalize transition-all',
                      form.severity === sev
                        ? `${SEV_COLOR[sev]} border-current/30 bg-current/10`
                        : 'text-hf-dim border-hf-border/30 hover:text-hf-muted opacity-60 hover:opacity-100'
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="What does this rule detect and why is it important?"
              className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60 resize-none"
            />
          </div>

          {/* Rule Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest">Rule Logic / Content *</label>
              <span className="text-[9px] text-hf-dim">{form.type.toUpperCase()} format</span>
            </div>
            <textarea
              value={form.content}
              onChange={set('content')}
              rows={12}
              spellCheck={false}
              className="w-full font-mono bg-[#07090f] border border-hf-border/50 rounded-lg px-3 py-2.5 text-xs text-hf-muted focus:outline-none focus:border-hf-primary/60 resize-y leading-relaxed"
            />
          </div>

          {/* Tags + MITRE row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={set('tags')}
                placeholder="ssh, brute-force, auth"
                className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-hf-dim uppercase tracking-widest mb-1.5 block">MITRE Techniques (comma-separated)</label>
              <input
                value={form.mitreTechniques}
                onChange={set('mitreTechniques')}
                placeholder="T1110, T1078"
                className="w-full bg-hf-bg/60 border border-hf-border/50 rounded-lg px-3 py-2 text-xs text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hf-border/40 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
            disabled={!form.name.trim()}
          >
            Create Rule
          </Button>
        </div>
      </div>
    </div>
  )
}
