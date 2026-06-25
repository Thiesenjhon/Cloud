import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function GET() {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const columns = await prisma.crmColumn.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { providers: true } } },
    })
    return NextResponse.json(columns)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { name, color } = await request.json()
    const last = await prisma.crmColumn.findFirst({ orderBy: { order: 'desc' } })
    const order = last ? last.order + 1 : 0
    const column = await prisma.crmColumn.create({
      data: { name, color: color ?? '#6b7280', order },
      include: { _count: { select: { providers: true } } },
    })
    return NextResponse.json(column)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
