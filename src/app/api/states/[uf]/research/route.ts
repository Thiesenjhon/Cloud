import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { uf: string } }) {
  const uf = params.uf.toUpperCase()

  try {
    if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    await prisma.stateResearch.upsert({
      where: { uf },
      update: { status: 'running', startedAt: new Date() },
      create: { uf, status: 'running', startedAt: new Date() },
    })

    const total = await prisma.provider.count({ where: { uf } })

    await prisma.stateResearch.update({
      where: { uf },
      data: { totalProviders: total, status: total > 0 ? 'running' : 'done', finishedAt: total === 0 ? new Date() : null },
    })

    return NextResponse.json({ success: true, uf, totalProviders: total })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
