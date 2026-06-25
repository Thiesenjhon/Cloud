import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 55

import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  if (!prisma) return NextResponse.json({ idle: true })

  try {
    const runningJob = await prisma.enrichJob.findFirst({ where: { status: 'running' } })
    if (!runningJob) return NextResponse.json({ idle: true })

    const baseUrl = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : new URL(request.url).origin

    let processed = 0

    if (runningJob.type === 'google_places') {
      const res = await fetch(`${baseUrl}/api/enrich/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 }),
      })
      if (res.ok) {
        const data = await res.json()
        processed = data.processed ?? 0
      }
    } else if (runningJob.type === 'cnpj') {
      const res = await fetch(`${baseUrl}/api/enrich/cnpj`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5 }),
      })
      if (res.ok) {
        const data = await res.json()
        processed = data.processed ?? 0
      }
    }

    if (processed > 0) {
      await prisma.enrichJob.update({
        where: { id: runningJob.id },
        data: { processed: { increment: processed } },
      })
    }

    return NextResponse.json({ processed, type: runningJob.type })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
