'use client'
import { useState } from 'react'
import { UserPlus, Check, X, Trash2, ChevronDown, CheckCircle2, Clock, Ban } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { SectionHeader, TabCard } from './shared'

type Role = 'admin' | 'analyst' | 'viewer'
type UserStatus = 'active' | 'pending' | 'suspended'

interface User {
  id:         string
  name:       string
  email:      string
  role:       Role
  status:     UserStatus
  lastActive: string | null
  mfaEnabled: boolean
}

const INIT_USERS: User[] = [
  { id: 'usr_001', name: 'System Admin',     email: 'admin@honeyforge.io',    role: 'admin',   status: 'active',   lastActive: '2026-06-18T14:33:00Z', mfaEnabled: true  },
  { id: 'usr_002', name: 'James Smith',      email: 'jsmith@honeyforge.io',   role: 'analyst', status: 'active',   lastActive: '2026-06-18T13:20:00Z', mfaEnabled: true  },
  { id: 'usr_003', name: 'Min Lee',          email: 'mlee@honeyforge.io',     role: 'analyst', status: 'active',   lastActive: '2026-06-18T14:00:00Z', mfaEnabled: true  },
  { id: 'usr_004', name: 'Analyst Lead',     email: 'analyst@honeyforge.io',  role: 'admin',   status: 'active',   lastActive: '2026-06-18T12:45:00Z', mfaEnabled: true  },
  { id: 'usr_005', name: 'Viewer User',      email: 'viewer@honeyforge.io',   role: 'analyst', status: 'active',   lastActive: '2026-06-17T16:30:00Z', mfaEnabled: false },
  { id: 'usr_006', name: 'Priya Venkatesan', email: 'priya.v@honeyforge.io',  role: 'analyst', status: 'pending',  lastActive: null,                   mfaEnabled: false },
]

const PERMISSIONS: { permission: string; admin: boolean; analyst: boolean; viewer: boolean }[] = [
  { permission: 'View alerts & events',          admin: true,  analyst: true,  viewer: true  },
  { permission: 'Mark events (attack / benign)', admin: true,  analyst: true,  viewer: false },
  { permission: 'Export IOCs',                   admin: true,  analyst: true,  viewer: false },
  { permission: 'Manage decoys',                 admin: true,  analyst: false, viewer: false },
  { permission: 'Manage detection rules',        admin: true,  analyst: true,  viewer: false },
  { permission: 'Configure integrations',        admin: true,  analyst: false, viewer: false },
  { permission: 'Generate & view reports',       admin: true,  analyst: true,  viewer: true  },
  { permission: 'Access threat intelligence',    admin: true,  analyst: true,  viewer: true  },
  { permission: 'Clone Studio access',           admin: true,  analyst: true,  viewer: false },
  { permission: 'View audit logs',               admin: true,  analyst: false, viewer: false },
  { permission: 'Manage users & roles',          admin: true,  analyst: false, viewer: false },
  { permission: 'Access platform settings',      admin: true,  analyst: false, viewer: false },
]

const ROLE_COLORS: Record<Role, string> = {
  admin:   'text-hf-primary bg-hf-primary/10 border-hf-primary/25',
  analyst: 'text-hf-accent  bg-hf-accent/10  border-hf-accent/25',
  viewer:  'text-hf-dim    bg-hf-dim/10    border-hf-border',
}
const STATUS_META: Record<UserStatus, { cls: string; Icon: React.ComponentType<{className?: string}>; label: string }> = {
  active:    { cls: 'text-hf-success', Icon: CheckCircle2, label: 'Active'    },
  pending:   { cls: 'text-hf-warning', Icon: Clock,        label: 'Pending'   },
  suspended: { cls: 'text-hf-danger',  Icon: Ban,          label: 'Suspended' },
}

function RoleSelect({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="relative">
      <select
        value={role}
        onChange={(e) => onChange(e.target.value as Role)}
        className={cn(
          'text-[11px] font-bold uppercase border px-2 py-0.5 rounded appearance-none pr-5 capitalize cursor-pointer focus:outline-none transition-all',
          ROLE_COLORS[role]
        )}
      >
        <option value="admin">Admin</option>
        <option value="analyst">Analyst</option>
        <option value="viewer">Viewer</option>
      </select>
      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
    </div>
  )
}

