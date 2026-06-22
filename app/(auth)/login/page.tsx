'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Hexagon, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@honeyforge.io', password: 'admin123', color: 'text-hf-danger' },
  { label: 'Analyst', email: 'analyst@honeyforge.io', password: 'analyst123', color: 'text-hf-warning' },
  { label: 'Viewer', email: 'viewer@honeyforge.io', password: 'viewer123', color: 'text-hf-muted' },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: authError } = await login({ email, password })
    if (authError) {
      setError(authError.message)
    } else {
      const redirect = searchParams.get('redirect') ?? '/dashboard'
      router.push(redirect)
    }
  }

  const fillDemo = (acct: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acct.email)
    setPassword(acct.password)
    setError('')
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-hf-primary rounded-2xl flex items-center justify-center mb-4 glow-primary">
          <Hexagon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-hf-text">HoneyForge</h1>
        <p className="text-sm text-hf-muted mt-1">Enterprise Deception Security Platform</p>
      </div>

      {/* Card */}
      <div className="bg-hf-surface border border-hf-border rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-hf-text mb-1">Sign in</h2>
        <p className="text-sm text-hf-muted mb-6">Enter your credentials to access the platform</p>

        {error && (
          <div className="flex items-center gap-2 bg-hf-danger/10 border border-hf-danger/30 rounded-lg px-4 py-3 mb-5">
            <AlertCircle className="w-4 h-4 text-hf-danger shrink-0" />
            <p className="text-sm text-hf-danger">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@honeyforge.io"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            rightIcon={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 pt-5 border-t border-hf-border">
          <p className="text-xs text-hf-dim mb-3 text-center font-medium uppercase tracking-wider">Demo accounts</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((acct) => (
              <button
                key={acct.label}
                onClick={() => fillDemo(acct)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-hf-border hover:bg-hf-surface-2 hover:border-hf-border-2 transition-colors"
              >
                <span className={`text-xs font-semibold ${acct.color}`}>{acct.label}</span>
                <span className="text-[10px] text-hf-dim">click to fill</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-hf-dim mt-6">
        HoneyForge © 2024 · Authorized access only
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
