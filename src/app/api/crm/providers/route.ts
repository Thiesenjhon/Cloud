import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  try {
    const { searchParams } = new URL(request.url)
    const columnId = searchParams.get('columnId') ?? 'inbox'
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const search = searchParams.get('search') ?? ''
    const pageSize = 50

    const where: Record<string, unknown> = {
      crmColumnId: columnId === 'inbox' ? null : columnId,
    }

    if (search) {
      where.OR = [
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { razaoSocial: { contains: search, mode: 'insensitive' } },
        { municipio: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { crmOrder: 'asc' },
        select: {
          id: true,
          nomeFantasia: true,
          razaoSocial: true,
          cnpj: true,
          uf: true,
          municipio: true,
          porte: true,
          situacao: true,
          crmOrder: true,
          crmNotes: true,
          crmColumnId: true,
          googleRating: true,
          googleReviews: true,
          googleAddress: true,
          googlePhone: true,
          googleWebsite: true,
          googleCategory: true,
          websiteUrl: true,
          instagramUrl: true,
          facebookUrl: true,
          enrichedAt: true,
          plans: {
            select: {
              id: true,
              name: true,
              technology: true,
              downloadSpeed: true,
              uploadSpeed: true,
              price: true,
              currency: true,
            },
          },
        },
      }),
      prisma.provider.count({ where }),
    ])

    return NextResponse.json({
      providers,
      total,
      page,
      pages: Math.ceil(total / pageSize),
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
