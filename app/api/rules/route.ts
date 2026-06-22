import { NextRequest } from 'next/server'
import { MOCK_RULES } from '@/services/mock'

export async function GET(_request: NextRequest) {
  return Response.json({ data: MOCK_RULES, total: MOCK_RULES.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return Response.json({ data: { id: `r_${Date.now()}`, ...body }, message: 'Rule created' }, { status: 201 })
}
