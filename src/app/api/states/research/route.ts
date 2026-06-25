import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

const BRAZIL_STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export async function GET() {
  try {
    if (prisma) {
      const researches = await prisma.stateResearch.findMany()
      const map: Record<string, typeof researches[0]> = {}
      for (const r of researches) map[r.uf] = r

      const providerCounts = await prisma.provider.groupBy({ by: ['uf'], _count: { id: true } })
      const countMap: Record<string, number> = {}
      for (const c of providerCounts) countMap[c.uf] = c._count.id

      const states = BRAZIL_STATES.map(uf => ({
        uf,
        status: map[uf]?.status || 'pending',
        totalProviders: map[uf]?.totalProviders || countMap[uf] || 0,
        enrichedCount: map[uf]?.enrichedCount || 0,
        scrapedCount: map[uf]?.scrapedCount || 0,
        plansCount: map[uf]?.plansCount || 0,
        startedAt: map[uf]?.startedAt || null,
        finishedAt: map[uf]?.finishedAt || null,
      }))

      return NextResponse.json({ states })
    }
  } catch { /* fall through */ }

  return NextResponse.json({ states: BRAZIL_STATES.map(uf => ({ uf, status: 'pending', totalProviders: 0, enrichedCount: 0, scrapedCount: 0, plansCount: 0 })) })
}
