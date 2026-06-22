'use client'
import { useState } from 'react'
import { ShieldAlert, X, ChevronDown, ChevronUp } from 'lucide-react'

export function AuthBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded]   = useState(false)

  if (dismissed) return null

  return (
    <div className="relative rounded-2xl border border-hf-warning/40 bg-hf-warning/5 overflow-hidden">
      {/* Accent bar */}
      <div className="absolute inset-y-0 left-0 w-1 bg-hf-warning" />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-hf-warning shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-hf-warning">Authorization Required</h4>
              <span className="text-[9px] font-black text-hf-warning border border-hf-warning/50 bg-hf-warning/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Legal Notice
              </span>
            </div>

            <p className="text-xs text-hf-muted mt-1 leading-relaxed">
              HoneyForge Clone Studio creates deceptive web assets for authorized security testing only.{' '}
              <strong className="text-hf-text">You must own or have explicit written authorization</strong> for any domain, application, or web asset you configure as a decoy.
            </p>

            {expanded && (
              <div className="mt-3 space-y-2 text-xs text-hf-muted leading-relaxed border-t border-hf-border/30 pt-3">
                <p>
                  <strong className="text-hf-warning">Prohibited use:</strong> Creating decoys that impersonate third-party services, competitors, or external websites without authorization violates computer fraud laws in most jurisdictions (CFAA, Computer Misuse Act, etc.).
                </p>
                <p>
                  <strong className="text-hf-text">What is permitted:</strong> Cloning internal applications you manage, test environments, staging systems, or any asset for which your organization has documented ownership or explicit written authorization from the asset owner.
                </p>
                <p>
                  <strong className="text-hf-text">No automatic external crawling:</strong> Clone Studio does not automatically fetch or replicate external websites. Configuration is manual. You are responsible for the content you deploy.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-hf-warning/70 hover:text-hf-warning transition-colors p-1"
              title={expanded ? 'Collapse' : 'Read more'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-hf-dim hover:text-hf-muted transition-colors p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
