import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { name, color, order } = await request.json()
    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (color !== undefined) data.color = color
    if (order !== undefined) data.order = order
    const column = await prisma.crmColumn.update({
      where: { id: params.id },
      data,
      include: { _count: { select: { providers: true } } },
    })
    return NextResponse.json(column)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    // Detach providers first
    await prisma.provider.updateMany({
      where: { crmColumnId: params.id },
      data: { crmColumnId: null },
    })
    await prisma.crmColumn.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
