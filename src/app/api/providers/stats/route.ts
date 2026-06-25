import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { getMockProviders } from '@/lib/anatel'

export async function GET() {
  try {
    if (prisma) {
      const total = await prisma.provider.count()

      if (total > 0) {
        const [enriched, planCount, providersMeta, plans, ratings] = await Promise.all([
          prisma.provider.count({ where: { googlePlaceId: { not: null } } }),
          prisma.plan.count(),
          prisma.provider.findMany({ select: { uf: true, porte: true } }),
          prisma.plan.findMany({
            select: {
              technology: true, downloadSpeed: true, price: true,
              hasStreaming: true, hasFixedIp: true, hasSecurity: true, hasPhone: true, hasTV: true,
            }
          }),
          prisma.provider.findMany({
            where: { googleRating: { not: null } },
            select: { googleRating: true },
          }),
        ])

        const avgPriceResult = planCount > 0
          ? await prisma.plan.aggregate({ _avg: { price: true } })
          : { _avg: { price: 0 } }

        const byState = Object.entries(
          providersMeta.reduce((acc, p) => { if (p.uf) acc[p.uf] = (acc[p.uf] || 0) + 1; return acc }, {} as Record<string, number>)
        ).map(([uf, count]) => ({ uf, count: count as number })).sort((a, b) => b.count - a.count)

        const byPorte = Object.entries(
          providersMeta.reduce((acc, p) => { const k = p.porte || 'DESCONHECIDO'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
        ).map(([porte, count]) => ({ porte, count }))

        // Real technology breakdown from plans
        const byTechnology = Object.entries(
          plans.reduce((acc, p) => {
            const t = p.technology || 'OUTROS'
            acc[t] = (acc[t] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        ).map(([technology, count]) => ({ technology, count: count as number })).sort((a, b) => b.count - a.count)

        // Speed distribution buckets
        const speedBuckets = [
          { label: 'Até 50 Mbps', min: 0, max: 50 },
          { label: '51–100 Mbps', min: 51, max: 100 },
          { label: '101–200 Mbps', min: 101, max: 200 },
          { label: '201–500 Mbps', min: 201, max: 500 },
          { label: 'Acima de 500 Mbps', min: 501, max: 99999 },
        ]
        const speedDistribution = speedBuckets.map(b => ({
          label: b.label,
          count: plans.filter(p => p.downloadSpeed >= b.min && p.downloadSpeed <= b.max).length,
        }))

        // Price ranges
        const priceBuckets = [
          { label: 'Até R$50', min: 0, max: 50 },
          { label: 'R$51–100', min: 51, max: 100 },
          { label: 'R$101–150', min: 101, max: 150 },
          { label: 'R$151–200', min: 151, max: 200 },
          { label: 'Acima R$200', min: 201, max: 99999 },
        ]
        const priceRanges = priceBuckets.map(b => ({
          label: b.label,
          count: plans.filter(p => p.price >= b.min && p.price <= b.max).length,
        }))

        // SVA popularity
        const svaTotal = plans.length || 1
        const topSVAs = [
          { sva: 'Streaming', count: plans.filter(p => p.hasStreaming).length },
          { sva: 'IP Fixo', count: plans.filter(p => p.hasFixedIp).length },
          { sva: 'Câmera/Segurança', count: plans.filter(p => p.hasSecurity).length },
          { sva: 'Telefone', count: plans.filter(p => p.hasPhone).length },
          { sva: 'TV', count: plans.filter(p => p.hasTV).length },
        ].map(s => ({ ...s, pct: Math.round((s.count / svaTotal) * 100) })).sort((a, b) => b.count - a.count)

        // Rating distribution
        const avgRating = ratings.length > 0
          ? ratings.reduce((s, r) => s + (r.googleRating || 0), 0) / ratings.length
          : 0

        return NextResponse.json({
          totalProviders: total,
          enrichedProviders: enriched,
          totalPlans: planCount,
          avgPrice: avgPriceResult._avg.price || 0,
          avgRating: Math.round(avgRating * 10) / 10,
          providersWithRating: ratings.length,
          byState,
          byPorte,
          byTechnology,
          speedDistribution,
          priceRanges,
          topSVAs,
          source: 'database',
        })
      }
    }
  } catch { /* fall through */ }

  // Mock fallback
  const providers = getMockProviders()
  const byState = Object.entries(
    providers.reduce((acc, p) => { acc[p.uf] = (acc[p.uf] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([uf, count]) => ({ uf, count })).sort((a, b) => b.count - a.count)
  const byPorte = Object.entries(
    providers.reduce((acc, p) => { const k = p.porte || 'DESCONHECIDO'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([porte, count]) => ({ porte, count }))

  return NextResponse.json({
    totalProviders: providers.length, enrichedProviders: 0, totalPlans: 0,
    avgPrice: 0, avgRating: 0, providersWithRating: 0,
    byState, byPorte,
    byTechnology: [], speedDistribution: [], priceRanges: [], topSVAs: [],
    source: 'mock',
  })
}
