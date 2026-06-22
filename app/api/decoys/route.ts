import { NextRequest } from 'next/server'
import { MOCK_DECOYS } from '@/services/mock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let data = MOCK_DECOYS
  if (status) data = data.filter((d) => d.status === status)
  if (type)   data = data.filter((d) => d.type === type)

  return Response.json({ data, total: data.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // TODO: validate with Zod + insert via Supabase
  return Response.json({ data: { id: `d_${Date.now()}`, ...body }, message: 'Decoy created' }, { status: 201 })
}
