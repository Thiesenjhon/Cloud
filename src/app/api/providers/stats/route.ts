import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { getMockProviders } from '@/lib/anatel'

export async function GET() {
  try {
    if (prisma) {
      const total = await prisma.provider.count()

      if (total > 0) {
        const [enriched, plans, providers] = await Promise.all([
          prisma.provider.count({ where: { googlePlaceId: { not: null } } }),
          prisma.plan.count(),
          prisma.provider.findMany({ select: { uf: true, porte: true } }),
        ])

        const avgPriceResult = await prisma.plan.aggregate({ _avg: { price: true } })

        const byState = Object.entries(
          providers.reduce((acc, p) => { acc[p.uf] = (acc[p.uf] || 0) + 1; return acc }, {} as Record<string, number>)
        ).map(([uf, count]) => ({ uf, count: count as number })).sort((a, b) => b.count - a.count)

        const byPorte = Object.entries(
          providers.reduce((acc, p) => { const k = p.porte || 'DESCONHECIDO'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
        ).map(([porte, count]) => ({ porte, count }))

        return NextResponse.json({
          totalProviders: total,
          enrichedProviders: enriched,
          totalPlans: plans,
          avgPrice: avgPriceResult._avg.price || 0,
          byState,
          byPorte,
          byTechnology: [{ technology: 'FIBRA', count: 0 }, { technology: 'RADIO', count: 0 }],
          priceRanges: [],
          speedDistribution: [],
          topSVAs: [],
          source: 'database',
        })
      }
    }
  } catch {
    // fall through
  }

  // Fallback to mock
  const providers = getMockProviders()
  const byState = Object.entries(
    providers.reduce((acc, p) => { acc[p.uf] = (acc[p.uf] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([uf, count]) => ({ uf, count })).sort((a, b) => b.count - a.count)
  const byPorte = Object.entries(
    providers.reduce((acc, p) => { const k = p.porte || 'DESCONHECIDO'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([porte, count]) => ({ porte, count }))

  return NextResponse.json({
    totalProviders: providers.length,
    enrichedProviders: 0,
    totalPlans: 0,
    avgPrice: 0,
    byState,
    byPorte,
    byTechnology: [{ technology: 'FIBRA', count: 0 }, { technology: 'RADIO', count: 0 }],
    priceRanges: [],
    speedDistribution: [],
    topSVAs: [],
    source: 'mock',
  })
}
