import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { getMockProviders } from '@/lib/anatel'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get('uf') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''

  try {
    if (prisma) {
      const where = {
        ...(uf ? { uf } : {}),
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
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { razaoSocial: 'asc' },
        }),
      ])

      // If DB is empty, return mock data signal
      if (total === 0) {
        return fallbackToMock(uf, page, limit, search)
      }

      return NextResponse.json({ data: providers, total, page, limit, pages: Math.ceil(total / limit), source: 'database' })
    }
  } catch {
    // fall through
  }

  return fallbackToMock(uf, page, limit, search)
}

function fallbackToMock(uf?: string, page = 1, limit = 20, search = '') {
  let providers = getMockProviders(uf)
  if (search) {
    const q = search.toLowerCase()
    providers = providers.filter(p =>
      p.razaoSocial.toLowerCase().includes(q) ||
      (p.nomeFantasia || '').toLowerCase().includes(q) ||
      p.municipio.toLowerCase().includes(q)
    )
  }
  const total = providers.length
  const paginated = providers.slice((page - 1) * limit, page * limit)
  return NextResponse.json({ data: paginated, total, page, limit, pages: Math.ceil(total / limit), source: 'mock' })
}