/* ── Invite modal ── */
function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (u: Omit<User, 'id' | 'lastActive' | 'mfaEnabled' | 'status'>) => void }) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [role,  setRole]  = useState<Role>('analyst')

  const submit = () => {
    if (!name.trim() || !email.trim()) return
    onInvite({ name: name.trim(), email: email.trim(), role })
    onClose()
  }

  const fieldCls = 'w-full bg-hf-bg/60 border border-hf-border/60 rounded-lg px-3 py-2 text-sm text-hf-text placeholder-hf-dim focus:outline-none focus:border-hf-primary/60 transition-colors'
  const lCls     = 'text-xs font-medium text-hf-muted block mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-hf-surface border border-hf-border/60 rounded-2xl shadow-2xl animate-fade-in p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-hf-text">Invite User</h3>
            <p className="text-xs text-hf-dim mt-0.5">An invitation email will be sent to the address below.</p>
          </div>
          <button onClick={onClose} className="text-hf-dim hover:text-hf-muted"><X className="w-4 h-4" /></button>
        </div>
        <div>
          <label className={lCls}>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={fieldCls} />
        </div>
        <div>
          <label className={lCls}>Email Address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jane@corp.com" className={fieldCls} />
        </div>
        <div>
          <label className={lCls}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}
            className="w-full bg-hf-bg/60 border border-hf-border/60 rounded-lg px-3 py-2 text-sm text-hf-text focus:outline-none focus:border-hf-primary/60 appearance-none">
            <option value="admin">Admin — Full platform access</option>
            <option value="analyst">Analyst — Review, rule, and export access</option>
            <option value="viewer">Viewer — Read-only access</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={submit} disabled={!name.trim() || !email.trim()}>
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  )
}

export function UsersTab() {
  const [users,      setUsers]      = useState<User[]>(INIT_USERS)
  const [showInvite, setShowInvite] = useState(false)

  const updateRole = (id: string, role: Role) =>
    setUsers((p) => p.map((u) => u.id === id ? { ...u, role } : u))

  const removeUser = (id: string) =>
    setUsers((p) => p.filter((u) => u.id !== id))

  const handleInvite = (data: Omit<User, 'id' | 'lastActive' | 'mfaEnabled' | 'status'>) => {
    const newUser: User = {
      ...data,
      id: `usr_${Date.now()}`,
      status: 'pending',
      lastActive: null,
      mfaEnabled: false,
    }
    setUsers((p) => [...p, newUser])
  }

  return (
    <>
      <TabCard>
        {/* ── Users table ── */}
        <div className="flex items-center justify-between mb-2">
          <SectionHeader title="Users" description={`${users.filter((u) => u.status === 'active').length} active · ${users.filter((u) => u.status === 'pending').length} pending`} />
          <Button variant="outline" size="sm" onClick={() => setShowInvite(true)} leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
            Invite User
          </Button>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-hf-border/40">
                {['User', 'Role', 'Status', 'MFA', 'Last Active', ''].map((h) => (
                  <th key={h} className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hf-border/15">
              {users.map((u) => {
                const sm = STATUS_META[u.status]
                return (
                  <tr key={u.id} className="hover:bg-hf-surface-2/40 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                          u.role === 'admin' ? 'bg-hf-primary/20 text-hf-primary' :
                          u.role === 'analyst' ? 'bg-hf-accent/20 text-hf-accent' : 'bg-hf-dim/20 text-hf-muted'
                        )}>
                          {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                        <div>
                          <p className="text-hf-text font-medium">{u.name}</p>
                          <p className="text-[10px] text-hf-dim">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <RoleSelect role={u.role} onChange={(r) => updateRole(u.id, r)} />
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('flex items-center gap-1 text-[10px] font-medium', sm.cls)}>
                        <sm.Icon className="w-3 h-3" /> {sm.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {u.mfaEnabled
                        ? <Check className="w-3.5 h-3.5 text-hf-success mx-auto" />
                        : <X className="w-3.5 h-3.5 text-hf-dim mx-auto" />
                      }
                    </td>
                    <td className="px-3 py-3 text-[10px] text-hf-dim font-mono">
                      {u.lastActive ? formatDate(u.lastActive, 'short') : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => removeUser(u.id)}
                        className="text-hf-dim hover:text-hf-danger transition-colors p-1 rounded hover:bg-hf-danger/10"
                        title="Remove user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Permissions matrix ── */}
        <div className="pt-5 mt-2 border-t border-hf-border/30">
          <SectionHeader title="Permissions Matrix" description="What each role can do in HoneyForge. Role permissions are fixed and cannot be customized." />

          <div className="overflow-x-auto mt-3 -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-hf-border/40">
                  <th className="text-[9px] font-bold uppercase tracking-widest text-hf-dim px-3 py-2.5 text-left">Permission</th>
                  {(['Admin', 'Analyst', 'Viewer'] as const).map((r) => (
                    <th key={r} className="text-[9px] font-bold uppercase tracking-widest px-3 py-2.5 text-center w-20">
                      <span className={cn(
                        'inline-block px-2 py-0.5 rounded border text-[9px]',
                        r === 'Admin' ? ROLE_COLORS.admin : r === 'Analyst' ? ROLE_COLORS.analyst : ROLE_COLORS.viewer
                      )}>{r}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hf-border/15">
                {PERMISSIONS.map((p) => (
                  <tr key={p.permission} className="hover:bg-hf-surface-2/30 transition-colors">
                    <td className="px-3 py-2.5 text-hf-muted">{p.permission}</td>
                    {[p.admin, p.analyst, p.viewer].map((allowed, i) => (
                      <td key={i} className="px-3 py-2.5 text-center">
                        {allowed
                          ? <Check className="w-3.5 h-3.5 text-hf-success mx-auto" />
                          : <X    className="w-3.5 h-3.5 text-hf-dim/40 mx-auto"   />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabCard>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </>
  )
}
