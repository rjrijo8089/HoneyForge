'use client'
import { useState } from 'react'
import { Plus, X, AlertTriangle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle, SettingRow, SectionHeader, BtnGroup, SaveBar, TabCard, useSave, inputCls, numberCls, labelCls } from './shared'

type AuthMode = 'local' | 'ldap' | 'saml' | 'oidc'

const AUTH_OPTIONS: { value: AuthMode; label: string }[] = [
  { value: 'local', label: 'Local'  },
  { value: 'ldap',  label: 'LDAP'   },
  { value: 'saml',  label: 'SAML'   },
  { value: 'oidc',  label: 'OIDC'   },
]

export function SecurityTab() {
  const { saving, saved, save } = useSave()

  const [authMode,           setAuthMode]           = useState<AuthMode>('local')
  const [ssoUrl,             setSsoUrl]             = useState('https://sso.acmecorp.io/saml/acs')
  const [sessionTimeout,     setSessionTimeout]     = useState(240)
  const [mfaRequired,        setMfaRequired]        = useState(true)
  const [ipRanges,           setIpRanges]           = useState<string[]>(['10.0.0.0/24', '192.168.1.0/24'])
  const [ipInput,            setIpInput]            = useState('')
  const [safeSimulation,     setSafeSimulation]     = useState(true)
  const [defensiveBanner,    setDefensiveBanner]    = useState(true)

  const addIp = () => {
    const v = ipInput.trim()
    if (v && !ipRanges.includes(v)) setIpRanges((p) => [...p, v])
    setIpInput('')
  }
  const removeIp = (r: string) => setIpRanges((p) => p.filter((x) => x !== r))

  const showSsoField = authMode === 'saml' || authMode === 'oidc' || authMode === 'ldap'
  const ssoLabel = authMode === 'ldap' ? 'LDAP Server URL' : authMode === 'saml' ? 'SAML SSO URL' : 'OIDC Issuer URL'

  return (
    <TabCard>
      {/* ── Auth mode ── */}
      <SectionHeader title="Authentication" />

      <SettingRow label="Authentication Mode" hint="How users authenticate to HoneyForge. Changes take effect after next login.">
        <BtnGroup options={AUTH_OPTIONS} value={authMode} onChange={setAuthMode} />
      </SettingRow>

      {showSsoField && (
        <div className="pb-2">
          <label className={cn(labelCls, 'block mb-1.5')}>{ssoLabel}</label>
          <input
            value={ssoUrl}
            onChange={(e) => setSsoUrl(e.target.value)}
            className={inputCls}
            placeholder="https://your-idp.example.com"
          />
          <p className="text-xs text-hf-dim mt-1">
            {authMode === 'ldap' && 'e.g. ldap://ldap.corp.example.com:389'}
            {authMode === 'saml' && 'Assertion Consumer Service URL provided by your identity provider'}
            {authMode === 'oidc' && 'Discovery endpoint for the OIDC provider'}
          </p>
        </div>
      )}

      <SettingRow label="Session Timeout" hint="Users will be logged out after this period of inactivity.">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            min={15}
            max={1440}
            className={numberCls}
          />
          <span className="text-xs text-hf-dim">minutes</span>
        </div>
      </SettingRow>

      <SettingRow
        label="Require MFA"
        hint="Enforce multi-factor authentication for all users. Existing sessions will be invalidated."
        badge={mfaRequired
          ? <span className="text-[9px] font-bold text-hf-success border border-hf-success/30 px-1.5 py-0.5 rounded">Enforced</span>
          : <span className="text-[9px] font-bold text-hf-warning border border-hf-warning/30 px-1.5 py-0.5 rounded">Optional</span>
        }
      >
        <Toggle checked={mfaRequired} onChange={setMfaRequired} />
      </SettingRow>

      {/* ── Access control ── */}
      <div className="pt-2"><SectionHeader title="Access Control" /></div>

      <SettingRow label="Allowed Admin IP Ranges" hint="Admin actions are only permitted from these CIDR ranges. Leave empty to allow all.">
        <div />
      </SettingRow>
      <div className="pb-3 -mt-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {ipRanges.map((r) => (
            <span key={r} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs bg-hf-surface-3 border border-hf-border/40 text-hf-muted font-mono">
              {r}
              <button onClick={() => removeIp(r)} className="hover:text-hf-danger transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {ipRanges.length === 0 && <span className="text-xs text-hf-dim italic">No restrictions — all IPs allowed</span>}
        </div>
        <div className="flex gap-2">
          <input
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIp()}
            placeholder="10.0.0.0/24"
            className={cn(inputCls, 'flex-1 font-mono text-xs')}
          />
          <button
            onClick={addIp}
            className="px-3 py-2 rounded-lg border border-hf-border text-hf-dim hover:text-hf-muted hover:bg-hf-surface-3 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Safe mode ── */}
      <div className="pt-2"><SectionHeader title="Safe Mode" /></div>

      <SettingRow
        label="Safe Simulation Mode"
        hint="Prevents honeypots from capturing real credentials or executing payloads. Interactions are logged only. Recommended for shared lab environments."
        badge={<ShieldCheck className="w-3.5 h-3.5 text-hf-success" />}
      >
        <Toggle checked={safeSimulation} onChange={setSafeSimulation} />
      </SettingRow>

      <SettingRow
        label="Defensive Lab Use Banner"
        hint="Displays a visible notice on all honeypot services stating they are part of a defensive security research environment."
      >
        <Toggle checked={defensiveBanner} onChange={setDefensiveBanner} />
      </SettingRow>

      {!safeSimulation && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-hf-warning/30 bg-hf-warning/[0.06]">
          <AlertTriangle className="w-4 h-4 text-hf-warning shrink-0 mt-0.5" />
          <p className="text-xs text-hf-warning/90">Safe Simulation is disabled. Honeypots may capture real credentials and execute attacker payloads in isolated sandboxes. Ensure legal authorization is in place.</p>
        </div>
      )}

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
