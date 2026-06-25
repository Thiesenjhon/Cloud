import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const jobs = await prisma.enrichJob.findMany({ orderBy: { type: 'asc' } })
    return NextResponse.json(jobs)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { type, action } = await request.json()

    const existing = await prisma.enrichJob.findFirst({ where: { type } })

    if (action === 'start') {
      if (existing) {
        const job = await prisma.enrichJob.update({
          where: { id: existing.id },
          data: { status: 'running' },
        })
        return NextResponse.json(job)
      }
      const job = await prisma.enrichJob.create({ data: { type, status: 'running' } })
      return NextResponse.json(job)
    }

    if (!existing) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    if (action === 'pause') {
      const job = await prisma.enrichJob.update({
        where: { id: existing.id },
        data: { status: 'paused' },
      })
      return NextResponse.json(job)
    }

    if (action === 'stop') {
      const job = await prisma.enrichJob.update({
        where: { id: existing.id },
        data: { status: 'idle', processed: 0 },
      })
      return NextResponse.json(job)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
