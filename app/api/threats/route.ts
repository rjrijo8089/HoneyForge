import { NextRequest } from 'next/server'
import { MOCK_THREATS } from '@/services/mock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const severity = searchParams.get('severity')
  const status   = searchParams.get('status')

  let data = MOCK_THREATS
  if (severity) data = data.filter((t) => t.severity === severity)
  if (status)   data = data.filter((t) => t.status === status)

  return Response.json({ data, total: data.length })
}
