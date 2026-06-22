import { type NextRequest } from 'next/server'

/**
 * Middleware — currently a pass-through.
 * Replace `updateSession` import with the Supabase SSR helper once env vars are configured.
 */
export async function middleware(_request: NextRequest) {
  // TODO: return updateSession(request) from @/lib/supabase/middleware
  // Auth protection is handled client-side via useRequireAuth() in the dashboard layout
  // until Supabase is configured.
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
