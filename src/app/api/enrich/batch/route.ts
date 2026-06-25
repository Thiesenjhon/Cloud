import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

// ⛔ Google Places API desativada para controle de custos.
// Para reativar: remova este bloqueio e configure GOOGLE_PLACES_API_KEY no Vercel.

export async function POST() {
  return NextResponse.json(
    { error: 'Google Places API desativada. Ative em /api/enrich/batch quando necessário.' },
    { status: 503 }
  )
}

export async function GET() {
  if (!prisma) return NextResponse.json({ enriched: 0, total: 0, remaining: 0 })
  try {
    const [enriched, total] = await Promise.all([
      prisma.provider.count({ where: { enrichedAt: { not: null } } }),
      prisma.provider.count(),
    ])
    return NextResponse.json({ enriched, total, remaining: total - enriched })
  } catch {
    return NextResponse.json({ enriched: 0, total: 0, remaining: 0 })
  }
}
