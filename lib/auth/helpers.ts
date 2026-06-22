import type { User, LoginCredentials, AuthError } from '@/types'

/** Mock users — replaced by Supabase auth in production */
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'usr_admin_001',
    email: 'admin@honeyforge.io',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr_analyst_001',
    email: 'analyst@honeyforge.io',
    password: 'analyst123',
    name: 'SOC Analyst',
    role: 'analyst',
    createdAt: '2024-02-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr_viewer_001',
    email: 'viewer@honeyforge.io',
    password: 'viewer123',
    name: 'Read-Only Viewer',
    role: 'viewer',
    createdAt: '2024-03-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
]

export interface LoginResult {
  user: User | null
  error: AuthError | null
}

export async function mockLogin(credentials: LoginCredentials): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 600))

  const match = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  )

  if (!match) {
    return { user: null, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } }
  }

  const { password: _, ...user } = match
  return { user: { ...user, lastLoginAt: new Date().toISOString() }, error: null }
}
