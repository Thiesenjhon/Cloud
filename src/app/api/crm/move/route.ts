import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { providerId, columnId, order, notes } = await request.json()
    const data: Record<string, unknown> = {
      crmColumnId: columnId === 'inbox' ? null : columnId,
    }
    if (order !== undefined) data.crmOrder = order
    if (notes !== undefined) data.crmNotes = notes
    const provider = await prisma.provider.update({
      where: { id: providerId },
      data,
    })
    return NextResponse.json({ ok: true, provider })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
