import { NextRequest, NextResponse } from 'next/server'
import { getMockProviders } from '@/lib/anatel'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get('uf') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''

  try {
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
    const start = (page - 1) * limit
    const paginated = providers.slice(start, start + limit)

    return NextResponse.json({
      data: paginated,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}
