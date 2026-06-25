import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { crmNotes } = await request.json()
    const provider = await prisma.provider.update({
      where: { id: params.id },
      data: { crmNotes },
    })
    return NextResponse.json({ ok: true, provider })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
