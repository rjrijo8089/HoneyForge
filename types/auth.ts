export type UserRole = 'admin' | 'analyst' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLoginAt: string
}

export interface Session {
  user: User
  accessToken: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthError {
  code: string
  message: string
}
