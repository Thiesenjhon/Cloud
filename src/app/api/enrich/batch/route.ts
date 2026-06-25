import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

async function searchGooglePlaces(name: string): Promise<{
  placeId: string | null
  rating: number | null
  reviews: number | null
  address: string | null
  phone: string | null
  website: string | null
  uf: string | null
  municipio: string | null
}> {
  if (!GOOGLE_API_KEY) return { placeId: null, rating: null, reviews: null, address: null, phone: null, website: null, uf: null, municipio: null }

  try {
    // Text search to find the business
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(name + ' provedor internet Brasil')}&key=${GOOGLE_API_KEY}&language=pt-BR`,
      { signal: AbortSignal.timeout(8000) }
    )
    const searchData = await searchRes.json()
    const place = searchData.results?.[0]
    if (!place) return { placeId: null, rating: null, reviews: null, address: null, phone: null, website: null, uf: null, municipio: null }

    const placeId = place.place_id
    const rating = place.rating || null
    const reviews = place.user_ratings_total || null

    // Extract UF from address_components or formatted_address
    const formattedAddress = place.formatted_address || ''
    const ufMatch = formattedAddress.match(/\b([A-Z]{2})\b(?:\s*-\s*Brasil|\s*,\s*Brasil)?/)
    const uf = ufMatch ? ufMatch[1] : null
    // Extract municipio - usually the first part before comma
    const municipio = place.name || formattedAddress.split(',')[0]?.trim() || null

    // Get details for phone and website
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,address_components&key=${GOOGLE_API_KEY}&language=pt-BR`,
      { signal: AbortSignal.timeout(8000) }
    )
    const detailsData = await detailsRes.json()
    const details = detailsData.result

    // Extract city and state from address_components
    const components = details?.address_components || place.address_components || []
    let cityFromComponents = null
    let stateFromComponents = null
    for (const c of components) {
      if (c.types.includes('administrative_area_level_2')) cityFromComponents = c.long_name
      if (c.types.includes('administrative_area_level_1')) stateFromComponents = c.short_name
    }

    return {
      placeId,
      rating,
      reviews,
      address: formattedAddress,
      phone: details?.formatted_phone_number || null,
      website: details?.website || null,
      uf: stateFromComponents || uf,
      municipio: cityFromComponents || municipio,
    }
  } catch {
    return { placeId: null, rating: null, reviews: null, address: null, phone: null, website: null, uf: null, municipio: null }
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    const { limit = 10, uf } = await request.json().catch(() => ({}))

    // Get providers that haven't been enriched yet
    const where = {
      googlePlaceId: null,
      enrichedAt: null,
      ...(uf ? { uf } : {}),
    }

    const providers = await prisma.provider.findMany({
      where,
      take: limit,
      orderBy: { razaoSocial: 'asc' },
      select: { id: true, razaoSocial: true, nomeFantasia: true, municipio: true, uf: true },
    })

    const results = []

    for (const provider of providers) {
      const searchName = provider.nomeFantasia || provider.razaoSocial
      const data = await searchGooglePlaces(searchName)

      await prisma.provider.update({
        where: { id: provider.id },
        data: {
          googlePlaceId: data.placeId || 'NOT_FOUND',
          googleRating: data.rating,
          googleReviews: data.reviews,
          googleAddress: data.address,
          googlePhone: data.phone,
          googleWebsite: data.website,
          uf: data.uf || provider.uf || '',
          municipio: data.municipio || provider.municipio || '',
          enrichedAt: new Date(),
        },
      })

      results.push({
        name: searchName,
        found: !!data.placeId,
        uf: data.uf,
        municipio: data.municipio,
        rating: data.rating,
        website: data.website,
      })
    }

    const enrichedCount = await prisma.provider.count({ where: { enrichedAt: { not: null } } })
    const totalCount = await prisma.provider.count()

    return NextResponse.json({
      processed: providers.length,
      results,
      enrichedTotal: enrichedCount,
      grandTotal: totalCount,
      remaining: totalCount - enrichedCount,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
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
