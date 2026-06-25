import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { uf: string } }) {
  const uf = params.uf.toUpperCase()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const search = searchParams.get('search') || ''
  const municipio = searchParams.get('municipio') || ''

  try {
    if (prisma) {
      const where = {
        uf,
        ...(municipio ? { municipio: { contains: municipio, mode: 'insensitive' as const } } : {}),
        ...(search ? {
          OR: [
            { razaoSocial: { contains: search, mode: 'insensitive' as const } },
            { nomeFantasia: { contains: search, mode: 'insensitive' as const } },
            { municipio: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {}),
      }

      const [total, providers] = await Promise.all([
        prisma.provider.count({ where }),
        prisma.provider.findMany({
          where,
          include: { plans: true },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: [{ googleRating: 'desc' }, { razaoSocial: 'asc' }],
        }),
      ])

      const municipios = await prisma.provider.findMany({
        where: { uf },
        select: { municipio: true },
        distinct: ['municipio'],
        orderBy: { municipio: 'asc' },
      })

      return NextResponse.json({
        providers,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        municipios: municipios.map(m => m.municipio),
      })
    }
  } catch { /* fall through */ }

  return NextResponse.json({ providers: [], total: 0, page: 1, limit, pages: 0, municipios: [] })
}
