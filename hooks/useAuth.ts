'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { mockLogin } from '@/lib/auth/helpers'
import type { LoginCredentials } from '@/types'

export function useAuth() {
  const { user, session, isLoading, setUser, setSession, setLoading, logout: storeLogout } = useAuthStore()

  const isAuthenticated = !!user

  async function login(credentials: LoginCredentials) {
    setLoading(true)
    const { user: authedUser, error } = await mockLogin(credentials)
    if (authedUser) {
      setUser(authedUser)
      setSession({
        user: authedUser,
        accessToken: `mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      })
    }
    setLoading(false)
    return { error }
  }

  function logout() {
    storeLogout()
  }

  return { user, session, isLoading, isAuthenticated, login, logout }
}

/** Redirect to /login if not authenticated */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}
