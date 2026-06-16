import type { GooglePlacesResult } from '@/types/provider'

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function findProviderOnGooglePlaces(
  companyName: string,
  municipio: string,
  uf: string
): Promise<GooglePlacesResult | null> {
  if (!PLACES_API_KEY) {
    console.warn('GOOGLE_PLACES_API_KEY not set, using mock data')
    return getMockPlacesResult(companyName)
  }

  try {
    const query = `${companyName} provedor internet ${municipio} ${uf}`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${PLACES_API_KEY}&language=pt-BR&region=br`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    if (!searchData.results?.length) return null

    const place = searchData.results[0]

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,rating,user_ratings_total,formatted_address,formatted_phone_number,website,types&key=${PLACES_API_KEY}&language=pt-BR`
    const detailsRes = await fetch(detailsUrl)
    const detailsData = await detailsRes.json()
    const details = detailsData.result

    return {
      placeId: details.place_id,
      rating: details.rating || 0,
      userRatingsTotal: details.user_ratings_total || 0,
      formattedAddress: details.formatted_address || '',
      phoneNumber: details.formatted_phone_number,
      website: details.website,
      types: details.types || [],
    }
  } catch (error) {
    console.error('Google Places API error:', error)
    return null
  }
}

function getMockPlacesResult(companyName: string): GooglePlacesResult {
  return {
    placeId: `mock_${companyName.toLowerCase().replace(/\s/g, '_')}`,
    rating: 3.5 + Math.random() * 1.5,
    userRatingsTotal: Math.floor(Math.random() * 500) + 10,
    formattedAddress: 'Av. Paulista, 1000 - São Paulo, SP',
    phoneNumber: '(11) 3000-0000',
    website: `https://www.${companyName.toLowerCase().replace(/\s/g, '')}.com.br`,
    types: ['internet_service_provider', 'establishment'],
  }
}
