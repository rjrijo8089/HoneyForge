import { NextRequest } from 'next/server'
import { MOCK_AUDIT_LOGS } from '@/services/mock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const action = searchParams.get('action')

  let data = MOCK_AUDIT_LOGS
  if (userId) data = data.filter((l) => l.userId === userId)
  if (action) data = data.filter((l) => l.action === action)

  return Response.json({ data, total: data.length })
}
