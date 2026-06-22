import { NextRequest } from 'next/server'
import { MOCK_REPORTS } from '@/services/mock'

export async function GET(_request: NextRequest) {
  return Response.json({ data: MOCK_REPORTS, total: MOCK_REPORTS.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return Response.json(
    { data: { id: `rep_${Date.now()}`, status: 'generating', ...body }, message: 'Report generation queued' },
    { status: 202 }
  )
}
