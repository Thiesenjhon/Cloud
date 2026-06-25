import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getMockProviders } from '@/lib/anatel'

export async function GET() {
  const providers = getMockProviders()

  const byState = Object.entries(
    providers.reduce((acc, p) => {
      acc[p.uf] = (acc[p.uf] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([uf, count]) => ({ uf, count })).sort((a, b) => b.count - a.count)

  const byPorte = Object.entries(
    providers.reduce((acc, p) => {
      const key = p.porte || 'DESCONHECIDO'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([porte, count]) => ({ porte, count }))

  return NextResponse.json({
    totalProviders: providers.length,
    enrichedProviders: 0,
    totalPlans: 0,
    avgPrice: 0,
    byState,
    byPorte,
    byTechnology: [
      { technology: 'FIBRA', count: 0 },
      { technology: 'RADIO', count: 0 },
    ],
    priceRanges: [],
    speedDistribution: [],
    topSVAs: [],
  })
}
